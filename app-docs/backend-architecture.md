## Nooklet — Backend Architecture (AdonisJS v6)

### Essential Non-Standard Patterns (from skedai-adonisjs)

**Domain-Driven Structure**: `app/features/*` instead of typical `app/controllers/`, `app/models/`
**UUID Primary Keys**: All models use UUID instead of auto-increment integers
**Soft-Delete Strategy**: Custom implementation using `is_archived` flags + `deletedAt` timestamps
**Auth Separation**: `auth_users` (credentials) + `profiles` (user data) split
**JSONB Metadata**: Flexible schema using PostgreSQL JSONB for extensibility
**AI Integration Points**: Prepared for vector embeddings, semantic search, content analysis
**Biome Tooling**: Replace ESLint/Prettier with Biome for linting and formatting

### Key Directory Structure

```text
app/
├── features/                      # Domain-driven (non-standard)
│   ├── auth/                      # Auth + Profile separation
│   ├── nooklet/                   # Core journaling
│   ├── tag/                       # Tagging system
│   └── ai/                        # Future: embeddings, analysis
├── models/
│   └── base_model.ts              # UUID PKs, custom serialization
└── middleware/
    └── auth_middleware.ts         # Access token guards

database/
├── migrations/                    # UUID PKs, JSONB columns
└── factories/                     # Test data generation
```

### Key Dependencies

**Core**: @adonisjs/core, @adonisjs/lucid, @adonisjs/auth, @vinejs/vine
**Database**: pg (PostgreSQL), future: pgvector for AI embeddings
**Tooling**: @biomejs/biome (replaces ESLint + Prettier)
**Soft-Delete**: Custom implementation (not adonis-lucid-soft-deletes)

### BaseModel (UUID + Custom Serialization)

```typescript
// app/models/base_model.ts
import { BaseModel as LucidBaseModel } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class BaseModel extends LucidBaseModel {
  // UUID primary keys by default
  public static primaryKey = 'id'

  // Custom DateTime serialization to ISO strings
  public serialize() {
    const json = super.serialize()
    for (const key of Object.keys(json)) {
      const value = this[key as keyof this]
      if (value instanceof DateTime) {
        json[key] = value.toISO()
      }
    }
    return json
  }
}
```

### Auth Separation Pattern (Non-Standard)

```typescript
// app/features/auth/models/auth_user.ts - Credentials only
export default class AuthUser extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string
}

// app/features/user/models/profile.ts - User data
export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare authUserId: string

  @column()
  declare username: string

  @column()
  declare displayName: string
}
```

### Nooklet Model (JSONB + Soft-Delete)

```typescript
// app/features/nooklet/models/nooklet.ts
export default class Nooklet extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare type: 'journal' | 'voice' | 'quick_capture'

  @column()
  declare title: string

  @column()
  declare content: string

  @column()
  declare metadata: Record<string, any> // JSONB for flexibility

  @column()
  declare isArchived: boolean // Soft-delete via flag

  @column.dateTime()
  declare deletedAt: DateTime | null // Additional soft-delete timestamp

  @manyToMany(() => Tag, { pivotTable: 'nooklet_tags' })
  declare tags: ManyToMany<typeof Tag>
}
```

### Soft-Delete Strategy (Custom Implementation)

**Dual Approach**: `isArchived` boolean flag + `deletedAt` timestamp
**User-Facing**: Archive/unarchive via `isArchived` flag
**Admin/Audit**: Hard deletes set `deletedAt` timestamp
**Queries**: Default scopes exclude both archived and deleted items

### AI Integration Points (Future)

**Vector Embeddings**: Add `embedding` column (vector type) to nooklets table
**Semantic Search**: pgvector extension for similarity queries
**Content Analysis**: AI service integration for auto-tagging, mood detection
**RAG System**: Chunk storage and retrieval for contextual AI responses

### Domain-Driven Service Pattern

**Dependency Injection**: `@inject()` decorator for service layer
**Feature Organization**: Controllers, services, validators grouped by domain
**Service Layer**: Business logic separated from controllers
**Validation**: VineJS validators per feature, not global

### Database Migrations (UUID + JSONB)

```typescript
// Key migration patterns
table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
table.jsonb('metadata').defaultTo('{}') // Flexible schema
table.boolean('is_archived').defaultTo(false) // Soft-delete flag
table.timestamp('deleted_at').nullable() // Admin soft-delete
```

### Biome Configuration (replaces ESLint + Prettier)

```json
// biome.json
{
  "linter": { "enabled": true },
  "formatter": { "enabled": true },
  "organizeImports": { "enabled": true }
}
```

### Future Considerations

**Inertia Integration**: Server adapter for SSR vs API-only approach
**AI Features**: pgvector extension, embedding storage, semantic search
**Scaling**: Redis caching, queue processing, CDN for media
**Monitoring**: Request IDs, structured logging, metrics collection
