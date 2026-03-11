---
description: Sync unchecked tasks from TASKS.md to GitHub Issues
---

# Task → GitHub Issue Sync

Parse TASKS.md and create GitHub issues for any unchecked tasks that don't already exist.

## Steps

1. Read `TASKS.md` from the workspace root
2. Parse all unchecked tasks (`- [ ]`)
3. Check which ones already exist as GitHub issues (by title match)
4. For new tasks, create GitHub issues with:
   - Title from the task
   - Description from any text after the em-dash
   - Labels based on section (Up Next → `priority`, In Progress → `in-progress`, Backlog → `backlog`)
   - Route to correct repo:
     - Tasks mentioning "kspf.au" or "kspf" → `rkuskopf/kspf.studio-repo`
     - All others → `rkuskopf/studio-os`

## Usage

```bash
# Preview what would be created (dry run)
node tools/sync-tasks-to-github.js

# Actually create the issues
node tools/sync-tasks-to-github.js --create

# Override the target repo
node tools/sync-tasks-to-github.js --create --repo owner/repo
```

## Requirements

- GitHub CLI (`gh`) installed and authenticated
- Run `gh auth login` if not authenticated
