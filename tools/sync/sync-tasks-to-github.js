#!/usr/bin/env node

/**
 * Sync TASKS.md to GitHub Issues
 * 
 * Parses TASKS.md and creates GitHub issues for unchecked tasks.
 * Skips tasks that already exist (by title match).
 * 
 * Usage:
 *   node sync-tasks-to-github.js                    # Dry run (preview)
 *   node sync-tasks-to-github.js --create           # Create issues
 *   node sync-tasks-to-github.js --repo owner/repo  # Specify repo
 * 
 * Default repos:
 *   - Tasks mentioning "kspf.au" → rkuskopf/kspf.studio-repo
 *   - All other tasks → rkuskopf/studio-os (or your default)
 */

import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TASKS_FILE = join(__dirname, '..', '..', 'TASKS.md');

// Config: map keywords to repos
const REPO_ROUTING = {
  'kspf.au': 'rkuskopf/kspf.studio-repo',
  'kspf': 'rkuskopf/kspf.studio-repo',
  default: 'rkuskopf/studio-os' // Change this to your main repo
};

// Parse args
const args = process.argv.slice(2);
const shouldCreate = args.includes('--create');
const repoOverride = args.includes('--repo') ? args[args.indexOf('--repo') + 1] : null;

// Check gh CLI
function checkGh() {
  try {
    execSync('gh auth status', { stdio: 'pipe' });
    return true;
  } catch {
    console.error('❌ GitHub CLI not authenticated. Run: gh auth login');
    return false;
  }
}

// Get existing issues from a repo
function getExistingIssues(repo) {
  try {
    const result = execSync(`gh issue list --repo ${repo} --state all --limit 200 --json title`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    const issues = JSON.parse(result);
    return new Set(issues.map(i => i.title.toLowerCase().trim()));
  } catch {
    return new Set();
  }
}

// Create a GitHub issue
function createIssue(repo, title, body, labels = []) {
  // Escape special characters for shell
  const safeTitle = title.replace(/[`$"\\]/g, '\\$&').slice(0, 100);
  const safeBody = body.replace(/[`$"\\]/g, '\\$&');
  
  // Build command without labels (they may not exist)
  const cmd = `gh issue create --repo ${repo} --title "${safeTitle}" --body "${safeBody}"`;
  
  try {
    const result = execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    return result.trim();
  } catch (err) {
    console.error(`  ❌ Failed to create: ${err.message.split('\n')[0]}`);
    return null;
  }
}

// Parse TASKS.md
function parseTasks(content) {
  const tasks = [];
  let currentSection = '';
  
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Track sections
    if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '').trim();
      continue;
    }
    
    // Match unchecked tasks: - [ ] **Task title** — description
    const taskMatch = line.match(/^-\s*\[\s*\]\s*\*?\*?(.+?)\*?\*?\s*(?:—|--|-|$)/);
    if (taskMatch) {
      let title = taskMatch[1].trim();
      // Clean up title
      title = title.replace(/\*\*/g, '').trim();
      
      // Get description (everything after the dash/em-dash)
      const descMatch = line.match(/(?:—|--)\s*(.+)$/);
      const description = descMatch ? descMatch[1].trim() : '';
      
      // Determine target repo
      let repo = repoOverride || REPO_ROUTING.default;
      for (const [keyword, targetRepo] of Object.entries(REPO_ROUTING)) {
        if (keyword !== 'default' && (title.toLowerCase().includes(keyword) || description.toLowerCase().includes(keyword))) {
          repo = targetRepo;
          break;
        }
      }
      
      // Determine labels based on section
      const labels = [];
      if (currentSection === 'Up Next') labels.push('priority');
      if (currentSection === 'In Progress') labels.push('in-progress');
      if (currentSection === 'Backlog') labels.push('backlog');
      
      tasks.push({
        title,
        description,
        section: currentSection,
        repo,
        labels,
        raw: line
      });
    }
  }
  
  return tasks;
}

// Main
async function main() {
  console.log('\n📋 TASKS.md → GitHub Issues Sync\n');
  
  if (!checkGh()) return;
  
  // Read TASKS.md
  const content = readFileSync(TASKS_FILE, 'utf-8');
  const tasks = parseTasks(content);
  
  console.log(`Found ${tasks.length} unchecked tasks\n`);
  
  // Group by repo
  const byRepo = {};
  for (const task of tasks) {
    if (!byRepo[task.repo]) byRepo[task.repo] = [];
    byRepo[task.repo].push(task);
  }
  
  // Process each repo
  for (const [repo, repoTasks] of Object.entries(byRepo)) {
    console.log(`\n📁 ${repo} (${repoTasks.length} tasks)\n`);
    
    const existingIssues = getExistingIssues(repo);
    console.log(`   ${existingIssues.size} existing issues found\n`);
    
    for (const task of repoTasks) {
      const titleLower = task.title.toLowerCase().trim();
      const alreadyExists = existingIssues.has(titleLower);
      
      if (alreadyExists) {
        console.log(`   ⏭️  Skip (exists): ${task.title.slice(0, 50)}...`);
        continue;
      }
      
      if (shouldCreate) {
        const body = `${task.description}\n\n---\n_Synced from TASKS.md (${task.section})_`;
        const url = createIssue(repo, task.title, body, task.labels);
        if (url) {
          console.log(`   ✅ Created: ${task.title.slice(0, 40)}...`);
          console.log(`      ${url}`);
        }
      } else {
        console.log(`   🆕 Would create: ${task.title.slice(0, 50)}...`);
        console.log(`      Section: ${task.section} | Labels: ${task.labels.join(', ') || 'none'}`);
      }
    }
  }
  
  if (!shouldCreate) {
    console.log('\n💡 Run with --create to actually create issues\n');
  }
  
  console.log('\nDone.\n');
}

main().catch(console.error);
