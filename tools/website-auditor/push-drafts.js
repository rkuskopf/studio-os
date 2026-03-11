#!/usr/bin/env node
import { createGmailDrafts } from './gmail-draft.js';
import { readFileSync } from 'fs';

const emails = JSON.parse(readFileSync('pipeline-emails.json', 'utf-8'));
const withEmail = emails.filter(e => e.to);

console.log(`\n📧 Pushing ${withEmail.length} emails to Gmail Drafts...\n`);

const result = await createGmailDrafts(withEmail);

if (result.configured) {
  console.log(`✅ Created: ${result.created}`);
  console.log(`❌ Failed: ${result.failed}`);
  console.log(`⏭️  Skipped (no email): ${result.skipped}\n`);
} else {
  console.log('Gmail not configured. Run: node gmail-draft.js --setup');
}
