# Prompt: Generate a Script or Automation

> **Category:** technical  
> **Purpose:** Generate a working script to automate a repetitive task.

---

## Prompt Text

```
Write a {{language}} script that {{task_description}}.

Requirements:
- {{requirement_1}}
- {{requirement_2}}

The script should:
1. Handle errors gracefully and print useful error messages
2. Accept {{inputs}} as {{input_method}}
3. Output {{outputs}}

Include:
- A usage comment or docstring at the top
- Inline comments explaining non-obvious logic
- A usage example in a comment at the bottom

Do not use any external libraries unless they are listed here: {{allowed_libraries}}
```

## Placeholders

| Placeholder | Description | Example |
|---|---|---|
| `{{language}}` | Target scripting language | `"Python"`, `"Bash"`, `"Node.js"` |
| `{{task_description}}` | What the script should do | `"renames all .wav files in a folder by prepending today's date"` |
| `{{requirement_1}}` | A must-have behavior | `"Must be idempotent (safe to run twice)"` |
| `{{requirement_2}}` | Another must-have (or delete this line) | `"Must log each renamed file to a .log file"` |
| `{{inputs}}` | What the script takes as input | `"a folder path"` |
| `{{input_method}}` | How input is provided | `"a command-line argument"`, `"an environment variable"` |
| `{{outputs}}` | What the script produces | `"renamed files and a summary count"` |
| `{{allowed_libraries}}` | Any external libraries you have installed | `"pathlib, datetime"` or `"none"` |

## Notes

- Run the script in a test directory before applying it to real files.
- Ask the AI to add a `--dry-run` flag if the script modifies or deletes files.
