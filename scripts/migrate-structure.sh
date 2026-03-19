#!/bin/bash
# Repo structure migration script
# Run from repo root: ./scripts/migrate-structure.sh

set -e  # Exit on error

echo "🔄 Starting repo restructure..."

# 1. Create new directories
echo "📁 Creating new directories..."
mkdir -p clients/alt-cosmetics/assets/mark-concepts
mkdir -p journal
mkdir -p personal/finance
mkdir -p data/leads
mkdir -p tools/sync
mkdir -p comms

# 2. Move ALT Cosmetics files to clients/alt-cosmetics/
echo "📦 Moving ALT Cosmetics files..."
git mv projects/alt-cosmetics.md clients/alt-cosmetics/README.md
git mv projects/alt-cosmetics-decisions.md clients/alt-cosmetics/decisions.md
git mv projects/alt-cosmetics-mj-prompts.md clients/alt-cosmetics/mj-prompts.md
git mv projects/ux-portfolio.md clients/ux-portfolio.md

# Move assets
git mv "projects/alt-cosmetics-assets/ALT-Decision-Log-v1.1 - Confirmed Decisions.csv" clients/alt-cosmetics/assets/decision-log.csv
git mv projects/alt-cosmetics-assets/alt-cosmetics-dashboard.html clients/alt-cosmetics/assets/dashboard.html
git mv projects/alt-cosmetics-assets/brand-guidelines.html clients/alt-cosmetics/assets/brand-guidelines.html
git mv projects/alt-cosmetics-assets/brand-guidelines-v2.html clients/alt-cosmetics/assets/brand-guidelines-v2.html
git mv projects/alt-cosmetics-assets/mark-concepts/alt-mark-concepts.html clients/alt-cosmetics/assets/mark-concepts/alt-mark-concepts.html

# 3. Move weekly logs to journal/
echo "📅 Moving weekly logs to journal/..."
git mv week-of-march-9.md journal/2026-03-09.md
git mv week-of-march-16.md journal/2026-03-16.md

# 4. Move personal/admin files
echo "📋 Moving personal admin files..."
git mv tasks/VCAT_FORM_FILLING_GUIDE.md personal/vcat-form-guide.md
git mv tasks/dropbox-icloud-migration.md personal/dropbox-migration.md

# 5. Move communications
echo "💬 Moving communications..."
git mv communications/humanising-ai-communication.md comms/humanising-ai-communication.md

# 6. Move sync tools
echo "🔧 Reorganizing tools..."
git mv tools/sync-tasks-to-github.js tools/sync/sync-tasks-to-github.js
git mv tools/sync-asana-github.js tools/sync/sync-asana-github.js
git mv tools/label-routing.json tools/sync/label-routing.json

# 7. Move lead CSVs to data/
echo "📊 Moving data files..."
git mv tools/website-auditor/all-leads-merged.csv data/leads/all-leads-merged.csv
git mv tools/website-auditor/excel-leads.csv data/leads/excel-leads.csv
git mv tools/website-auditor/fashion-art-leads.csv data/leads/fashion-art-leads.csv
git mv tools/website-auditor/filtered-leads.csv data/leads/filtered-leads.csv
git mv tools/website-auditor/leads-ranked-fashion-art.csv data/leads/leads-ranked-fashion-art.csv
git mv tools/website-auditor/maps-leads-v2.csv data/leads/maps-leads-v2.csv
git mv tools/website-auditor/pipeline-audited.csv data/leads/pipeline-audited.csv
git mv tools/website-auditor/pipeline-leads.csv data/leads/pipeline-leads.csv
git mv tools/website-auditor/urls-sample.csv data/leads/urls-sample.csv

# 8. Remove duplicates (root level files that exist in projects/)
echo "🗑️ Removing duplicate files..."
git rm alt-cosmetics.md  # Duplicate of projects/alt-cosmetics.md
git rm dashboard.html    # Duplicate/old version

# 9. Clean up empty directories
echo "🧹 Cleaning up..."
rmdir projects/alt-cosmetics-assets/mark-concepts 2>/dev/null || true
rmdir projects/alt-cosmetics-assets 2>/dev/null || true
rmdir projects 2>/dev/null || true
rmdir tasks 2>/dev/null || true
rmdir communications 2>/dev/null || true

# 10. Add worktrees to gitignore
echo "📝 Updating .gitignore..."
echo "" >> .gitignore
echo "# Claude worktrees (local only)" >> .gitignore
echo ".claude/worktrees/" >> .gitignore

echo ""
echo "✅ Migration complete!"
echo ""
echo "New structure:"
echo "  clients/alt-cosmetics/  - ALT Cosmetics project"
echo "  journal/                - Weekly logs"
echo "  personal/               - Admin, legal, finance"
echo "  data/leads/             - Lead CSVs"
echo "  tools/sync/             - GitHub/Asana sync scripts"
echo "  comms/                  - Communications docs"
echo ""
echo "Next steps:"
echo "  1. Review changes with: git status"
echo "  2. Update file references in TASKS.md, CLAUDE.md, etc."
echo "  3. Commit with: git commit -m 'Restructure repo for clarity'"
