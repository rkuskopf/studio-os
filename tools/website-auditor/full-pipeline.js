#!/usr/bin/env node

/**
 * KSPF Full Lead Pipeline
 * 
 * Automated workflow:
 * 1. Scrape leads from Google Maps (or use existing CSV)
 * 2. Extract contact info from each website
 * 3. Audit each website with Lighthouse
 * 4. Generate personalised outreach emails for top leads
 * 5. Sync email drafts to Gmail (requires Gmail API credentials — see gmail-draft.js)
 * 
 * Usage:
 *   node full-pipeline.js --query "fashion brand melbourne" --limit 10
 *   node full-pipeline.js --input existing-leads.csv
 *   node full-pipeline.js --input leads.csv --top 20    (only draft emails for top 20)
 *   node full-pipeline.js --query "..." --no-gmail      (skip Gmail sync)
 */

import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { stringify } from 'csv-stringify/sync';
import { parse } from 'csv-parse/sync';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import { createGmailDrafts, printSetupInstructions } from './gmail-draft.js';

puppeteerExtra.use(StealthPlugin());

// Parse args
const args = process.argv.slice(2);
const getArg = (name) => {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : null;
};

const query = getArg('query');
const inputFile = getArg('input');
const limit = parseInt(getArg('limit') || '10');
const topN = parseInt(getArg('top') || '20'); // Only draft emails for top N leads
const skipScrape = !!inputFile;
const skipGmail = args.includes('--no-gmail');
const outputDir = '.';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms + Math.random() * 500));
}

// ============================================
// STEP 1: Scrape leads from Google Maps
// ============================================
async function scrapeLeads(query, limit) {
  console.log(chalk.bold.blue('\n📍 STEP 1: Scraping Google Maps\n'));
  console.log(chalk.gray(`Query: "${query}" | Limit: ${limit}\n`));

  const browser = await puppeteerExtra.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled', '--window-size=1280,800']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  const results = [];

  try {
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(3000);

    try {
      await page.waitForSelector('div[role="feed"]', { timeout: 15000 });
    } catch {
      console.log(chalk.red('Could not find results. Google may have changed layout.'));
      await browser.close();
      return [];
    }

    // Scroll to load more
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => {
        const feed = document.querySelector('div[role="feed"]');
        if (feed) feed.scrollTop = feed.scrollHeight;
      });
      await sleep(2000);
    }

    const businessLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('a[href*="/maps/place/"]');
      return [...new Set([...links].map(a => a.href))];
    });

    console.log(chalk.green(`Found ${businessLinks.length} listings\n`));

    for (let i = 0; i < Math.min(businessLinks.length, limit); i++) {
      const spinner = ora(`[${i + 1}/${Math.min(businessLinks.length, limit)}] Extracting...`).start();

      try {
        await page.goto(businessLinks[i], { waitUntil: 'networkidle2', timeout: 30000 });
        await sleep(1500);

        const info = await page.evaluate(() => {
          const name = document.querySelector('h1')?.textContent?.trim() || '';
          let website = '';
          let phone = '';
          let instagram = '';
          let facebook = '';
          
          const websiteBtn = document.querySelector('a[data-item-id="authority"]');
          if (websiteBtn) website = websiteBtn.href;
          
          if (!website) {
            const links = document.querySelectorAll('a[href^="http"]');
            for (const a of links) {
              if (!a.href.includes('google.com') && !a.href.includes('facebook.com') && !a.href.includes('instagram.com')) {
                website = a.href;
                break;
              }
            }
          }

          if (website.includes('/url?q=')) {
            const match = website.match(/url\?q=([^&]+)/);
            if (match) website = decodeURIComponent(match[1]);
          }

          // Phone number
          const phoneBtn = document.querySelector('button[data-item-id^="phone"]');
          if (phoneBtn) phone = phoneBtn.textContent?.trim() || '';

          // Social links
          const allLinks = document.querySelectorAll('a[href]');
          for (const a of allLinks) {
            const href = a.href || '';
            if (href.includes('instagram.com') && !instagram) {
              instagram = href;
            }
            if (href.includes('facebook.com') && !facebook) {
              facebook = href;
            }
          }

          const category = document.querySelector('button[jsaction*="category"]')?.textContent?.trim() || '';
          const address = document.querySelector('button[data-item-id="address"]')?.textContent?.trim() || '';

          return { name, website, category, address, phone, instagram, facebook };
        });

        if (info.name && info.website) {
          spinner.succeed(`${info.name} → ${info.website}`);
          results.push({
            name: info.name,
            url: info.website,
            category: info.category,
            address: info.address,
            phone: info.phone,
            instagram: info.instagram,
            facebook: info.facebook,
            source: 'google_maps',
            query: query
          });
        } else {
          spinner.fail(`${info.name || 'Unknown'} — no website`);
        }
      } catch (err) {
        spinner.fail(`Error: ${err.message}`);
      }
    }
  } catch (error) {
    console.log(chalk.red(`Error: ${error.message}`));
  }

  await browser.close();

  // Dedupe by domain
  const seen = new Set();
  return results.filter(r => {
    try {
      const domain = new URL(r.url).hostname;
      if (seen.has(domain)) return false;
      seen.add(domain);
      return true;
    } catch { return false; }
  });
}

// ============================================
// STEP 2: Extract contact info from websites
// ============================================
async function extractContactInfo(leads) {
  console.log(chalk.bold.blue('\n📧 STEP 2: Extracting Contact Info from Websites\n'));

  const browser = await puppeteerExtra.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    const spinner = ora(`[${i + 1}/${leads.length}] Checking ${lead.name}`).start();

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
      
      // Visit homepage
      await page.goto(lead.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      
      let contactInfo = await extractEmailsFromPage(page);
      
      // If no email found, try /contact page
      if (!contactInfo.email) {
        const contactUrls = ['/contact', '/contact-us', '/about', '/about-us'];
        for (const path of contactUrls) {
          try {
            const contactUrl = new URL(path, lead.url).href;
            await page.goto(contactUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
            contactInfo = await extractEmailsFromPage(page);
            if (contactInfo.email) break;
          } catch {}
        }
      }

      lead.email = contactInfo.email || '';
      lead.contactFormUrl = contactInfo.contactForm || '';
      
      // Also grab Instagram if we didn't get it from Maps
      if (!lead.instagram && contactInfo.instagram) {
        lead.instagram = contactInfo.instagram;
      }

      // Store scraped content for email personalisation
      lead.siteTitle = contactInfo.siteTitle || '';
      lead.siteDescription = contactInfo.siteDescription || '';
      lead.heroHeading = contactInfo.heroHeading || '';

      await page.close();

      if (lead.email) {
        spinner.succeed(`${lead.name} → ${lead.email}`);
      } else if (lead.instagram) {
        spinner.warn(`${lead.name} → No email, has Instagram: ${lead.instagram}`);
      } else if (lead.contactFormUrl) {
        spinner.warn(`${lead.name} → Contact form only: ${lead.contactFormUrl}`);
      } else {
        spinner.fail(`${lead.name} → No contact info found`);
      }

    } catch (err) {
      spinner.fail(`${lead.name} → Error: ${err.message}`);
    }

    await sleep(500);
  }

  await browser.close();
  return leads;
}

async function extractEmailsFromPage(page) {
  return await page.evaluate(() => {
    const result = { email: '', contactForm: '', instagram: '', siteTitle: '', siteDescription: '', heroHeading: '' };
    const html = document.body.innerHTML;
    
    // Find emails with regex
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = html.match(emailRegex) || [];
    
    // Filter out common non-contact emails
    const validEmails = emails.filter(e => 
      !e.includes('example.com') &&
      !e.includes('wordpress') &&
      !e.includes('wixpress') &&
      !e.includes('squarespace') &&
      !e.includes('sentry.io') &&
      !e.includes('.png') &&
      !e.includes('.jpg')
    );
    
    if (validEmails.length > 0) {
      // Prefer emails with common contact patterns
      const preferred = validEmails.find(e => 
        e.includes('hello@') || 
        e.includes('info@') || 
        e.includes('contact@') ||
        e.includes('studio@') ||
        e.includes('enquir')
      );
      result.email = preferred || validEmails[0];
    }

    // Look for mailto links
    const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');
    if (mailtoLinks.length > 0) {
      const mailto = mailtoLinks[0].href.replace('mailto:', '').split('?')[0];
      if (mailto && !result.email) result.email = mailto;
    }

    // Look for contact form
    const forms = document.querySelectorAll('form');
    for (const form of forms) {
      const action = form.action || '';
      const html = form.innerHTML.toLowerCase();
      if (html.includes('email') || html.includes('message') || html.includes('contact')) {
        result.contactForm = window.location.href;
        break;
      }
    }

    // Instagram link
    const igLinks = document.querySelectorAll('a[href*="instagram.com"]');
    if (igLinks.length > 0) {
      result.instagram = igLinks[0].href;
    }

    // --- Scrape site content for email personalisation ---

    // Page title (strip site name suffix if present, e.g. "Hero Copy | Business Name")
    result.siteTitle = (document.title || '').split(/[\|–—\-]/)[0].trim().substring(0, 120);

    // Meta description
    result.siteDescription = (document.querySelector('meta[name="description"]')?.content || '').trim().substring(0, 200);

    // Primary heading (h1) — often the brand tagline on a homepage
    const h1 = document.querySelector('h1');
    if (h1) {
      result.heroHeading = h1.textContent?.trim().substring(0, 120) || '';
    }

    // If still no description, grab the first meaningful paragraph from main content
    if (!result.siteDescription) {
      const MIN_PARA_LENGTH = 40;
      const MAX_PARA_LENGTH = 300;
      const candidates = document.querySelectorAll('main p, [class*="hero"] p, [class*="banner"] p, [class*="intro"] p, section p, p');
      for (const p of candidates) {
        const text = (p.textContent || '').trim();
        if (text.length > MIN_PARA_LENGTH && text.length < MAX_PARA_LENGTH && !text.includes('@') && !text.includes('cookie')) {
          result.siteDescription = text.substring(0, 200);
          break;
        }
      }
    }

    return result;
  });
}

// ============================================
// STEP 3: Audit websites with Lighthouse
// ============================================
async function auditWebsites(leads) {
  console.log(chalk.bold.blue('\n🔍 STEP 3: Auditing Websites\n'));

  const chrome = await launch({ chromeFlags: ['--headless', '--no-sandbox'] });
  const results = [];

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    const spinner = ora(`[${i + 1}/${leads.length}] Auditing ${lead.name}`).start();

    try {
      const { lhr } = await lighthouse(lead.url, {
        port: chrome.port,
        output: 'json',
        onlyCategories: ['accessibility', 'performance', 'best-practices', 'seo']
      });

      const scores = {
        accessibility: Math.round((lhr.categories.accessibility?.score || 0) * 100),
        performance: Math.round((lhr.categories.performance?.score || 0) * 100),
        bestPractices: Math.round((lhr.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((lhr.categories.seo?.score || 0) * 100)
      };

      // Lead score: lower is worse website = better lead
      const avgScore = (scores.accessibility + scores.performance + scores.bestPractices + scores.seo) / 4;
      const leadScore = 100 - avgScore;

      // Extract specific issues for outreach
      const issues = [];
      if (scores.accessibility < 80) issues.push(`accessibility issues (${scores.accessibility}/100)`);
      if (scores.performance < 50) issues.push(`slow loading (${scores.performance}/100 performance)`);
      if (scores.seo < 80) issues.push(`SEO problems (${scores.seo}/100)`);
      if (scores.bestPractices < 80) issues.push(`technical issues (${scores.bestPractices}/100 best practices)`);

      results.push({
        ...lead,
        ...scores,
        leadScore: Math.round(leadScore),
        issues: issues.join('; ') || 'Minor issues only',
        auditDate: new Date().toISOString().split('T')[0]
      });

      spinner.succeed(`${lead.name} — Lead score: ${Math.round(leadScore)} (A:${scores.accessibility} P:${scores.performance} S:${scores.seo})`);
    } catch (err) {
      spinner.fail(`${lead.name} — audit failed: ${err.message}`);
      results.push({ ...lead, leadScore: 0, issues: 'Audit failed', auditDate: new Date().toISOString().split('T')[0] });
    }
  }

  await chrome.kill();

  // Sort by lead score (highest = worst website = best opportunity)
  return results.sort((a, b) => b.leadScore - a.leadScore);
}

// ============================================
// EMAIL BODY BUILDER — shared by Step 4 and CSV
// ============================================

/**
 * Build a personalised outreach email body for a lead.
 * Uses scraped site content (siteDescription, heroHeading) so each email
 * references something specific about the business rather than being generic.
 */
function buildEmailBody(lead) {
  const issues = lead.issues || 'some areas for improvement';
  const firstIssue = issues.split(';')[0].trim();

  // Fix "builtwith" (Shopify scrape artefact) or empty category
  const rawCategory = (lead.category || '').toLowerCase().trim();
  const category = (rawCategory && rawCategory !== 'builtwith')
    ? lead.category
    : 'small Melbourne businesses';

  // Lowercase first character and strip trailing period — used for inline sentence fragments
  const sentenceFragment = (str) => str.charAt(0).toLowerCase() + str.slice(1).replace(/\.$/, '');

  // Build a specific sentence about what the business does, using scraped content
  let specificLine = '';
  const desc = (lead.siteDescription || '').trim();
  const heading = (lead.heroHeading || '').trim();
  const title = (lead.siteTitle || '').trim();

  if (desc && desc.length > 20) {
    // Use meta description — usually the best one-liner about the business
    specificLine = `\n\nI had a look at your site — ${sentenceFragment(desc)}.`;
  } else if (heading && heading.length > 5 && heading.toLowerCase() !== (lead.name || '').toLowerCase()) {
    // Use h1 if it's not just the business name
    specificLine = `\n\nI noticed your headline — "${heading}" — and it caught my attention.`;
  } else if (title && title.length > 5 && title.toLowerCase() !== (lead.name || '').toLowerCase()) {
    specificLine = `\n\nI had a look at your site — ${sentenceFragment(title)}.`;
  }

  return `Hi there,

I came across ${lead.name} while looking at ${category} in Melbourne and really like what you're doing.${specificLine}

I noticed your website might have ${firstIssue} — not a criticism, just something I spotted as a web designer.

I run a small design studio (kspf.au) and work with independent Melbourne businesses on exactly this kind of thing. Would you be open to a quick chat about it? No pressure, happy to share some thoughts either way.

Cheers,
Rowan
KSPF Design Studio
kspf.au`;
}

// ============================================
// STEP 4: Generate outreach emails
// ============================================
function generateOutreachEmails(leads) {
  console.log(chalk.bold.blue('\n✉️  STEP 4: Generating Outreach Emails\n'));

  const emails = [];

  // Only draft emails for leads with contact info
  const contactableLeads = leads.filter(l => l.email || l.instagram || l.contactFormUrl);
  
  for (const lead of contactableLeads.slice(0, topN)) { // Top N contactable leads
    // Determine contact method
    let contactMethod = 'unknown';
    let contactValue = '';
    if (lead.email) {
      contactMethod = 'email';
      contactValue = lead.email;
    } else if (lead.instagram) {
      contactMethod = 'instagram_dm';
      contactValue = lead.instagram;
    } else if (lead.contactFormUrl) {
      contactMethod = 'contact_form';
      contactValue = lead.contactFormUrl;
    }
    
    const email = {
      to: lead.email || '',
      toName: lead.name,
      contactMethod: contactMethod,
      contactValue: contactValue,
      instagram: lead.instagram || '',
      subject: `Quick thought on ${lead.name}'s website`,
      body: buildEmailBody(lead),
      lead: {
        name: lead.name,
        url: lead.url,
        leadScore: lead.leadScore,
        issues: lead.issues,
        phone: lead.phone
      }
    };

    emails.push(email);
    
    console.log(chalk.bold(`\n📧 ${lead.name}`));
    console.log(chalk.gray(`   Lead score: ${lead.leadScore} | Issues: ${lead.issues}`));
    console.log(chalk.cyan(`   Contact: ${contactMethod} → ${contactValue}`));
  }

  // Report on non-contactable leads
  const noContact = leads.filter(l => !l.email && !l.instagram && !l.contactFormUrl);
  if (noContact.length > 0) {
    console.log(chalk.yellow(`\n⚠️  ${noContact.length} leads have no contact info — may need manual lookup`));
  }

  return emails;
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log(chalk.bold.magenta('\n🚀 KSPF Full Lead Pipeline\n'));
  console.log(chalk.gray('━'.repeat(50)));

  let leads = [];

  // Step 1: Get leads
  if (skipScrape && inputFile) {
    console.log(chalk.bold.blue(`\n📂 Loading leads from ${inputFile}\n`));
    const csv = readFileSync(inputFile, 'utf-8');
    leads = parse(csv, { columns: true });
    console.log(chalk.green(`Loaded ${leads.length} leads\n`));
  } else if (query) {
    leads = await scrapeLeads(query, limit);
  } else {
    console.log(chalk.yellow('Usage:'));
    console.log('  node full-pipeline.js --query "fashion brand melbourne" --limit 10');
    console.log('  node full-pipeline.js --input existing-leads.csv\n');
    return;
  }

  if (leads.length === 0) {
    console.log(chalk.red('\nNo leads found. Try a different query.\n'));
    return;
  }

  // Save raw leads
  const leadsFile = `${outputDir}/pipeline-leads.csv`;
  writeFileSync(leadsFile, stringify(leads, { header: true }));
  console.log(chalk.gray(`\nSaved ${leads.length} leads to ${leadsFile}`));

  // Step 2: Extract contact info from websites
  const leadsWithContacts = await extractContactInfo(leads);

  // Step 3: Audit websites
  const auditedLeads = await auditWebsites(leadsWithContacts);

  // Filter out dead/unreachable sites: all Lighthouse scores 0 means the URL didn't load
  const liveLeads = auditedLeads.filter(l => {
    const allZero = l.accessibility === 0 && l.performance === 0 && l.seo === 0 && l.bestPractices === 0;
    return !allZero;
  });
  if (liveLeads.length < auditedLeads.length) {
    console.log(chalk.yellow(`\n⚠️  Skipped ${auditedLeads.length - liveLeads.length} unreachable site(s) with all-zero scores`));
  }

  // Save audited leads with email drafts included
  const auditedFile = `${outputDir}/pipeline-audited.csv`;
  
  // Add email draft to each lead for easy copy/paste
  const leadsWithEmails = liveLeads.map(lead => {
    return {
      ...lead,
      emailSubject: `Quick thought on ${lead.name}'s website`,
      emailDraft: buildEmailBody(lead).replace(/\n/g, '\\n') // Escape newlines for CSV
    };
  });
  
  writeFileSync(auditedFile, stringify(leadsWithEmails, { header: true }));
  console.log(chalk.gray(`\nSaved audited leads to ${auditedFile}`));

  // Step 4: Generate emails
  const emails = generateOutreachEmails(liveLeads);

  // Save emails
  const emailsFile = `${outputDir}/pipeline-emails.json`;
  writeFileSync(emailsFile, JSON.stringify(emails, null, 2));
  console.log(chalk.gray(`Saved ${emails.length} draft emails to ${emailsFile}`));

  // Step 5: Sync drafts to Gmail
  console.log(chalk.bold.blue('\n📬 STEP 5: Syncing to Gmail Drafts\n'));
  if (skipGmail) {
    console.log(chalk.gray('  Skipped (--no-gmail flag set)'));
  } else {
    const emailDrafts = emails.filter(e => e.to);
    if (emailDrafts.length === 0) {
      console.log(chalk.yellow('  No email addresses found — drafts skipped'));
    } else {
      const result = await createGmailDrafts(emailDrafts);
      if (!result.configured) {
        printSetupInstructions();
      } else {
        if (result.created > 0) {
          console.log(chalk.green(`  ✅ ${result.created} draft(s) created in Gmail`));
        }
        if (result.failed > 0) {
          console.log(chalk.red(`  ✗ ${result.failed} draft(s) failed`));
        }
        if (result.skipped > 0) {
          console.log(chalk.gray(`  ${result.skipped} lead(s) had no email address — skipped`));
        }
      }
    }
  }

  // Summary
  console.log(chalk.bold.magenta('\n━'.repeat(50)));
  console.log(chalk.bold.magenta('📊 PIPELINE COMPLETE\n'));
  console.log(`  Leads found:     ${leads.length}`);
  console.log(`  Leads audited:   ${auditedLeads.length}`);
  console.log(`  Live leads:      ${liveLeads.length}`);
  console.log(`  Emails drafted:  ${emails.length}`);
  console.log(`\n  ${chalk.cyan('Top 3 leads:')}`);
  liveLeads.slice(0, 3).forEach((l, i) => {
    console.log(`    ${i + 1}. ${l.name} (score: ${l.leadScore})`);
    console.log(chalk.gray(`       ${l.url}`));
    console.log(chalk.gray(`       ${l.issues}\n`));
  });

  console.log(chalk.bold('\n📁 Output files:'));
  console.log(`  ${leadsFile} — raw leads`);
  console.log(`  ${auditedFile} — audited & ranked`);
  console.log(`  ${emailsFile} — draft emails`);
  if (!skipGmail) {
    console.log(chalk.gray('  Gmail Drafts — check your inbox to review and send\n'));
  } else {
    console.log();
  }
}

main().catch(console.error);
