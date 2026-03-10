#!/usr/bin/env node

/**
 * KSPF Website Auditor
 * 
 * Runs Lighthouse audits on a list of URLs and outputs a ranked CSV of potential leads
 * based on poor UX, accessibility, and performance scores.
 * 
 * Usage:
 *   node audit.js --input urls.csv --output leads.csv
 *   node audit.js --sample  (runs with sample Melbourne fashion/beauty URLs)
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

// Sample URLs for testing — Melbourne fashion/beauty/lifestyle businesses
const SAMPLE_URLS = [
  { url: 'https://example.com', name: 'Example Business', category: 'sample' },
  // Add real URLs here when you have them
];

const argv = yargs(hideBin(process.argv))
  .option('input', {
    alias: 'i',
    type: 'string',
    description: 'Input CSV file with URLs (columns: url, name, category)'
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    default: 'leads-output.csv',
    description: 'Output CSV file for ranked leads'
  })
  .option('sample', {
    alias: 's',
    type: 'boolean',
    description: 'Run with sample URLs for testing'
  })
  .option('limit', {
    alias: 'l',
    type: 'number',
    description: 'Limit number of URLs to audit'
  })
  .help()
  .argv;

/**
 * Calculate a "lead score" based on how bad the site is
 * Higher score = worse site = better lead for KSPF
 */
function calculateLeadScore(scores) {
  const { performance, accessibility, bestPractices, seo } = scores;
  
  // Weight accessibility and performance highest (your strengths)
  const weightedScore = (
    (100 - performance) * 0.3 +
    (100 - accessibility) * 0.35 +
    (100 - bestPractices) * 0.2 +
    (100 - seo) * 0.15
  );
  
  return Math.round(weightedScore);
}

/**
 * Get a human-readable assessment of the site
 */
function getAssessment(scores, leadScore) {
  const issues = [];
  
  if (scores.accessibility < 70) issues.push('Poor accessibility');
  if (scores.performance < 50) issues.push('Slow loading');
  if (scores.bestPractices < 70) issues.push('Outdated practices');
  if (scores.seo < 70) issues.push('SEO issues');
  
  if (leadScore >= 40) return `🔥 High priority: ${issues.join(', ')}`;
  if (leadScore >= 25) return `⚡ Medium priority: ${issues.join(', ')}`;
  return `✓ Low priority — site is decent`;
}

/**
 * Run Lighthouse audit on a single URL
 */
async function auditUrl(browser, url) {
  const page = await browser.newPage();
  
  try {
    // Get the browser's WebSocket endpoint for Lighthouse
    const browserWSEndpoint = browser.wsEndpoint();
    const endpointURL = new URL(browserWSEndpoint);
    const port = endpointURL.port;

    const result = await lighthouse(url, {
      port: parseInt(port),
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'mobile',
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        cpuSlowdownMultiplier: 4,
      },
    });

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
    return {
      success: false,
      error: error.message
    };
  } finally {
    await page.close();
  }
}

/**
 * Main function
 */
async function main() {
  console.log(chalk.bold('\n🔍 KSPF Website Auditor\n'));
  
  // Load URLs
  let urls = [];
  
  if (argv.sample) {
    console.log(chalk.yellow('Running with sample URLs...\n'));
    urls = SAMPLE_URLS;
  } else if (argv.input) {
    if (!existsSync(argv.input)) {
      console.error(chalk.red(`Error: Input file not found: ${argv.input}`));
      process.exit(1);
    }
    const csvContent = readFileSync(argv.input, 'utf-8');
    urls = parse(csvContent, { columns: true, skip_empty_lines: true });
  } else {
    console.log(chalk.yellow('No input specified. Use --input <file.csv> or --sample'));
    console.log(chalk.gray('\nExpected CSV format:'));
    console.log(chalk.gray('url,name,category'));
    console.log(chalk.gray('https://example.com,Example Business,fashion\n'));
    process.exit(0);
  }
  
  if (argv.limit) {
    urls = urls.slice(0, argv.limit);
  }
  
  console.log(chalk.gray(`Auditing ${urls.length} URLs...\n`));
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });
  
  const results = [];
  
  for (let i = 0; i < urls.length; i++) {
    const { url, name, category } = urls[i];
    const spinner = ora(`[${i + 1}/${urls.length}] Auditing ${name || url}`).start();
    
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
      
      if (leadScore >= 40) {
        spinner.succeed(chalk.green(`${name || url} — Lead Score: ${leadScore} 🔥`));
      } else if (leadScore >= 25) {
        spinner.succeed(chalk.yellow(`${name || url} — Lead Score: ${leadScore}`));
      } else {
        spinner.succeed(chalk.gray(`${name || url} — Lead Score: ${leadScore}`));
      }
    } else {
      spinner.fail(chalk.red(`${name || url} — Failed: ${audit.error}`));
      results.push({
        name: name || '',
        url,
        category: category || '',
        leadScore: 0,
        performance: 'Error',
        accessibility: 'Error',
        bestPractices: 'Error',
        seo: 'Error',
        assessment: `Error: ${audit.error}`,
        auditDate: new Date().toISOString().split('T')[0]
      });
    }
  }
  
  await browser.close();
  
  // Sort by lead score (highest first)
  results.sort((a, b) => b.leadScore - a.leadScore);
  
  // Output CSV
  const csv = stringify(results, { header: true });
  writeFileSync(argv.output, csv);
  
  // Summary
  console.log(chalk.bold('\n📊 Summary\n'));
  
  const highPriority = results.filter(r => r.leadScore >= 40);
  const mediumPriority = results.filter(r => r.leadScore >= 25 && r.leadScore < 40);
  
  console.log(chalk.green(`🔥 High priority leads: ${highPriority.length}`));
  console.log(chalk.yellow(`⚡ Medium priority leads: ${mediumPriority.length}`));
  console.log(chalk.gray(`\nResults saved to: ${argv.output}\n`));
  
  // Show top 5
  if (highPriority.length > 0) {
    console.log(chalk.bold('Top leads to contact:\n'));
    highPriority.slice(0, 5).forEach((lead, i) => {
      console.log(`  ${i + 1}. ${lead.name || lead.url}`);
      console.log(chalk.gray(`     ${lead.assessment}`));
      console.log(chalk.gray(`     Accessibility: ${lead.accessibility} | Performance: ${lead.performance}\n`));
    });
  }
}

main().catch(console.error);
