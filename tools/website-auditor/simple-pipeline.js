#!/usr/bin/env node

/**
 * KSPF Lead Pipeline — Practical Version
 * 
 * A realistic automated pipeline that:
 * 1. Starts with seed URLs (manually curated or from simple sources)
 * 2. Audits them for UX/accessibility issues
 * 3. Outputs ranked leads
 * 
 * For finding seed URLs, use:
 * - Manual Google searches (copy URLs to a CSV)
 * - Export from bookmarks
 * - Instagram bio extraction (separate tool)
 * 
 * Usage:
 *   node simple-pipeline.js --input seeds.csv
 *   node simple-pipeline.js --demo  (runs with demo URLs)
 */

import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Demo seed URLs — real Melbourne small businesses to test
// These are examples — build your own list for actual prospecting
const DEMO_URLS = [
  { url: 'https://www.kafeneo.com.au', name: 'Kafeneo', category: 'cafe' },
  { url: 'https://www.sensorylab.com.au', name: 'Sensory Lab', category: 'cafe' },  
  { url: 'https://www.theflowermerchantonline.com', name: 'Flower Merchant', category: 'florist' },
  { url: 'https://www.motherofpearl.com.au', name: 'Mother of Pearl', category: 'florist' },
  { url: 'https://www.baredshoes.com.au', name: 'Bared Footwear', category: 'fashion' },
];

const argv = yargs(hideBin(process.argv))
  .option('input', {
    alias: 'i',
    type: 'string',
    description: 'CSV file with URLs (columns: url, name, category)'
  })
  .option('demo', {
    alias: 'd',
    type: 'boolean',
    description: 'Run with demo Melbourne businesses'
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    default: 'leads-ranked.csv',
    description: 'Output CSV'
  })
  .option('limit', {
    alias: 'l',
    type: 'number',
    description: 'Limit number of sites to audit'
  })
  .help()
  .argv;

/**
 * Calculate lead score (higher = worse site = better lead)
 */
function calculateLeadScore(scores) {
  const { performance, accessibility, bestPractices, seo } = scores;
  return Math.round(
    (100 - performance) * 0.3 +
    (100 - accessibility) * 0.35 +
    (100 - bestPractices) * 0.2 +
    (100 - seo) * 0.15
  );
}

function getAssessment(scores, leadScore) {
  const issues = [];
  if (scores.accessibility < 70) issues.push('Poor accessibility');
  if (scores.performance < 50) issues.push('Slow loading');
  if (scores.bestPractices < 70) issues.push('Outdated practices');
  if (scores.seo < 70) issues.push('SEO issues');
  
  if (leadScore >= 40) return `🔥 High priority: ${issues.join(', ') || 'Multiple issues'}`;
  if (leadScore >= 25) return `⚡ Medium priority: ${issues.join(', ') || 'Some issues'}`;
  return `✓ Low priority — site is decent`;
}

/**
 * Run Lighthouse audit
 */
async function auditUrl(browser, url) {
  try {
    const browserWSEndpoint = browser.wsEndpoint();
    const endpointURL = new URL(browserWSEndpoint);
    const port = endpointURL.port;

    const result = await lighthouse(url, {
      port: parseInt(port),
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'mobile',
      maxWaitForLoad: 45000,
    });

    if (!result?.lhr?.categories) {
      return { success: false, error: 'No results' };
    }

    const categories = result.lhr.categories;
    return {
      success: true,
      scores: {
        performance: Math.round((categories.performance?.score || 0) * 100),
        accessibility: Math.round((categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
        seo: Math.round((categories.seo?.score || 0) * 100),
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log(chalk.bold.cyan(`
╔═══════════════════════════════════════════════════════════╗
║         KSPF Lead Pipeline — Website Auditor              ║
╚═══════════════════════════════════════════════════════════╝
`));

  // Load URLs
  let urls = [];
  
  if (argv.demo) {
    console.log(chalk.gray('Running with demo Melbourne businesses...\n'));
    urls = DEMO_URLS;
  } else if (argv.input && existsSync(argv.input)) {
    const content = readFileSync(argv.input, 'utf-8');
    urls = parse(content, { columns: true, skip_empty_lines: true });
    console.log(chalk.gray(`Loaded ${urls.length} URLs from ${argv.input}\n`));
  } else {
    console.log(chalk.yellow('Usage:\n'));
    console.log('  node simple-pipeline.js --demo');
    console.log('  node simple-pipeline.js --input my-urls.csv\n');
    console.log(chalk.gray('CSV format: url,name,category'));
    console.log(chalk.gray('Example row: https://example.com,Example Business,beauty\n'));
    
    console.log(chalk.bold('How to build your seed list:\n'));
    console.log('1. Google "fashion boutique melbourne" → copy business URLs');
    console.log('2. Browse Instagram hashtags → extract websites from bios');
    console.log('3. Check business directories (Yellow Pages, TrueLocal)');
    console.log('4. Ask ChatGPT for Melbourne fashion/beauty businesses\n');
    return;
  }
  
  if (argv.limit) {
    urls = urls.slice(0, argv.limit);
  }
  
  console.log(chalk.gray(`Auditing ${urls.length} websites...\n`));
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });
  
  const results = [];
  
  for (let i = 0; i < urls.length; i++) {
    const { url, name, category } = urls[i];
    const spinner = ora(`[${i + 1}/${urls.length}] ${name || url}`).start();
    
    const audit = await auditUrl(browser, url);
    
    if (audit.success) {
      const leadScore = calculateLeadScore(audit.scores);
      const assessment = getAssessment(audit.scores, leadScore);
      
      results.push({
        name: name || '',
        url,
        category: category || '',
        leadScore,
        performance: audit.scores.performance,
        accessibility: audit.scores.accessibility,
        bestPractices: audit.scores.bestPractices,
        seo: audit.scores.seo,
        assessment,
        auditDate: new Date().toISOString().split('T')[0]
      });
      
      const color = leadScore >= 40 ? chalk.green : leadScore >= 25 ? chalk.yellow : chalk.gray;
      spinner.succeed(color(`${name || url} — Lead Score: ${leadScore}`));
    } else {
      spinner.fail(chalk.red(`${name || url} — ${audit.error}`));
    }
  }
  
  await browser.close();
  
  // Sort by lead score
  results.sort((a, b) => b.leadScore - a.leadScore);
  
  // Output
  const csv = stringify(results, { header: true });
  writeFileSync(argv.output, csv);
  
  // Summary
  const highPriority = results.filter(r => r.leadScore >= 40);
  const mediumPriority = results.filter(r => r.leadScore >= 25 && r.leadScore < 40);
  
  console.log(chalk.bold('\n📊 Results\n'));
  console.log(chalk.green(`🔥 High priority: ${highPriority.length}`));
  console.log(chalk.yellow(`⚡ Medium priority: ${mediumPriority.length}`));
  console.log(chalk.gray(`Saved to: ${argv.output}\n`));
  
  if (highPriority.length > 0) {
    console.log(chalk.bold('Top leads to contact:\n'));
    highPriority.slice(0, 5).forEach((lead, i) => {
      console.log(`  ${i + 1}. ${lead.name || lead.url}`);
      console.log(chalk.gray(`     ${lead.assessment}`));
      console.log(chalk.gray(`     Accessibility: ${lead.accessibility}% | Performance: ${lead.performance}%\n`));
    });
  }
}

main().catch(console.error);
