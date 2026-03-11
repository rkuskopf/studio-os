#!/usr/bin/env node
/**
 * Convert Excel lead files to CSV for pipeline processing
 */
import XLSX from 'xlsx';
import { writeFileSync } from 'fs';

const files = [
  '/Users/rowankuskopf/Downloads/Built with leads.xlsx',
  '/Users/rowankuskopf/Downloads/Potential leads.xlsx'
];

let allLeads = [];

for (const file of files) {
  console.log(`\n📂 Reading: ${file}`);
  
  try {
    const workbook = XLSX.readFile(file);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`   Found ${data.length} rows`);
    console.log(`   Columns: ${Object.keys(data[0] || {}).join(', ')}`);
    
    // Show first few rows to understand structure
    console.log('\n   Sample data:');
    data.slice(0, 3).forEach((row, i) => {
      console.log(`   ${i + 1}.`, JSON.stringify(row).slice(0, 100) + '...');
    });
    
    allLeads.push({ file, data });
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
  }
}

console.log(`\n📊 Total: ${allLeads.reduce((sum, f) => sum + f.data.length, 0)} leads across ${allLeads.length} files\n`);
