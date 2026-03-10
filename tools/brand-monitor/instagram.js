#!/usr/bin/env node

/**
 * KSPF Brand Monitor — Instagram Hashtag Scraper
 * 
 * Monitors Instagram hashtags for new brands launching in fashion/beauty/lifestyle.
 * Outputs accounts that look like early-stage brands.
 * 
 * Usage:
 *   node instagram.js --hashtag melbournebrand
 *   node instagram.js --hashtags "#indiebeauty,#melbournefashion,#newbrand"
 * 
 * Note: Instagram scraping is fragile and against TOS. Use sparingly.
 * Consider this a research tool, not a production scraper.
 */

import puppeteer from 'puppeteer';
import { stringify } from 'csv-stringify/sync';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Hashtags relevant to KSPF's target clients
const DEFAULT_HASHTAGS = [
  'melbournebrand',
  'melbournefashion',
  'melbournebeauty',
  'australianbrand',
  'indiebeauty',
  'smallbatchbeauty',
  'newbrandlaunch',
  'brandlaunch',
  'indieskincare',
  'cleanbeautyau',
  'australianmade',
  'melbournemade',
];

// Signals that an account might be an early-stage brand (good lead)
const EARLY_STAGE_SIGNALS = [
  'coming soon',
  'launching',
  'pre-order',
  'new brand',
  'just launched',
  'small batch',
  'handmade',
  'founded by',
  'made in melbourne',
  'australian made',
  'locally made',
  'est. 2024',
  'est. 2025',
  'est. 2026',
];

const argv = yargs(hideBin(process.argv))
  .option('hashtag', {
    alias: 'h',
    type: 'string',
    description: 'Single hashtag to monitor (without #)'
  })
  .option('hashtags', {
    type: 'string',
    description: 'Comma-separated list of hashtags'
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    default: 'instagram-leads.csv',
    description: 'Output CSV file'
  })
  .option('limit', {
    alias: 'l',
    type: 'number',
    default: 20,
    description: 'Max posts to check per hashtag'
  })
  .help()
  .argv;

/**
 * Check if bio contains early-stage brand signals
 */
function scoreAccount(bio, followerCount) {
  let score = 0;
  const bioLower = (bio || '').toLowerCase();
  
  // Early stage signals in bio
  for (const signal of EARLY_STAGE_SIGNALS) {
    if (bioLower.includes(signal)) {
      score += 10;
    }
  }
  
  // Follower count scoring (smaller = more likely to need help)
  if (followerCount < 1000) score += 20;
  else if (followerCount < 5000) score += 15;
  else if (followerCount < 10000) score += 10;
  else if (followerCount > 100000) score -= 20; // Too big
  
  // Has website link (shows intent)
  if (bioLower.includes('http') || bioLower.includes('www') || bioLower.includes('.com') || bioLower.includes('.au')) {
    score += 5;
  }
  
  return score;
}

/**
 * Scrape Instagram hashtag page
 * Note: This is fragile and may break. Instagram actively blocks scrapers.
 */
async function scrapeHashtag(browser, hashtag, limit) {
  const page = await browser.newPage();
  const results = [];
  
  try {
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const url = `https://www.instagram.com/explore/tags/${hashtag}/`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for content to load
    await page.waitForSelector('article', { timeout: 10000 }).catch(() => null);
    
    // Get post links
    const postLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('article a[href*="/p/"]'));
      return links.map(a => a.href).slice(0, 30);
    });
    
    // Visit each post and extract account info
    for (const postUrl of postLinks.slice(0, limit)) {
      try {
        await page.goto(postUrl, { waitUntil: 'networkidle2', timeout: 15000 });
        await page.waitForTimeout(1000 + Math.random() * 2000); // Random delay
        
        const accountInfo = await page.evaluate(() => {
          // Try to get username from the page
          const usernameEl = document.querySelector('header a[href*="/"]');
          const username = usernameEl?.textContent || usernameEl?.href?.split('/').filter(Boolean).pop();
          
          return { username };
        });
        
        if (accountInfo.username && !results.find(r => r.username === accountInfo.username)) {
          results.push({
            username: accountInfo.username,
            hashtag,
            postUrl,
            foundDate: new Date().toISOString().split('T')[0]
          });
        }
      } catch (e) {
        // Skip failed posts
      }
    }
  } catch (error) {
    console.log(chalk.yellow(`  Could not scrape #${hashtag}: ${error.message}`));
  } finally {
    await page.close();
  }
  
  return results;
}

/**
 * Main function
 */
async function main() {
  console.log(chalk.bold('\n📱 KSPF Brand Monitor — Instagram\n'));
  
  // Determine hashtags to search
  let hashtags = DEFAULT_HASHTAGS;
  
  if (argv.hashtag) {
    hashtags = [argv.hashtag.replace('#', '')];
  } else if (argv.hashtags) {
    hashtags = argv.hashtags.split(',').map(h => h.trim().replace('#', ''));
  }
  
  console.log(chalk.gray(`Monitoring ${hashtags.length} hashtags...\n`));
  console.log(chalk.yellow('⚠️  Note: Instagram scraping is fragile and rate-limited.\n'));
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });
  
  let allResults = [];
  
  for (const hashtag of hashtags) {
    const spinner = ora(`Searching #${hashtag}`).start();
    
    const results = await scrapeHashtag(browser, hashtag, argv.limit);
    allResults = allResults.concat(results);
    
    spinner.succeed(`#${hashtag} — found ${results.length} accounts`);
    
    // Rate limiting
    await new Promise(r => setTimeout(r, 3000 + Math.random() * 2000));
  }
  
  await browser.close();
  
  // Deduplicate
  const uniqueResults = [];
  const seen = new Set();
  for (const result of allResults) {
    if (!seen.has(result.username)) {
      seen.add(result.username);
      uniqueResults.push(result);
    }
  }
  
  // Output CSV
  if (uniqueResults.length > 0) {
    const csv = stringify(uniqueResults, { header: true });
    writeFileSync(argv.output, csv);
    
    console.log(chalk.bold(`\n✅ Found ${uniqueResults.length} unique accounts`));
    console.log(chalk.gray(`Saved to: ${argv.output}\n`));
    
    console.log(chalk.bold('Next steps:'));
    console.log('1. Review the accounts manually on Instagram');
    console.log('2. Check if they have a website (audit it!)');
    console.log('3. Look for early-stage signals in their bio/posts');
    console.log('4. Add promising leads to your outreach list\n');
  } else {
    console.log(chalk.yellow('\nNo accounts found. Instagram may be blocking requests.\n'));
  }
}

main().catch(console.error);
