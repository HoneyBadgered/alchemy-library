# Strapi Backend Setup Guide for The Alchemy Table Library

## Overview

This guide provides complete instructions for setting up, configuring, and deploying the Strapi backend for The Alchemy Table Library, which manages two content types: **Log** (short-form posts) and **Grimoire** (long-form articles).

## Table of Contents

1. [Installation](#installation)
2. [Database Configuration](#database-configuration)
3. [CORS Configuration](#cors-configuration)
4. [Collection Types](#collection-types)
5. [API Configuration](#api-configuration)
6. [AI Workflow](#ai-workflow)
7. [Deployment](#deployment)

---

## Installation

### Prerequisites

- Node.js >= 18.0.0 and <= 22.x.x
- npm >= 6.0.0
- Git

### Local Development Setup

1. **Navigate to the backend directory:**

```bash
cd backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create environment file:**

```bash
cp .env.example .env
```

4. **Configure your `.env` file:**

```env
# Server
HOST=0.0.0.0
PORT=1337

# Secrets
APP_KEYS=your-app-key-1,your-app-key-2
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# Database - SQLite (Development)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email Configuration (for AI workflow notifications)
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_USERNAME=your-email@example.com
SMTP_PASSWORD=your-email-password
EMAIL_FROM=noreply@alchemy-library.com
ADMIN_EMAIL=admin@alchemy-library.com

# OpenAI Configuration (for AI draft generation)
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4-turbo-preview

# Base URLs
BASE_URL=http://localhost:1337
FRONTEND_BASE_URL=http://localhost:5173
```

5. **Generate secret keys:**

```bash
# You can generate secure random strings using:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

6. **Start the development server:**

```bash
npm run develop
```

7. **Access the admin panel:**

Open your browser to `http://localhost:1337/admin` and create your first admin user.

8. **If status dropdown is missing options (only shows 3 instead of 5 statuses):**

This issue occurs when the database schema doesn't match the current schema definitions. You need to reset the database in development:

```bash
# DEVELOPMENT ONLY - This deletes all data!
npm run reset-db
npm run clear-cache
npm run develop
```

After restarting Strapi, you'll need to create a new admin user. The status dropdown will now show all 5 values: `draft`, `pending_ai`, `draft_ready`, `needs_changes`, `published`.

**Note:** In production, you would need to run a database migration instead of resetting the database.

---

## Database Configuration

### SQLite (Development)

SQLite is used for local development and requires no additional setup. The database file is stored in `.tmp/data.db`.

**Configuration file:** `config/database.ts`

```typescript
export default ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: env('DATABASE_FILENAME', '.tmp/data.db'),
    },
    useNullAsDefault: true,
  },
});
```

### PostgreSQL (Production)

For production, use PostgreSQL for better performance and reliability.

1. **Install pg package:**

```bash
npm install pg
```

2. **Update your production `.env`:**

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=your-postgres-host.com
DATABASE_PORT=5432
DATABASE_NAME=alchemy_library
DATABASE_USERNAME=your-db-username
DATABASE_PASSWORD=your-db-password
DATABASE_SSL=true
```

3. **Configuration file:** `config/database.ts`

```typescript
export default ({ env }) => {
  if (env('DATABASE_CLIENT') === 'postgres') {
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: env('DATABASE_HOST', 'localhost'),
          port: env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME', 'strapi'),
          user: env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', 'strapi'),
          ssl: env.bool('DATABASE_SSL', false) && {
            rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
          },
        },
        debug: false,
      },
    };
  }

  // SQLite for development
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: env('DATABASE_FILENAME', '.tmp/data.db'),
      },
      useNullAsDefault: true,
    },
  };
};
```

---

## CORS Configuration

To allow your React frontend to communicate with Strapi, configure CORS properly.

**Configuration file:** `config/middlewares.ts`

```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:5173', // Vite dev server
        'http://localhost:4173', // Vite preview
        process.env.FRONTEND_URL || 'http://localhost:5173',
        // Add your production domain(s)
        // 'https://yourdomain.com',
      ],
      headers: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

---

## Collection Types

### Collection Type Structure

The Alchemy Table Library uses three collection types:

1. **Log** - Short-form posts
2. **Grimoire** - Long-form articles
3. **Tag** - Shared tags for categorization

### Creating Collection Types

#### Method 1: Using Strapi Admin Panel

1. **Start your Strapi server:**
   ```bash
   npm run develop
   ```

2. **Access the admin panel:**
   Open `http://localhost:1337/admin`

3. **Navigate to Content-Type Builder:**
   Click on "Content-Type Builder" in the left sidebar

4. **Create each collection type** as detailed below

#### Method 2: Using Schema Files

The schema files are located in `src/api/[collection-name]/content-types/[collection-name]/schema.json`. See the [Schema Definitions](#schema-definitions) section below for complete schema files.

---

### Schema Definitions

#### Log Collection Type

**Location:** `src/api/log/content-types/log/schema.json`

```json
{
  "kind": "collectionType",
  "collectionName": "logs",
  "info": {
    "singularName": "log",
    "pluralName": "logs",
    "displayName": "Log",
    "description": "Short-form posts, updates, and announcements"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "minLength": 3,
      "maxLength": 200
    },
    "slug": {
      "type": "uid",
      "targetField": "title",
      "required": true
    },
    "postType": {
      "type": "string",
      "default": "log",
      "private": false
    },
    "status": {
      "type": "enumeration",
      "enum": ["pending_ai", "draft_ready", "needs_changes", "published"],
      "default": "pending_ai",
      "required": true
    },
    "draftBody": {
      "type": "richtext"
    },
    "publishedBody": {
      "type": "richtext"
    },
    "excerpt": {
      "type": "text",
      "maxLength": 500
    },
    "author": {
      "type": "string"
    },
    "tags": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::tag.tag",
      "inversedBy": "logs"
    }
  }
}
```

#### Grimoire Collection Type

**Location:** `src/api/grimoire/content-types/grimoire/schema.json`

```json
{
  "kind": "collectionType",
  "collectionName": "grimoires",
  "info": {
    "singularName": "grimoire",
    "pluralName": "grimoires",
    "displayName": "Grimoire",
    "description": "Long-form articles, guides, and educational content"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "minLength": 3,
      "maxLength": 200
    },
    "slug": {
      "type": "uid",
      "targetField": "title",
      "required": true
    },
    "postType": {
      "type": "string",
      "default": "grimoire",
      "private": false
    },
    "status": {
      "type": "enumeration",
      "enum": ["pending_ai", "draft_ready", "needs_changes", "published"],
      "default": "pending_ai",
      "required": true
    },
    "draftBody": {
      "type": "richtext"
    },
    "publishedBody": {
      "type": "richtext"
    },
    "excerpt": {
      "type": "text",
      "maxLength": 500
    },
    "author": {
      "type": "string"
    },
    "heroImage": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    },
    "tags": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::tag.tag",
      "inversedBy": "grimoires"
    },
    "category": {
      "type": "string"
    }
  }
}
```

#### Tag Collection Type

**Location:** `src/api/tag/content-types/tag/schema.json`

```json
{
  "kind": "collectionType",
  "collectionName": "tags",
  "info": {
    "singularName": "tag",
    "pluralName": "tags",
    "displayName": "Tag",
    "description": "Tags for categorizing Log and Grimoire entries"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "name": {
      "type": "string",
      "required": true,
      "unique": true,
      "minLength": 2,
      "maxLength": 50
    },
    "slug": {
      "type": "uid",
      "targetField": "name",
      "required": true
    },
    "logs": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::log.log",
      "mappedBy": "tags"
    },
    "grimoires": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::grimoire.grimoire",
      "mappedBy": "tags"
    }
  }
}
```

---

## Permissions Configuration

### Public Access (Read-Only for Published Content)

1. **Navigate to Settings → Users & Permissions plugin → Roles → Public**

2. **Configure Log permissions:**
   - ✅ `find` (list all logs)
   - ✅ `findOne` (get single log by ID)

3. **Configure Grimoire permissions:**
   - ✅ `find` (list all grimoires)
   - ✅ `findOne` (get single grimoire by ID)

4. **Configure Tag permissions:**
   - ✅ `find` (list all tags)
   - ✅ `findOne` (get single tag by ID)

### Authenticated Access (Admin Users)

1. **Navigate to Settings → Users & Permissions plugin → Roles → Authenticated**

2. **Configure all collection permissions:**
   - ✅ All CRUD operations (create, find, findOne, update, delete)
   - ✅ Custom routes (approve, reject, etc.)

---

## Next Steps

After completing this setup:

1. ✅ Read the [API Routes Documentation](./API_ROUTES.md) for endpoint details
2. ✅ Review the [AI Workflow Guide](./AI_WORKFLOW.md) for automation setup
3. ✅ Check the [Frontend Integration Guide](./FRONTEND_INTEGRATION.md) for React setup
4. ✅ See the [Deployment Guide](./DEPLOYMENT.md) for production deployment

---

## Troubleshooting

### Port already in use
```bash
# Change the port in .env
PORT=1338
```

### Database connection errors
```bash
# Reset the database (DEVELOPMENT ONLY!)
rm -rf .tmp/data.db
npm run develop
```

### CORS errors
- Verify `FRONTEND_URL` in `.env`
- Check `config/middlewares.ts` includes your frontend URL
- Clear browser cache

### Permission errors
- Check Settings → Users & Permissions → Roles
- Ensure Public role has `find` and `findOne` enabled for published content

### Admin panel not showing all status options

If the admin panel dropdown is only showing "draft", "draft_ready", and "pending_ai" instead of all 5 status values ("draft", "pending_ai", "draft_ready", "needs_changes", "published"):

**Root Cause:** This happens when the database schema was created with an older version of the schema that had fewer enum values. Strapi doesn't automatically update database constraints when you change enum values in schema.json.

**Solution (Development):** Reset the database and clear cache:

```bash
# DEVELOPMENT ONLY - Deletes all data!
npm run reset-db
npm run clear-cache
npm run develop
```

After Strapi restarts, create a new admin user. All 5 status options will now appear.

**Solution (Production):** For production databases with existing data, consult the Strapi documentation on [database migrations](https://docs.strapi.io/) or contact your database administrator. Enum constraints must be updated at the database level.

**Alternative:** Use the interactive script:
```bash
chmod +x clear-cache.sh  # Only needed once
./clear-cache.sh  # Will prompt you to reset database
```

---

## Additional Resources

- [Strapi Documentation](https://docs.strapi.io)
- [Strapi Discord Community](https://discord.strapi.io)
- [Project Repository](https://github.com/HoneyBadgered/alchemy-library)
