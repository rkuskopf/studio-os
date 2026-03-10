#!/usr/bin/env node

/**
 * KSPF Brand Monitor — Full Pipeline
 * 
 * Automated lead discovery:
 * 1. Scrape Instagram hashtags → find brand accounts
 * 2. Extract profiles → get website URLs
 * 3. Run website audits → rank leads
 * 
 * Usage:
 *   node pipeline.js --preset  (use default KSPF hashtags)
 *   node pipeline.js --hashtags "melbournebrand,indiebeauty"
 */

import { spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('hashtags', {
    alias: 'h',
    type: 'string',
    description: 'Comma-separated hashtags to search'
  })
  .option('preset', {
    alias: 'p',
    type: 'boolean',
    description: 'Use preset KSPF hashtags'
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    default: 'final-instagram-leads.csv',
    description: 'Final output file'
  })
  .option('skip-scrape', {
    type: 'boolean',
    description: 'Skip Instagram scraping, use existing instagram-leads.csv'
  })
  .option('skip-extract', {
    type: 'boolean',
    description: 'Skip profile extraction, use existing websites-to-audit.csv'
  })
  .help()
  .argv;

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });
    proc.on('close', code => code === 0 ? resolve() : reject(new Error(`Exit code ${code}`)));
    proc.on('error', reject);
  });
}

async function main() {
  console.log(chalk.bold.magenta('\n═══════════════════════════════════════════'));
  console.log(chalk.bold.magenta('  KSPF Brand Monitor — Instagram Pipeline'));
  console.log(chalk.bold.magenta('═══════════════════════════════════════════\n'));
  
  // Step 1: Scrape hashtags
  if (!argv.skipScrape) {
    console.log(chalk.bold('\n📱 Step 1: Scraping Instagram hashtags...\n'));
    
    const scrapeArgs = ['instagram.js'];
    if (argv.hashtags) {
      scrapeArgs.push('--hashtags', argv.hashtags);
    } else if (argv.preset) {
      scrapeArgs.push('--preset');
    } else {
      console.log(chalk.yellow('Specify --hashtags or --preset\n'));
      return;
    }
    
    try {
      await runCommand('node', scrapeArgs);
    } catch (e) {
      console.log(chalk.yellow('\nInstagram scraping may have been blocked. Continuing with any results...\n'));
    }
  }
  
  // Step 2: Extract profiles
  if (!argv.skipExtract && existsSync('instagram-leads.csv')) {
    console.log(chalk.bold('\n👤 Step 2: Extracting profile information...\n'));
    
    // Read usernames from scraped results
    const content = readFileSync('instagram-leads.csv', 'utf-8');
    const lines = content.split('\n').slice(1); // Skip header
    const usernames = lines
      .map(line => line.split(',')[0])
      .filter(Boolean)
      .slice(0, 30); // Limit to avoid rate limiting
    
    if (usernames.length > 0) {
      try {
        await runCommand('node', ['extract-profiles.js', '--users', usernames.join(',')]);
      } catch (e) {
        console.log(chalk.yellow('\nProfile extraction may have been blocked.\n'));
      }
    }
  }
  
  // Step 3: Audit websites
  const websitesFile = 'websites-to-audit.csv';
  if (existsSync(websitesFile)) {
    console.log(chalk.bold('\n🔍 Step 3: Auditing websites...\n'));
    
    try {
      await runCommand('node', [
        '../website-auditor/audit.js',
        '--input', websitesFile,
        '--output', argv.output
      ]);
    } catch (e) {
      console.log(chalk.red('\nWebsite auditing failed.\n'));
    }
  }
  
  console.log(chalk.bold.green('\n═══════════════════════════════════════════'));
  console.log(chalk.bold.green('  ✅ Pipeline Complete'));
  console.log(chalk.bold.green('═══════════════════════════════════════════\n'));
}

main().catch(console.error);
