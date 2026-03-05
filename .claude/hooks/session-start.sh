#!/bin/bash
# KSPF Studio — Claude Code Session Start Hook
# Runs when a Claude Code session starts in this repo.
# No dependencies to install — this repo is pure documentation/context.
# Purpose: validate context files exist and surface a quick briefing.

set -euo pipefail

# Only run full briefing in remote (web) Claude Code sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo "=== KSPF Studio — Session Ready ===" >&2
echo "Date: $(date '+%A %d %B %Y')" >&2
echo "" >&2

# Check core context files are present
MISSING=0
for f in CLAUDE.md TASKS.md company.md; do
  if [ ! -f "${CLAUDE_PROJECT_DIR}/${f}" ]; then
    echo "WARNING: Missing context file: ${f}" >&2
    MISSING=1
  fi
done

if [ "$MISSING" -eq 0 ]; then
  echo "All context files present." >&2
fi

echo "" >&2

# Show open tasks count from TASKS.md
if [ -f "${CLAUDE_PROJECT_DIR}/TASKS.md" ]; then
  IN_PROGRESS=$(grep -c "^- " "${CLAUDE_PROJECT_DIR}/TASKS.md" 2>/dev/null; true)
  echo "TASKS.md: ${IN_PROGRESS:-0} task lines found." >&2
fi

echo "===================================" >&2

exit 0
