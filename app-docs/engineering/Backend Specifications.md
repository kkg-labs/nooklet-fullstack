# Backend Specifications

#backend #technical #architecture

**Purpose:** This document is the **Technical Guide**. It contains detailed specifications for the backend architecture, data models, and infrastructure requirements for Nooklet - an AI-powered "second brain" application that seamlessly integrates journaling with intelligent resource management.

**Note:** API design and database schema details are maintained within the backend project itself to ensure consistency and avoid documentation drift.

---

## 1. System Architecture Overview

### 1.1. High-Level Architecture

Nooklet follows a microservices architecture with the following core components:

- **API Gateway**: Central entry point for all client requests
- **Core Service**: Main application logic and nooklet management
- **AI Service**: Content processing, tagging, and semantic analysis
- **Search Service**: Full-text and semantic search capabilities
- **Auth Service**: User authentication and authorization
- **Media Service**: File upload, processing, and storage
- **Notification Service**: Real-time updates and push notifications

### 1.2. Technology Stack

**Backend Framework**: Node.js with Express.js / Python with FastAPI
**Database**: PostgreSQL (primary) with pgvector extension, Redis (caching)
**AI/ML**: OpenAI API, Hugging Face Transformers, Custom embedding models
**Search**: PostgreSQL with pgvector (vector similarity), Full-text search (tsvector)
**RAG System**: Enhanced embeddings with chunking, hybrid search, performance tracking
**Message Queue**: Redis / RabbitMQ
**File Storage**: AWS S3 / CloudFlare R2
**Monitoring**: Prometheus + Grafana
**Deployment**: Docker + Kubernetes / Railway / Vercel

---

## 2. Data Model

### 2.1. Core Entities

The Nooklet data model is built around a multi-tenant architecture with separate authentication and profile management, supporting journaling content (nooklets) and resource links (articles, videos) as distinct entity types.

#### 2.1.1. User Management

**Authentication & Profiles**: The system uses a split user model:

- `auth_users`: Authentication credentials and login information
- `profiles`: User profile data and public information
- `profile_settings`: User preferences and application settings

This separation allows for flexible authentication methods while maintaining clean profile management.

**Key Features**:

- Secure authentication with password hashing
- Flexible profile management with timezone and subscription support
- Configurable user settings stored as JSON
- Activity tracking for user engagement analytics

**Key Relationships**:

- One auth_user has one profile (one-to-one)
- One profile can have many nooklets, articles, videos, collections, tags, and mood entries

#### 2.1.2. Content Entities

The system supports three distinct content types, each optimized for its specific use case:

##### Nooklets (Journaling Core)

**Purpose**: The fundamental journaling unit for personal thoughts, reflections, and quick captures.

**Content Types**:

- **Journal**: Personal thoughts, reflections, daily entries
- **Voice**: Voice notes with transcription
- **Quick Capture**: Rapid text input, meeting notes, highlights

**Key Features**:

- Rich text content with AI processing and summarization
- Mood tracking integration
- Location awareness
- Draft and publishing workflow
- Word count and reading time estimation
- Favorite and archive functionality

##### Articles (Resource Links)

**Purpose**: Text-based resource metadata for articles, blog posts, and documents.

**Key Features**:

- URL parsing and content extraction
- Reading progress tracking (percentage-based)
- Rich metadata (author, publication date, site information)
- Archive.org backup integration
- Content parsing status tracking
- Language detection and word count

##### Videos (Media Resources)

**Purpose**: Video and audio resource metadata for YouTube, podcasts, and media content.

**Key Features**:

- Platform-specific metadata (YouTube, Vimeo, podcasts)
- Time-based progress tracking
- Transcript and chapter support
- Thumbnail and quality information
- Duration and viewing session tracking
- Playlist and channel organization

**Shared Relationships** (All Content Types):

- Belongs to one user
- Can have many tags (many-to-many via separate junction tables)
- Can belong to many collections (many-to-many via separate junction tables)
- Can have AI analysis results (sentiment, topics, entities)
- Can have vector embeddings for semantic search

#### 2.1.3. Mood Tracking System

The mood system provides sophisticated emotional tracking with multiple entry types and AI integration.

##### Mood Types

**Purpose**: Reusable mood templates/definitions that users can create and customize.

**Key Features**:

- **Personal Mood Library**: Each user can create custom mood types
- **Default Mood Types**: System provides common moods (happy, sad, excited, calm, etc.)
- **Visual Representation**: Emojis and colors for intuitive mood selection
- **Usage Tracking**: Monitor which mood types are used most frequently

##### Mood Entries

**Purpose**: Records actual mood instances with multiple tracking levels and AI integration.

**Entry Types**:

- **Daily**: Overall mood for an entire day (e.g., "Today I felt enthusiastic")
- **Momentary**: Specific moment mood throughout the day (e.g., "Feeling anxious right now")
- **Nooklet**: Mood tied to specific journaling content (journal entry, voice note, quick capture)
- **Independent**: Standalone mood entry not tied to content or daily summary

**Key Features**:

- **Multi-Level Tracking**: Support daily, momentary, and content-specific moods
- **Intensity Ratings**: Rate mood strength on 1-10 scale
- **Contextual Notes**: Add context about what triggered the mood
- **Location Awareness**: Optional location tracking for mood patterns
- **Flexible Triggers**: Track what caused or influenced the mood
- **AI Integration**: Sentiment analysis can suggest moods based on content

**Sentiment Analysis Integration**:

- AI analyzes nooklet content and suggests appropriate moods
- Users can accept, reject, or modify AI suggestions
- Confidence scores track AI accuracy for continuous improvement

#### 2.1.4. Organization System

##### Tags (AI + Manual)

**Purpose**: Intelligent categorization system supporting both AI-generated and user-created tags.

**Key Features**:

- **Hybrid Tagging**: Combines AI-generated suggestions with manual user tags
- **Multi-Content Support**: Tags work across nooklets, articles, and videos
- **Confidence Scoring**: AI tags include confidence scores for quality assessment
- **Usage Analytics**: Track tag popularity and effectiveness
- **Visual Organization**: Color coding for visual tag management

##### Collections

**Purpose**: User-created groupings supporting all content types with smart and manual organization.

**Collection Types**:

- **Manual Collections**: User manually adds/removes content
- **Smart Collections**: Auto-populated based on rules (tags, dates, content type)
- **Public Collections**: Shareable collections for collaboration

**Key Features**:

- **Multi-Content Support**: Can contain nooklets, articles, and videos
- **Smart Rules**: Automated population based on flexible criteria
- **Visual Organization**: Color coding and descriptions
- **Sharing Capabilities**: Public collections for knowledge sharing

#### 2.1.5. AI and Search System

##### Enhanced RAG (Retrieval-Augmented Generation)

**Purpose**: Production-ready RAG system for intelligent content retrieval and AI-powered insights.

**Key Features**:

- **Advanced Chunking**: Multiple strategies (paragraph, sentence, sliding window)
- **Hybrid Search**: Combines vector similarity with full-text search
- **Content Versioning**: Automatic re-embedding when content changes
- **Performance Tracking**: Query analytics and retrieval optimization
- **Multi-Model Support**: Flexible embedding model management

**Chunking Strategies**:

- **Full Document**: Single embedding for entire content
- **Paragraph**: Natural paragraph boundaries for better context
- **Sentence**: Sentence-level chunking for precise retrieval
- **Sliding Window**: Overlapping fixed-size windows for comprehensive coverage

##### Content Analysis

**Purpose**: AI-powered content analysis providing rich metadata for enhanced search and organization.

**Analysis Types**:

- **Sentiment Analysis**: Emotional tone detection with mood suggestions
- **Topic Extraction**: Key themes and subject identification
- **Entity Recognition**: Named entities (people, places, organizations)
- **Content Classification**: Automatic categorization and tagging

**Integration Benefits**:

- **Enhanced RAG**: Analysis results improve retrieval quality
- **Smart Filtering**: Filter content by sentiment, topics, or entities
- **Auto-Tagging**: Automatic tag generation from analysis results
- **Mood Integration**: Sentiment analysis suggests appropriate moods

---

## 3. Infrastructure and Deployment

### 3.1. Database Requirements

**Primary Database**: PostgreSQL 14+ with the following extensions:

- `pgvector`: Vector similarity search for RAG system
- `pg_trgm`: Trigram matching for fuzzy text search
- `uuid-ossp`: UUID generation functions

**Caching Layer**: Redis for session management, query caching, and real-time features

**Search Capabilities**:

- Vector similarity search using pgvector with ivfflat indexes
- Full-text search using PostgreSQL's tsvector with GIN indexes
- Hybrid search combining both approaches for optimal RAG performance

### 3.2. AI/ML Infrastructure

**Embedding Models**: Support for multiple embedding providers:

- OpenAI (text-embedding-3-small, text-embedding-ada-002)
- Hugging Face transformers for local deployment
- Custom fine-tuned models for domain-specific content

**Content Analysis**:

- Sentiment analysis for mood suggestions
- Topic extraction and entity recognition
- Content classification and auto-tagging

**RAG System**:

- Chunking strategies for optimal retrieval
- Query performance tracking and optimization
- Content versioning for automatic re-embedding

### 3.3. Performance Considerations

**Database Optimization**:

- Specialized indexes for vector similarity and full-text search
- Partitioning strategies for large content tables
- Connection pooling and query optimization

**Caching Strategy**:

- Embedding cache to avoid re-computation
- Query result caching for frequently accessed content
- User session and preference caching

**Scalability**:

- Horizontal scaling support for AI processing
- Async job processing for content analysis
- CDN integration for media files

---

This backend specification provides the foundation for a scalable, AI-powered second brain application with advanced RAG capabilities, comprehensive mood tracking, and intelligent content organization. For detailed API endpoints and database schema implementations, refer to the backend project documentation.
