# Asana ↔ GitHub Sync — Setup & Rollout

Two-way sync between Asana and GitHub (`rkuskopf/studio-os`), with optional cross-repo mirroring to `rkuskopf/kspf.studio-repo` for website-related tasks.

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

| Task | Command |
|------|---------|
| Preview TASKS.md sync | `node tools/sync/sync-tasks-to-github.js` |
| Push TASKS.md → GitHub | `node tools/sync/sync-tasks-to-github.js --create` |
| Push GitHub → Asana | `gh workflow run "asana-sync.yml" --field direction=gh-to-asana` |
| Push Asana → GitHub | `gh workflow run "asana-sync.yml" --field direction=asana-to-gh` |
| Full two-way sync | `gh workflow run "asana-sync.yml" --field direction=both` |
| Dry run (preview) | `gh workflow run "asana-sync.yml" --field dry_run=true` |

**Note:** The Asana PAT is stored as a GitHub secret (`ASANA_PAT`), so you don't need it locally when using the GitHub Action.

---

## How it works

| Direction | What happens |
|-----------|-------------|
| **Asana → GitHub** | Each open Asana task becomes a GitHub issue. Completed tasks close their linked issue. |
| **GitHub → Asana** | Each GitHub issue (not originally created from Asana) is pushed to Asana as a task. Closed issues mark their task complete. |
| **Cross-repo mirror** | Issues in `studio-os` that mention `kspf.au`, `kspf.studio`, or `website` are mirrored to `kspf.studio-repo`. |

### Loop prevention

- Issues created **from Asana** carry a hidden HTML comment (`<!-- asana-task-id: ... -->`) so the GitHub → Asana direction ignores them.
- Asana tasks created **from GitHub** carry a `[synced-from-github]` tag in their notes so the Asana → GitHub direction ignores them.

### ID tracking

- GitHub issue body stores the Asana task GID in a marker comment.
- Asana task notes store the GitHub issue number as `GitHub Issue: #N`.

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

All commands are run from the `tools/` directory.

```bash
cd tools/sync
```

### Dry run (no changes — safe to run any time)

```bash
node tools/sync/sync-asana-github.js
# or:
npm run sync
```

### Full two-way sync (live)

```bash
node tools/sync/sync-asana-github.js --sync
# or:
npm run sync:live
```

### One direction only

```bash
# Asana → GitHub only
node tools/sync/sync-asana-github.js --direction asana-to-gh --sync

# GitHub → Asana only
node tools/sync/sync-asana-github.js --direction gh-to-asana --sync

# Cross-repo mirror only (no Asana PAT needed)
node tools/sync/sync-asana-github.js --direction cross-repo --sync
```

### Specific Asana project

Filter to a single Asana project by name or GID:

```bash
node tools/sync/sync-asana-github.js --project "Studio OS" --sync
```

---

## Mapping rules

| Asana field | GitHub field |
|-------------|-------------|
| Task name | Issue title |
| Task notes | Issue body (first section) |
| Task completed | Issue state (open/closed) |
| Project name | Noted in issue body footer |

### Status mapping

| Asana | GitHub |
|-------|--------|
| Incomplete | Open |
| Completed | Closed |

### Label

All Asana-synced issues receive the `asana-sync` label (created automatically if it doesn't exist). Customise with the `SYNC_LABEL` env var.

---

## GitHub Actions (automated schedule)

A workflow at `.github/workflows/asana-sync.yml` runs the sync automatically. To enable it:

1. Add your Asana PAT as a [repository secret](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions):
   - **Name:** `ASANA_PAT`
   - **Value:** your Personal Access Token
2. Push the repo — the workflow runs daily at 6 AM AEST and on manual trigger.

To run manually: **Actions tab → Asana ↔ GitHub Sync → Run workflow**.

---

## Conflict handling

| Scenario | Behaviour |
|----------|-----------|
| Same title exists in both | Skipped (no duplicate created) |
| Task renamed in Asana | Issue title updated on next sync |
| Issue renamed in GitHub | Asana task name updated on next sync |
| Task completed in Asana | Issue closed on next sync |
| Issue closed in GitHub | Asana task marked complete on next sync |
| Both changed simultaneously | Last sync wins (most recent run applies) |

---

## Rollout steps

1. **Test authentication**: run `gh auth status` and verify your `ASANA_PAT` works by running a dry run.
2. **Dry run first**: run `npm run sync` to preview all changes.
3. **Review output**: check for unexpected creates or closes.
4. **Enable live sync**: run `npm run sync:live` once satisfied.
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
