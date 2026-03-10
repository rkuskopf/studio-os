#!/usr/bin/env node

/**
 * KSPF Lead Pipeline — Fully Automated
 * 
 * One command to:
 * 1. Scrape Google Maps for businesses
 * 2. Audit their websites for UX/accessibility issues
 * 3. Output ranked leads ready for outreach
 * 
 * Usage:
 *   node pipeline.js --query "fashion boutique melbourne"
 *   node pipeline.js --preset  (use all KSPF target queries)
 *   node pipeline.js --preset --limit 10  (faster test run)
 */

import { spawn } from 'child_process';
import { existsSync, unlinkSync } from 'fs';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('query', {
    alias: 'q',
    type: 'string',
    description: 'Single search query'
  })
  .option('queries', {
    type: 'string',
    description: 'Comma-separated search queries'
  })
  .option('preset', {
    alias: 'p',
    type: 'boolean',
    description: 'Use preset KSPF target queries'
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    default: 'final-leads.csv',
    description: 'Final output CSV file'
  })
  .option('limit', {
    alias: 'l',
    type: 'number',
    default: 15,
    description: 'Max results per search query'
  })
  .option('audit-limit', {
    type: 'number',
    description: 'Max websites to audit (default: all found)'
  })
  .option('skip-scrape', {
    type: 'boolean',
    description: 'Skip scraping, use existing maps-leads.csv'
  })
  .help()
  .argv;

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });
    
    proc.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with code ${code}`));
    });
    
    proc.on('error', reject);
  });
}

async function main() {
  console.log(chalk.bold.cyan('\n═══════════════════════════════════════════'));
  console.log(chalk.bold.cyan('  KSPF Lead Pipeline — Fully Automated'));
  console.log(chalk.bold.cyan('═══════════════════════════════════════════\n'));
  
  const tempFile = 'pipeline-scraped.csv';
  
  // Step 1: Scrape Google Maps
  if (!argv.skipScrape) {
    console.log(chalk.bold('\n📍 Step 1: Scraping Google Maps for businesses...\n'));
    
    const scrapeArgs = ['scrape-maps.js', '--output', tempFile, '--limit', argv.limit];
    
    if (argv.query) {
      scrapeArgs.push('--query', argv.query);
    } else if (argv.queries) {
      scrapeArgs.push('--queries', argv.queries);
    } else if (argv.preset) {
      scrapeArgs.push('--preset');
    } else {
      console.log(chalk.yellow('No query specified. Use --query, --queries, or --preset\n'));
      console.log('Examples:');
      console.log('  node pipeline.js --query "fashion boutique melbourne"');
      console.log('  node pipeline.js --preset --limit 5');
      return;
    }
    
    try {
      await runCommand('node', scrapeArgs);
    } catch (e) {
      console.log(chalk.red('\nScraping failed. Check the error above.\n'));
      return;
    }
  } else {
    console.log(chalk.gray('\nSkipping scrape, using existing data...\n'));
  }
  
  // Check if we have data to audit
  const scrapeOutput = argv.skipScrape ? 'maps-leads.csv' : tempFile;
  if (!existsSync(scrapeOutput)) {
    console.log(chalk.red(`\nNo scraped data found at ${scrapeOutput}\n`));
    return;
  }
  
  // Step 2: Audit websites
  console.log(chalk.bold('\n🔍 Step 2: Auditing websites for UX/accessibility issues...\n'));
  
  const auditArgs = ['audit.js', '--input', scrapeOutput, '--output', argv.output];
  
  if (argv.auditLimit) {
    auditArgs.push('--limit', argv.auditLimit);
  }
  
  try {
    await runCommand('node', auditArgs);
  } catch (e) {
    console.log(chalk.red('\nAuditing failed. Check the error above.\n'));
    return;
  }
  
  // Cleanup temp file
  if (existsSync(tempFile) && !argv.skipScrape) {
    // Keep the scraped data for reference
    // unlinkSync(tempFile);
  }
  
  // Done
  console.log(chalk.bold.green('\n═══════════════════════════════════════════'));
  console.log(chalk.bold.green('  ✅ Pipeline Complete!'));
  console.log(chalk.bold.green('═══════════════════════════════════════════\n'));
  
  console.log(`Ranked leads saved to: ${chalk.cyan(argv.output)}\n`);
  
  console.log(chalk.bold('Next steps:'));
  console.log('  1. Open the CSV and review top-scored leads');
  console.log('  2. Research each business (Instagram, about page)');
  console.log('  3. Craft personalised outreach based on their specific issues');
  console.log('  4. Track outreach in ops/lead-generation.md\n');
}

main().catch(console.error);
