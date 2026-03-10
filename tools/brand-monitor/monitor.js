#!/usr/bin/env node

/**
 * KSPF Brand Monitor — Combined Workflow
 * 
 * Runs the full lead discovery pipeline:
 * 1. Scrape Instagram hashtags for new brands
 * 2. Extract website URLs from found accounts
 * 3. Run website audits on those URLs
 * 4. Output ranked leads
 */

import { spawn } from 'child_process';
import chalk from 'chalk';

console.log(chalk.bold('\n🔄 KSPF Brand Monitor — Full Pipeline\n'));
console.log(chalk.yellow('This runs the full lead discovery workflow:\n'));
console.log('  1. Instagram hashtag scraping → find new brands');
console.log('  2. Extract websites from Instagram bios');
console.log('  3. Run Lighthouse audits on websites');
console.log('  4. Output ranked lead list\n');

console.log(chalk.bold('Recommended manual workflow:\n'));

console.log(chalk.cyan('Step 1: Find potential brands'));
console.log('  node instagram.js --hashtags "melbournebrand,indiebeauty,newbrand"');
console.log('  → Outputs: instagram-leads.csv\n');

console.log(chalk.cyan('Step 2: Manually review accounts'));
console.log('  - Open each account on Instagram');
console.log('  - Check bio for website links');
console.log('  - Look for early-stage signals');
console.log('  - Add promising URLs to a new CSV\n');

console.log(chalk.cyan('Step 3: Audit websites'));
console.log('  cd ../website-auditor');
console.log('  node audit.js --input ../brand-monitor/websites-to-audit.csv');
console.log('  → Outputs: leads-output.csv with ranked leads\n');

console.log(chalk.cyan('Step 4: Outreach'));
console.log('  - Review top-scored leads');
console.log('  - Research each business');
console.log('  - Personalise outreach based on specific issues found\n');

console.log(chalk.gray('---\n'));
console.log('Run individual tools:');
console.log('  npm run instagram   → Instagram hashtag scraper');
console.log('  npm run abr         → Australian Business Register lookup\n');
