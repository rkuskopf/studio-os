#!/usr/bin/env node

/**
 * KSPF Lead Scraper — Google Search
 * 
 * Searches Google for businesses and extracts their websites.
 * More reliable than Maps scraping.
 * 
 * Usage:
 *   node scrape-google.js --query "fashion boutique melbourne"
 *   node scrape-google.js --preset
 */

import puppeteer from 'puppeteer';
import { stringify } from 'csv-stringify/sync';
import { writeFileSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const PRESET_QUERIES = [
  'fashion boutique melbourne website',
  'beauty salon melbourne cbd website',
  'skincare brand australia website',
  'indie cosmetics melbourne',
  'florist melbourne website',
  'jewellery designer melbourne',
  'homewares store melbourne website',
  'yoga studio melbourne fitzroy',
  'pilates studio south yarra',
  'hair salon prahran website',
  'nail salon melbourne website',
  'bridal boutique melbourne',
  'vintage clothing melbourne',
  'gift shop melbourne cbd',
];

const argv = yargs(hideBin(process.argv))
  .option('query', {
    alias: 'q',
    type: 'string',
    description: 'Search query'
  })
  .option('queries', {
    type: 'string',
    description: 'Comma-separated queries'
  })
  .option('preset', {
    alias: 'p',
    type: 'boolean',
    description: 'Use preset KSPF queries'
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    default: 'google-leads.csv',
    description: 'Output CSV file'
  })
  .option('limit', {
    alias: 'l',
    type: 'number',
    default: 10,
    description: 'Results per query'
  })
  .help()
  .argv;

/**
 * Extract business websites from Google search results
 */
async function searchGoogle(browser, query, limit) {
  const page = await browser.newPage();
  const results = [];
  
  try {
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Add "website" to query if not present to get direct business results
    const searchQuery = query.includes('website') ? query : `${query} website`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&num=${limit + 5}`;
    
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1000));
    
    // Accept cookies if prompted
    const consentButton = await page.$('button[id*="accept"], button[aria-label*="Accept"]');
    if (consentButton) {
      await consentButton.click();
      await new Promise(r => setTimeout(r, 1000));
    }
    
    // Extract search results
    const searchResults = await page.evaluate((maxResults) => {
      const results = [];
      
      // Get all search result containers
      const resultDivs = document.querySelectorAll('div.g, div[data-hveid]');
      
      for (const div of resultDivs) {
        if (results.length >= maxResults) break;
        
        // Get the link
        const linkEl = div.querySelector('a[href^="http"]:not([href*="google"])');
        if (!linkEl) continue;
        
        const url = linkEl.href;
        
        // Skip non-business URLs
        if (url.includes('facebook.com') ||
            url.includes('instagram.com') ||
            url.includes('linkedin.com') ||
            url.includes('youtube.com') ||
            url.includes('twitter.com') ||
            url.includes('yelp.com') ||
            url.includes('tripadvisor.com') ||
            url.includes('yellowpages.com') ||
            url.includes('truelocal.com') ||
            url.includes('wikipedia.org')) {
          continue;
        }
        
        // Get title
        const titleEl = div.querySelector('h3');
        const title = titleEl?.textContent?.trim() || '';
        
        // Get description
        const descEl = div.querySelector('div[data-sncf], span.st, div.VwiC3b');
        const description = descEl?.textContent?.trim().substring(0, 200) || '';
        
        if (url && title) {
          results.push({ url, title, description });
        }
      }
      
      return results;
    }, limit);
    
    for (const result of searchResults) {
      // Extract domain for deduplication
      try {
        const domain = new URL(result.url).hostname;
        results.push({
          name: result.title,
          url: result.url,
          domain,
          description: result.description,
          source: 'google_search',
          query: query,
          scrapedDate: new Date().toISOString().split('T')[0]
        });
      } catch (e) {
        // Invalid URL, skip
      }
    }
  } catch (error) {
    console.log(chalk.yellow(`  Error searching "${query}": ${error.message}`));
  } finally {
    await page.close();
  }
  
  return results;
}

async function main() {
  console.log(chalk.bold('\n🔍 KSPF Lead Scraper — Google Search\n'));
  
  let queries = [];
  
  if (argv.query) {
    queries = [argv.query];
  } else if (argv.queries) {
    queries = argv.queries.split(',').map(q => q.trim());
  } else if (argv.preset) {
    queries = PRESET_QUERIES;
    console.log(chalk.gray(`Using ${queries.length} preset queries\n`));
  } else {
    console.log(chalk.yellow('Usage:'));
    console.log('  node scrape-google.js --query "fashion boutique melbourne"');
    console.log('  node scrape-google.js --preset\n');
    return;
  }
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });
  
  let allResults = [];
  
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    const spinner = ora(`[${i + 1}/${queries.length}] ${query}`).start();
    
    const results = await searchGoogle(browser, query, argv.limit);
    allResults = allResults.concat(results);
    
    spinner.succeed(`${query} — found ${results.length} results`);
    
    // Rate limiting
    await new Promise(r => setTimeout(r, 2000 + Math.random() * 1000));
  }
  
  await browser.close();
  
  // Deduplicate by domain
  const seen = new Set();
  const unique = allResults.filter(r => {
    if (seen.has(r.domain)) return false;
    seen.add(r.domain);
    return true;
  });
  
  if (unique.length > 0) {
    const csv = stringify(unique, { header: true });
    writeFileSync(argv.output, csv);
    
    console.log(chalk.bold(`\n✅ Found ${unique.length} unique websites`));
    console.log(chalk.gray(`Saved to: ${argv.output}\n`));
    
    console.log(chalk.cyan('Next step: Audit these websites'));
    console.log(chalk.gray(`  node audit.js --input ${argv.output}\n`));
  }
}

main().catch(console.error);
