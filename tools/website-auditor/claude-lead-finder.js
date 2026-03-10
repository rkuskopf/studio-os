#!/usr/bin/env node

/**
 * KSPF Lead Finder — Claude-Assisted
 * 
 * Generates a prompt for Claude (with web search) to find businesses,
 * then parses the response into a CSV for auditing.
 * 
 * Usage:
 *   node claude-lead-finder.js --category "beauty salons" --location "melbourne"
 *   node claude-lead-finder.js --preset
 *   node claude-lead-finder.js --parse response.txt  (parse Claude's response)
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { stringify } from 'csv-stringify/sync';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const PRESET_CATEGORIES = [
  'indie beauty brands',
  'fashion boutiques',
  'hair salons',
  'florists',
  'yoga studios',
  'pilates studios',
  'jewellery designers',
  'homewares stores',
  'gift shops',
  'nail salons',
  'skincare brands',
  'bridal boutiques',
];

const argv = yargs(hideBin(process.argv))
  .option('category', {
    alias: 'c',
    type: 'string',
    description: 'Business category to search'
  })
  .option('location', {
    alias: 'l',
    type: 'string',
    default: 'Melbourne, Australia',
    description: 'Location'
  })
  .option('count', {
    alias: 'n',
    type: 'number',
    default: 20,
    description: 'Number of businesses to find'
  })
  .option('preset', {
    alias: 'p',
    type: 'boolean',
    description: 'Generate prompts for all preset categories'
  })
  .option('parse', {
    type: 'string',
    description: 'Parse a text file containing Claude\'s response'
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    default: 'claude-leads.csv',
    description: 'Output CSV file'
  })
  .help()
  .argv;

/**
 * Generate a prompt for Claude to find businesses
 */
function generatePrompt(category, location, count) {
  return `Search the web and find ${count} ${category} in ${location} that have their own websites.

For each business, provide:
1. Business name
2. Website URL (must be their actual website, not social media or directory listings)
3. Brief description (1 sentence)

Format your response as a numbered list like this:
1. **Business Name** | https://www.example.com | Brief description
2. **Business Name** | https://www.example.com | Brief description

Requirements:
- Only include businesses with their own website (not just Instagram or Facebook)
- Prefer smaller/independent businesses over large chains
- Focus on businesses that appear to be locally owned
- Verify the websites are real and accessible

Category: ${category}
Location: ${location}
Count: ${count}`;
}

/**
 * Parse Claude's response into structured data
 */
function parseResponse(text) {
  const results = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    // Match patterns like:
    // 1. **Name** | https://url.com | Description
    // 1. Name | https://url.com | Description
    // 1. Name - https://url.com - Description
    
    const patterns = [
      /^\d+\.\s*\*?\*?([^|*]+)\*?\*?\s*\|\s*(https?:\/\/[^\s|]+)\s*\|\s*(.+)$/i,
      /^\d+\.\s*\*?\*?([^-*]+)\*?\*?\s*-\s*(https?:\/\/[^\s-]+)\s*-\s*(.+)$/i,
      /^\d+\.\s*\*?\*?([^:*]+)\*?\*?:\s*(https?:\/\/[^\s]+)\s*-?\s*(.*)$/i,
      /^\d+\.\s*\[([^\]]+)\]\((https?:\/\/[^)]+)\)\s*[-–]?\s*(.*)$/i,
    ];
    
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        const name = match[1].trim().replace(/\*\*/g, '');
        const url = match[2].trim();
        const description = match[3]?.trim() || '';
        
        // Validate URL
        try {
          new URL(url);
          results.push({
            name,
            url,
            description,
            source: 'claude_search',
            foundDate: new Date().toISOString().split('T')[0]
          });
        } catch {
          // Invalid URL, skip
        }
        break;
      }
    }
    
    // Also try to find standalone URLs with business names
    if (results.length === 0 || !results.find(r => line.includes(r.url))) {
      const urlMatch = line.match(/(https?:\/\/[^\s,)]+)/);
      const nameMatch = line.match(/^\d+\.\s*\*?\*?([^|(:\-\[]+)/);
      
      if (urlMatch && nameMatch) {
        const url = urlMatch[1].replace(/[.,;:]+$/, '');
        const name = nameMatch[1].trim().replace(/\*\*/g, '');
        
        try {
          new URL(url);
          if (!results.find(r => r.url === url)) {
            results.push({
              name,
              url,
              description: '',
              source: 'claude_search',
              foundDate: new Date().toISOString().split('T')[0]
            });
          }
        } catch {
          // Invalid URL
        }
      }
    }
  }
  
  return results;
}

async function main() {
  console.log(chalk.bold.cyan('\n🤖 KSPF Lead Finder — Claude-Assisted\n'));
  
  // Parse mode: convert Claude's response to CSV
  if (argv.parse) {
    if (!existsSync(argv.parse)) {
      console.log(chalk.red(`File not found: ${argv.parse}`));
      return;
    }
    
    const text = readFileSync(argv.parse, 'utf-8');
    const results = parseResponse(text);
    
    if (results.length > 0) {
      const csv = stringify(results, { header: true });
      writeFileSync(argv.output, csv);
      
      console.log(chalk.green(`✅ Parsed ${results.length} businesses`));
      console.log(chalk.gray(`Saved to: ${argv.output}\n`));
      
      console.log(chalk.bold('Parsed businesses:'));
      results.slice(0, 5).forEach((r, i) => {
        console.log(`  ${i + 1}. ${r.name}`);
        console.log(chalk.gray(`     ${r.url}\n`));
      });
      
      console.log(chalk.cyan('\nNext step: Audit these websites'));
      console.log(chalk.gray(`  node simple-pipeline.js --input ${argv.output}\n`));
    } else {
      console.log(chalk.yellow('Could not parse any businesses from the response.'));
      console.log(chalk.gray('Make sure Claude\'s response follows the format:'));
      console.log(chalk.gray('  1. **Business Name** | https://website.com | Description\n'));
    }
    return;
  }
  
  // Generate mode: create prompts for Claude
  let categories = [];
  
  if (argv.category) {
    categories = [argv.category];
  } else if (argv.preset) {
    categories = PRESET_CATEGORIES;
  } else {
    console.log(chalk.yellow('Usage:\n'));
    console.log('  Generate a prompt:');
    console.log('    node claude-lead-finder.js --category "beauty salons" --location "Melbourne"');
    console.log('    node claude-lead-finder.js --preset\n');
    console.log('  Parse Claude\'s response:');
    console.log('    node claude-lead-finder.js --parse response.txt\n');
    
    console.log(chalk.bold('Workflow:\n'));
    console.log('  1. Run this script to generate a prompt');
    console.log('  2. Copy the prompt into Claude (claude.ai) with web search enabled');
    console.log('  3. Save Claude\'s response to a text file');
    console.log('  4. Run: node claude-lead-finder.js --parse response.txt');
    console.log('  5. Audit the results: node simple-pipeline.js --input claude-leads.csv\n');
    return;
  }
  
  // Generate prompts
  console.log(chalk.bold('📋 Prompts for Claude (copy and paste into claude.ai with web search):\n'));
  console.log(chalk.gray('─'.repeat(70)));
  
  for (const category of categories) {
    const prompt = generatePrompt(category, argv.location, argv.count);
    
    console.log(chalk.cyan(`\n## ${category.toUpperCase()}\n`));
    console.log(prompt);
    console.log(chalk.gray('\n' + '─'.repeat(70)));
  }
  
  // Save prompts to file for easy access
  const allPrompts = categories.map(cat => 
    `## ${cat.toUpperCase()}\n\n${generatePrompt(cat, argv.location, argv.count)}`
  ).join('\n\n---\n\n');
  
  writeFileSync('claude-prompts.txt', allPrompts);
  console.log(chalk.gray(`\nPrompts also saved to: claude-prompts.txt`));
  
  console.log(chalk.bold('\n📝 Next steps:\n'));
  console.log('  1. Copy a prompt above into Claude (claude.ai)');
  console.log('  2. Make sure Claude has web search enabled');
  console.log('  3. Save the response to a file (e.g., response.txt)');
  console.log('  4. Parse it: node claude-lead-finder.js --parse response.txt');
  console.log('  5. Audit: node simple-pipeline.js --input claude-leads.csv\n');
}

main().catch(console.error);
