#!/usr/bin/env node

/**
 * KSPF Brand Monitor — ABR (Australian Business Register) New Business Checker
 * 
 * Monitors newly registered businesses in relevant categories.
 * Uses the ABR public lookup to find new ABNs.
 * 
 * Note: The ABR doesn't have a public "new registrations" feed, so this
 * provides a workflow for manually checking businesses you find elsewhere.
 * 
 * For bulk new business data, consider:
 * - ASIC company search (paid)
 * - Data.gov.au datasets
 * - Third-party providers like IBISWorld or Dun & Bradstreet
 */

import puppeteer from 'puppeteer';
import { stringify } from 'csv-stringify/sync';
import { parse } from 'csv-parse/sync';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('input', {
    alias: 'i',
    type: 'string',
    description: 'CSV file with business names to look up'
  })
  .option('name', {
    alias: 'n',
    type: 'string',
    description: 'Single business name to look up'
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    default: 'abr-results.csv',
    description: 'Output CSV file'
  })
  .help()
  .argv;

/**
 * Look up a business name on ABR
 */
async function lookupBusiness(browser, businessName) {
  const page = await browser.newPage();
  
  try {
    await page.goto('https://abr.business.gov.au/', { waitUntil: 'networkidle2' });
    
    // Find and fill the search box
    await page.type('input[name="SearchText"]', businessName);
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    // Extract results
    const results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.abnResult, .result-item, tr'));
      return items.slice(0, 5).map(item => {
        const text = item.textContent || '';
        return {
          text: text.substring(0, 500).replace(/\s+/g, ' ').trim()
        };
      });
    });
    
    return {
      success: true,
      results
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
  console.log(chalk.bold('\n🏢 KSPF Brand Monitor — ABR Lookup\n'));
  
  let businessNames = [];
  
  if (argv.name) {
    businessNames = [argv.name];
  } else if (argv.input && existsSync(argv.input)) {
    const csvContent = readFileSync(argv.input, 'utf-8');
    const rows = parse(csvContent, { columns: true, skip_empty_lines: true });
    businessNames = rows.map(r => r.name || r.business_name || r.Name).filter(Boolean);
  } else {
    console.log(chalk.yellow('Usage:'));
    console.log('  node abr-check.js --name "Business Name"');
    console.log('  node abr-check.js --input businesses.csv\n');
    
    console.log(chalk.bold('Finding new businesses:\n'));
    console.log('The ABR doesn\'t publish a "new registrations" feed.');
    console.log('To find new businesses, try these sources:\n');
    console.log('  1. Instagram hashtags → run instagram.js first');
    console.log('  2. Local news / press releases for "new store" or "launching"');
    console.log('  3. Shopping centre announcements');
    console.log('  4. Industry newsletters (Ragtrader, Beauty Directory)');
    console.log('  5. Kickstarter/Pozible for launching products');
    console.log('  6. Facebook groups for Melbourne small business\n');
    
    console.log(chalk.gray('Once you have business names, use this tool to verify them.\n'));
    return;
  }
  
  console.log(chalk.gray(`Looking up ${businessNames.length} business(es)...\n`));
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  
  const results = [];
  
  for (const name of businessNames) {
    const spinner = ora(`Looking up: ${name}`).start();
    
    const lookup = await lookupBusiness(browser, name);
    
    if (lookup.success) {
      spinner.succeed(`${name} — found ${lookup.results.length} results`);
      results.push({
        searchName: name,
        found: lookup.results.length > 0,
        topResult: lookup.results[0]?.text || 'No results',
        checkedDate: new Date().toISOString().split('T')[0]
      });
    } else {
      spinner.fail(`${name} — error: ${lookup.error}`);
    }
    
    // Rate limiting
    await new Promise(r => setTimeout(r, 2000));
  }
  
  await browser.close();
  
  // Output
  if (results.length > 0) {
    const csv = stringify(results, { header: true });
    writeFileSync(argv.output, csv);
    console.log(chalk.gray(`\nResults saved to: ${argv.output}\n`));
  }
}

main().catch(console.error);
