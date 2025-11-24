# AI Implementation (Saved for Later)

This directory contains the AI-powered content generation workflow that was implemented for The Alchemy Table Library. These files have been preserved for future re-implementation.

## Overview

The AI workflow automatically generates draft content when new Log or Grimoire entries are created with `status = "pending_ai"`. It includes:

1. **OpenAI Integration** - Generates content drafts based on title and context
2. **Email Notifications** - Sends admin notifications when drafts are ready
3. **Approval Workflow** - Custom endpoints for approve/reject/regenerate actions
4. **Lifecycle Hooks** - Automatically triggers AI generation on entry creation

## Saved Files

### Services
- `services/ai.ts` - OpenAI API integration for content generation
- `services/email.ts` - Nodemailer email notification service

### API Components
- `api/grimoire/` - Grimoire content type with AI workflow
  - `content-types/grimoire/lifecycles.ts` - Lifecycle hooks for AI generation
  - `content-types/grimoire/schema.json` - Schema with AI workflow fields
  - `controllers/grimoire.ts` - Custom controller with approve/reject/regenerate
  - `routes/custom-routes.ts` - Custom API routes

- `api/log/` - Log content type with AI workflow
  - `content-types/log/lifecycles.ts` - Lifecycle hooks for AI generation
  - `content-types/log/schema.json` - Schema with AI workflow fields
  - `controllers/log.ts` - Custom controller with approve/reject/regenerate
  - `routes/custom-routes.ts` - Custom API routes

### Documentation
- `AI_WORKFLOW.md` - Complete implementation guide

## Dependencies Required

To re-enable AI functionality, add these to `package.json`:

```json
{
  "dependencies": {
    "openai": "^4.77.3",
    "nodemailer": "^6.9.16"
  },
  "devDependencies": {
    "@types/nodemailer": "^6.4.17"
  }
}
```

## Environment Variables Required

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4-turbo-preview

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM="Alchemy Library" <noreply@alchemy-library.com>
ADMIN_EMAIL=admin@alchemy-library.com
```

## Re-Implementation Steps

1. Install dependencies: `npm install openai nodemailer @types/nodemailer`
2. Copy service files to `src/services/`
3. Replace controller files in `src/api/grimoire/controllers/` and `src/api/log/controllers/`
4. Copy custom route files to `src/api/grimoire/routes/` and `src/api/log/routes/`
5. Copy lifecycle files to content-types directories
6. Update schema files with AI workflow fields
7. Set environment variables
8. Clear cache and rebuild: `npm run clear-cache`
