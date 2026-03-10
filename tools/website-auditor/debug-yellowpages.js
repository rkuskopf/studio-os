#!/usr/bin/env node

/**
 * Debug script to inspect Yellow Pages markup
 * Run this to see what selectors we need
 */

import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';

const URL = 'https://www.yellowpages.com.au/find/florists/melbourne-vic';

async function debug() {
  console.log('🔍 Inspecting Yellow Pages markup...\n');
  console.log(`URL: ${URL}\n`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
  
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise(r => setTimeout(r, 3000));
  
  // Save the HTML for inspection
  const html = await page.content();
  writeFileSync('debug-yellowpages.html', html);
  console.log('✅ Saved page HTML to debug-yellowpages.html\n');
  
  // Try to find business listings with various selectors
  const debug = await page.evaluate(() => {
    const info = {
      title: document.title,
      url: window.location.href,
      bodyLength: document.body.innerHTML.length,
      selectors: {},
      allLinks: [],
      potentialListings: []
    };
    
    // Test various selectors
    const selectorsToTest = [
      // Common listing selectors
      '.MuiBox-root[data-testid*="listing"]',
      '[data-testid*="listing"]',
      '[data-testid*="card"]',
      'article',
      '.listing',
      '.business-listing',
      '.search-result',
      '[class*="listing"]',
      '[class*="search-contact-card"]',
      '[class*="SearchContactCard"]',
      '[class*="Result"]',
      '[class*="result"]',
      'div[class*="Box"][class*="root"]',
      // Links
      'a[href*="website"]',
      'a[rel="nofollow"]',
    ];
    
    for (const sel of selectorsToTest) {
      try {
        const count = document.querySelectorAll(sel).length;
        if (count > 0) info.selectors[sel] = count;
      } catch {}
    }
    
    // Get all links that might be business websites
    const links = document.querySelectorAll('a[href]');
    for (const link of links) {
      const href = link.href;
      const text = link.textContent?.trim().slice(0, 50);
      const testId = link.getAttribute('data-testid') || '';
      
      // Look for website links
      if (href && (
        text?.toLowerCase().includes('website') ||
        href.includes('redirect') ||
        testId.includes('website') ||
        (href.startsWith('http') && !href.includes('yellowpages.com') && !href.includes('google') && !href.includes('facebook'))
      )) {
        info.allLinks.push({ href: href.slice(0, 100), text, testId });
      }
    }
    
    // Try to find business names and their containers
    const h2s = document.querySelectorAll('h2, h3');
    for (const h of [...h2s].slice(0, 10)) {
      const container = h.closest('article, [class*="listing"], [class*="card"], div[data-testid]');
      info.potentialListings.push({
        tag: h.tagName,
        text: h.textContent?.trim().slice(0, 50),
        containerClass: container?.className?.slice(0, 100),
        containerTestId: container?.getAttribute('data-testid')
      });
    }
    
    return info;
  });
  
  console.log('📄 Page Info:');
  console.log(`  Title: ${debug.title}`);
  console.log(`  Body length: ${debug.bodyLength.toLocaleString()} chars`);
  
  console.log('\n📌 Selectors found:');
  for (const [sel, count] of Object.entries(debug.selectors)) {
    console.log(`  ${sel}: ${count}`);
  }
  
  console.log('\n🔗 Potential website links:');
  for (const link of debug.allLinks.slice(0, 20)) {
    console.log(`  "${link.text}" → ${link.href}`);
    if (link.testId) console.log(`    data-testid: ${link.testId}`);
  }
  
  console.log('\n📋 Potential listings (headings):');
  for (const item of debug.potentialListings) {
    console.log(`  ${item.tag}: "${item.text}"`);
    if (item.containerClass) console.log(`    class: ${item.containerClass}`);
    if (item.containerTestId) console.log(`    data-testid: ${item.containerTestId}`);
  }
  
  await browser.close();
  
  console.log('\n✅ Debug complete. Check debug-yellowpages.html for full markup.\n');
}

debug().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
