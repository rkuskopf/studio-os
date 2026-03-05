# studio-os

A curated collection of AI contexts, prompt templates, and workflow automations to streamline creative and production workflows.

## Overview

This repository serves as a knowledge base and automation toolkit for working with AI assistants (ChatGPT, Claude, Copilot, etc.). By storing reusable contexts, prompts, and workflow definitions here, you can:

- **Stay consistent** – Load the same context every session so the AI always has the right background
- **Move faster** – Reuse battle-tested prompt templates instead of writing from scratch
- **Automate repetitive tasks** – Define multi-step workflows once and run them on demand
- **Version-control your AI setup** – Track changes over time and roll back when needed

## Repository Structure

```
studio-os/
├── contexts/          # System-level AI context files (personas, background knowledge)
│   ├── general/       # General-purpose contexts
│   └── specialized/   # Domain-specific contexts (audio, video, code, etc.)
├── prompts/           # Reusable prompt templates organized by task type
│   ├── brainstorming/ # Ideation and creative prompts
│   ├── editing/       # Content editing and refinement prompts
│   ├── research/      # Research and summarization prompts
│   └── technical/     # Technical / code-focused prompts
├── workflows/         # Multi-step workflow definitions
│   ├── content/       # Content creation workflows
│   └── production/    # Production and release workflows
└── templates/         # Quick-start templates for new contexts/prompts/workflows
```

## Quick Start

1. **Browse** the `contexts/` folder and find (or create) a context that matches your work.
2. **Copy** the context into your AI assistant's system prompt or beginning of conversation.
3. **Pick** a prompt from `prompts/` that matches your task and fill in the `{{placeholders}}`.
4. **Run** any multi-step process by following the steps in `workflows/`.

## Adding New Content

### New Context
```
cp templates/context-template.md contexts/<category>/<name>.md
# Edit the file to describe the AI's role, background knowledge, and behavior guidelines
```

### New Prompt Template
```
cp templates/prompt-template.md prompts/<category>/<name>.md
# Fill in the prompt text and document the available placeholders
```

### New Workflow
```
cp templates/workflow-template.md workflows/<category>/<name>.md
# Define each step, inputs, outputs, and any AI prompts used
```

## Contributing

1. Keep each file focused on a single context, prompt, or workflow.
2. Use `{{double_curly_braces}}` for placeholders that need to be filled in at runtime.
3. Add a brief description at the top of every file explaining its purpose.
4. Update this README if you add a new top-level category.
