#!/usr/bin/env node
/**
 * Merge and dedupe all lead sources into one clean CSV
 */
import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

const files = [
  'excel-leads.csv',
  'fashion-art-leads.csv'
];

const allLeads = [];
const seenDomains = new Set();

for (const file of files) {
  console.log(`📂 Reading ${file}...`);
  const content = readFileSync(file, 'utf-8');
  const rows = parse(content, { columns: true });
  
  for (const row of rows) {
    try {
      const url = row.url || row.URL || row.website || '';
      if (!url) continue;
      
      const domain = new URL(url).hostname.replace('www.', '');
      
      if (seenDomains.has(domain)) {
        console.log(`   ⏭️  Skipping dupe: ${domain}`);
        continue;
      }
      
      seenDomains.add(domain);
      allLeads.push({
        name: row.name || row.Name || row.Brand || domain,
        url: url,
        category: row.category || row.Category || '',
        source: file,
        decisionMaker: row.decisionMaker || '',
        notes: row.notes || ''
      });
    } catch (err) {
      console.log(`   ⚠️  Bad URL: ${row.url}`);
    }
  }
}

// Save merged leads
const outFile = 'all-leads-merged.csv';
writeFileSync(outFile, stringify(allLeads, { header: true }));

console.log(`\n✅ Merged ${allLeads.length} unique leads → ${outFile}`);
console.log(`   (removed ${117 - allLeads.length} duplicates)\n`);
