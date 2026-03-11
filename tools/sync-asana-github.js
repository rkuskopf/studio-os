#!/usr/bin/env node

/**
 * Asana ↔ GitHub Two-Way Sync
 *
 * Syncs tasks between Asana projects and GitHub Issues (rkuskopf/studio-os).
 * Also mirrors relevant issues to kspf.studio-repo when they mention the website.
 *
 * Usage:
 *   node sync-asana-github.js                        # Dry run (preview, no changes)
 *   node sync-asana-github.js --sync                 # Run full two-way sync
 *   node sync-asana-github.js --direction asana-to-gh   # One direction only
 *   node sync-asana-github.js --direction gh-to-asana   # One direction only
 *   node sync-asana-github.js --direction cross-repo    # Cross-repo mirror only
 *   node sync-asana-github.js --project "Studio OS"     # Specific Asana project (name or GID)
 *
 * Required env vars:
 *   ASANA_PAT       — Asana Personal Access Token
 *                     Get one at: https://app.asana.com/0/my-profile-apps
 *
 * Optional env vars:
 *   ASANA_WORKSPACE — Asana workspace GID (auto-detected from first workspace if not set)
 *   GITHUB_REPO     — Default GitHub repo (default: rkuskopf/studio-os)
 *   SYNC_LABEL      — GitHub label applied to Asana-synced issues (default: asana-sync)
 */

import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Config ───────────────────────────────────────────────────────────────────

const CONFIG = {
  asanaPat: process.env.ASANA_PAT || '',
  asanaWorkspace: process.env.ASANA_WORKSPACE || '',
  defaultRepo: process.env.GITHUB_REPO || 'rkuskopf/studio-os',
  crossSyncRepo: 'rkuskopf/kspf.studio-repo',
  crossSyncKeywords: ['kspf.au', 'kspf.studio', 'website'],
  syncLabel: process.env.SYNC_LABEL || 'asana-sync',
  asanaApiBase: 'https://app.asana.com/api/1.0',
  rateLimitMs: 50,   // ms between Asana API calls (Asana rate limit: 1500 req/min)
  maxRetries: 3,
};

// Marker embedded in GitHub issue bodies to track the originating Asana task
const ASANA_ID_MARKER = '<!-- asana-task-id:';
// Tag in Asana task notes to indicate the task was created from a GitHub issue
const GITHUB_ORIGIN_TAG = '[synced-from-github]';

// ─── CLI args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const isDryRun = !args.includes('--sync');
const directionArg = args.includes('--direction')
  ? args[args.indexOf('--direction') + 1]
  : 'both';
const projectFilter = args.includes('--project')
  ? args[args.indexOf('--project') + 1]
  : null;

// ─── Utilities ────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Write content to a temp file, run fn(path), then delete the file. */
function withTmpFile(content, fn) {
  const path = join(tmpdir(), `studio-os-sync-${Date.now()}.md`);
  writeFileSync(path, content, 'utf-8');
  try {
    return fn(path);
  } finally {
    try { unlinkSync(path); } catch { /* ignore */ }
  }
}

// ─── Asana API ────────────────────────────────────────────────────────────────

async function asanaFetch(path, method = 'GET', body = null, attempt = 0) {
  if (!CONFIG.asanaPat) throw new Error('ASANA_PAT is not set');

  await sleep(CONFIG.rateLimitMs);

  const res = await fetch(`${CONFIG.asanaApiBase}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${CONFIG.asanaPat}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Retry on rate-limit
  if (res.status === 429 && attempt < CONFIG.maxRetries) {
    const wait = parseInt(res.headers.get('Retry-After') || '5', 10) * 1000;
    console.log(`  ⏳ Asana rate limit — waiting ${wait / 1000}s…`);
    await sleep(wait);
    return asanaFetch(path, method, body, attempt + 1);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Asana ${res.status} on ${method} ${path}: ${text.slice(0, 300)}`);
  }

  const json = await res.json();
  return json.data;
}

async function asanaGetWorkspace() {
  if (CONFIG.asanaWorkspace) return CONFIG.asanaWorkspace;
  const workspaces = await asanaFetch('/workspaces');
  if (!workspaces?.length) throw new Error('No Asana workspaces found');
  CONFIG.asanaWorkspace = workspaces[0].gid;
  return CONFIG.asanaWorkspace;
}

async function asanaGetProjects() {
  const wsGid = await asanaGetWorkspace();
  return asanaFetch(`/workspaces/${wsGid}/projects?opt_fields=gid,name,archived`);
}

async function asanaGetTasks(projectGid) {
  return asanaFetch(
    `/projects/${projectGid}/tasks?opt_fields=gid,name,notes,completed,due_on&limit=100`
  );
}

async function asanaCreateTask(projectGid, title, notes) {
  const wsGid = await asanaGetWorkspace();
  return asanaFetch('/tasks', 'POST', {
    data: { name: title, notes, projects: [projectGid], workspace: wsGid },
  });
}

async function asanaUpdateTask(taskGid, fields) {
  return asanaFetch(`/tasks/${taskGid}`, 'PUT', { data: fields });
}

// ─── GitHub (via gh CLI) ──────────────────────────────────────────────────────

function ghExec(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (err) {
    const msg = err.stderr?.toString().trim() || err.message;
    throw new Error(`gh: ${msg.slice(0, 300)}`);
  }
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

/** Ensure a label exists in the repo, creating it if necessary. */
function ensureLabel(repo, label) {
  try {
    const list = JSON.parse(
      ghExec(`gh label list --repo ${repo} --json name --limit 200`)
    );
    if (!list.some(l => l.name === label)) {
      ghExec(`gh label create "${label}" --repo ${repo} --color "0075ca" --description "Synced from Asana"`);
    }
  } catch {
    // Non-fatal: label creation may fail on repos we don't own
  }
}

function ghGetIssues(repo) {
  try {
    const out = ghExec(
      `gh issue list --repo ${repo} --state all --limit 500 --json number,title,body,state,url`
    );
    return JSON.parse(out);
  } catch {
    return [];
  }
}

function ghCreateIssue(repo, title, body, labels = []) {
  const safeTitle = title.slice(0, 256).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return withTmpFile(body, tmpPath => {
    const labelFlag = labels.length ? `--label "${labels.join(',')}"` : '';
    const out = ghExec(
      `gh issue create --repo ${repo} --title "${safeTitle}" --body-file "${tmpPath}" ${labelFlag}`
    );
    return out.trim();
  });
}

function ghUpdateIssue(repo, number, fields = {}) {
  const parts = [`gh issue edit ${number} --repo ${repo}`];
  if (fields.title) {
    const safeTitle = fields.title.slice(0, 256).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    parts.push(`--title "${safeTitle}"`);
  }
  if (fields.body) {
    return withTmpFile(fields.body, tmpPath => {
      parts.push(`--body-file "${tmpPath}"`);
      ghExec(parts.join(' '));
    });
  }
  ghExec(parts.join(' '));
}

function ghCloseIssue(repo, number) {
  ghExec(`gh issue close ${number} --repo ${repo}`);
}

function ghReopenIssue(repo, number) {
  ghExec(`gh issue reopen ${number} --repo ${repo}`);
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

/** Extract Asana task GID from a GitHub issue body marker. */
function extractAsanaGid(body) {
  const match = (body || '').match(/<!-- asana-task-id: ([0-9]+) -->/);
  return match ? match[1] : null;
}

/** Extract GitHub issue number from an Asana task's notes. */
function extractGithubNumber(notes) {
  const match = (notes || '').match(/GitHub Issue: #(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

/** Build the GitHub issue body for an Asana task. */
function buildGhBody(task, projectName) {
  const desc = (task.notes || '').trim();
  return [
    desc,
    '',
    '---',
    `_Synced from Asana · Project: **${projectName}** · Task: ${task.gid}_`,
    `<!-- asana-task-id: ${task.gid} -->`,
  ].join('\n');
}

/** Build the Asana task notes footer for a GitHub issue. */
function buildAsanaNotes(issue, repo) {
  const body = (issue.body || '').trim();
  return [
    body,
    '',
    '---',
    `GitHub Issue: #${issue.number}`,
    `Repo: ${repo}`,
    GITHUB_ORIGIN_TAG,
  ].join('\n');
}

/** True if this GitHub issue was originally created from Asana (loop guard). */
function isAsanaDerived(issue) {
  return (issue.body || '').includes(ASANA_ID_MARKER);
}

/** True if this Asana task was originally created from GitHub (loop guard). */
function isGithubDerived(task) {
  return (task.notes || '').includes(GITHUB_ORIGIN_TAG);
}

/** True if the issue title/body touches the website repo. */
function needsCrossSync(title, body) {
  const hay = `${title} ${body || ''}`.toLowerCase();
  return CONFIG.crossSyncKeywords.some(kw => hay.includes(kw.toLowerCase()));
}

// ─── Sync: Asana → GitHub ─────────────────────────────────────────────────────

async function syncAsanaToGh(projects, repo) {
  console.log('\n📥  Asana → GitHub\n');

  const issues = ghGetIssues(repo);
  // Build map: asana GID → existing issue
  const gidToIssue = new Map(
    issues.flatMap(i => {
      const gid = extractAsanaGid(i.body);
      return gid ? [[gid, i]] : [];
    })
  );

  let created = 0, updated = 0, skipped = 0;

  for (const project of projects) {
    console.log(`  📂  ${project.name}`);
    const tasks = await asanaGetTasks(project.gid);
    if (!tasks?.length) { console.log(`       (no tasks)\n`); continue; }

    for (const task of tasks) {
      const title = task.name?.trim();
      if (!title) continue;

      // Skip tasks that were created from GitHub (loop guard)
      if (isGithubDerived(task)) continue;

      const existing = gidToIssue.get(task.gid);
      const body = buildGhBody(task, project.name);

      if (!existing) {
        if (isDryRun) {
          console.log(`       🆕  Would create issue: ${title.slice(0, 70)}`);
        } else {
          try {
            ensureLabel(repo, CONFIG.syncLabel);
            const url = ghCreateIssue(repo, title, body, [CONFIG.syncLabel]);
            console.log(`       ✅  Created: ${title.slice(0, 60)} → ${url}`);
            created++;
            // Cross-repo mirror
            if (needsCrossSync(title, task.notes)) {
              const mirrorUrl = ghCreateIssue(CONFIG.crossSyncRepo, title, body, [CONFIG.syncLabel]);
              console.log(`            ↔️   Mirrored to ${CONFIG.crossSyncRepo}: ${mirrorUrl}`);
            }
          } catch (err) {
            console.error(`       ❌  Failed to create "${title.slice(0, 50)}": ${err.message}`);
          }
        }
      } else {
        const titleChanged = existing.title !== title;
        const shouldClose = task.completed && existing.state === 'OPEN';
        const shouldReopen = !task.completed && existing.state === 'CLOSED';

        if (!titleChanged && !shouldClose && !shouldReopen) { skipped++; continue; }

        if (isDryRun) {
          if (titleChanged) console.log(`       📝  Would update title → "${title.slice(0, 60)}"`);
          if (shouldClose) console.log(`       🔒  Would close #${existing.number}`);
          if (shouldReopen) console.log(`       🔓  Would reopen #${existing.number}`);
        } else {
          try {
            if (titleChanged) ghUpdateIssue(repo, existing.number, { title });
            if (shouldClose) ghCloseIssue(repo, existing.number);
            if (shouldReopen) ghReopenIssue(repo, existing.number);
            console.log(`       📝  Updated #${existing.number}: ${title.slice(0, 50)}`);
            updated++;
          } catch (err) {
            console.error(`       ❌  Failed to update #${existing.number}: ${err.message}`);
          }
        }
      }
    }
    console.log();
  }

  return { created, updated, skipped };
}

// ─── Sync: GitHub → Asana ─────────────────────────────────────────────────────

async function syncGhToAsana(projects, repo) {
  console.log('\n📤  GitHub → Asana\n');

  const wsGid = await asanaGetWorkspace();
  const issues = ghGetIssues(repo);

  // Only sync issues that weren't themselves created from Asana
  const nativeIssues = issues.filter(i => !isAsanaDerived(i));
  const skippedCount = issues.length - nativeIssues.length;
  console.log(
    `  ${nativeIssues.length} GitHub-native issues (skipping ${skippedCount} already linked to Asana)\n`
  );

  // Use the first active project as the target for new tasks
  const targetProject = projects.find(p => !p.archived) ?? projects[0];
  if (!targetProject) {
    console.log('  ⚠️   No active Asana project — nothing to sync into\n');
    return { created: 0, updated: 0, skipped: 0 };
  }
  console.log(`  Target project: ${targetProject.name}\n`);

  // Build map: github issue number → existing asana task
  const existingTasks = await asanaGetTasks(targetProject.gid);
  const numToTask = new Map(
    (existingTasks || []).flatMap(t => {
      const num = extractGithubNumber(t.notes);
      return num ? [[num, t]] : [];
    })
  );

  let created = 0, updated = 0, skipped = 0;

  for (const issue of nativeIssues) {
    const title = issue.title?.trim();
    if (!title) continue;

    const existing = numToTask.get(issue.number);
    const notes = buildAsanaNotes(issue, repo);

    if (!existing) {
      if (isDryRun) {
        console.log(`  🆕  Would create Asana task: ${title.slice(0, 70)} (from #${issue.number})`);
      } else {
        try {
          const task = await asanaCreateTask(targetProject.gid, title, notes);
          console.log(`  ✅  Created task: ${title.slice(0, 60)} (gid: ${task.gid})`);
          created++;
        } catch (err) {
          console.error(`  ❌  Failed to create task for #${issue.number}: ${err.message}`);
        }
      }
    } else {
      // Skip tasks that were themselves created from GitHub (avoid double-sync)
      if (isGithubDerived(existing)) { skipped++; continue; }

      const titleChanged = existing.name !== title;
      const shouldComplete = issue.state === 'CLOSED' && !existing.completed;
      const shouldReopen = issue.state === 'OPEN' && existing.completed;

      if (!titleChanged && !shouldComplete && !shouldReopen) { skipped++; continue; }

      if (isDryRun) {
        if (titleChanged) console.log(`  📝  Would update: "${existing.name}" → "${title.slice(0, 60)}"`);
        if (shouldComplete) console.log(`  🔒  Would complete Asana task: "${title.slice(0, 60)}"`);
        if (shouldReopen) console.log(`  🔓  Would re-open Asana task: "${title.slice(0, 60)}"`);
      } else {
        try {
          const fields = {};
          if (titleChanged) fields.name = title;
          if (shouldComplete) fields.completed = true;
          if (shouldReopen) fields.completed = false;
          await asanaUpdateTask(existing.gid, fields);
          console.log(`  📝  Updated task: ${title.slice(0, 60)}`);
          updated++;
        } catch (err) {
          console.error(`  ❌  Failed to update task "${existing.name}": ${err.message}`);
        }
      }
    }
  }

  return { created, updated, skipped };
}

// ─── Cross-repo mirror ────────────────────────────────────────────────────────

async function syncCrossRepo() {
  console.log('\n↔️   Cross-repo mirror (studio-os → kspf.studio-repo)\n');

  const sourceIssues = ghGetIssues(CONFIG.defaultRepo);
  const targetIssues = ghGetIssues(CONFIG.crossSyncRepo);
  const targetTitles = new Set(targetIssues.map(i => i.title.toLowerCase().trim()));

  let mirrored = 0;
  const candidates = sourceIssues.filter(
    i => i.state === 'OPEN' && needsCrossSync(i.title, i.body)
  );
  console.log(`  ${candidates.length} open issue(s) match cross-sync keywords\n`);

  for (const issue of candidates) {
    if (targetTitles.has(issue.title.toLowerCase().trim())) continue;

    const mirrorBody = [
      (issue.body || '').trim(),
      '',
      '---',
      `_Mirrored from [${CONFIG.defaultRepo}#${issue.number}](https://github.com/${CONFIG.defaultRepo}/issues/${issue.number})_`,
    ].join('\n');

    if (isDryRun) {
      console.log(`  🆕  Would mirror: "${issue.title.slice(0, 70)}" → ${CONFIG.crossSyncRepo}`);
    } else {
      try {
        ensureLabel(CONFIG.crossSyncRepo, CONFIG.syncLabel);
        const url = ghCreateIssue(CONFIG.crossSyncRepo, issue.title, mirrorBody, [CONFIG.syncLabel]);
        console.log(`  ✅  Mirrored: "${issue.title.slice(0, 60)}" → ${url}`);
        mirrored++;
      } catch (err) {
        console.error(`  ❌  Failed to mirror #${issue.number}: ${err.message}`);
      }
    }
  }

  return { mirrored };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔄  Asana ↔ GitHub Sync\n');
  console.log(`Mode:      ${isDryRun ? '🔍 DRY RUN (no changes will be made)' : '⚡ LIVE SYNC'}`);
  console.log(`Direction: ${directionArg}`);
  console.log(`Repo:      ${CONFIG.defaultRepo}`);
  if (projectFilter) console.log(`Project:   ${projectFilter}`);
  console.log();

  // ── Pre-flight checks ──────────────────────────────────────────────────────

  if (!checkGhAuth()) process.exit(1);

  const needsAsana = ['both', 'asana-to-gh', 'gh-to-asana'].includes(directionArg);

  if (needsAsana && !CONFIG.asanaPat) {
    console.error('❌  ASANA_PAT is required for Asana sync directions.');
    console.error('   Get your token at: https://app.asana.com/0/my-profile-apps');
    console.error('   Then run:  export ASANA_PAT=your_token\n');
    if (directionArg !== 'cross-repo') process.exit(1);
  }

  // ── Load Asana projects ────────────────────────────────────────────────────

  let projects = [];
  if (needsAsana && CONFIG.asanaPat) {
    try {
      console.log('🔌  Connecting to Asana…');
      const all = await asanaGetProjects();
      projects = projectFilter
        ? all.filter(
            p => p.gid === projectFilter ||
                 p.name.toLowerCase().includes(projectFilter.toLowerCase())
          )
        : all.filter(p => !p.archived);
      console.log(`   Found ${projects.length} active project(s): ${projects.map(p => p.name).join(', ')}\n`);
    } catch (err) {
      console.error(`❌  Asana connection failed: ${err.message}`);
      if (directionArg !== 'cross-repo') process.exit(1);
    }
  }

  // ── Run sync ───────────────────────────────────────────────────────────────

  const results = {};

  if (['both', 'asana-to-gh'].includes(directionArg) && projects.length) {
    results.asanaToGh = await syncAsanaToGh(projects, CONFIG.defaultRepo);
  }

  if (['both', 'gh-to-asana'].includes(directionArg) && projects.length) {
    results.ghToAsana = await syncGhToAsana(projects, CONFIG.defaultRepo);
  }

  if (['both', 'cross-repo'].includes(directionArg)) {
    results.crossRepo = await syncCrossRepo();
  }

  // ── Summary ────────────────────────────────────────────────────────────────

  console.log('\n─────────────────────────────────────────────────\n');

  if (isDryRun) {
    console.log('✅  Dry run complete — no changes were made.');
    console.log('   Run with --sync to apply changes.\n');
  } else {
    console.log('✅  Sync complete.\n');
    if (results.asanaToGh) {
      const r = results.asanaToGh;
      console.log(`   Asana → GitHub:  ${r.created} created, ${r.updated} updated, ${r.skipped} unchanged`);
    }
    if (results.ghToAsana) {
      const r = results.ghToAsana;
      console.log(`   GitHub → Asana:  ${r.created} created, ${r.updated} updated, ${r.skipped} unchanged`);
    }
    if (results.crossRepo) {
      console.log(`   Cross-repo:      ${results.crossRepo.mirrored} mirrored`);
    }
    console.log();
  }
}

main().catch(err => {
  console.error(`\n💥  Unexpected error: ${err.message}`);
  process.exit(1);
});
