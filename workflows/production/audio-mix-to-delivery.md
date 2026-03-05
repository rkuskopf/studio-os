# Workflow: Audio Track – Mix to Delivery

> **Category:** production  
> **Purpose:** Walk through every stage from a finished mix to a delivered, release-ready audio file.  
> **Estimated Time:** 1–3 hours per track

---

## Overview

This workflow covers the final stages of audio production: mix review, mastering, QA listening, and file delivery. Use the AI prompts below to get targeted mixing/mastering advice and generate delivery specs for any platform.

## Inputs

| Input | Description | Required? |
|---|---|---|
| `track_name` | Name of the track being processed | Yes |
| `genre` | Musical genre (affects target loudness and EQ curve) | Yes |
| `delivery_target` | Where the track will be distributed (streaming, vinyl, sync, broadcast) | Yes |
| `DAW` | The digital audio workstation you're using | No |

---

## Steps

### Step 1 – Mix Review

**Goal:** Identify any remaining mix issues before mastering.

**Action:** Load the `contexts/specialized/audio-production.md` context, then ask:
```
I'm finishing a mix for a {{genre}} track called "{{track_name}}". 
My delivery target is {{delivery_target}}.

Please give me a pre-mastering checklist covering:
1. Gain staging and headroom targets
2. Frequency balance checkpoints
3. Stereo width considerations
4. Common genre-specific issues to watch for
5. What to export (stem format, sample rate, bit depth)
```

**Output:** A tailored pre-mastering checklist.

---

### Step 2 – Master the Track

**Goal:** Apply mastering processing to achieve target loudness and sonic balance.

**Action:** Ask the AI:
```
I'm mastering a {{genre}} track for {{delivery_target}}.
Current peak: {{current_peak}} dBFS. Current integrated loudness: {{current_lufs}} LUFS.

What are the target specs I should hit, and what processing chain do you recommend?
List the processors in order with suggested starting settings.
```

**Output:** Target specs (LUFS, peak, format) and a recommended processing chain.

---

### Step 3 – QA Listening

**Goal:** Catch any artifacts or issues introduced during mastering.

**Action:** Listen to the mastered file on at least three playback systems:
- [ ] Studio monitors (full range)
- [ ] Headphones (check stereo image and low-end)
- [ ] Phone speaker or small Bluetooth speaker (check mono compatibility and mid presence)
- [ ] Car speakers (optional but recommended for commercial releases)

Note any issues and return to Step 2 if corrections are needed.

**Output:** Confirmed QA pass on all listening environments.

---

### Step 4 – Export Final Files

**Goal:** Produce all required delivery formats.

**Action:** Ask the AI:
```
What file formats and specs do I need to deliver a mastered track to {{delivery_target}}?
Include: sample rate, bit depth, format, loudness target, and any metadata requirements.
```

Then export from your DAW according to the specs.

**Output:** Final audio files ready for delivery.

---

### Step 5 – Deliver

**Goal:** Submit files to the appropriate platform or recipient.

**Action:**
1. Name files according to the delivery spec (e.g., `TrackName_Master_48k24b.wav`).
2. Upload to the distribution platform, label, or client folder.
3. Log the delivery (date, format, destination) in your project notes.

**Output:** Track delivered and delivery logged.

---

## Final Output

A mastered, QA-approved audio track delivered in all required formats to the target platform or recipient.

## Notes

- Keep a copy of the unmastered mix and all stems. Never overwrite source files.
- Store delivery specs per platform in this repo as they evolve.
