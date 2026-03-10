#!/usr/bin/env node

/**
 * KSPF Lead Scraper — Yellow Pages Australia
 * 
 * Scrapes yellowpages.com.au for business listings with websites.
 * More reliable than Google for bulk scraping.
 * 
 * Usage:
 *   node scrape-yellowpages.js --category "beauty-salons" --location "melbourne"
 *   node scrape-yellowpages.js --preset
 */

import puppeteer from 'puppeteer';
import { stringify } from 'csv-stringify/sync';
import { writeFileSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Yellow Pages categories matching KSPF targets
const PRESET_SEARCHES = [
  { category: 'beauty-salons', location: 'melbourne-vic' },
  { category: 'hair-salons', location: 'melbourne-vic' },
  { category: 'nail-salons', location: 'melbourne-vic' },
  { category: 'florists', location: 'melbourne-vic' },
  { category: 'fashion-accessories', location: 'melbourne-vic' },
  { category: 'jewellers', location: 'melbourne-vic' },
  { category: 'gift-shops', location: 'melbourne-vic' },
  { category: 'yoga', location: 'melbourne-vic' },
  { category: 'pilates', location: 'melbourne-vic' },
  { category: 'homewares', location: 'melbourne-vic' },
];

const argv = yargs(hideBin(process.argv))
  .option('category', {
    alias: 'c',
    type: 'string',
    description: 'Yellow Pages category slug'
  })
  .option('location', {
    alias: 'l',
    type: 'string',
    default: 'melbourne-vic',
    description: 'Location slug'
  })
  .option('preset', {
    alias: 'p',
    type: 'boolean',
    description: 'Use preset KSPF categories'
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    default: 'yellowpages-leads.csv',
    description: 'Output CSV'
  })
  .option('pages', {
    type: 'number',
    default: 2,
    description: 'Pages to scrape per category'
  })
  .help()
  .argv;

/**
 * Scrape a Yellow Pages category page
 */
async function scrapeYellowPages(browser, category, location, maxPages) {
  const page = await browser.newPage();
  const results = [];
  
  try {
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const url = `https://www.yellowpages.com.au/find/${category}/${location}/page-${pageNum}`;
      
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 1500));
        
        const pageResults = await page.evaluate(() => {
          const listings = [];
          
          // Find all business listing cards
          const cards = document.querySelectorAll('.MuiBox-root[data-testid="listing-card"], div[class*="listing"], article');
          
          for (const card of cards) {
            // Business name
            const nameEl = card.querySelector('h2, h3, [class*="name"], a[class*="listing"]');
            const name = nameEl?.textContent?.trim() || '';
            
            // Website link - look for explicit website buttons/links
            let website = '';
            const websiteLinks = card.querySelectorAll('a[href]');
            for (const link of websiteLinks) {
              const href = link.href || '';
              const text = link.textContent?.toLowerCase() || '';
              
              // Look for website links
              if ((text.includes('website') || text.includes('visit') || link.getAttribute('data-testid')?.includes('website')) &&
                  href.startsWith('http') && 
                  !href.includes('yellowpages.com')) {
                // Extract actual URL if it's a redirect
                if (href.includes('redirect') || href.includes('url=')) {
                  const match = href.match(/url=([^&]+)/);
                  if (match) website = decodeURIComponent(match[1]);
                } else {
                  website = href;
                }
                break;
              }
            }
            
            // Category
            const categoryEl = card.querySelector('[class*="category"], [class*="type"]');
            const category = categoryEl?.textContent?.trim() || '';
            
            // Address
            const addressEl = card.querySelector('[class*="address"], address');
            const address = addressEl?.textContent?.trim() || '';
            
            if (name && website) {
              listings.push({ name, website, category, address });
            }
          }
          
          return listings;
        });
        
        results.push(...pageResults);
        
      } catch (e) {
        // Page failed, continue
      }
      
      // Rate limiting between pages
      await new Promise(r => setTimeout(r, 1000));
    }
  } catch (error) {
    console.log(chalk.yellow(`  Error: ${error.message}`));
  } finally {
    await page.close();
  }
  
  return results;
}

async function main() {
  console.log(chalk.bold('\n📒 KSPF Lead Scraper — Yellow Pages Australia\n'));
  
  let searches = [];
  
  if (argv.category) {
    searches = [{ category: argv.category, location: argv.location }];
  } else if (argv.preset) {
    searches = PRESET_SEARCHES;
    console.log(chalk.gray(`Scraping ${searches.length} categories\n`));
  } else {
    console.log(chalk.yellow('Usage:'));
    console.log('  node scrape-yellowpages.js --category "beauty-salons" --location "melbourne-vic"');
    console.log('  node scrape-yellowpages.js --preset\n');
    console.log(chalk.gray('Common categories: beauty-salons, hair-salons, florists, jewellers, yoga, pilates\n'));
    return;
  }
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });
  
  let allResults = [];
  
  for (let i = 0; i < searches.length; i++) {
    const { category, location } = searches[i];
    const spinner = ora(`[${i + 1}/${searches.length}] ${category} in ${location}`).start();
    
    const results = await scrapeYellowPages(browser, category, location, argv.pages);
    
    // Add source info
    results.forEach(r => {
      r.source = 'yellowpages';
      r.searchCategory = category;
      r.searchLocation = location;
      r.scrapedDate = new Date().toISOString().split('T')[0];
    });
    
    allResults = allResults.concat(results);
    spinner.succeed(`${category} — found ${results.length} with websites`);
    
    await new Promise(r => setTimeout(r, 2000));
  }
  
  await browser.close();
  
  // Deduplicate by domain
  const seen = new Set();
  const unique = allResults.filter(r => {
    try {
      const domain = new URL(r.website).hostname;
      if (seen.has(domain)) return false;
      seen.add(domain);
      r.url = r.website; // Rename for auditor compatibility
      return true;
    } catch {
      return false;
    }
  });
  
  if (unique.length > 0) {
    const csv = stringify(unique, { header: true });
    writeFileSync(argv.output, csv);
    
    console.log(chalk.bold(`\n✅ Found ${unique.length} unique businesses with websites`));
    console.log(chalk.gray(`Saved to: ${argv.output}\n`));
    
    console.log(chalk.cyan('Next step: Audit these websites'));
    console.log(chalk.gray(`  node audit.js --input ${argv.output}\n`));
  } else {
    console.log(chalk.yellow('\nNo businesses with websites found.\n'));
  }
}

main().catch(console.error);
