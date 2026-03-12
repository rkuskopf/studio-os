# OpenAI Codex ↔ GitHub Integration — Setup Guide

Codex is OpenAI's AI software-engineering agent. You give it access to a GitHub repo, describe a task, and it plans + implements changes in an isolated environment, then opens a pull request for your review.

This guide explains how to connect Codex to this repo (`rkuskopf/studio-os`) and use it effectively.

---

## What Codex can do for you

| Task type | Example |
|-----------|---------|
| Write new features | "Add a --dry-run flag to sync-asana-github.js" |
| Fix bugs | "The label routing is ignoring lowercase labels — fix it" |
| Refactor code | "Move the auth logic in sync-asana-github.js into its own module" |
| Write documentation | "Document all CLI flags for full-pipeline.js" |
| Create GitHub Actions | "Add a workflow that runs the lead pipeline weekly" |

Codex works well on this repo because it is code-heavy automation. It will struggle with tasks that require reading local files, using private APIs without keys, or making real-time decisions.

---

## Prerequisites

| Thing | Why |
|-------|-----|
| OpenAI account with Codex access | At `platform.openai.com` — request access if not enabled |
| GitHub account (`rkuskopf`) | Must be authenticated and have admin access to the repo |

---

## Step 1 — Enable Codex in OpenAI Platform

1. Go to [platform.openai.com/codex](https://platform.openai.com/codex) (or via the left sidebar of ChatGPT under "More → Codex").
2. If you see a waitlist prompt, join and wait for access — it rolls out gradually.
3. Once enabled you will see a **New task** button.

---

## Step 2 — Connect your GitHub repository

On first use (or via **Settings → Integrations**):

1. Click **Connect GitHub**.
2. Authorise the **OpenAI Codex** GitHub App when prompted.
3. Under **Repository access**, choose **Only select repositories** and add `rkuskopf/studio-os` (and optionally `rkuskopf/kspf.studio-repo`).
4. Click **Save**.

Codex now has read/write access to the repo to open branches and pull requests.

---

## Step 3 — Run your first task

1. Click **New task**.
2. Select **rkuskopf/studio-os** as the repository.
3. Choose a base branch (default: `main`).
4. Type your task in plain English. Be specific — include file names and the expected outcome.

**Example prompts:**

```
In tools/sync-asana-github.js, add a --limit flag that caps the number
of issues created per run. Default to 50. Update the README with the new flag.
```

```
The full-pipeline.js script crashes when a URL has no og:description meta tag.
Add a null check and fall back to an empty string.
```

5. Click **Run**. Codex will:
   - Spin up an isolated Linux environment with the repo checked out
   - Plan the changes (you can see its reasoning)
   - Implement the code
   - Open a pull request on `studio-os` with a summary of changes

6. Review the PR, test locally if needed, and merge.

---

## Tips for good results

- **Be specific about files.** "Fix the sync script" is vague. "In `tools/sync-asana-github.js`, fix the label matching on line ~140 to be case-insensitive" is actionable.
- **One task at a time.** Codex handles focused, bounded tasks well. Long multi-feature requests produce messy PRs.
- **Include acceptance criteria.** Paste in the relevant section of a GitHub issue or Asana task description.
- **Use the existing issue as context.** You can reference GitHub issue numbers: "Fix the bug described in issue #17."
- **Check the PR before merging.** Codex is good but not infallible — always read the diff.

---

## How Codex fits with the existing Claude setup

This repo uses both **Claude** (via the Claude Code CLI and GitHub Copilot agent) and **Codex**. They complement each other:

| Tool | Best for |
|------|----------|
| **Claude Code** (terminal) | Interactive, back-and-forth sessions; exploring the codebase; quick edits |
| **GitHub Copilot agent** (this agent) | Automated PR-based changes triggered from GitHub issues |
| **OpenAI Codex** (platform.openai.com) | Standalone tasks where you want a full isolated run + PR without any local setup |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Repository not found" | Re-authorise the GitHub App and ensure `studio-os` is in the allowed list |
| Codex makes changes to the wrong files | Be more specific in your prompt; mention exact file paths |
| PR conflicts on merge | Pull `main` locally, resolve conflicts, push — same as any PR |
| Codex uses wrong Node version | Add a note in the prompt: "This project uses Node 20" |
| Task times out | Break the task into smaller steps and run each separately |

---

## Useful links

- Codex home: [platform.openai.com/codex](https://platform.openai.com/codex)
- OpenAI Codex docs: [platform.openai.com/docs/codex](https://platform.openai.com/docs/codex)
- GitHub App permissions: [github.com/settings/installations](https://github.com/settings/installations)
