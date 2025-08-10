# Session and Checkpoint Management Guide for AI Agents

**Instructions for managing session files and creating checkpoints in specification folders**

---

## Overview

This guide provides step-by-step instructions for AI agents to manage session files and create checkpoints when working on specifications. This ensures continuity between different AI agents and prevents loss of critical context.

## Session Management Overview

**Creating New Sessions:** When starting work, create session files following the pattern `[session-number]-[descriptive-slug].md`. Determine session numbers by checking both the sessions folder and checkpoints folder for the highest existing number. See `create-new-session.md` for detailed instructions.

**This Document Focus:** Checkpoint management when 3+ session files accumulate.

## Checkpoint Management

### When to Create Checkpoints

Create a checkpoint when:
- **3+ session files** exist in the sessions folder
- **Major milestone reached** (e.g., core functionality complete)
- **Significant architectural decisions** have been made
- **Before starting new major phase** of work
- **Complex debugging session** with important discoveries
- **Before handoff to different development focus** (e.g., frontend to backend)

### Checkpoint Creation Process

1. **Create session-history folder** if it doesn't exist:
   ```
   .specs-sys/specs/[spec-folder]/sessions/session-history/
   ```

2. **Identify session files to consolidate**:
   - If no previous checkpoints exist: consolidate ALL session files
   - If previous checkpoints exist: consolidate files between the latest checkpoint and current session

3. **Move identified session files** to the session-history folder:
   - Keep the original filenames
   - This preserves detailed history while cleaning up the main sessions folder

4. **Determine checkpoint number**:
   - Check existing checkpoint files in the main sessions folder
   - Increment from the highest checkpoint number found
   - Start with `01` if no checkpoints exist

5. **Create checkpoint file** in the main sessions folder with format:
   ```
   [checkpoint-number]-CHECKPOINT-[summary-title-slug].md
   ```
   
   Examples:
   - `01-CHECKPOINT-algolia-search-bug-fix-complete.md`
   - `02-CHECKPOINT-frontend-implementation-phase-done.md`
   - `03-CHECKPOINT-testing-validation-milestone.md`

6. **Consolidate information** from moved session files into the checkpoint:

   ```markdown
   # Checkpoint [Number]: [Summary Title]
   
   **Date:** [Current Date]
   **Sessions Consolidated:** [List of session files moved to checkpoints]
   **Milestone:** [What major milestone this checkpoint represents]
   
   ## Executive Summary
   [High-level overview of what was accomplished in the consolidated sessions]
   
   ## Key Discoveries & Solutions
   [Important findings, solutions implemented, gotchas discovered]
   
   ## Technical Implementation
   [Summary of technical changes, file modifications, patterns established]
   
   ## Testing & Validation
   [Testing approaches used, results, any ongoing testing needs]
   
   ## Current State
   [Complete status of requirements, tasks, and implementation]
   
   ## Critical Context for Future AI Agents
   ### Architecture & Patterns
   [Important architectural decisions and patterns to follow]
   
   ### File Locations & Structure
   [Key files, their purposes, and how they relate]
   
   ### Gotchas & Things to Watch Out For
   [Important warnings, edge cases, potential pitfalls]
   
   ### Development Environment & Setup
   [How to set up and work with this specification]
   
   ### Next Phase Recommendations
   [Suggested next steps and priorities]
   
   ## Dependencies & Integration Points
   [How this work relates to other parts of the system]
   ```

## Best Practices

### For Session Files
- **Be specific** about what was accomplished
- **Include code snippets** for important changes
- **Document debugging steps** and their outcomes
- **Note any temporary workarounds** that need future attention
- **Include exact file paths** and line numbers when relevant
- **Record testing commands** and procedures used

### For Checkpoint Files
- **Focus on the big picture** rather than minute details
- **Highlight critical decisions** that affect future work
- **Summarize patterns** that should be followed
- **Identify integration points** with other systems
- **Document any technical debt** or future refactoring needs
- **Provide clear next steps** for continuing the work

### General Guidelines
- **Update session files throughout work**, not just at the end
- **Use clear, descriptive language** that any AI agent can understand
- **Include enough context** for someone unfamiliar with the project
- **Reference specific requirements and tasks** from the specification
- **Maintain consistency** with the specification's terminology and structure

## Example Workflow

1. AI Agent starts work on specification `05-user-authentication`
2. Checks `sessions/` folder, finds `05-password-validation.md` as latest session
3. Creates `06-oauth-integration-setup.md` for new session
4. Works on OAuth integration, updating session file with progress
5. Notices 3 session files now exist, decides to create checkpoint
6. Creates `sessions/session-history/` folder
7. Moves sessions `04` through `06` to session-history folder
8. Creates `01-CHECKPOINT-authentication-core-features-complete.md` in the main sessions folder
9. Consolidates key information from moved sessions into checkpoint
10. Continues with session `07` for next phase of work

This system ensures that critical context is preserved while keeping the active sessions folder manageable and focused on current work.
