#!/usr/bin/env node
/**
 * Convert Excel lead files to CSV for pipeline processing
 */
import XLSX from 'xlsx';
import { writeFileSync } from 'fs';
import { stringify } from 'csv-stringify/sync';

// Read Built With leads (domains in first column)
console.log('\n📂 Processing Built with leads.xlsx...');
const builtWith = XLSX.readFile('/Users/rowankuskopf/Downloads/Built with leads.xlsx');
const bwSheet = builtWith.Sheets[builtWith.SheetNames[0]];
const bwData = XLSX.utils.sheet_to_json(bwSheet);

const bwLeads = bwData.map(row => {
  const domain = Object.values(row)[0]; // First column has domain
  return {
    name: domain,
    url: domain.startsWith('http') ? domain : `https://${domain}`,
    category: 'builtwith',
    source: 'builtwith_export'
  };
}).filter(l => l.url && !l.url.includes('undefined'));

console.log(`   Extracted ${bwLeads.length} domains`);

// Read Potential leads (need to look up URLs for brand names)
console.log('\n📂 Processing Potential leads.xlsx...');
const potential = XLSX.readFile('/Users/rowankuskopf/Downloads/Potential leads.xlsx');
const pSheet = potential.Sheets[potential.SheetNames[0]];
const pData = XLSX.utils.sheet_to_json(pSheet);

console.log('   Brands found:');
const potentialLeads = pData.map(row => {
  const brand = row['Brand'] || row['brand'] || Object.values(row)[0];
  console.log(`   - ${brand}`);
  
  // Common brand → domain mappings
  const domainMap = {
    'Dinosaur Designs': 'dinosaurdesigns.com.au',
    'En Gold': 'engold.com.au',
    'Boteh': 'boteh.com.au',
    'Marle': 'marle.com.au',
    'Esse Studios': 'essestudios.com',
    'Arnsdorf': 'arnsdorf.com.au'
  };
  
  const domain = domainMap[brand];
  return {
    name: brand,
    url: domain ? `https://${domain}` : '',
    category: 'potential_lead',
    decisionMaker: row['Decision Maker'] || '',
    notes: row['Why Them?'] || '',
    source: 'potential_leads_xlsx'
  };
});

console.log(`   Found ${potentialLeads.length} brands`);

// Add Style Magazines (from lead-generation.md)
const styleMag = {
  name: 'Style Magazines',
  url: 'https://stylemagazines.com.au',
  category: 'media',
  source: 'manual'
};

// Combine all
const allLeads = [...bwLeads, ...potentialLeads.filter(l => l.url), styleMag];

// Save to CSV
const csvFile = 'excel-leads.csv';
writeFileSync(csvFile, stringify(allLeads, { header: true }));
console.log(`\n✅ Saved ${allLeads.length} leads to ${csvFile}`);

// Also show what needs manual URL lookup
const needsUrl = potentialLeads.filter(l => !l.url);
if (needsUrl.length > 0) {
  console.log('\n⚠️  These brands need manual URL lookup:');
  needsUrl.forEach(l => console.log(`   - ${l.name}`));
}

console.log('\n📋 Next step: node full-pipeline.js --input excel-leads.csv --no-gmail');
console.log('   (or remove --no-gmail to create Gmail drafts)\n');
