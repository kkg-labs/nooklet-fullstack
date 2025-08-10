# Augment AI Agent System

**Complete Instructions for AI Agents Working on Feature/Task/Issue Specifications**

---

## Overview

This system provides a standardized approach for AI agents to create comprehensive specifications and manage work sessions when users request new features, bug fixes, or tasks. This consolidated guide contains all necessary instructions for specification creation, session management, and handoff procedures.

## Essential Development Lessons

**MANDATORY READING**: Before creating any specification, AI agents must read `.specs-sys/specs/lessons.md` which contains critical development principles including:

- **Minimal Viable Fix (MVF)**: Start with the simplest solution that works
- **Problem-First Approach**: Define the exact problem before designing solutions
- **Complexity Budget**: Every line of code has a maintenance cost
- **Required Specification Checks**: Mandatory validation steps for all specs

These lessons prevent over-engineering and ensure solutions match problem complexity.

## When to Create a Specification

Create a new specification when users request:

- "create a spec for [feature/task/issue]"
- "please read spec readme and create a spec for [description]"
- Any request that involves planning or documenting a new feature/enhancement

## Specification Structure

Each specification must create a new folder in `.specs-sys/specs/` with the format:

```text
.specs-sys/specs/[counter]-[slug-title]/
├── requirements.md
├── design.md
├── tasks.md
├── rules.md          # REQUIRED: Project-specific rules and guidelines
└── sessions/         # REQUIRED: Session handoff documentation
    ├── [spec num]-create-new-session.md   # Template copy
    ├── session-checkpoint-management.md   # Template copy
    ├── 01-CHECKPOINT-summary-title-slug.md # Checkpoint files stay in main sessions folder
    ├── 03-current-session-slug.md
    └── session-history/  # Archived session files moved here during consolidation
        ├── 01-old-session-slug.md
        └── 02-old-session-slug.md
```

**Folder Naming Convention:**

- Counter: Start from `01`, increment by 1 for each new spec
- Slug: Lowercase, hyphen-separated version of the spec title
- Example: `01-skeleton-screen-implementation`, `02-user-authentication-system`

**IMPORTANT:** Every spec folder MUST include a `sessions/` subfolder immediately upon creation. Copy both template files into the sessions folder:

- Copy `.specs-sys/templates/create-new-session.md` (retain filename)
- Copy `.specs-sys/templates/session-checkpoint-management.md` (retain filename)

**CRITICAL:** Before creating any specification, AI agents MUST read `.specs-sys/specs/lessons.md` to understand essential development principles and apply the required specification checks.

## Required Files

### 1. requirements.md

**Purpose:** Define what needs to be built and why

**Instructions for AI Agent:**

1. Create a high-level overview based on the user's request
2. Include relevant context and background information
3. Define 3-5 main requirements, each with:
   - Clear description of what is needed
   - 2-5 specific acceptance criteria as checkable items
4. Add success metrics, constraints, and out-of-scope items
5. Avoid implementation details that may change

**Example Format:**

```markdown
# Requirements Specification: [Title]

## Overview
[Brief description of the feature/task]

## Context & Background
[Relevant background information]

## Requirements

### REQ-001: [Requirement Name]
**Description:** [Detailed description]

**Acceptance Criteria:**
- [ ] [Specific deliverable 1]
- [ ] [Specific deliverable 2]
- [ ] [Specific deliverable 3]

[Additional requirements...]

## Success Metrics
[How success will be measured]

## Constraints & Assumptions
[Known limitations and assumptions]

## Out of Scope
[What is explicitly not included]
```

### 2. design.md

**Purpose:** Guide implementation by mapping to codebase structure

**Instructions for AI Agent:**

1. Analyze the codebase to identify relevant components
2. Document specific file paths and locations that will need changes
3. Include architecture components, database changes, and API endpoints
4. Consider security, performance, and testing implications
5. Be specific about file locations to help with implementation

**Example Format:**

```markdown
# Design Architecture: [Title]

## System Overview
[Brief description of the system architecture]

## Architecture Components

### Frontend Architecture
**Location:** [Specific directory paths]
**Key Components:**
- [Component 1]
- [Component 2]

**Files to Modify/Create:**
- [Specific file path 1]
- [Specific file path 2]

[Additional sections for Backend, Database, API, etc.]

## Integration Points
[How this connects with other systems]

## Security & Performance Considerations
[Important considerations]

## Testing Strategy
[Approach to testing]
```

### 3. tasks.md

**Purpose:** Provide an implementation plan with trackable status

**Instructions for AI Agent:**

1. Break down implementation into logical phases
2. Create specific tasks with clear dependencies
3. Estimate time for each task (in minutes/hours)
4. Define deliverables for each task
5. Use status indicators: "planned", "in-progress", "done"

**Example Format:**

```markdown
# Implementation Tasks: [Title]

## Task Overview
**Total Tasks:** [Number]
**Estimated Duration:** [Time estimate]
**Priority:** [high/medium/low]

## Task List

### Phase 1: [Phase Name]
- [ ] **TASK-001**: [Task Name]
  - **Status:** planned
  - **Estimated Time:** [Time estimate]
  - **Dependencies:** [Dependencies, if any]
  - **Description:** [Detailed description]
  - **Deliverables:**
    - [Specific deliverable 1]
    - [Specific deliverable 2]

[Additional tasks...]

## Status Legend
- **planned**: Task is defined and ready to start
- **in-progress**: Task is currently being worked on
- **done**: Task is completed and verified

## Progress Tracking
**Completed:** 0/[Total] tasks (0%)
**In Progress:** 0/[Total] tasks
**Remaining:** [Total]/[Total] tasks
```

### 4. rules.md

**Purpose:** Document project-specific rules, guidelines, and clarifications discovered during implementation

**Instructions for AI Agent:**

1. Create an initially empty `rules.md` file during spec creation
2. Update this file throughout sessions with:
   - Testing procedures and commands
   - Specific implementation guidelines
   - User clarifications about processes or logic
   - File-specific handling instructions
   - Any "gotchas" or important considerations
3. Reference this file in session handoffs to ensure continuity
4. Add critical rules to Augment user rules and memories when possible

**Example Format:**

```markdown
# Project Rules & Guidelines: [Title]

## Testing Procedures
[How to test this implementation]

## Implementation Guidelines
[Specific approaches that must be followed]

## File-Specific Instructions
[Special handling for particular files or components]

## User Clarifications
[Important clarifications provided by the user]

## Gotchas & Considerations
[Things to watch out for or remember]
```

## Session Management System

### Session Files
Every specification includes a `sessions/` folder for AI agent handoff documentation. This ensures continuity between different AI agents working on the same project.

#### Session File Naming Convention

- Format: `[session-number]-[slug-version-of-session-title].md`
- Session numbers start from `01` and increment for each new session
- Use kebab-case for the slug (lowercase, hyphens for spaces)
- Examples:
  - `01-dynamic-skeleton-system-implementation.md`
  - `02-content-loading-detection-setup.md`
  - `03-visual-consistency-improvements.md`

#### Session File Contents

Each session file should include:

1. **Session Context** - Date, focus, previous status
2. **Key Findings & Discoveries** - What was learned during the session
3. **Implementation Details** - Technical changes made
4. **Testing Results** - What was tested and outcomes
5. **Current Status** - Updated requirement statuses
6. **Handoff Information** - Critical context for next AI agent:
   - Immediate next tasks
   - Technical context and file locations
   - Known issues to address
   - Development environment details
   - Any architectural decisions or patterns established

### Checkpoint Management
When sessions accumulate (typically 3+ session files), create checkpoints to consolidate information:

1. **Create session-history folder** if it doesn't exist: `sessions/session-history/`
2. **Move older session files** from `sessions/` to `sessions/session-history/` folder
3. **Create new checkpoint file** in the main `sessions/` folder with format: `[checkpoint-number]-CHECKPOINT-[summary-title-slug].md`
4. **Summarize consolidated information** including:
   - All necessary context and findings
   - Solutions and gotchas discovered
   - Things to look out for
   - Current state and next steps
   - Any critical information for future AI agents

## AI Agent Workflow

When a user requests a specification, follow these steps:

1. **Read Essential Lessons** (MANDATORY)
   - Read `.specs-sys/specs/lessons.md` to understand key development principles
   - Apply the fundamental rules: start with Minimal Viable Fix, problem-first approach
   - Use the required specification checks throughout the process

2. **Analyze the Request**
   - Understand the feature/task/issue being requested
   - Determine if additional information is needed
   - Ask clarifying questions if the request is ambiguous
   - **Apply lessons**: Define the exact problem before designing solutions

3. **Create the Specification Folder**
   - Check existing specs in `.specs-sys/specs/` to determine the next counter number
   - Create a new folder with the pattern `[counter]-[slug-title]`
   - Example: `.specs-sys/specs/01-skeleton-screen-implementation/`

4. **Generate the Required Files**
   - Create `requirements.md` with clear requirements and acceptance criteria
   - Create `design.md` with specific file paths and architecture details
   - Create `tasks.md` with an implementation plan and status tracking
   - **Create `rules.md`** using the template from `.specs-sys/templates/rules.md` for project-specific rules and guidelines
   - **Create `sessions/` folder** and copy both template files:
   - Copy `.specs-sys/templates/create-new-session.md` (retain filename but add spec number identifier like if spec num is `02` then the copied file should be `02-create-new-session.md`)
     - Copy `.specs-sys/templates/session-checkpoint-management.md` (retain filename)
   - **Apply lessons**: Use required specification checks from lessons.md

5. **Inform the User**
   - Confirm the specification has been created
   - Summarize the key requirements and implementation approach
   - Offer to begin implementation if requested

## Best Practices for AI Agents

### For Requirements

- Focus on **what** and **why**, not **how**
- Include enough context for discovery
- Avoid implementation details that may change
- Define clear, measurable acceptance criteria
- Use checkboxes for acceptance criteria to enable tracking

### For Design

- Map to actual file locations in codebase
- Include integration points and dependencies
- Consider security and performance implications
- Plan for testing at each level
- Be specific about which files need to be modified

### For Tasks

- Break work into ~20-minute professional units
- Define clear dependencies between tasks
- Include verification steps
- Use the status indicators consistently
- Group tasks into logical phases

## Example Specification

Here's an example of a complete specification structure:

```text
.specs-sys/specs/01-skeleton-screen-implementation/
├── requirements.md    # Skeleton screen requirements
├── design.md         # Implementation architecture
├── tasks.md          # Implementation tasks
├── rules.md          # Project-specific rules and guidelines
└── sessions/         # Session handoff documentation
    ├── [spec num]-create-new-session.md              # Template copy
    ├── session-checkpoint-management.md   # Template copy
    ├── 01-CHECKPOINT-core-features-complete.md # Checkpoint file in main sessions folder
    ├── 04-current-implementation.md
    └── session-history/  # Archived session files
        ├── 01-initial-implementation.md
        ├── 02-bug-fixes.md
        └── 03-testing-phase.md
```

The templates in `.specs-sys/templates/` provide guidance on the structure and content of each file. Use them as a reference when creating new specifications.

## Session Workflow for AI Agents

When working on an existing specification:

1. **Check for existing sessions** in the `sessions/` folder
2. **Read the latest session file** to understand current status and context
3. **Create a new session file** when starting work:
   - Increment session number from the latest session
   - Use descriptive slug for the session focus
   - Include all required sections from the template
4. **Update session file** throughout work with discoveries and progress
5. **Complete session file** before ending work with handoff information

### When to Create Checkpoints

Create a checkpoint when:

- There are 3+ session files in the sessions folder
- A major milestone is reached
- Significant architectural decisions have been made
- Before starting a new major phase of work

### Checkpoint Creation Process

1. **Create checkpoints folder** if it doesn't exist: `sessions/checkpoints/`
2. **Identify session files to consolidate** (between latest checkpoint and current)
3. **Move identified session files** to checkpoints folder
4. **Create new checkpoint file** with format: `[checkpoint-number]-CHECKPOINT-[summary-title-slug].md`
5. **Summarize all critical information** from moved sessions into the checkpoint file

## Updating Specifications

When a specification needs to be updated:

1. Modify the existing files in the specification folder
2. Add a note in the relevant file indicating the update
3. Update task statuses in `tasks.md` as work progresses
4. Create session files to document changes and handoff context

---

**Augment AI Agent System v2.0** - *Consolidated specification and session management system*
