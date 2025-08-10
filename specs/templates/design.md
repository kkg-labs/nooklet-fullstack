# Design Template Instructions

**For AI Agents: Use this template structure when creating design.md files**

## Template Structure

```markdown
# Design Architecture: [Title]

## System Overview
[Brief description of the system architecture and approach]

## Architecture Components

### Frontend Architecture
**Location:** [Specific directory paths, e.g., src/views/, wiki-themes/12rnd/]
**Key Components:**
- [Component 1 - specific UI elements or modules]
- [Component 2 - specific UI elements or modules]
- [Component 3 - specific UI elements or modules]

**Files to Modify/Create:**
- [Specific file path 1]
- [Specific file path 2]

### Backend Architecture
**Location:** [Specific directory paths, e.g., src/routes/, src/lib/]
**Key Components:**
- [Component 1 - services, controllers, middleware]
- [Component 2 - services, controllers, middleware]
- [Component 3 - services, controllers, middleware]

**Files to Modify/Create:**
- [Specific file path 1]
- [Specific file path 2]

### Database Schema
**Tables/Collections Affected:**
- [table_name] - [purpose and changes needed]
- [table_name] - [purpose and changes needed]

**Schema Changes:**
```sql
[Specific SQL/schema changes if applicable]
```

### API Endpoints
**New Endpoints:**
- `[METHOD /api/endpoint]` - [purpose and functionality]
- `[METHOD /api/endpoint]` - [purpose and functionality]

**Modified Endpoints:**
- `[METHOD /api/endpoint]` - [what changes are needed]

### Configuration & Environment
**Config Files:**
- [config file path 1]
- [config file path 2]

**Environment Variables:**
- [ENV_VAR_NAME] - [purpose and default value]
- [ENV_VAR_NAME] - [purpose and default value]

## Integration Points
[How this feature integrates with existing systems, dependencies]

## Security Considerations
[Security implications, authentication, authorization, data protection]

## Performance Considerations
[Performance impact, optimization strategies, caching, etc.]

## Testing Strategy
**Unit Tests:**
- [specific test file or function to test]
- [specific test file or function to test]

**Integration Tests:**
- [integration scenario to test]
- [integration scenario to test]

**E2E Tests:**
- [end-to-end user flow to test]
- [end-to-end user flow to test]

## Deployment Considerations
[Deployment steps, environment setup, migration requirements]

---
*Generated on [DATE] | Spec ID: [SPEC_FOLDER_NAME]*
```

## Instructions for AI Agents

1. **Analyze the Codebase**: Before creating the design, use codebase-retrieval to understand the current architecture
2. **Be Specific**: Include exact file paths and directory structures
3. **Map Components**: Connect requirements to actual code locations
4. **Consider Integration**: Think about how this fits with existing systems
5. **Include Testing**: Plan for different levels of testing
6. **Think Security**: Consider security implications of the changes
7. **Performance Impact**: Consider how changes affect performance

## Key Principles

- Map requirements to actual codebase structure
- Be specific about file locations and changes needed
- Consider the full stack (frontend, backend, database, config)
- Include integration points and dependencies
- Plan for testing at multiple levels
- Consider security and performance implications
