# Prompt: Edit for Clarity and Conciseness

> **Category:** editing  
> **Purpose:** Tighten and clarify a piece of writing without changing the author's voice.

---

## Prompt Text

```
Edit the following {{content_type}} for clarity and conciseness.

Goals:
- Remove filler words and redundant phrases
- Break up sentences longer than 25 words where possible
- Use active voice instead of passive voice
- Keep the author's original tone and intent intact

Do NOT:
- Change the meaning of any sentence
- Add new information that wasn't in the original
- Alter technical terms or proper nouns

Return the revised text, then list each change made and the reason for it.

---
{{content}}
```

## Placeholders

| Placeholder | Description | Example |
|---|---|---|
| `{{content_type}}` | Type of content being edited | `"email"`, `"blog post"`, `"bio"`, `"product description"` |
| `{{content}}` | The full text to be edited | *(paste your text here)* |

## Usage Example

**Input:**
```
Edit the following email for clarity and conciseness.
...
[email text pasted below the dashes]
```

## Notes

- For longer documents, process one section at a time to keep context tight.
- If you want the AI to preserve a specific phrase, add it to the "Do NOT" list.
