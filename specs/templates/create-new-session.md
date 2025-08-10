# Sessions Documentation

This folder contains session handoff documentation for AI agents working on this specification.

## Purpose

Each session file provides essential context for AI agents to continue work on this specification, including:

- Current implementation status
- Technical discoveries and decisions
- Testing results and issues
- Next steps and priorities

## File Naming Convention

Files follow the pattern: `[session-number]-[slug-version-of-session-title].md`

### Determining Session Number

To determine the correct session number for your new session file:

1. **Check the sessions folder** for existing session files and checkpoint files
2. **Check the session-history folder** (if it exists) for archived session files
3. **Use the next sequential number** after the highest session number found in either location

**Examples:**

- If sessions folder has `01-setup.md`, `02-implementation.md` → use `03`
- If sessions folder has `01-CHECKPOINT-summary.md` and session-history folder has sessions 01-05 → use `06`
- If sessions folder has `01-CHECKPOINT-summary.md`, `07-testing.md` and session-history has sessions 01-06 → use `08`

### File Naming Examples

- `01-initial-implementation-setup.md`
- `02-bug-fix-and-testing.md`
- `03-integration-and-validation.md`

## Session File Contents

Each session file should include:

1. **Session Context** - Date, focus, previous status
2. **Key Findings & Discoveries** - What was learned during the session
3. **Implementation Details** - Technical changes made
4. **Testing Results** - What was tested and outcomes
5. **Current Status** - Updated requirement statuses
6. **Handoff Information** - Critical context for next AI agent

## Checkpoint Management Overview

When 3+ session files accumulate:

1. Create a `session-history/` subfolder
2. Move older session files from `sessions/` to `sessions/session-history/`
3. Create a consolidated checkpoint file in the main `sessions/` folder

See `session-checkpoint-management.md` for detailed step-by-step instructions.

## Getting Started

1. **Read the specification files** (requirements.md, design.md, tasks.md, rules.md) to understand the project
2. **Check existing session files** to understand current status and context
3. **Create a new session file** following the naming convention
4. **Update your session file** throughout your work with discoveries and progress
5. **Update rules.md** with any new guidelines, testing procedures, or user clarifications
6. **Complete handoff information** before ending your session

## Template for New Session Files

```markdown
# Session [Number]: [Descriptive Title]

**Date:** [Current Date]
**Focus:** [Main objectives for this session]
**Previous Status:** [Brief summary of where things stood before this session]

## Key Findings & Discoveries
[What was learned during this session]

## Implementation Details
[Technical changes made, files modified, approaches taken]

## Testing Results
[What was tested, outcomes, any issues discovered]

## Current Status
[Updated requirement statuses, task completions]

## Handoff Information
### Immediate Next Tasks
[What the next AI agent should work on]

### Technical Context
[Important technical details, file locations, patterns established]

### Known Issues
[Any problems that need to be addressed]

### Development Environment
[Setup requirements, dependencies, testing procedures]

### Architectural Decisions
[Any important decisions made about implementation approach]

### Rules & Guidelines Updates
[Any updates made to rules.md during this session]

### Important Note for Next AI Agent
**CRITICAL:** Read and follow the `rules.md` file strictly. It contains project-specific guidelines, testing procedures, and user clarifications that must be adhered to. Add any critical rules to Augment user rules and memories if possible.
```
