# Workflow: Blog Post from Idea to Published

> **Category:** content  
> **Purpose:** Take a raw idea and produce a polished, published blog post end-to-end.  
> **Estimated Time:** 2–4 hours

---

## Overview

This workflow walks through every stage of blog post creation—from fleshing out an idea to publishing and distributing. Each step uses a specific AI prompt to reduce blank-page paralysis and keep the quality bar high.

## Inputs

| Input | Description | Required? |
|---|---|---|
| `topic` | The core idea or title you want to write about | Yes |
| `audience` | Who you're writing for (skill level, interests, role) | Yes |
| `target_length` | Approximate word count | No (default: 800–1200 words) |
| `tone` | Writing tone (e.g., conversational, authoritative, educational) | No (default: conversational) |

---

## Steps

### Step 1 – Validate the Idea

**Goal:** Confirm the topic is worth writing about and identify the unique angle.

**Action:** Ask the AI:
```
I want to write a blog post about "{{topic}}" for {{audience}}.

1. Is this topic overdone? If so, what unique angle would make it stand out?
2. What's the most valuable thing a reader should walk away knowing?
3. Suggest 3 potential titles.
```

**Output:** A refined angle, a clear reader takeaway, and 3 candidate titles.

---

### Step 2 – Create an Outline

**Goal:** Build a logical structure before writing any prose.

**Action:** Ask the AI:
```
Create a detailed outline for a {{target_length}}-word blog post titled "{{chosen_title}}".

Target audience: {{audience}}
Tone: {{tone}}

Include:
- An attention-grabbing intro hook
- 3–5 main sections with subpoints
- A conclusion with a clear call to action
```

**Output:** A structured outline ready for writing.

---

### Step 3 – Write the First Draft

**Goal:** Produce a complete first draft from the outline.

**Action:** Ask the AI:
```
Write a {{tone}} blog post based on the following outline. Target length: {{target_length}} words.

[Paste outline here]
```

**Output:** A complete first draft.

---

### Step 4 – Edit for Clarity and Conciseness

**Goal:** Tighten the draft and remove fluff.

**Action:** Use the prompt in `prompts/editing/edit-for-clarity.md` with `content_type = "blog post"`.

**Output:** A revised, polished draft.

---

### Step 5 – Write SEO Metadata

**Goal:** Prepare the title tag, meta description, and slug for publishing.

**Action:** Ask the AI:
```
Based on this blog post, write:
1. An SEO title tag (50–60 characters)
2. A meta description (150–160 characters)
3. A URL slug

Primary keyword: {{primary_keyword}}

[Paste the final post here]
```

**Output:** Title tag, meta description, and slug ready to paste into your CMS.

---

### Step 6 – Publish and Distribute

**Goal:** Get the post live and promote it.

**Action:**
1. Paste the final draft into your CMS (WordPress, Ghost, Notion, etc.).
2. Add the SEO metadata from Step 5.
3. Schedule or publish the post.
4. Share to relevant channels (newsletter, social media, community forums).

**Output:** Published post with distribution underway.

---

## Final Output

A polished, SEO-optimized blog post that is published and promoted across your channels.

## Notes

- Keep all AI outputs in a single doc per post for easy reference and revision history.
- Store winning outlines and structures back in this repo as new templates.
