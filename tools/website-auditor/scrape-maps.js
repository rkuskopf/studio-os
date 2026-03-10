#!/usr/bin/env node

/**
 * KSPF Lead Scraper — Google Maps
 * 
 * Searches Google Maps for businesses matching your criteria,
 * extracts their websites, and outputs a CSV ready for auditing.
 * 
 * Usage:
 *   node scrape-maps.js --query "fashion boutique melbourne"
 *   node scrape-maps.js --queries "beauty salon melbourne,skincare brand melbourne"
 *   node scrape-maps.js --preset  (uses default KSPF target queries)
 */

import puppeteer from 'puppeteer';
import { stringify } from 'csv-stringify/sync';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Default search queries targeting KSPF's ideal clients
const PRESET_QUERIES = [
  'fashion boutique melbourne',
  'beauty salon melbourne',
  'skincare brand melbourne',
  'cosmetics store melbourne',
  'indie fashion melbourne',
  'hair salon melbourne fitzroy',
  'beauty clinic melbourne',
  'nail salon melbourne prahran',
  'wellness studio melbourne',
  'pilates studio melbourne',
  'yoga studio melbourne',
  'florist melbourne',
  'jewellery store melbourne',
  'homewares store melbourne',
  'gift shop melbourne',
  'lifestyle store melbourne',
  'vintage clothing melbourne',
  'bridal boutique melbourne',
];

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
    default: 'maps-leads.csv',
    description: 'Output CSV file'
  })
  .option('limit', {
    alias: 'l',
    type: 'number',
    default: 20,
    description: 'Max results per query'
  })
  .option('headless', {
    type: 'boolean',
    default: true,
    description: 'Run browser in headless mode'
  })
  .help()
  .argv;

/**
 * Scroll the Google Maps results panel to load more results
 */
async function autoScroll(page, selector) {
  await page.evaluate(async (sel) => {
    const element = document.querySelector(sel);
    if (!element) return;
    
    for (let i = 0; i < 5; i++) {
      element.scrollTop = element.scrollHeight;
      await new Promise(r => setTimeout(r, 1500));
    }
  }, selector);
}

/**
 * Extract business info from Google Maps search results
 */
async function scrapeGoogleMaps(browser, query, limit) {
  const page = await browser.newPage();
  const results = [];
  
  try {
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Navigate to Google Maps search
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Wait for results to load
    await page.waitForSelector('div[role="feed"]', { timeout: 15000 }).catch(() => null);
    
    // Scroll to load more results
    await autoScroll(page, 'div[role="feed"]');
    
    // Get all business links
    const businessLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/maps/place/"]'));
      return [...new Set(links.map(a => a.href))].slice(0, 30);
    });
    
    // Visit each business page to get details
    for (const link of businessLinks.slice(0, limit)) {
      try {
        await page.goto(link, { waitUntil: 'networkidle2', timeout: 30000 });
        await page.waitForTimeout(1000 + Math.random() * 1000);
        
        const businessInfo = await page.evaluate(() => {
          // Business name
          const nameEl = document.querySelector('h1');
          const name = nameEl?.textContent?.trim() || '';
          
          // Website link
          const websiteLink = document.querySelector('a[data-item-id="authority"]') ||
                             document.querySelector('a[href*="http"]:not([href*="google"])');
          let website = '';
          if (websiteLink) {
            const href = websiteLink.getAttribute('href');
            if (href && !href.includes('google.com')) {
              website = href;
            }
          }
          
          // Also try to find website in the info panel
          if (!website) {
            const allLinks = Array.from(document.querySelectorAll('a[href]'));
            for (const link of allLinks) {
              const href = link.href;
              if (href && 
                  !href.includes('google.com') && 
                  !href.includes('gstatic') &&
                  !href.includes('facebook.com') &&
                  !href.includes('instagram.com') &&
                  (href.startsWith('http://') || href.startsWith('https://')) &&
                  !href.includes('/maps/')) {
                website = href;
                break;
              }
            }
          }
          
          // Category/type
          const categoryEl = document.querySelector('button[jsaction*="category"]');
          const category = categoryEl?.textContent?.trim() || '';
          
          // Address
          const addressEl = document.querySelector('button[data-item-id="address"]');
          const address = addressEl?.textContent?.trim() || '';
          
          // Rating
          const ratingEl = document.querySelector('span[role="img"]');
          const rating = ratingEl?.getAttribute('aria-label') || '';
          
          return { name, website, category, address, rating };
        });
        
        if (businessInfo.name && businessInfo.website) {
          // Clean up website URL
          let cleanUrl = businessInfo.website;
          if (cleanUrl.includes('url?q=')) {
            cleanUrl = decodeURIComponent(cleanUrl.split('url?q=')[1].split('&')[0]);
          }
          
          results.push({
            name: businessInfo.name,
            url: cleanUrl,
            category: businessInfo.category,
            address: businessInfo.address,
            rating: businessInfo.rating,
            source: 'google_maps',
            query: query,
            scrapedDate: new Date().toISOString().split('T')[0]
          });
        }
      } catch (e) {
        // Skip failed business pages
      }
    }
  } catch (error) {
    console.log(chalk.yellow(`  Error scraping "${query}": ${error.message}`));
  } finally {
    await page.close();
  }
  
  return results;
}

/**
 * Main function
 */
async function main() {
  console.log(chalk.bold('\n🗺️  KSPF Lead Scraper — Google Maps\n'));
  
  // Determine queries
  let queries = [];
  
  if (argv.query) {
    queries = [argv.query];
  } else if (argv.queries) {
    queries = argv.queries.split(',').map(q => q.trim());
  } else if (argv.preset) {
    queries = PRESET_QUERIES;
    console.log(chalk.gray(`Using ${queries.length} preset queries for KSPF targets\n`));
  } else {
    console.log(chalk.yellow('Usage:'));
    console.log('  node scrape-maps.js --query "fashion boutique melbourne"');
    console.log('  node scrape-maps.js --queries "query1,query2,query3"');
    console.log('  node scrape-maps.js --preset  (use KSPF default queries)\n');
    console.log(chalk.gray('Preset queries include:'));
    PRESET_QUERIES.slice(0, 5).forEach(q => console.log(chalk.gray(`  - ${q}`)));
    console.log(chalk.gray(`  ... and ${PRESET_QUERIES.length - 5} more\n`));
    return;
  }
  
  console.log(chalk.gray(`Searching ${queries.length} queries, max ${argv.limit} results each...\n`));
  console.log(chalk.yellow('⚠️  This may take a while. Google Maps requires careful scraping.\n'));
  
  const browser = await puppeteer.launch({
    headless: argv.headless,
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1920,1080']
  });
  
  let allResults = [];
  
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    const spinner = ora(`[${i + 1}/${queries.length}] Searching: ${query}`).start();
    
    const results = await scrapeGoogleMaps(browser, query, argv.limit);
    allResults = allResults.concat(results);
    
    spinner.succeed(`${query} — found ${results.length} businesses with websites`);
    
    // Rate limiting between queries
    if (i < queries.length - 1) {
      await new Promise(r => setTimeout(r, 3000 + Math.random() * 2000));
    }
  }
  
  await browser.close();
  
  // Deduplicate by URL
  const seen = new Set();
  const uniqueResults = allResults.filter(r => {
    const domain = new URL(r.url).hostname;
    if (seen.has(domain)) return false;
    seen.add(domain);
    return true;
  });
  
  // Output
  if (uniqueResults.length > 0) {
    const csv = stringify(uniqueResults, { header: true });
    writeFileSync(argv.output, csv);
    
    console.log(chalk.bold(`\n✅ Found ${uniqueResults.length} unique businesses with websites`));
    console.log(chalk.gray(`Saved to: ${argv.output}\n`));
    
    console.log(chalk.bold('Sample results:'));
    uniqueResults.slice(0, 5).forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.name}`);
      console.log(chalk.gray(`     ${r.url}`));
      console.log(chalk.gray(`     ${r.category || r.address || ''}\n`));
    });
    
    console.log(chalk.cyan('\nNext step: Run the website auditor'));
    console.log(chalk.gray(`  node audit.js --input ${argv.output}\n`));
  } else {
    console.log(chalk.yellow('\nNo businesses with websites found. Try different queries.\n'));
  }
}

main().catch(console.error);
