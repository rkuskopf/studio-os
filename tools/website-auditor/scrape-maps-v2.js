#!/usr/bin/env node

/**
 * KSPF Lead Scraper — Google Maps (v2 with Stealth)
 * 
 * Uses puppeteer-extra-plugin-stealth to avoid bot detection.
 * Extracts business websites from Google Maps search results.
 * 
 * Usage:
 *   node scrape-maps-v2.js --query "florist melbourne"
 *   node scrape-maps-v2.js --query "beauty salon fitzroy" --limit 10
 */

import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { stringify } from 'csv-stringify/sync';
import { writeFileSync } from 'fs';
import chalk from 'chalk';

// Add stealth plugin
puppeteerExtra.use(StealthPlugin());

const args = process.argv.slice(2);
const queryIndex = args.indexOf('--query');
const limitIndex = args.indexOf('--limit');

const query = queryIndex !== -1 ? args[queryIndex + 1] : 'florist melbourne';
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : 10;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms + Math.random() * 1000));
}

async function scrapeGoogleMaps(query, limit) {
  console.log(chalk.bold(`\n🗺️  Google Maps Scraper v2 (Stealth)\n`));
  console.log(chalk.gray(`Query: "${query}"`));
  console.log(chalk.gray(`Limit: ${limit} results\n`));

  const browser = await puppeteerExtra.launch({
    headless: false, // Visible browser helps avoid detection
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1280,800'
    ]
  });

  const page = await browser.newPage();
  
  // Set a realistic viewport
  await page.setViewport({ width: 1280, height: 800 });
  
  // Set realistic user agent
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  const results = [];

  try {
    // Navigate to Google Maps search
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    console.log(chalk.gray(`Opening: ${searchUrl}\n`));
    
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(3000);

    // Wait for the results panel
    console.log(chalk.yellow('Waiting for results to load...'));
    
    try {
      await page.waitForSelector('div[role="feed"]', { timeout: 15000 });
    } catch {
      console.log(chalk.red('Could not find results panel. Google may have blocked or changed layout.'));
      await browser.close();
      return [];
    }

    // Scroll to load more results
    console.log(chalk.yellow('Scrolling to load more results...'));
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => {
        const feed = document.querySelector('div[role="feed"]');
        if (feed) feed.scrollTop = feed.scrollHeight;
      });
      await sleep(2000);
    }

    // Get all business listing links
    const businessLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('a[href*="/maps/place/"]');
      const hrefs = [];
      for (const link of links) {
        if (link.href && !hrefs.includes(link.href)) {
          hrefs.push(link.href);
        }
      }
      return hrefs;
    });

    console.log(chalk.green(`Found ${businessLinks.length} business listings\n`));

    // Visit each business to get details
    for (let i = 0; i < Math.min(businessLinks.length, limit); i++) {
      const link = businessLinks[i];
      console.log(chalk.gray(`[${i + 1}/${Math.min(businessLinks.length, limit)}] Visiting...`));

      try {
        await page.goto(link, { waitUntil: 'networkidle2', timeout: 30000 });
        await sleep(2000);

        const info = await page.evaluate(() => {
          // Business name from h1
          const nameEl = document.querySelector('h1');
          const name = nameEl?.textContent?.trim() || '';

          // Try multiple selectors for website
          let website = '';
          
          // Method 1: Look for website button/link
          const websiteBtn = document.querySelector('a[data-item-id="authority"]');
          if (websiteBtn) {
            website = websiteBtn.href;
          }
          
          // Method 2: Look for links with "website" text
          if (!website) {
            const allLinks = document.querySelectorAll('a[href]');
            for (const a of allLinks) {
              const text = a.textContent?.toLowerCase() || '';
              const ariaLabel = a.getAttribute('aria-label')?.toLowerCase() || '';
              if ((text.includes('website') || ariaLabel.includes('website')) && a.href.startsWith('http')) {
                website = a.href;
                break;
              }
            }
          }
          
          // Method 3: Look in the info panel for external links
          if (!website) {
            const infoPanel = document.querySelector('div[role="main"]');
            if (infoPanel) {
              const links = infoPanel.querySelectorAll('a[href^="http"]');
              for (const a of links) {
                const href = a.href;
                if (!href.includes('google.com') && 
                    !href.includes('facebook.com') && 
                    !href.includes('instagram.com') &&
                    !href.includes('maps') &&
                    !href.includes('gstatic')) {
                  website = href;
                  break;
                }
              }
            }
          }

          // Clean up Google redirect URLs
          if (website.includes('/url?q=')) {
            const match = website.match(/url\?q=([^&]+)/);
            if (match) website = decodeURIComponent(match[1]);
          }

          // Category
          const categoryBtn = document.querySelector('button[jsaction*="category"]');
          const category = categoryBtn?.textContent?.trim() || '';

          // Address
          const addressBtn = document.querySelector('button[data-item-id="address"]');
          const address = addressBtn?.textContent?.trim() || '';

          // Rating
          const ratingEl = document.querySelector('span[role="img"][aria-label*="star"]');
          const rating = ratingEl?.getAttribute('aria-label') || '';

          return { name, website, category, address, rating };
        });

        if (info.name) {
          console.log(chalk.white(`   ${info.name}`));
          if (info.website) {
            console.log(chalk.green(`   ✓ ${info.website}`));
            results.push({
              name: info.name,
              url: info.website,
              category: info.category,
              address: info.address,
              rating: info.rating,
              source: 'google_maps',
              query: query,
              scrapedDate: new Date().toISOString().split('T')[0]
            });
          } else {
            console.log(chalk.gray(`   ✗ No website found`));
          }
        }

      } catch (err) {
        console.log(chalk.red(`   Error: ${err.message}`));
      }

      // Random delay between requests
      await sleep(1500);
    }

  } catch (error) {
    console.log(chalk.red(`\nError: ${error.message}`));
  }

  await browser.close();
  return results;
}

async function main() {
  const results = await scrapeGoogleMaps(query, limit);

  // Deduplicate by URL
  const seen = new Set();
  const unique = results.filter(r => {
    try {
      const domain = new URL(r.url).hostname;
      if (seen.has(domain)) return false;
      seen.add(domain);
      return true;
    } catch {
      return false;
    }
  });

  if (unique.length > 0) {
    const outputFile = 'maps-leads-v2.csv';
    const csv = stringify(unique, { header: true });
    writeFileSync(outputFile, csv);

    console.log(chalk.bold(`\n✅ Found ${unique.length} unique businesses with websites`));
    console.log(chalk.gray(`Saved to: ${outputFile}\n`));

    console.log(chalk.cyan('Next step: Run the website auditor'));
    console.log(chalk.gray(`  node audit.js --input ${outputFile}\n`));
  } else {
    console.log(chalk.yellow('\n⚠️  No businesses with websites found.'));
    console.log(chalk.gray('This could mean:'));
    console.log(chalk.gray('  - Google blocked the scraper'));
    console.log(chalk.gray('  - The markup has changed'));
    console.log(chalk.gray('  - Try a different query\n'));
  }
}

main().catch(console.error);
