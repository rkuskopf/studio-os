# Prompt: Code Review

> **Category:** technical  
> **Purpose:** Get a structured code review with issues ranked by severity.

---

## Prompt Text

```
Review the following {{language}} code and provide feedback organized by severity.

Severity levels:
- 🔴 Critical – bugs, security vulnerabilities, or data-loss risks
- 🟡 Warning – performance issues, bad practices, or maintainability concerns
- 🔵 Suggestion – style improvements, readability tweaks, optional enhancements

For each issue:
1. Quote the relevant line(s)
2. Explain the problem
3. Provide a corrected version

After the review, give an overall assessment (1–2 sentences) and a quality score out of 10.

Context: {{context}}

---
{{code}}
```

## Placeholders

| Placeholder | Description | Example |
|---|---|---|
| `{{language}}` | Programming language of the code | `"Python"`, `"TypeScript"`, `"Go"` |
| `{{context}}` | Brief description of what the code is supposed to do | `"This function fetches user data from an API and caches the result."` |
| `{{code}}` | The code to review | *(paste your code here)* |

## Usage Example

**Input:**
```
Review the following Python code and provide feedback organized by severity.
...
Context: This function reads a CSV file and inserts rows into a PostgreSQL database.

---
[code pasted here]
```

## Notes

- Always provide `{{context}}`—without it, the AI may flag intentional design decisions as bugs.
- For large files, review one function or module at a time.
