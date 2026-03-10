# north-star migration

**Status:** Work in progress
**Started:** March 2026
**Source:** Notion (KSPF Studio workspace)
**Destination:** `north-star/` folder → `rkuskopf/north-star` GitHub repo

---

## What happened

The music workspace in Notion was scraped and migrated to a local markdown folder (`north-star/`). This covers songs, lyrics, production logs, references, and a sound library spreadsheet. The folder is currently sitting in Google Drive / the local workspace but has not been pushed to GitHub yet.

`north-star` is intentionally separate from `studio-os` — that repo is business/design only.

---

## What's been migrated

| Area | Status |
|------|--------|
| Song files (all songs from Notion DB) | ✅ Done |
| Lyrics and fragments | ✅ Done |
| Sound library (patches, presets, samples) | ✅ Done — `sound-library.xlsx` |
| Sonic references | ✅ Done |
| Artist profile | ✅ Done |
| Production lanes and approach | ✅ Done |
| Production log: Midnight | ✅ Done |
| Production logs: other songs | ❌ Not yet |
| Repo initialised on GitHub | ❌ Not yet |

---

## Current folder structure

```
north-star/
├── README.md
├── artist-profile.md
├── business.md
├── sound-library.xlsx
├── songs/
│   ├── midnight.md          ← Priority 1
│   ├── song-2.md
│   ├── song-4.md
│   ├── song-5.md
│   └── ... (10 more)
├── lyrics/
│   ├── all-lyrics.md
│   └── song-6-lyrics.md
├── production/
│   ├── production-lanes.md
│   ├── nfr-sound-design.md
│   ├── musical-fragments.md
│   ├── feeling-stuck.md
│   └── logs/
│       └── midnight.md
└── references/
    └── sonic-references.md
```

---

## Next steps

1. **Initialise the git repo** — run `git init` in `north-star/`, add a `.gitignore` (exclude `.logicx`, `.aif`, `.wav`, `.DS_Store`), commit, and push to `rkuskopf/north-star` on GitHub
2. **Finish Midnight** — Priority 1 song. Build Arrangement 4. Full task list in `songs/midnight.md`
3. **Add production logs for other songs** — only Midnight has one so far. Song 2, 4, and 5 are next
4. **Check Notion for anything missed** — particularly File Manager 2 (Logic project index) and sound design entries for songs other than Midnight
5. **Link repos** — add a reference in `studio-os` pointing to `north-star` for music context


# Tasks

## Active

- [ ] **Initialise north-star git repo** - create `rkuskopf/north-star` on GitHub, push migrated music workspace
  - Run `git init` in `north-star/`, add `.gitignore` (exclude `.logicx`, `.aif`, `.wav`, `.DS_Store`)
  - See `north-star-migration.md` for full context and next steps

## Waiting On

## Someday

## Done