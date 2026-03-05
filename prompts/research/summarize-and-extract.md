# Prompt: Summarize and Extract Key Points

> **Category:** research  
> **Purpose:** Condense a long document or article into an actionable summary.

---

## Prompt Text

```
Summarize the following {{source_type}} in {{format}}.

Include:
- A 2–3 sentence executive summary at the top
- The {{count}} most important takeaways as bullet points
- Any action items or next steps mentioned (or implied)
- Key figures, dates, or names worth remembering

---
{{content}}
```

## Placeholders

| Placeholder | Description | Example |
|---|---|---|
| `{{source_type}}` | What kind of document this is | `"article"`, `"meeting transcript"`, `"research paper"`, `"book chapter"` |
| `{{format}}` | Desired output structure | `"bullet points"`, `"a structured outline"`, `"a one-page brief"` |
| `{{count}}` | Number of key takeaways to extract | `5` |
| `{{content}}` | The full text to summarize | *(paste your content here)* |

## Usage Example

**Input:**
```
Summarize the following meeting transcript in bullet points.

Include:
- A 2–3 sentence executive summary at the top
- The 5 most important takeaways as bullet points
- Any action items or next steps mentioned (or implied)
- Key figures, dates, or names worth remembering

---
[transcript pasted here]
```

## Notes

- Works best when the source material is pasted directly rather than described.
- For very long documents, split into sections and summarize each, then summarize the summaries.
