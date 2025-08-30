# Requirements Document

## Introduction

This feature introduces test LLM endpoints for text embedding and chat functionality. These endpoints will serve as a foundation for future AI-powered features in Nooklet, including semantic search and intelligent content recommendations. The endpoints are designed for testing and development purposes, providing basic text processing capabilities using OpenAI's services and Qdrant vector storage.

## Alignment with Product Vision

This feature aligns with Nooklet's future AI integration roadmap outlined in the product vision:
- **AI-Powered Features**: Enables semantic search across nooklets and auto-tagging based on content
- **Content Discovery**: Provides the foundation for intelligent content recommendations
- **Second Brain Functionality**: Supports the vision of AI-assisted organization and discovery of personal knowledge

The test endpoints will validate the technical architecture needed for future AI features while maintaining the product's core principles of speed, simplicity, and user control.

## Requirements

### Requirement 1

**User Story:** As a developer, I want a text embedding endpoint, so that I can test vector storage and retrieval functionality for future semantic search features.

#### Acceptance Criteria

1. WHEN a POST request is made to `/test/llm/embed-text` with valid `content` and `user` parameters THEN the system SHALL split the content into sentences using LangChain text splitter
2. WHEN content is split into sentences THEN the system SHALL generate embeddings for each sentence using OpenAI text-embedding-3-small model
3. WHEN embeddings are generated THEN the system SHALL store them in a Qdrant collection named "chunks_test" with vector size 1536 and Cosine distance metric
4. IF the "chunks_test" collection does not exist THEN the system SHALL create it automatically with the correct configuration
5. WHEN the embedding process completes successfully THEN the system SHALL return a JSON response with success status and metadata about the stored chunks
6. WHEN an error occurs during processing THEN the system SHALL return an appropriate error response with details

### Requirement 2

**User Story:** As a developer, I want a chat endpoint, so that I can test LLM integration for future conversational features.

#### Acceptance Criteria

1. WHEN a POST request is made to `/test/llm/chat` with valid `prompt` and `user` parameters THEN the system SHALL process the request using OpenAI's chat completion API
2. WHEN the chat request is processed THEN the system SHALL return the LLM response in a structured JSON format
3. WHEN an error occurs during chat processing THEN the system SHALL return an appropriate error response with details
4. IF the request parameters are invalid THEN the system SHALL return validation errors

### Requirement 3

**User Story:** As a developer, I want proper error handling and validation, so that the test endpoints are reliable and provide clear feedback.

#### Acceptance Criteria

1. WHEN required parameters (`content`, `user`, `prompt`) are missing THEN the system SHALL return a 400 Bad Request with validation errors
2. WHEN OpenAI API calls fail THEN the system SHALL return a 500 Internal Server Error with appropriate error message
3. WHEN Qdrant operations fail THEN the system SHALL return a 500 Internal Server Error with appropriate error message
4. WHEN requests are made without authentication THEN the system SHALL process them (no auth required for test endpoints)

## Non-Functional Requirements

### Code Architecture and Modularity
- **Single Responsibility Principle**: Separate services for embedding, chat, and vector storage operations
- **Modular Design**: Create reusable services that can be extended for future AI features
- **Dependency Management**: Isolate OpenAI and Qdrant integrations into dedicated service classes
- **Clear Interfaces**: Define TypeScript interfaces for all API requests and responses

### Performance
- **Response Time**: Embedding endpoint should complete within 30 seconds for typical content (up to 5000 characters)
- **Chat Response**: Chat endpoint should respond within 10 seconds for typical prompts
- **Vector Storage**: Qdrant operations should complete efficiently with proper indexing

### Security
- **Input Validation**: All request parameters must be validated using VineJS schemas
- **Error Handling**: No sensitive information (API keys, internal errors) should be exposed in responses
- **Rate Limiting**: Consider implementing basic rate limiting for production use

### Reliability
- **Error Recovery**: Graceful handling of external service failures (OpenAI, Qdrant)
- **Data Consistency**: Ensure vector storage operations are atomic where possible
- **Logging**: Comprehensive logging for debugging and monitoring

### Usability
- **Clear API Documentation**: Endpoints should have clear request/response formats
- **Meaningful Error Messages**: Error responses should provide actionable information for developers
- **Consistent Response Format**: All endpoints should follow the same JSON response structure