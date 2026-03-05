# Prompt: Brainstorm Ideas

> **Category:** brainstorming  
> **Purpose:** Generate a diverse list of ideas for any topic or challenge.

---

## Prompt Text

```
Generate {{count}} distinct ideas for {{topic}}.

Requirements:
- {{requirement_1}}
- {{requirement_2}}

For each idea, provide:
1. A short title (5 words or fewer)
2. A one-sentence description
3. One potential challenge or risk

After the list, recommend the top 3 ideas and explain why they stand out.
```

## Placeholders

| Placeholder | Description | Example |
|---|---|---|
| `{{count}}` | Number of ideas to generate | `10` |
| `{{topic}}` | The subject or challenge to brainstorm around | `"names for a music podcast"` |
| `{{requirement_1}}` | A constraint or must-have quality | `"Must appeal to beginners"` |
| `{{requirement_2}}` | A second constraint (optional—delete if not needed) | `"Must be available as a .com domain"` |

## Usage Example

**Input:**
```
Generate 8 distinct ideas for names for a music production YouTube channel.

Requirements:
- Must be memorable and easy to spell
- Should hint at the production/beat-making angle

For each idea, provide:
1. A short title (5 words or fewer)
2. A one-sentence description
3. One potential challenge or risk

After the list, recommend the top 3 ideas and explain why they stand out.
```

## Notes

- Increase `{{count}}` for divergent phases; keep it low (5–7) when you need focused options.
- Add more requirement lines as needed to tighten the output.
