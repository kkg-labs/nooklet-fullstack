# Requirements Document

## Introduction

The RAG Test Interface is a developer-focused testing tool that provides a user-friendly interface for testing and debugging the existing LLM RAG (Retrieval-Augmented Generation) functionality. This feature will add a dedicated testing page accessible from the main navigation, allowing developers and stakeholders to interact with the embedding and chat capabilities without needing to use API tools directly.

The interface will provide two main functions: text embedding for building the knowledge base, and chat interaction that leverages the embedded content for context-aware responses. This tool is essential for validating the AI functionality and demonstrating the RAG capabilities to stakeholders.

## Alignment with Product Vision

This feature supports the product vision by:
- **AI Integration Readiness**: Demonstrates the platform's AI capabilities and prepares for future AI-powered features
- **Developer Experience**: Provides essential tooling for testing and validating AI functionality during development
- **Quality Assurance**: Enables thorough testing of RAG functionality before integrating into user-facing features
- **Stakeholder Demonstration**: Offers a clean interface for showcasing AI capabilities to stakeholders and potential users

## Requirements

### REQ-001: Navigation Integration

**User Story:** As a developer, I want to access the RAG testing interface from the main navigation, so that I can quickly test AI functionality without navigating through complex URLs.

#### Acceptance Criteria

1. WHEN a user views the landing page THEN the system SHALL display a "RAG Test" button in the top navigation
2. WHEN a user clicks the "RAG Test" button THEN the system SHALL navigate to the RAG test page at `/rag-test`
3. WHEN the RAG test page loads THEN the system SHALL display the page title "RAG Test Interface"

### REQ-002: Text Embedding Interface

**User Story:** As a developer, I want to embed text content with metadata, so that I can build a knowledge base for testing RAG functionality.

#### Acceptance Criteria

1. WHEN a user accesses the RAG test page THEN the system SHALL display an "Embed Text" tab as the first tab
2. WHEN the "Embed Text" tab is active THEN the system SHALL display:
   - A textarea labeled "Content" for entering text to embed
   - A text input field labeled "User" for specifying the user context
   - A date picker labeled "Date" that supports both date and time selection (hours & minutes)
3. WHEN a user selects a date and time THEN the system SHALL format the date using the same format as `shared/utils.ts` formatDate function
4. WHEN a user fills all fields and clicks "Save" THEN the system SHALL use Inertia's `useForm` hook to submit data to the existing `embedText` function from the LLM test controller
5. WHEN the embedding is successful THEN the system SHALL display a success message with the number of chunks processed
6. WHEN the embedding fails THEN the system SHALL display an error message with details

### REQ-003: Chat Interface

**User Story:** As a developer, I want to chat with the LLM using embedded content as context, so that I can test the RAG functionality and see how the system responds to queries.

#### Acceptance Criteria

1. WHEN a user accesses the RAG test page THEN the system SHALL display a "Chat" tab as the second tab
2. WHEN the "Chat" tab is active THEN the system SHALL display:
   - A textarea labeled "User Prompt" for entering the chat message
   - A text input field labeled "User" for filtering context by user
   - A "Submit Chat" button for sending the request
3. WHEN a user fills the prompt and clicks "Submit Chat" THEN the system SHALL use Inertia's `useForm` hook to submit data to the existing `chat` function from the LLM test controller
4. WHEN the chat response is received THEN the system SHALL display:
   - The actual LLM response in a clearly labeled section
   - The system prompt used for the request in a separate, clearly labeled section
5. WHEN the chat request fails THEN the system SHALL display an error message with details

### REQ-004: User Interface Design

**User Story:** As a developer, I want a clean and intuitive interface, so that I can efficiently test RAG functionality without confusion.

#### Acceptance Criteria

1. WHEN the RAG test page loads THEN the system SHALL use daisyUI v5 components for consistent styling
2. WHEN displaying the date picker THEN the system SHALL use daisyUI v5 date picker component with time selection capability
3. WHEN switching between tabs THEN the system SHALL maintain form state within each tab
4. WHEN displaying responses THEN the system SHALL use appropriate daisyUI styling for success/error states
5. WHEN the page is viewed on different screen sizes THEN the system SHALL maintain responsive design principles

### REQ-005: Backend Integration

**User Story:** As a developer, I want the interface to connect seamlessly with existing backend functionality, so that I can test the actual production code paths.

#### Acceptance Criteria

1. WHEN the embed form is submitted THEN the system SHALL send a POST request to the existing `/test/llm/embed-text` endpoint
2. WHEN the chat form is submitted THEN the system SHALL send a POST request to the existing `/test/llm/chat` endpoint
3. WHEN backend responses are received THEN the system SHALL handle both success and error responses appropriately
4. IF the backend is unavailable THEN the system SHALL display appropriate error messages

### REQ-006: Inertia Form Integration

**User Story:** As a developer, I want the forms to follow established patterns, so that the implementation is consistent with the existing codebase.

#### Acceptance Criteria

1. WHEN implementing form handling THEN the system SHALL use Inertia's `useForm` hook following the same pattern as the Registration page
2. WHEN forms are submitted THEN the system SHALL leverage Inertia's built-in form processing capabilities
3. WHEN handling form state THEN the system SHALL use the same patterns for data binding, validation, and submission as existing forms
4. WHEN displaying form errors THEN the system SHALL follow the same error handling patterns used in the Registration page

## Non-Functional Requirements

### Code Architecture and Modularity
- **Single Responsibility Principle**: Separate components for embedding form, chat form, and response display
- **Modular Design**: Reusable form components that follow existing patterns (LabeledTextInput, etc.)
- **Dependency Management**: Minimal dependencies, leveraging existing daisyUI and Inertia patterns
- **Clear Interfaces**: Well-defined TypeScript interfaces for form data and API responses
- **Consistent Patterns**: Follow the same form handling patterns as the Registration page using `useForm`

### Performance
- Page load time should be under 2 seconds
- Form submissions should provide immediate feedback (loading states)
- Tab switching should be instantaneous with no network requests

### Security
- Input validation on both client and server sides
- No sensitive data should be logged or exposed in error messages
- Note: CSRF protection is not required as test APIs are excluded from CSRF protection

### Reliability
- Graceful error handling for network failures
- Form validation to prevent invalid submissions
- Proper loading states during API calls

### Usability
- Intuitive tab-based interface following common UX patterns
- Clear labeling and helpful placeholder text
- Responsive design that works on desktop and tablet devices
- Consistent styling with the existing application theme