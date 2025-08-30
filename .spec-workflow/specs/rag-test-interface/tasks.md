# Tasks Document

- [x] 1. Add RAG Test route to routing configuration
  - File: start/routes.ts
  - Add GET route for `/rag-test` that renders the Inertia page
  - Follow existing route patterns in the file
  - Purpose: Enable navigation to the RAG test interface
  - _Leverage: existing route patterns in start/routes.ts_
  - _Requirements: REQ-001_

- [x] 2. Update landing page navigation with RAG Test button
  - File: inertia/pages/landing.tsx
  - Add "RAG Test" button to the existing navigation section
  - Use Link component from Inertia for navigation
  - Follow existing button styling patterns
  - Purpose: Provide easy access to RAG test interface from main page
  - _Leverage: existing navigation structure and Link components_
  - _Requirements: REQ-001_

- [x] 3. Create TypeScript interfaces for RAG test data structures
  - File: inertia/pages/rag-test/types.ts
  - Define EmbedFormData, ChatFormData, EmbedResponse, ChatResponse interfaces
  - Define TabType and TabState interfaces for tab management
  - Purpose: Establish type safety for form data and API responses
  - _Leverage: existing TypeScript patterns in the project_
  - _Requirements: REQ-002, REQ-003_

- [x] 4. Create main RAG test page component
  - File: inertia/pages/rag-test/Index.tsx
  - Implement main page container with tab navigation
  - Set up tab state management using React useState
  - Add page title using Inertia Head component
  - Purpose: Provide main container for RAG testing interface
  - _Leverage: inertia/pages/auth/Register.tsx patterns, daisyUI tab components_
  - _Requirements: REQ-001, REQ-004_

- [x] 5. Create embed form component
  - File: inertia/pages/rag-test/components/EmbedForm.tsx
  - Implement form using Inertia's useForm hook following Registration page pattern
  - Add content textarea, user input field, and date picker
  - Integrate formatDate function from shared/utils.ts
  - Add form submission to /test/llm/embed-text endpoint
  - Purpose: Handle text embedding functionality with proper form management
  - _Leverage: inertia/components/form/LabeledTextInput.tsx, shared/utils.ts formatDate, useForm patterns from Register.tsx_
  - _Requirements: REQ-002, REQ-005, REQ-006_

- [x] 6. Create chat form component
  - File: inertia/pages/rag-test/components/ChatForm.tsx
  - Implement form using Inertia's useForm hook following Registration page pattern
  - Add user prompt textarea and user input field
  - Add form submission to /test/llm/chat endpoint
  - Purpose: Handle chat functionality with proper form management
  - _Leverage: inertia/components/form/LabeledTextInput.tsx, useForm patterns from Register.tsx_
  - _Requirements: REQ-003, REQ-005, REQ-006_

- [x] 7. Create response display component
  - File: inertia/pages/rag-test/components/ResponseDisplay.tsx
  - Display LLM response in a card component
  - Display system prompt in a separate card for debugging
  - Handle both success and error states with appropriate styling
  - Purpose: Show API responses and system prompts for testing and debugging
  - _Leverage: daisyUI card components, existing alert styling patterns_
  - _Requirements: REQ-003, REQ-004_

- [x] 8. Implement daisyUI v5 date picker integration
  - File: inertia/pages/rag-test/components/DateTimePicker.tsx
  - Create date picker component using daisyUI v5 with time selection
  - Integrate with formatDate function for consistent formatting
  - Handle date/time selection and validation
  - Purpose: Provide date and time selection for embedding metadata
  - _Leverage: daisyUI v5 date picker, shared/utils.ts formatDate function_
  - _Requirements: REQ-002, REQ-004_

- [x] 9. Add error handling and loading states
  - File: inertia/pages/rag-test/components/EmbedForm.tsx (modify existing)
  - File: inertia/pages/rag-test/components/ChatForm.tsx (modify existing)
  - Implement error display using daisyUI alert components
  - Add loading states during form submission using useForm processing state
  - Handle network failures and validation errors
  - Purpose: Provide user feedback during API interactions
  - _Leverage: useForm error handling patterns from Register.tsx, daisyUI alert components_
  - _Requirements: REQ-002, REQ-003, REQ-004_

- [x] 10. Integrate all components in main page
  - File: inertia/pages/rag-test/Index.tsx (modify existing)
  - Import and integrate EmbedForm, ChatForm, ResponseDisplay components
  - Implement tab switching logic with state management
  - Add responsive layout using daisyUI grid system
  - Purpose: Complete the RAG test interface with all functionality
  - _Leverage: existing component integration patterns, daisyUI responsive utilities_
  - _Requirements: REQ-001, REQ-002, REQ-003, REQ-004_

- [x] 11. Test navigation integration using Browser MCP
  - Navigate to landing page and verify "RAG Test" button is visible
  - Click "RAG Test" button and verify navigation to /rag-test
  - Take screenshots of navigation flow
  - Capture any console errors during navigation
  - Purpose: Verify navigation integration works correctly
  - _Leverage: Browser MCP navigation and screenshot capabilities_
  - _Requirements: REQ-001_

- [x] 12. Test embed form functionality using Browser MCP
  - Navigate to RAG test page and verify embed tab is active by default
  - Fill in content textarea with test content
  - Fill in user field with test user
  - Select date and time using date picker
  - Click "Save" button and capture network logs
  - Verify success message display and take screenshot
  - Test error scenarios with empty fields
  - Purpose: Verify embed functionality works end-to-end
  - _Leverage: Browser MCP form interaction, network monitoring, screenshot capabilities_
  - _Requirements: REQ-002, REQ-005_

- [x] 13. Test chat form functionality using Browser MCP
  - Navigate to chat tab and verify tab switching works
  - Fill in user prompt textarea with test question
  - Fill in user field for context filtering
  - Click "Submit Chat" button and capture network logs
  - Verify both LLM response and system prompt are displayed
  - Take screenshots of response display
  - Test error scenarios and capture error states
  - Purpose: Verify chat functionality works end-to-end
  - _Leverage: Browser MCP form interaction, network monitoring, screenshot capabilities_
  - _Requirements: REQ-003, REQ-005_

- [x] 14. Test responsive design using Browser MCP
  - Test interface on different viewport sizes (desktop, tablet)
  - Verify tab navigation works on smaller screens
  - Verify form layouts adapt properly to screen size
  - Take screenshots at different breakpoints
  - Purpose: Ensure responsive design works across devices
  - _Leverage: Browser MCP viewport manipulation and screenshot capabilities_
  - _Requirements: REQ-004_

- [x] 15. Validate API integration using curl commands
  - Test embed endpoint with curl using sample data
  - Test chat endpoint with curl using sample prompt
  - Verify response formats match expected interfaces
  - Document any API issues or unexpected responses
  - Purpose: Validate backend integration independently of frontend
  - _Leverage: curl commands for direct API testing_
  - _Requirements: REQ-005_

- [x] 16. Final integration testing using Browser MCP
  - Perform complete end-to-end workflow: navigate → embed text → chat → verify responses
  - Test error recovery scenarios (network failures, invalid data)
  - Capture comprehensive screenshots of all states
  - Monitor console logs for any JavaScript errors
  - Verify all requirements are met through browser testing
  - Purpose: Ensure complete feature works as specified
  - _Leverage: Browser MCP comprehensive testing capabilities_
  - _Requirements: All requirements_