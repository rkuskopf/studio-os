#!/usr/bin/env node

/**
 * Push Latitude/Pioneer dispute letters to Gmail drafts
 */

import { createGmailDrafts } from './gmail-draft.js';
import chalk from 'chalk';

const drafts = [
  {
    to: 'compliance@pioneercredit.com.au',
    subject: 'Formal Dispute — Account 26020929',
    body: `Dear Pioneer Credit Compliance Team,

Re: Formal Notice of Dispute — Account Number 26020929

I am writing in response to your recent SMS communications regarding an alleged debt assigned from Latitude Financial Services. I formally dispute the validity of this debt and the amount claimed.

BACKGROUND

On 8 October 2025, I submitted a formal hardship notice to Latitude Financial Services under Section 72 of the National Credit Code (NCC). On the same date, Latitude acknowledged receipt and requested additional information.

Under Section 72(5) of the NCC, Latitude was required to notify me of their decision within 28 days of that request (i.e., by 5 November 2025). I never received any further communication from Latitude — no decision, no refusal notice, and no notification that my hardship application had been assessed.

Despite this unresolved hardship application, the debt was subsequently assigned to Pioneer Credit. I was not provided with a formal Notice of Assignment from Latitude as required under state property law (e.g., Property Law Act 1958 (Vic), s 134).

REGULATORY POSITION

Under Section 188 of the National Credit Code, as assignee of the debt, Pioneer Credit is subject to the same obligations as the original credit provider. This includes the obligation to address my unresolved hardship request.

The ACCC/ASIC Debt Collection Guideline (RG 96) requires debt collectors to pause collection activity when a debt is genuinely disputed. I am formally invoking this protection.

REQUESTED DOCUMENTATION

Pursuant to Section 185 and Section 36 of the National Credit Code, please provide the following within 14 days:

1. A copy of the original credit contract with Latitude Financial Services
2. A copy of the Notice of Assignment from Latitude to Pioneer, including the date of assignment
3. A full statement of account showing:
   - The balance at the date of assignment
   - The current balance
   - A breakdown of principal, interest, fees, and charges
4. Copies of any default notices issued under Section 88 of the NCC
5. Documentation of Latitude's response to my hardship application (if any exists)

NOTICE OF INTENDED ESCALATION

Please be advised that I intend to lodge formal complaints with:

1. Latitude Financial Services (Internal Dispute Resolution) regarding their failure to respond to my hardship notice within statutory timeframes
2. Australian Financial Complaints Authority (AFCA) if this matter is not resolved within 30 days

Under AFCA Rule A.7, once a complaint is registered, all enforcement and collection activity must cease until the complaint is resolved.

I request that Pioneer Credit:
- Pause all collection activity pending investigation of this dispute
- Cease SMS contact and communicate in writing only
- Provide the documentation requested above

I look forward to your written response within 14 days.

Yours sincerely,

Rowan Kuskopf`
  },
  {
    to: '', // Latitude uses web form, leave blank - this is for reference
    subject: '[REFERENCE ONLY] IDR Complaint to Latitude Financial',
    body: `NOTE: This draft is for REFERENCE ONLY. Latitude Financial requires complaints to be lodged via their online form at latitude.com.au or by phone at 1300 369 340.

---

Dear Latitude Financial Services Complaints Team,

Re: Formal Complaint — Failure to Respond to Hardship Application

I am writing to lodge a formal complaint regarding Latitude's failure to comply with its statutory obligations under the National Credit Code in relation to my hardship application.

FACTS

1. On 8 October 2025, I submitted a hardship application to Latitude Financial Services.

2. On 8 October 2025, I received two emails from Latitude:
   - A confirmation that my hardship request had been received
   - A request for additional information to assess my application

3. Under Section 72(5) of the National Credit Code, Latitude was required to notify me of its decision within 28 days of requesting additional information. This deadline was 5 November 2025.

4. I never received any further communication from Latitude. No decision was provided, no refusal notice was sent, and no alternative arrangements were offered.

5. Without resolving my hardship application, Latitude subsequently sold the debt to Pioneer Credit. I first became aware of this when Pioneer contacted me via SMS on 18 February 2026.

6. I was never provided with a formal Notice of Assignment from Latitude.

STATUTORY BREACHES

Latitude has breached the following provisions:

- Section 72(5) NCC: Decision must be provided within 28 days of requesting information — No decision ever provided
- Section 72(4) NCC: Refusal must be in writing with reasons and AFCA details — No refusal notice received
- Section 47(1)(a) NCCPA: Licensee must act "efficiently, honestly and fairly" — Hardship process abandoned; debt sold without resolution
- ACCC/ASIC Debt Collection Guideline: Should not sell debt while hardship is unresolved — Debt sold to Pioneer while application pending

IMPACT

As a result of Latitude's failures:
- My hardship request was never properly assessed
- The debt was sold to a third party without my knowledge
- Interest and fees have continued to accrue (balance has grown from ~$2,937 to ~$2,954)
- I am now being pursued by Pioneer Credit for a debt that should have been subject to hardship assessment

RESOLUTION SOUGHT

I request that Latitude:

1. Acknowledge the breach of Section 72 obligations
2. Provide documentation of how my hardship application was handled (or confirm it was not assessed)
3. Remediate any financial loss caused by the failure, including interest and fees accrued after 5 November 2025
4. Coordinate with Pioneer Credit to pause collection activity pending resolution
5. Consider whether the debt should be recalled from Pioneer and assessed under hardship provisions

ESCALATION

If this complaint is not resolved to my satisfaction within 21 days (per ASIC's hardship-related IDR timeframe), I will escalate the matter to the Australian Financial Complaints Authority (AFCA).

I request a written response and a complaint reference number.

Yours sincerely,

Rowan Kuskopf`
  }
];

async function main() {
  console.log(chalk.bold.blue('\n📧 Pushing dispute letters to Gmail drafts...\n'));

  // Only push the Pioneer letter (the one with a valid email)
  const pioneerDraft = drafts.filter(d => d.to);
  
  const result = await createGmailDrafts(pioneerDraft);

  if (!result.configured) {
    console.log(chalk.red('Gmail not configured. Run: node tools/website-auditor/gmail-draft.js --setup'));
    process.exit(1);
  }

  console.log(chalk.green(`✅ Created ${result.created} draft(s)`));
  
  if (result.failed > 0) {
    console.log(chalk.red(`❌ Failed: ${result.failed}`));
  }

  console.log(chalk.yellow('\n⚠️  Note: The Latitude complaint should be submitted via their web form at:'));
  console.log(chalk.cyan('   https://www.latitudefinancial.com.au/contact-us/\n'));
  console.log(chalk.gray('   The full text is saved in: personal/latitude-pioneer-dispute.md\n'));
}

main().catch(err => {
  console.error(chalk.red(err.message));
  process.exit(1);
});
