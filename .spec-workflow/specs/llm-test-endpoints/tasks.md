# Tasks Document

- [ ] 1. Install required dependencies
  - Command: npm install openai langchain
  - Purpose: Add OpenAI SDK and LangChain text splitter (use Qdrant REST API directly)
  - _Requirements: 1.1, 1.2_

- [ ] 2. Create AI feature directory
  - Directory: app/features/ai/
  - Purpose: Create simple directory for AI-related files
  - _Leverage: existing app/features/* pattern_
  - _Requirements: All_

- [ ] 3. Create request validators
  - File: app/features/ai/llm_test_validator.ts
  - Implement VineJS schemas for embed-text and chat requests
  - Validate required fields: content/prompt and user
  - Purpose: Ensure request data integrity
  - _Leverage: app/features/auth/register_validator.ts patterns_
  - _Requirements: 1.1, 1.2_

- [ ] 4. Create LLM test controller
  - File: app/features/ai/llm_test_controller.ts
  - Implement embedText() method for /test/llm/embed-text endpoint
  - Implement chat() method for /test/llm/chat endpoint
  - Include all logic: validation, text splitting, OpenAI calls, Qdrant REST API calls
  - Purpose: Handle HTTP requests and orchestrate AI operations
  - _Leverage: app/features/auth/auth_controller.ts patterns_
  - _Requirements: 1.1, 1.2_

- [ ] 5. Add routes for LLM test endpoints
  - File: start/routes.ts
  - Add POST /test/llm/embed-text route (no auth middleware)
  - Add POST /test/llm/chat route (no auth middleware)
  - Purpose: Expose endpoints for testing without authentication
  - _Leverage: existing routing patterns_
  - _Requirements: 1.1, 1.2_

- [ ] 6. Test embed-text endpoint manually
  - Use Postman/curl to test POST /test/llm/embed-text
  - Verify text splitting with LangChain
  - Verify OpenAI embedding generation
  - Verify Qdrant collection creation and vector storage via REST API
  - Purpose: Validate embedding workflow works end-to-end
  - _Requirements: 1.1_

- [ ] 7. Test chat endpoint manually
  - Use Postman/curl to test POST /test/llm/chat
  - Verify OpenAI chat completion API integration
  - Verify proper response formatting
  - Purpose: Validate chat functionality works
  - _Requirements: 1.2_

- [ ] 8. Add basic error handling tests
  - Test with missing environment variables
  - Test with invalid API keys
  - Test with malformed requests
  - Purpose: Ensure graceful error handling
  - _Requirements: 1.1, 1.2_

- [ ] 9. Create basic unit tests
  - File: tests/functional/ai/llm_test_controller.test.ts
  - Test controller methods with mocked external APIs
  - Test validation error scenarios
  - Purpose: Ensure controller reliability
  - _Leverage: existing test patterns in tests/functional/_
  - _Requirements: 1.1, 1.2_

- [ ] 10. Document API endpoints
  - Add endpoint documentation with request/response examples
  - Include sample curl commands for testing
  - Purpose: Enable easy testing and future reference
  - _Requirements: All_