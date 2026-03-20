#!/usr/bin/env node

/**
 * Sync GitHub Issues → TASKS.md
 *
 * Updates TASKS.md based on GitHub issue state:
 *   - Closed issues    → check off [ ] as [x] in TASKS.md
 *   - PRs linked to an issue → add a "🔀 PR #N" child bullet under the matching task
 *
 * Usage:
 *   node sync-github-to-tasks.js                  # Dry run (preview only)
 *   node sync-github-to-tasks.js --sync           # Apply changes to TASKS.md
 *   node sync-github-to-tasks.js --pr <N>         # Only handle PR #N's linked issues
 *   node sync-github-to-tasks.js --repo owner/repo
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TASKS_FILE = join(__dirname, '..', '..', 'TASKS.md');

const args = process.argv.slice(2);
const isDryRun = !args.includes('--sync');
const prNumber = args.includes('--pr') ? parseInt(args[args.indexOf('--pr') + 1], 10) : null;
const repo = args.includes('--repo') ? args[args.indexOf('--repo') + 1] : 'rkuskopf/studio-os';

// ─── GitHub helpers ───────────────────────────────────────────────────────────

function ghExec(cmd) {
  return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
}

function checkGhAuth() {
  try {
    execSync('gh auth status', { stdio: 'pipe' });
    return true;
  } catch {
    console.error('❌  GitHub CLI not authenticated. Run: gh auth login');
    return false;
  }
}

/** Fetch all issues (open + closed) with closedByPullRequest info. */
function getIssues() {
  try {
    const out = ghExec(
      `gh issue list --repo ${repo} --state all --limit 500 --json number,title,state,closedByPullRequest,url`
    );
    return JSON.parse(out);
  } catch {
    return [];
  }
}

/** Fetch a single PR's details. */
function getPR(number) {
  const out = ghExec(
    `gh pr view ${number} --repo ${repo} --json number,title,url,state,body`
  );
  return JSON.parse(out);
}

/** Extract issue numbers referenced by a PR body (Closes/Fixes/Resolves #N). */
function extractLinkedIssueNumbers(body) {
  const pattern = /(?:close[sd]?|fix(?:es)?|resolve[sd]?)\s+#(\d+)/gi;
  const nums = new Set();
  let m;
  while ((m = pattern.exec(body || '')) !== null) {
    nums.add(parseInt(m[1], 10));
  }
  return [...nums];
}

// ─── TASKS.md helpers ─────────────────────────────────────────────────────────

/** Normalize a title for fuzzy matching: strip markdown, lowercase, trim. */
function normalizeTitle(t) {
  return t
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '') // strip links
    .trim()
    .toLowerCase();
}

/**
 * Parse all task lines from TASKS.md.
 * Returns an array of { lineIndex, indent, checked, normalizedTitle, line }.
 */
function parseTasks(lines) {
  const tasks = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^(\s*)-\s*\[( |x)\]\s*(.+)/i);
    if (!m) continue;
    const rawTitle = m[3];
    // Extract the human-readable title (before any — dash or end of **bold**)
    const titleText = rawTitle
      .replace(/\*\*/g, '')
      .replace(/`[^`]*`/g, '')
      .split(/\s*(?:—|--)\s*/)[0]
      .trim();
    tasks.push({
      lineIndex: i,
      indent: m[1],
      checked: m[2] === 'x',
      normalizedTitle: normalizeTitle(titleText),
      line,
    });
  }
  return tasks;
}

/**
 * Find the last line index belonging to this task's sub-bullet block.
 * Sub-bullets are lines immediately after the task that are indented more
 * (at least 2 extra spaces) or start with a deeper bullet.
 */
function findInsertAfter(lines, taskLineIndex, taskIndent) {
  let insertAfter = taskLineIndex;
  const subIndent = taskIndent + '  ';
  for (let j = taskLineIndex + 1; j < lines.length; j++) {
    const next = lines[j];
    if (next === '') break; // blank line ends the group
    if (next.startsWith(subIndent)) {
      insertAfter = j;
    } else {
      break;
    }
  }
  return insertAfter;
}

/** Check if a PR bullet for the given PR number already exists near this task. */
function prBulletExists(lines, taskLineIndex, taskIndent, prNum) {
  const subIndent = taskIndent + '  ';
  for (let j = taskLineIndex + 1; j < lines.length; j++) {
    const next = lines[j];
    if (next === '') break;
    if (!next.startsWith(subIndent)) break;
    if (next.includes(`PR #${prNum}`)) return true;
  }
  return false;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n📋  GitHub Issues → TASKS.md\n');
  console.log(`Mode:   ${isDryRun ? '🔍 DRY RUN (no changes will be made)' : '⚡ LIVE'}`);
  console.log(`Repo:   ${repo}`);
  if (prNumber) console.log(`PR:     #${prNumber}`);
  console.log();

  if (!checkGhAuth()) process.exit(1);

  const content = readFileSync(TASKS_FILE, 'utf-8');
  const lines = content.split('\n');
  const tasks = parseTasks(lines);

  // Build title → task map (first match wins)
  const titleToTask = new Map();
  for (const task of tasks) {
    if (!titleToTask.has(task.normalizedTitle)) {
      titleToTask.set(task.normalizedTitle, task);
    }
  }

  // ── Determine which issues (and PR info) to process ─────────────────────────

  let issuesToProcess = [];    // [{ issue, linkedPR? }]
  let prLabel = '';

  if (prNumber) {
    // Process only the linked issues of this specific PR
    let pr;
    try {
      pr = getPR(prNumber);
    } catch (err) {
      console.error(`❌  Could not fetch PR #${prNumber}: ${err.message}`);
      process.exit(1);
    }

    const linkedNums = extractLinkedIssueNumbers(pr.body);
    console.log(`  PR #${pr.number}: "${pr.title}" (${pr.state?.toLowerCase()})`);
    console.log(
      `  Linked issues: ${linkedNums.length ? linkedNums.map(n => `#${n}`).join(', ') : '(none found in PR body)'}\n`
    );

    if (!linkedNums.length) {
      console.log('  Nothing to do.\n');
      return;
    }

    // Fetch the linked issues to get their titles
    const allIssues = getIssues();
    const issueMap = new Map(allIssues.map(i => [i.number, i]));

    for (const num of linkedNums) {
      const issue = issueMap.get(num);
      if (issue) {
        issuesToProcess.push({ issue, linkedPR: pr });
      } else {
        console.log(`  ⚠️  Issue #${num} not found — skipping`);
      }
    }
    prLabel = ` (from PR #${prNumber})`;
  } else {
    // Full sync: check off tasks for closed issues
    const allIssues = getIssues();
    for (const issue of allIssues) {
      issuesToProcess.push({ issue, linkedPR: issue.closedByPullRequest ?? null });
    }
    console.log(`  Fetched ${allIssues.length} GitHub issues\n`);
  }

  // ── Collect changes (process bottom-up to keep line indices stable) ──────────

  // Collect: { type: 'replace', lineIndex, newLine }
  //        | { type: 'insert_after', lineIndex, newLine }
  const changes = [];
  let checkOffCount = 0;
  let prBulletCount = 0;

  for (const { issue, linkedPR } of issuesToProcess) {
    const normTitle = normalizeTitle(issue.title);
    const task = titleToTask.get(normTitle);
    if (!task) continue;

    // 1. Check off if the issue is closed and the task is still unchecked
    if (!task.checked && issue.state === 'CLOSED') {
      const newLine = task.line.replace(/\[ \]/, '[x]');
      if (isDryRun) {
        console.log(`  ✅  Would check off: "${issue.title.slice(0, 60)}" (#${issue.number})`);
      } else {
        console.log(`  ✅  Checked off: "${issue.title.slice(0, 60)}" (#${issue.number})`);
      }
      changes.push({ type: 'replace', lineIndex: task.lineIndex, newLine });
      checkOffCount++;
      // Mark task as checked so we don't double-process
      task.checked = true;
      task.line = newLine;
    }

    // 2. Add PR bullet if there's a linked PR and it isn't already there
    if (linkedPR) {
      if (prBulletExists(lines, task.lineIndex, task.indent, linkedPR.number)) continue;

      const state = (linkedPR.state || 'open').toLowerCase();
      const bullet = `${task.indent}  - 🔀 PR #${linkedPR.number}: [${linkedPR.title}](${linkedPR.url}) _(${state})_`;
      const insertAfter = findInsertAfter(lines, task.lineIndex, task.indent);

      if (isDryRun) {
        console.log(
          `  🔀  Would add PR bullet to "${issue.title.slice(0, 50)}" → PR #${linkedPR.number}`
        );
      } else {
        console.log(
          `  🔀  Added PR bullet to "${issue.title.slice(0, 50)}" → PR #${linkedPR.number}`
        );
      }
      changes.push({ type: 'insert_after', lineIndex: insertAfter, newLine: bullet });
      prBulletCount++;
    }
  }

  // ── Apply changes (bottom-up so earlier inserts don't shift later indices) ───

  if (!isDryRun && changes.length > 0) {
    // Sort: highest lineIndex first; for same index, inserts before replaces
    changes.sort((a, b) => {
      if (b.lineIndex !== a.lineIndex) return b.lineIndex - a.lineIndex;
      return a.type === 'insert_after' ? 1 : -1;
    });

    const modifiedLines = [...lines];
    for (const change of changes) {
      if (change.type === 'replace') {
        modifiedLines[change.lineIndex] = change.newLine;
      } else {
        // insert_after: insert newLine after the given lineIndex
        modifiedLines.splice(change.lineIndex + 1, 0, change.newLine);
      }
    }

    writeFileSync(TASKS_FILE, modifiedLines.join('\n'), 'utf-8');
    console.log(
      `\n  📝  TASKS.md updated${prLabel}: ${checkOffCount} check-off(s), ${prBulletCount} PR link(s) added\n`
    );
  } else if (isDryRun) {
    const summary = `${checkOffCount} check-off(s), ${prBulletCount} PR link(s)`;
    console.log(`\n  Dry run complete${prLabel}: ${summary} would be applied`);
    console.log('  Run with --sync to apply changes.\n');
  } else {
    console.log('\n  Nothing to update.\n');
  }
}

main().catch(err => {
  console.error(`\n💥  Unexpected error: ${err.message}`);
  process.exit(1);
});
