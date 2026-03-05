# Workflow: New Feature – Idea to Shipped Code

> **Category:** production  
> **Purpose:** Move a software feature from a rough idea to merged, tested, and deployed code.  
> **Estimated Time:** Varies (use for planning, not time-boxing)

---

## Overview

This workflow covers the full software development lifecycle for a single feature: scoping, implementation, code review, testing, and deployment. AI assists at each step to reduce decision fatigue and speed up the lower-value stages.

## Inputs

| Input | Description | Required? |
|---|---|---|
| `feature_idea` | A plain-language description of the feature | Yes |
| `codebase_context` | Language, framework, and relevant architecture notes | Yes |
| `acceptance_criteria` | What "done" looks like (can be generated in Step 1) | No |

---

## Steps

### Step 1 – Scope the Feature

**Goal:** Turn a vague idea into a clear, bounded specification.

**Action:** Load the `contexts/specialized/software-developer.md` context, then ask:
```
I want to build the following feature: {{feature_idea}}

Codebase context: {{codebase_context}}

Please:
1. Restate the feature as a concise user story ("As a [user], I want to [action] so that [benefit].")
2. Write 3–5 acceptance criteria in Given/When/Then format
3. List any edge cases or error states to handle
4. Identify any dependencies or prerequisites
```

**Output:** A user story, acceptance criteria, edge cases, and dependencies.

---

### Step 2 – Plan the Implementation

**Goal:** Define what code changes are needed before writing any code.

**Action:**
```
Given the following feature spec and codebase context, create an implementation plan.

[Paste user story and acceptance criteria from Step 1]

Codebase context: {{codebase_context}}

Include:
- Files to create or modify
- Data model changes (if any)
- API endpoints to add or change (if any)
- Suggested implementation order
- Anything that should NOT change
```

**Output:** A concrete implementation plan with file-level detail.

---

### Step 3 – Write the Code

**Goal:** Implement the feature according to the plan.

**Action:** Work through the implementation plan. For each piece of code, ask the AI:
```
Write the {{language}} code for: {{specific_task}}

Requirements from the spec:
- {{acceptance_criteria_1}}
- {{acceptance_criteria_2}}

Existing code for context:
[Paste relevant existing code]
```

**Output:** Working code for each component of the feature.

---

### Step 4 – Code Review

**Goal:** Catch bugs and quality issues before the code reaches main.

**Action:** Use the prompt in `prompts/technical/code-review.md` on each changed file.

**Output:** A list of issues by severity with suggested fixes applied.

---

### Step 5 – Write Tests

**Goal:** Verify the feature works and protect against regressions.

**Action:**
```
Write {{test_framework}} tests for the following code.

Cover:
1. The happy path for each acceptance criterion
2. Each edge case identified in the spec
3. Error/failure states

[Paste the code to test]
```

**Output:** A test file with passing tests for all acceptance criteria.

---

### Step 6 – Open a Pull Request

**Goal:** Get the code reviewed and merged.

**Action:** Ask the AI:
```
Write a pull request description for the following feature.

Feature: {{feature_idea}}
Acceptance criteria: [list]
Files changed: [list]

Include: summary, motivation, testing notes, and any screenshots or demo instructions needed.
```

Then open the PR and request reviewers.

**Output:** PR open and under review.

---

### Step 7 – Deploy

**Goal:** Ship the feature to users.

**Action:**
1. Merge the PR after approval.
2. Run the deployment pipeline (CI/CD, manual deploy script, etc.).
3. Verify the feature works in the production environment.
4. Monitor error logs for 30 minutes post-deploy.

**Output:** Feature live in production and verified.

---

## Final Output

A fully-implemented, tested, reviewed, and deployed feature with a clear audit trail from idea to production.

## Notes

- If the feature turns out larger than expected at Step 2, split it into smaller deliverables.
- Store reusable code patterns discovered during this workflow back in a `patterns/` folder for future reference.
