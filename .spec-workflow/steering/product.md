# Product Steering

## Vision & Mission

**Vision**: Make creating and browsing nooklets as quick as jotting a note, but organized, searchable, and shareable with fine-grained privacy.

**Mission**: Nooklet is an AI-powered "second brain" application that seamlessly integrates journaling with intelligent resource management. We enable creators to capture, organize, and surface their thoughts through structured "nooklets" (short posts/entries) in a personal timeline with robust privacy controls.

**Problem Statement**: Creators need a simple, fast way to publish and curate nooklets and surface them in a personal timeline, with clear privacy controls and safe archiving.

## Target Users

### Primary Personas

**Creator** (Primary User)
- Wants quick capture and light structure for thoughts and ideas
- Values control over visibility and privacy settings
- Needs fast, friction-free publishing experience
- Expects organized, searchable content management

**Viewer** (Secondary User)  
- Skims a creator's public timeline
- Expects fast loads and clean presentation
- Browses nooklet detail views

**Admin** (Internal User)
- Needs auditability and recovery tools
- Manages soft-deleted data and system health

## User Experience Principles

### Core UX Guidelines

**Speed & Simplicity**
- TTFN (Time to First Nooklet) < 3 minutes for new users
- Minimal friction in creation and publishing workflow
- Clean, low-friction dashboard with intuitive navigation

**Privacy & Control**
- Robust privacy controls: public/private with future limited audiences
- Clear visibility indicators and settings
- Safe archiving with soft-delete everywhere for recoverability

**Organization & Discovery**
- Reverse-chronological timeline as primary interface
- Tag-based organization and filtering
- Searchable content (future: semantic search with AI)

### Design System Principles

**Minimal & Clean Interface**
- Focus on content, minimal chrome
- Dark theme compatibility built-in
- Tailwind CSS v4 with CSS-first approach

**Accessibility Standards**
- WCAG AA compliance targets
- Keyboard-friendly navigation
- Focus styles and screen reader support

### Performance Standards

- p95 API latency < 200ms for core endpoints
- 99.9% uptime SLO
- Efficient pagination for timeline views
- Graceful degradation on service unavailability

## Feature Priorities

### Must-Have Features (MVP)

**Core Journaling**
- Nooklet CRUD: create, edit, publish, soft-delete, restore
- Title (required) + body (optional) + tags (optional)
- Privacy controls: public/private

**Dashboard & Timeline**
- Top navigation + timeline list of nooklets
- Reverse-chronological ordering with pagination
- Filter by tag and privacy (self view)

**Authentication & User Management**
- Register, login, refresh, logout
- Access token-based authentication
- User profiles with basic settings

**Tagging System**
- Create and manage personal tags
- Assign tags to nooklets
- Tag-based filtering and organization

### Nice-to-Have Features (Post-MVP)

**Enhanced Privacy**
- Limited audience sharing (specific users/groups)
- Granular privacy controls per nooklet

**Content Management**
- Collections for grouping nooklets
- Bookmarks for external articles/videos
- Import/export functionality

**AI-Powered Features**
- Semantic search across nooklets
- Auto-tagging based on content
- Mood tracking and analysis
- Content recommendations

### Future Roadmap Items

**Advanced Features**
- Multi-modal content (voice notes, images)
- Rich collaboration (comments, mentions)
- Real-time multi-user editing
- Mobile applications

**Analytics & Insights**
- Personal analytics dashboard
- Content performance metrics
- Usage patterns and insights

## Success Metrics

### Activation Metrics
- **Primary**: % of signups creating ≥1 nooklet within 24h (target ≥40%)
- Time to first nooklet < 3 minutes
- Registration completion rate

### Engagement Metrics
- **Primary**: Median nooklets/user in week 1 (target ≥3)
- Daily/weekly active users
- Average session duration
- Nooklets created per session

### Retention Metrics
- **Primary**: D7 creator retention (target ≥20%)
- D30 retention rate
- Monthly recurring usage

### Quality Metrics
- **Primary**: p95 API latency < 200ms
- 99.9% uptime SLO
- Error rates and recovery times
- User satisfaction scores

### Product-Market Fit Indicators
- Organic user growth rate
- Feature adoption rates
- User feedback sentiment
- Referral rates

## Content Strategy

### Nooklet Types
- **Journal**: Traditional diary-style entries
- **Quick Capture**: Brief thoughts and ideas
- **Voice**: Audio recordings (future)

### Content Guidelines
- Encourage authentic, personal expression
- Support both structured and free-form content
- Enable easy organization through tags and collections

### Privacy Philosophy
- Privacy-first approach with sensible defaults
- User control over all sharing decisions
- Transparent data handling and retention policies

## Competitive Positioning

### Key Differentiators
- **Speed**: Fastest time to publish among journaling apps
- **Privacy**: Granular control with safe archiving
- **AI Integration**: Intelligent content management and discovery
- **Simplicity**: Minimal interface focused on content creation

### Competitive Advantages
- Domain-driven architecture for rapid feature development
- Spec-driven development for consistent quality
- Modern tech stack optimized for performance
- Built-in AI readiness for future enhancements

## Risk Mitigation

### Product Risks
- **Scope Creep**: Enforce MVP boundaries; maintain parking lot for future features
- **User Adoption**: Focus on TTFN and activation metrics
- **Privacy Concerns**: Transparent policies and user control

### Technical Risks
- **Performance**: Continuous monitoring and optimization
- **Scalability**: Architecture designed for growth
- **Data Loss**: Comprehensive backup and soft-delete strategies

## Future Vision

**Long-term Goal**: Become the definitive platform for personal knowledge management, combining the simplicity of journaling with the power of AI-assisted organization and discovery.

**AI Integration Roadmap**:
- Semantic search and content discovery
- Intelligent auto-tagging and categorization
- Mood and sentiment analysis
- Personalized content recommendations
- RAG-powered insights and connections