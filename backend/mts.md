# Secure Multi-Tenant Vault API

A barebones API-first backend built with Go, `net/http`, PostgreSQL, Redis, Cloudflare R2, Clerk auth verification, and Stripe only if billing is required.

The goal is to keep the project simple, secure, and easy to reason about:
- No framework
- No ORM
- No unnecessary abstractions
- Clear separation of concerns
- Strong multi-tenant isolation by organization

## Product scope

This project supports:
- Organizations as tenant boundaries
- Members with roles inside an organization
- Encrypted secrets storage
- Secure file metadata + file storage in Cloudflare R2
- Audit logs
- Redis-based rate limiting
- Expiration cleanup for secrets/files
- Optional Stripe subscription support

This project does **not** include:
- Microservices
- Event buses
- CQRS
- Outbox pattern
- API tokens
- Websocket features
- Complex worker orchestration
- ORM-generated models

## Core architecture

Use a simple layered design:

1. HTTP layer
   - Routing
   - Middleware
   - Request/response handling

2. Service layer
   - Business logic
   - Validation
   - Authorization checks
   - Transaction boundaries

3. Repository layer
   - Raw SQL queries
   - PostgreSQL access only

4. External adapters
   - Redis
   - Cloudflare R2
   - Clerk token verification
   - Stripe

Rule:
- Handlers call services
- Services call repositories/adapters
- Repositories never contain business logic

## Folder structure

project/
├── cmd/
│   └── api/
│       └── main.go
├── internal/
│   ├── config/
│   │   └── config.go
│   ├── http/
│   │   ├── router.go
│   │   ├── middleware/
│   │   │   ├── auth.go
│   │   │   ├── org.go
│   │   │   ├── rbac.go
│   │   │   ├── ratelimit.go
│   │   │   ├── logging.go
│   │   │   ├── recovery.go
│   │   │   └── request_id.go
│   │   └── handlers/
│   │       ├── health.go
│   │       ├── organizations.go
│   │       ├── members.go
│   │       ├── secrets.go
│   │       ├── files.go
│   │       ├── audit_logs.go
│   │       ├── billing.go
│   │       └── webhooks.go
│   ├── domain/
│   │   ├── models/
│   │   │   ├── organization.go
│   │   │   ├── user.go
│   │   │   ├── member.go
│   │   │   ├── secret.go
│   │   │   ├── file.go
│   │   │   ├── audit_log.go
│   │   │   └── subscription.go
│   │   ├── services/
│   │   │   ├── organization_service.go
│   │   │   ├── member_service.go
│   │   │   ├── secret_service.go
│   │   │   ├── file_service.go
│   │   │   ├── audit_service.go
│   │   │   └── billing_service.go
│   │   └── repositories/
│   │       ├── organization_repository.go
│   │       ├── member_repository.go
│   │       ├── secret_repository.go
│   │       ├── file_repository.go
│   │       ├── audit_repository.go
│   │       └── subscription_repository.go
│   ├── store/
│   │   ├── postgres/
│   │   │   ├── db.go
│   │   │   ├── organization_store.go
│   │   │   ├── member_store.go
│   │   │   ├── secret_store.go
│   │   │   ├── file_store.go
│   │   │   ├── audit_store.go
│   │   │   └── subscription_store.go
│   │   └── migrations/
│   ├── adapters/
│   │   ├── redis.go
│   │   ├── r2.go
│   │   ├── clerk.go
│   │   └── stripe.go
│   ├── crypto/
│   │   └── aead.go
│   └── jobs/
│       └── cleanup.go
├── docs/
│   └── schema.dbml
└── Makefile

## Why this structure

- `http/` handles transport only
- `domain/models/` defines data shapes
- `domain/services/` contains the app rules
- `domain/repositories/` defines database contracts
- `store/postgres/` implements raw SQL
- `adapters/` holds SDK integrations
- `jobs/cleanup.go` is the only background job because expiration cleanup is required

This is enough separation without becoming over-engineered.

## Multi-tenant model

Everything belongs to an organization.

Rules:
- Every tenant-owned record has `organization_id`
- Every query for secrets, files, members, and audit logs must filter by `organization_id`
- The authenticated user must also be a member of that organization
- Role checks happen after membership is confirmed

This keeps tenant isolation simple and explicit.

## Roles

Use only these roles:
- `owner`
- `admin`
- `member`

Permissions:
- `owner`: full control
- `admin`: manage members, secrets, files, audit logs
- `member`: create/read/update own allowed resources depending on business rules

Keep RBAC small at first. More roles can be added later only if truly needed.

## Core models

### Organization

Purpose:
- Tenant boundary

Fields:
- id
- name
- slug
- created_at
- updated_at

### User

Purpose:
- Maps Clerk user to internal app user

Fields:
- id
- clerk_user_id
- email
- display_name
- created_at
- updated_at

### Member

Purpose:
- User membership inside an organization

Fields:
- id
- organization_id
- user_id
- role
- created_at

### Secret

Purpose:
- Encrypted secret metadata and encrypted payload

Fields:
- id
- organization_id
- created_by_user_id
- name
- ciphertext
- iv
- auth_tag
- expires_at
- created_at
- updated_at

### File

Purpose:
- File metadata for object stored in R2

Fields:
- id
- organization_id
- uploaded_by_user_id
- object_key
- original_filename
- content_type
- size_bytes
- encrypted_file_key
- iv
- expires_at
- created_at
- updated_at

### AuditLog

Purpose:
- Security event trail

Fields:
- id
- organization_id
- actor_user_id
- action
- resource_type
- resource_id
- ip_address
- user_agent
- created_at

### Subscription

Only keep this if billing is required.

Fields:
- id
- organization_id
- stripe_customer_id
- stripe_subscription_id
- plan
- status
- created_at
- updated_at

## Interfaces

Keep interfaces small.

### OrganizationRepository
- Create
- GetByID
- GetBySlug

### MemberRepository
- Add
- GetByUserAndOrg
- ListByOrg
- UpdateRole
- Remove

### SecretRepository
- Create
- GetByID
- ListByOrg
- Update
- DeleteExpired

### FileRepository
- Create
- GetByID
- ListByOrg
- Update
- DeleteExpired

### AuditRepository
- Create
- ListByOrg

### SubscriptionRepository
- Upsert
- GetByOrgID

## Service responsibilities

### OrganizationService
- Create organization
- Create owner membership
- Check slug uniqueness

### MemberService
- Add member
- Change role
- Remove member
- Prevent invalid self-removal of only owner

### SecretService
- Validate input
- Store encrypted secret fields
- Enforce expiration checks
- Write audit log

### FileService
- Create file record
- Generate upload key
- Return presigned upload/download URLs
- Enforce expiration checks
- Write audit log

### AuditService
- Write and list audit events

### BillingService
Only if required:
- Create checkout session
- Process Stripe webhook
- Update subscription state

## Request flow

### Auth flow

1. Client authenticates with Clerk
2. Client sends bearer token to API
3. API verifies token
4. API extracts user identity
5. API resolves current organization
6. API checks membership
7. API checks role
8. Handler executes action

### Secret creation flow

1. Request hits `POST /v1/secrets`
2. Auth middleware verifies token
3. Org middleware loads membership
4. Rate limit middleware checks Redis
5. Handler validates body
6. Service stores secret row
7. Audit log row is inserted
8. API returns created secret metadata

### File upload flow

1. Request hits `POST /v1/files/init`
2. Auth/org/rate limit checks run
3. Handler validates filename, size, content type
4. Service generates unique object key
5. Service creates DB record
6. Service returns presigned R2 upload URL
7. Client uploads directly to R2
8. API may optionally confirm upload with a finalize endpoint

### Cleanup flow

1. A scheduled job runs periodically
2. It finds expired secrets
3. It deletes or marks them expired
4. It finds expired files
5. It deletes matching objects from R2
6. It writes audit entries if needed

## Goroutines

Keep goroutines minimal.

Use them only for:
- Running the cleanup job on a schedule
- Graceful server shutdown
- Optional non-blocking audit logging only if you can guarantee errors are handled safely

Do not use goroutines for core request business logic at first.
Keep request handling simple and synchronous.

## Middleware chain

Recommended middleware order:

1. Request ID
2. Logging
3. Recovery
4. Auth
5. Organization resolution
6. RBAC
7. Rate limit
8. Handler

## Core endpoints

GET    /v1/health

POST   /v1/organizations
GET    /v1/organizations/:id

GET    /v1/members
POST   /v1/members
PATCH  /v1/members/:userId/role
DELETE /v1/members/:userId

GET    /v1/secrets
POST   /v1/secrets
GET    /v1/secrets/:id
PATCH  /v1/secrets/:id
DELETE /v1/secrets/:id

GET    /v1/files
POST   /v1/files/init
GET    /v1/files/:id
POST   /v1/files/:id/download-url
DELETE /v1/files/:id

GET    /v1/audit-logs

POST   /v1/billing/checkout
POST   /v1/webhooks/stripe

Remove billing endpoints entirely if billing is not part of version 1.

## DBML

```dbml
Project secure_vault_core {
  database_type: "PostgreSQL"
}

Enum member_role {
  owner
  admin
  member
}

Table organizations {
  id uuid [pk]
  name varchar(120) [not null]
  slug varchar(64) [not null, unique]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    slug [unique]
  }
}

Table users {
  id uuid [pk]
  clerk_user_id varchar(128) [not null, unique]
  email varchar(255) [not null]
  display_name varchar(120]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    clerk_user_id [unique]
    email
  }
}

Table members {
  id uuid [pk]
  organization_id uuid [not null, ref: > organizations.id]
  user_id uuid [not null, ref: > users.id]
  role member_role [not null, default: 'member']
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (organization_id, user_id) [unique]
    (organization_id, role)
    user_id
  }
}

Table secrets {
  id uuid [pk]
  organization_id uuid [not null, ref: > organizations.id]
  created_by_user_id uuid [not null, ref: > users.id]
  name varchar(160) [not null]
  ciphertext text [not null]
  iv varchar(128) [not null]
  auth_tag varchar(128) [not null]
  expires_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (organization_id, id) [unique]
    (organization_id, name)
    (organization_id, expires_at)
  }
}

Table files {
  id uuid [pk]
  organization_id uuid [not null, ref: > organizations.id]
  uploaded_by_user_id uuid [not null, ref: > users.id]
  object_key varchar(1024) [not null]
  original_filename varchar(255) [not null]
  content_type varchar(160)
  size_bytes bigint [not null]
  encrypted_file_key text [not null]
  iv varchar(128) [not null]
  expires_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (organization_id, id) [unique]
    (organization_id, object_key) [unique]
    (organization_id, expires_at)
  }
}

Table audit_logs {
  id uuid [pk]
  organization_id uuid [not null, ref: > organizations.id]
  actor_user_id uuid [not null, ref: > users.id]
  action varchar(120) [not null]
  resource_type varchar(64) [not null]
  resource_id uuid
  ip_address inet
  user_agent text
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (organization_id, created_at)
    (organization_id, action, created_at)
  }
}

Table subscriptions {
  id uuid [pk]
  organization_id uuid [not null, unique, ref: > organizations.id]
  stripe_customer_id varchar(128) [not null]
  stripe_subscription_id varchar(128)
  plan varchar(32) [not null]
  status varchar(32) [not null]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    organization_id [unique]
    stripe_customer_id
    stripe_subscription_id
  }
}
```

## Notes on DB design

- `organization_id` exists on every tenant-owned table
- `members` is the join table for user access
- `secrets` stores encrypted payload fields only
- `files` stores metadata only; actual file bytes live in R2
- `audit_logs` is append-only
- `subscriptions` is optional and should be removed if you want the simplest possible version

## Basic structs to implement

### AuthClaims
Fields:
- user_id
- clerk_user_id
- organization_id
- role

### Organization
Fields:
- id
- name
- slug
- created_at
- updated_at

### User
Fields:
- id
- clerk_user_id
- email
- display_name
- created_at
- updated_at

### Member
Fields:
- id
- organization_id
- user_id
- role
- created_at

### Secret
Fields:
- id
- organization_id
- created_by_user_id
- name
- ciphertext
- iv
- auth_tag
- expires_at
- created_at
- updated_at

### File
Fields:
- id
- organization_id
- uploaded_by_user_id
- object_key
- original_filename
- content_type
- size_bytes
- encrypted_file_key
- iv
- expires_at
- created_at
- updated_at

### AuditLog
Fields:
- id
- organization_id
- actor_user_id
- action
- resource_type
- resource_id
- ip_address
- user_agent
- created_at

### Subscription
Only if needed:
- id
- organization_id
- stripe_customer_id
- stripe_subscription_id
- plan
- status
- created_at
- updated_at

## Basic methods to implement

### Organization methods
- Validate()
- NormalizeSlug()

### Member methods
- IsOwner()
- IsAdmin()

### Secret methods
- IsExpired(now)
- CanAccess(role)

### File methods
- IsExpired(now)

### Subscription methods
- IsActive()

Keep model methods tiny. Business logic should stay mostly in services.

## Minimal external integrations

### Clerk
Use only for:
- Verifying user identity
- Mapping external auth user to internal user

### Redis
Use only for:
- Rate limiting

### Cloudflare R2
Use only for:
- Upload/download object storage

### Stripe
Use only for:
- Checkout
- Webhook subscription updates

If billing is not required now, remove Stripe entirely.

## Security basics

- Never store plaintext secrets
- Never store raw encryption keys in logs
- Scope every query by `organization_id`
- Use short-lived presigned URLs
- Rate limit auth-sensitive endpoints
- Validate content size and type for file uploads
- Log security-sensitive actions in `audit_logs`

## Performance basics

- Use connection pooling for Postgres
- Use indexes with `organization_id`
- Keep handlers thin
- Keep SQL explicit
- Keep Redis keys simple
- Avoid unnecessary goroutines

## Final build recommendation

If you want the cleanest version of this project, keep only:
- organizations
- users
- members
- secrets
- files
- audit_logs

Then add:
- Redis rate limiting

Then optionally add:
- Stripe subscriptions

That gives you a strong, understandable, production-style backend without overbuilding.