#!/usr/bin/env node

/**
 * KSPF Brand Monitor — Instagram Profile Extractor
 * 
 * Given a list of Instagram usernames, visits each profile and extracts:
 * - Bio text
 * - Website URL
 * - Follower count
 * - Business category
 * 
 * Outputs a CSV with websites ready for the auditor.
 * 
 * Usage:
 *   node extract-profiles.js --input usernames.txt --output profiles.csv
 *   node extract-profiles.js --users "brand1,brand2,brand3"
 */

import puppeteer from 'puppeteer';
import { stringify } from 'csv-stringify/sync';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Signals that indicate early-stage brand (good lead)
const EARLY_STAGE_SIGNALS = [
  'coming soon', 'launching', 'pre-order', 'new brand', 'just launched',
  'small batch', 'handmade', 'founded by', 'made in melbourne', 'australian made',
  'locally made', 'est. 2024', 'est. 2025', 'est. 2026', 'founder', 'small business'
];

const argv = yargs(hideBin(process.argv))
  .option('input', {
    alias: 'i',
    type: 'string',
    description: 'Text file with usernames (one per line)'
  })
  .option('users', {
    alias: 'u',
    type: 'string',
    description: 'Comma-separated usernames'
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    default: 'instagram-profiles.csv',
    description: 'Output CSV file'
  })
  .option('websites-csv', {
    alias: 'w',
    type: 'string',
    default: 'websites-to-audit.csv',
    description: 'Output CSV with just websites for auditor'
  })
  .help()
  .argv;

/**
 * Calculate lead score based on profile info
 */
function calculateLeadScore(profile) {
  let score = 0;
  const bioLower = (profile.bio || '').toLowerCase();
  
  // Early stage signals
  for (const signal of EARLY_STAGE_SIGNALS) {
    if (bioLower.includes(signal)) score += 10;
  }
  
  // Follower count (smaller = more likely to need help)
  const followers = parseInt(profile.followers) || 0;
  if (followers < 1000) score += 25;
  else if (followers < 5000) score += 20;
  else if (followers < 10000) score += 10;
  else if (followers > 50000) score -= 10;
  
  // Has website (shows business intent)
  if (profile.website) score += 15;
  
  // Is business account
  if (profile.category) score += 5;
  
  return score;
}

/**
 * Extract profile information from Instagram
 */
async function extractProfile(browser, username) {
  const page = await browser.newPage();
  
  try {
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const url = `https://www.instagram.com/${username}/`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for profile to load
    await page.waitForSelector('header', { timeout: 10000 });
    await page.waitForTimeout(1500);
    
    const profile = await page.evaluate(() => {
      // Get bio
      const bioEl = document.querySelector('header section > div:last-child') ||
                    document.querySelector('div.-vDIg span');
      const bio = bioEl?.textContent?.trim() || '';
      
      // Get external link
      const linkEl = document.querySelector('a[href*="l.instagram.com"]') ||
                     document.querySelector('header a[rel="me nofollow noopener noreferrer"]');
      let website = '';
      if (linkEl) {
        const href = linkEl.href;
        if (href.includes('l.instagram.com')) {
          // Extract actual URL from Instagram redirect
          const match = href.match(/u=([^&]+)/);
          if (match) website = decodeURIComponent(match[1]);
        } else {
          website = href;
        }
      }
      
      // Also check for link in bio text
      if (!website) {
        const urlMatch = bio.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/);
        if (urlMatch) {
          website = urlMatch[0].startsWith('http') ? urlMatch[0] : 'https://' + urlMatch[0];
        }
      }
      
      // Get follower count
      const statsEls = document.querySelectorAll('header section ul li span span');
      let followers = '';
      statsEls.forEach(el => {
        const text = el.textContent || '';
        if (el.closest('li')?.textContent?.includes('follower')) {
          followers = text;
        }
      });
      
      // Alternative follower extraction
      if (!followers) {
        const metaDesc = document.querySelector('meta[name="description"]');
        const descContent = metaDesc?.content || '';
        const followerMatch = descContent.match(/([\d,.]+[KkMm]?)\s*Followers/);
        if (followerMatch) followers = followerMatch[1];
      }
      
      // Get business category
      const categoryEl = document.querySelector('header div[class*="category"]') ||
                        document.querySelector('div.-vDIg > span:first-child');
      const category = categoryEl?.textContent?.trim() || '';
      
      // Get display name
      const nameEl = document.querySelector('header h2') ||
                    document.querySelector('header span[class*="name"]');
      const displayName = nameEl?.textContent?.trim() || '';
      
      return { bio, website, followers, category, displayName };
    });
    
    return {
      success: true,
      ...profile
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
  console.log(chalk.bold('\n📱 KSPF Instagram Profile Extractor\n'));
  
  // Get usernames
  let usernames = [];
  
  if (argv.users) {
    usernames = argv.users.split(',').map(u => u.trim().replace('@', ''));
  } else if (argv.input && existsSync(argv.input)) {
    const content = readFileSync(argv.input, 'utf-8');
    usernames = content.split('\n').map(u => u.trim().replace('@', '')).filter(Boolean);
  } else {
    console.log(chalk.yellow('Usage:'));
    console.log('  node extract-profiles.js --users "brand1,brand2,brand3"');
    console.log('  node extract-profiles.js --input usernames.txt\n');
    console.log(chalk.gray('Input file should have one username per line.\n'));
    return;
  }
  
  console.log(chalk.gray(`Extracting ${usernames.length} profiles...\n`));
  console.log(chalk.yellow('⚠️  Instagram may block after many requests. Use sparingly.\n'));
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });
  
  const results = [];
  const websitesForAudit = [];
  
  for (let i = 0; i < usernames.length; i++) {
    const username = usernames[i];
    const spinner = ora(`[${i + 1}/${usernames.length}] @${username}`).start();
    
    const profile = await extractProfile(browser, username);
    
    if (profile.success) {
      const leadScore = calculateLeadScore(profile);
      
      const result = {
        username,
        displayName: profile.displayName,
        website: profile.website,
        followers: profile.followers,
        category: profile.category,
        bio: profile.bio?.substring(0, 200),
        leadScore,
        instagramUrl: `https://instagram.com/${username}`,
        extractedDate: new Date().toISOString().split('T')[0]
      };
      
      results.push(result);
      
      if (profile.website) {
        websitesForAudit.push({
          url: profile.website,
          name: profile.displayName || username,
          category: profile.category || 'instagram',
          source: 'instagram',
          instagramFollowers: profile.followers
        });
        spinner.succeed(chalk.green(`@${username} — ${profile.website}`));
      } else {
        spinner.succeed(chalk.gray(`@${username} — no website`));
      }
    } else {
      spinner.fail(chalk.red(`@${username} — ${profile.error}`));
      results.push({
        username,
        error: profile.error,
        extractedDate: new Date().toISOString().split('T')[0]
      });
    }
    
    // Rate limiting
    await new Promise(r => setTimeout(r, 2000 + Math.random() * 2000));
  }
  
  await browser.close();
  
  // Output full profiles
  const csv = stringify(results, { header: true });
  writeFileSync(argv.output, csv);
  
  // Output websites CSV for auditor
  if (websitesForAudit.length > 0) {
    const websitesCsv = stringify(websitesForAudit, { header: true });
    writeFileSync(argv.websitesCsv, websitesCsv);
  }
  
  // Summary
  console.log(chalk.bold(`\n✅ Extracted ${results.length} profiles`));
  console.log(chalk.green(`   ${websitesForAudit.length} have websites`));
  console.log(chalk.gray(`\nFull profiles: ${argv.output}`));
  
  if (websitesForAudit.length > 0) {
    console.log(chalk.gray(`Websites CSV: ${argv.websitesCsv}`));
    console.log(chalk.cyan('\nNext step: Audit the websites'));
    console.log(chalk.gray(`  cd ../website-auditor`));
    console.log(chalk.gray(`  node audit.js --input ../brand-monitor/${argv.websitesCsv}\n`));
  }
}

main().catch(console.error);
