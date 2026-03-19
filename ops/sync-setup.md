# Asana ↔ GitHub ↔ TASKS.md Sync — Setup & Rollout

Three-way sync between Asana, GitHub (`rkuskopf/studio-os`), and `TASKS.md`, with optional cross-repo mirroring to `rkuskopf/kspf.studio-repo` for website-related tasks.

---

## Quick Reference (TL;DR)

Most common workflow — push new tasks from TASKS.md all the way to Asana:

```bash
# 1. Push TASKS.md → GitHub Issues
node tools/sync/sync-tasks-to-github.js --create

# 2. Push GitHub Issues → Asana (via GitHub Action — no local token needed)
gh workflow run "asana-sync.yml" --field direction=gh-to-asana

# 3. Check sync status
gh run list --workflow="asana-sync.yml" --limit 3
```

Pull completed tasks back to TASKS.md (runs automatically on schedule):

```bash
node tools/sync/sync-github-to-tasks.js --sync
```

| Task | Command |
|------|---------|
| Preview TASKS.md sync | `node tools/sync/sync-tasks-to-github.js` |
| Push TASKS.md → GitHub | `node tools/sync/sync-tasks-to-github.js --create` |
| Push GitHub → Asana | `gh workflow run "asana-sync.yml" --field direction=gh-to-asana` |
| Push Asana → GitHub | `gh workflow run "asana-sync.yml" --field direction=asana-to-gh` |
| Full two-way sync | `gh workflow run "asana-sync.yml" --field direction=both` |
| Pull GitHub closures → TASKS.md | `node tools/sync/sync-github-to-tasks.js --sync` |
| Dry run (preview) | `gh workflow run "asana-sync.yml" --field dry_run=true` |

**Note:** The Asana PAT is stored as a GitHub secret (`ASANA_PAT`), so you don't need it locally when using the GitHub Action.

---

## How it works

| Direction | What happens |
|-----------|-------------|
| **TASKS.md → GitHub** | Each unchecked task in TASKS.md becomes a GitHub issue (skips duplicates). |
| **GitHub → TASKS.md** | Closed GitHub issues check off `[ ]` → `[x]` in TASKS.md. PRs linked to issues add a `🔀 PR #N` child bullet under the matching task. |
| **Asana → GitHub** | Each open Asana task becomes a GitHub issue. Completed tasks close their linked issue. |
| **GitHub → Asana** | Each GitHub issue (not originally created from Asana) is pushed to Asana as a task. Closed issues mark their task complete. |
| **PR → Asana + TASKS.md** | When a PR references an issue (Closes/Fixes/Resolves #N), the linked Asana task gets PR info in its notes, and TASKS.md gets a `🔀 PR #N` bullet under the task. |
| **Cross-repo mirror** | Issues in `studio-os` that mention `kspf.au`, `kspf.studio`, or `website` are mirrored to `kspf.studio-repo`. |

### Completion flow (end-to-end)

```
Mark complete in Asana
  ↓  (daily sync)
GitHub issue closes
  ↓  (daily sync / asana-sync workflow)
TASKS.md task checked off [x]
  ↓  (auto-committed back to repo)
```

### PR notification flow

```
Open PR that says "Fixes #5"
  ↓  (pr-update.yml workflow triggers immediately)
TASKS.md: 🔀 PR bullet added under the task
Asana: PR link added to the task's notes
  ↓  (on merge)
GitHub issue #5 closes
  ↓  (next daily sync)
TASKS.md: task checked off [x]
```

### Loop prevention

- Issues created **from Asana** carry a hidden HTML comment (`<!-- asana-task-id: ... -->`) so the GitHub → Asana direction ignores them.
- Asana tasks created **from GitHub** carry a `[synced-from-github]` tag in their notes so the Asana → GitHub direction ignores them.

### ID tracking

- GitHub issue body stores the Asana task GID in a marker comment.
- Asana task notes store the GitHub issue number as `GitHub Issue: #N`.
- TASKS.md tasks are matched to GitHub issues by **normalised title** (strips markdown, lowercased).

---

## Prerequisites

| Tool | Why needed |
|------|-----------|
| [GitHub CLI (`gh`)](https://cli.github.com/) | Creating and updating GitHub issues |
| Node.js 18+ | Running the sync script (uses built-in `fetch`) |
| Asana PAT | Authenticating with the Asana API |

---

## Configuration

### 1. Get an Asana Personal Access Token

1. Go to **[My Profile Apps](https://app.asana.com/0/my-profile-apps)** in Asana.
2. Click **+ New access token**, give it a name (e.g., `studio-os-sync`), copy the token.

### 2. Authenticate the GitHub CLI

```bash
gh auth login
```

Select GitHub.com → HTTPS → Yes (authenticate with browser).

### 3. Set environment variables

```bash
# One-time in your shell session:
export ASANA_PAT=your_token_here

# Or persist in ~/.zshrc / ~/.bashrc:
echo 'export ASANA_PAT=your_token_here' >> ~/.zshrc
```

Copy `tools/.env.example` to `tools/.env` as a reference (`.env` is gitignored).

---

## Running the sync

All commands are run from the repo root.

### TASKS.md → GitHub Issues (one-way push)

```bash
node tools/sync/sync-tasks-to-github.js          # dry run
node tools/sync/sync-tasks-to-github.js --create # live
```

### GitHub Issues → TASKS.md (close completed tasks + add PR links)

```bash
node tools/sync/sync-github-to-tasks.js          # dry run
node tools/sync/sync-github-to-tasks.js --sync   # live

# Only update for a specific PR:
node tools/sync/sync-github-to-tasks.js --pr 7 --sync
```

### Asana ↔ GitHub (two-way sync)

```bash
node tools/sync/sync-asana-github.js             # dry run (both directions)
node tools/sync/sync-asana-github.js --sync      # live (both directions)

# One direction only:
node tools/sync/sync-asana-github.js --direction asana-to-gh --sync
node tools/sync/sync-asana-github.js --direction gh-to-asana --sync
node tools/sync/sync-asana-github.js --direction cross-repo --sync

# Notify Asana of a PR:
node tools/sync/sync-asana-github.js --direction pr-update --pr 7 --sync
```

### Specific Asana project

Filter to a single Asana project by name or GID:

```bash
node tools/sync/sync-asana-github.js --project "Studio OS" --sync
```

---

## Mapping rules

| TASKS.md / GitHub field | Asana field |
|-------------------------|-------------|
| Task title (normalised) | Task name |
| Issue body | Task notes |
| Issue state (closed) | Task completed |
| PR reference in body | Notes footer entry |

### Status mapping

| Asana | GitHub | TASKS.md |
|-------|--------|----------|
| Incomplete | Open | `- [ ]` |
| Completed | Closed | `- [x]` |

### Labels

All Asana-synced issues receive the `asana-sync` label (created automatically if it doesn't exist). Customise with the `SYNC_LABEL` env var.

---

## GitHub Actions (automated schedule)

Two workflows automate the sync:

### `asana-sync.yml` — Daily Asana ↔ GitHub ↔ TASKS.md sync

Runs daily at 6 AM AEDT and on manual trigger.

1. Syncs Asana ↔ GitHub (both directions by default).
2. Runs `sync-github-to-tasks.js --sync` to check off completed tasks in TASKS.md.
3. Commits any TASKS.md changes back to the repo.

To enable:
1. Add `ASANA_PAT` as a [repository secret](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions).
2. Push the repo — the workflow runs on schedule.

To run manually: **Actions tab → Asana ↔ GitHub Sync → Run workflow**.

### `pr-update.yml` — Real-time PR → Asana + TASKS.md

Triggers automatically when a PR is opened, updated, or closed.

- Adds a `🔀 PR #N` bullet under the matching task in TASKS.md.
- Updates the linked Asana task's notes with PR title, state, and URL.
- Commits the TASKS.md change back to the repo.

No manual setup needed — activates as soon as the workflow file is in the repo (and `ASANA_PAT` is set for the Asana step).

---

## Conflict handling

| Scenario | Behaviour |
|----------|-----------|
| Same title exists in both | Skipped (no duplicate created) |
| Task renamed in Asana | Issue title updated on next sync |
| Issue renamed in GitHub | Asana task name updated on next sync |
| Task completed in Asana | Issue closed → TASKS.md checked off on next sync |
| Issue closed in GitHub | Asana task marked complete + TASKS.md checked off on next sync |
| PR opened referencing issue | TASKS.md gets PR bullet, Asana task gets PR note (immediately) |
| Both changed simultaneously | Last sync wins (most recent run applies) |

---

## Rollout steps

1. **Test authentication**: run `gh auth status` and verify your `ASANA_PAT` works by running a dry run.
2. **Dry run first**: run `node tools/sync/sync-asana-github.js` to preview all changes.
3. **Review output**: check for unexpected creates or closes.
4. **Enable live sync**: run `node tools/sync/sync-asana-github.js --sync` once satisfied.
5. **Set up Actions**: add `ASANA_PAT` secret and let the scheduled workflow take over.

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `ASANA_PAT is not set` | Export the env var: `export ASANA_PAT=...` |
| `gh: not authenticated` | Run `gh auth login` |
| `Asana 401` | PAT is invalid or expired — generate a new one |
| `Asana 403` | PAT doesn't have access to the workspace/project |
| `gh: label not found` | Label creation is attempted automatically; check repo permissions |
| Rate limit warnings | Normal — the script pauses and retries automatically |
| TASKS.md task not found | Title must match exactly (after stripping `**`, backticks, links) |

