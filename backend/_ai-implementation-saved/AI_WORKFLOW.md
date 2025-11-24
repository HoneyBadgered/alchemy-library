# AI Automation Workflow Guide

## Overview

This guide details the AI-powered workflow for automatically generating draft content when new Log or Grimoire entries are created with `status = "pending_ai"`.

## Workflow Steps

1. **Create Entry** → User creates Log/Grimoire with only a title
2. **Trigger AI** → Lifecycle hook detects `status = "pending_ai"`
3. **Generate Draft** → AI creates content using OpenAI
4. **Update Status** → Changes to `draft_ready`
5. **Send Email** → Admin receives notification with approve/reject links
6. **Review** → Admin reviews draft in Strapi
7. **Approve/Reject** → Admin approves → publishes to site

---

## Architecture

```
┌─────────────────┐
│  Create Entry   │
│  (pending_ai)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Lifecycle Hook  │
│  afterCreate    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   AI Service    │
│  (OpenAI API)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Update Entry   │
│  draft_ready    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Email Service  │
│  Notification   │
└─────────────────┘
```

---

## Implementation

### 1. Lifecycle Hooks

Lifecycle hooks are Strapi's way of executing code before or after CRUD operations.

#### Log Lifecycle Hook

**Location:** `src/api/log/content-types/log/lifecycles.ts`

```typescript
import { sendDraftNotification } from '../../../../services/email';
import { generateDraft } from '../../../../services/ai';

export default {
  async afterCreate(event) {
    const { result } = event;

    // Only process if status is pending_ai
    if (result.status === 'pending_ai') {
      try {
        // Generate AI draft
        const draftContent = await generateDraft({
          title: result.title,
          postType: 'log',
          additionalContext: result.excerpt || '',
        });

        // Update the entry with the generated draft
        await strapi.entityService.update('api::log.log', result.id, {
          data: {
            draftBody: draftContent,
            status: 'draft_ready',
          },
        });

        // Send email notification
        await sendDraftNotification({
          id: result.id,
          title: result.title,
          postType: 'log',
          draftBody: draftContent,
        });

        strapi.log.info(`AI draft generated for Log #${result.id}: ${result.title}`);
      } catch (error) {
        strapi.log.error(`Failed to generate AI draft for Log #${result.id}:`, error);
        
        // Update status to needs_changes on error
        await strapi.entityService.update('api::log.log', result.id, {
          data: {
            status: 'needs_changes',
          },
        });
      }
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    // If status changed to pending_ai (regeneration requested)
    if (result.status === 'pending_ai' && !result.draftBody) {
      try {
        const draftContent = await generateDraft({
          title: result.title,
          postType: 'log',
          additionalContext: result.excerpt || '',
        });

        await strapi.entityService.update('api::log.log', result.id, {
          data: {
            draftBody: draftContent,
            status: 'draft_ready',
          },
        });

        await sendDraftNotification({
          id: result.id,
          title: result.title,
          postType: 'log',
          draftBody: draftContent,
        });

        strapi.log.info(`AI draft regenerated for Log #${result.id}: ${result.title}`);
      } catch (error) {
        strapi.log.error(`Failed to regenerate AI draft for Log #${result.id}:`, error);
      }
    }
  },
};
```

#### Grimoire Lifecycle Hook

**Location:** `src/api/grimoire/content-types/grimoire/lifecycles.ts`

```typescript
import { sendDraftNotification } from '../../../../services/email';
import { generateDraft } from '../../../../services/ai';

export default {
  async afterCreate(event) {
    const { result } = event;

    if (result.status === 'pending_ai') {
      try {
        const draftContent = await generateDraft({
          title: result.title,
          postType: 'grimoire',
          additionalContext: result.excerpt || '',
          category: result.category || '',
        });

        await strapi.entityService.update('api::grimoire.grimoire', result.id, {
          data: {
            draftBody: draftContent,
            status: 'draft_ready',
          },
        });

        await sendDraftNotification({
          id: result.id,
          title: result.title,
          postType: 'grimoire',
          draftBody: draftContent,
        });

        strapi.log.info(`AI draft generated for Grimoire #${result.id}: ${result.title}`);
      } catch (error) {
        strapi.log.error(`Failed to generate AI draft for Grimoire #${result.id}:`, error);
        
        await strapi.entityService.update('api::grimoire.grimoire', result.id, {
          data: {
            status: 'needs_changes',
          },
        });
      }
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    if (result.status === 'pending_ai' && !result.draftBody) {
      try {
        const draftContent = await generateDraft({
          title: result.title,
          postType: 'grimoire',
          additionalContext: result.excerpt || '',
          category: result.category || '',
        });

        await strapi.entityService.update('api::grimoire.grimoire', result.id, {
          data: {
            draftBody: draftContent,
            status: 'draft_ready',
          },
        });

        await sendDraftNotification({
          id: result.id,
          title: result.title,
          postType: 'grimoire',
          draftBody: draftContent,
        });

        strapi.log.info(`AI draft regenerated for Grimoire #${result.id}: ${result.title}`);
      } catch (error) {
        strapi.log.error(`Failed to regenerate AI draft for Grimoire #${result.id}:`, error);
      }
    }
  },
};
```

---

### 2. AI Service (OpenAI Integration)

**Location:** `src/services/ai.ts`

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert content writer for The Alchemy Table Library, a knowledge repository that combines mystical theming with practical, educational content.

The Alchemy Table Library contains two types of posts:

1. **Log**: Short-form posts (300-800 words) for updates, announcements, and casual blog content. These should be conversational, engaging, and concise.

2. **Grimoire**: Long-form articles (1000-3000 words) for guides, tutorials, educational content, and deep dives. These should be comprehensive, well-structured, and authoritative.

Your writing style should:
- Be clear, engaging, and accessible
- Use mystical/alchemical metaphors sparingly and tastefully
- Focus on delivering practical value
- Include relevant examples and explanations
- Use proper markdown formatting with headers, lists, and code blocks where appropriate
- Be SEO-friendly with natural keyword usage

Generate content that is informative, well-researched, and valuable to readers interested in knowledge management, learning, and personal development.`;

interface GenerateDraftParams {
  title: string;
  postType: 'log' | 'grimoire';
  additionalContext?: string;
  category?: string;
  instructions?: string;
}

export async function generateDraft(params: GenerateDraftParams): Promise<string> {
  const { title, postType, additionalContext, category, instructions } = params;

  // Construct user prompt
  let userPrompt = `Generate a ${postType === 'log' ? 'short-form blog post (Log)' : 'comprehensive long-form article (Grimoire)'} with the following title: "${title}"`;

  if (additionalContext) {
    userPrompt += `\n\nAdditional context: ${additionalContext}`;
  }

  if (category && postType === 'grimoire') {
    userPrompt += `\n\nCategory: ${category}`;
  }

  if (instructions) {
    userPrompt += `\n\nSpecial instructions: ${instructions}`;
  }

  if (postType === 'log') {
    userPrompt += '\n\nLength: 300-800 words\nFormat: Conversational and engaging\nStructure: Brief introduction, 2-3 main points, conclusion';
  } else {
    userPrompt += '\n\nLength: 1000-3000 words\nFormat: Comprehensive and authoritative\nStructure: Introduction, multiple detailed sections with subheadings, practical examples, conclusion with key takeaways';
  }

  userPrompt += '\n\nGenerate the content in markdown format with proper headers, formatting, and structure.';

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: postType === 'log' ? 1500 : 4000,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated from OpenAI');
    }

    return content;
  } catch (error) {
    strapi.log.error('OpenAI API error:', error);
    throw new Error(`Failed to generate AI content: ${error.message}`);
  }
}

export async function regenerateDraft(
  params: GenerateDraftParams & { currentDraft?: string }
): Promise<string> {
  const { currentDraft, ...restParams } = params;

  if (currentDraft && restParams.instructions) {
    // If we have a current draft and specific instructions, modify it
    const userPrompt = `Here is the current draft:\n\n${currentDraft}\n\nPlease revise it according to these instructions: ${restParams.instructions}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: restParams.postType === 'log' ? 1500 : 4000,
    });

    return completion.choices[0]?.message?.content || currentDraft;
  }

  // Otherwise, generate a fresh draft
  return generateDraft(restParams);
}
```

---

### 3. Email Service

**Location:** `src/services/email.ts`

```typescript
import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface DraftNotificationParams {
  id: number;
  title: string;
  postType: 'log' | 'grimoire';
  draftBody: string;
}

export async function sendDraftNotification(params: DraftNotificationParams): Promise<void> {
  const { id, title, postType, draftBody } = params;

  const baseUrl = process.env.BASE_URL || 'http://localhost:1337';
  const frontendUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

  // Generate approve/reject URLs
  const approveUrl = `${baseUrl}/api/${postType}s/${id}/approve`;
  const rejectUrl = `${baseUrl}/api/${postType}s/${id}/reject`;
  const editUrl = `${baseUrl}/admin/content-manager/collection-types/api::${postType}.${postType}/${id}`;
  const previewUrl = `${frontendUrl}/library/${postType}/${id}/preview`;

  // Truncate draft for email preview
  const draftPreview = draftBody.substring(0, 500) + (draftBody.length > 500 ? '...' : '');

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Draft Ready: ${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 14px;
      margin-top: 10px;
    }
    .content {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .content h2 {
      margin-top: 0;
      color: #667eea;
    }
    .draft-preview {
      background: white;
      padding: 20px;
      border-left: 4px solid #667eea;
      border-radius: 4px;
      font-size: 14px;
      line-height: 1.8;
      color: #555;
    }
    .actions {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      margin: 0 10px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.3s;
    }
    .button-approve {
      background: #10b981;
      color: white;
    }
    .button-approve:hover {
      background: #059669;
    }
    .button-reject {
      background: #ef4444;
      color: white;
    }
    .button-reject:hover {
      background: #dc2626;
    }
    .button-edit {
      background: #667eea;
      color: white;
    }
    .button-edit:hover {
      background: #5568d3;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .info {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧪 New Draft Ready for Review</h1>
    <div class="badge">${postType.toUpperCase()}</div>
  </div>

  <div class="content">
    <h2>${title}</h2>
    
    <div class="info">
      <strong>📝 AI-Generated Draft</strong><br>
      This draft was automatically created using AI. Please review and edit as needed before publishing.
    </div>

    <h3>Draft Preview:</h3>
    <div class="draft-preview">
      ${draftPreview.replace(/\n/g, '<br>')}
    </div>
  </div>

  <div class="actions">
    <a href="${editUrl}" class="button button-edit">✏️ Edit in Strapi</a>
  </div>

  <div class="actions">
    <a href="${approveUrl}" class="button button-approve">✅ Approve & Publish</a>
    <a href="${rejectUrl}" class="button button-reject">❌ Needs Changes</a>
  </div>

  <div class="footer">
    <p>The Alchemy Table Library</p>
    <p>This is an automated notification from your Strapi CMS.</p>
  </div>
</body>
</html>
`;

  const textContent = `
New Draft Ready for Review
===========================

Type: ${postType.toUpperCase()}
Title: ${title}

Draft Preview:
--------------
${draftPreview}

Actions:
--------
Edit in Strapi: ${editUrl}
Approve & Publish: ${approveUrl}
Needs Changes: ${rejectUrl}

---
The Alchemy Table Library
This is an automated notification from your Strapi CMS.
`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Alchemy Library" <noreply@alchemy-library.com>',
      to: adminEmail,
      subject: `🧪 New Draft Ready: ${title}`,
      text: textContent,
      html: htmlContent,
    });

    strapi.log.info(`Draft notification email sent for ${postType} #${id}`);
  } catch (error) {
    strapi.log.error('Failed to send draft notification email:', error);
    // Don't throw - email failure shouldn't break the workflow
  }
}

export async function sendRejectionNotification(params: {
  id: number;
  title: string;
  postType: 'log' | 'grimoire';
  feedback: string;
}): Promise<void> {
  // Similar implementation for rejection notifications
  // ... (implementation details)
}
```

---

### 4. Custom Controller Routes

**Location:** `src/api/log/routes/custom-routes.ts`

```typescript
export default {
  routes: [
    {
      method: 'PUT',
      path: '/logs/:id/approve',
      handler: 'log.approve',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/logs/:id/reject',
      handler: 'log.reject',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/logs/:id/regenerate',
      handler: 'log.regenerate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
```

**Location:** `src/api/log/controllers/log.ts`

```typescript
import { factories } from '@strapi/strapi';
import { regenerateDraft } from '../../../services/ai';
import { sendDraftNotification } from '../../../services/email';

export default factories.createCoreController('api::log.log', ({ strapi }) => ({
  // Approve draft and publish
  async approve(ctx) {
    const { id } = ctx.params;

    try {
      const entry = await strapi.entityService.findOne('api::log.log', id);

      if (!entry) {
        return ctx.notFound('Log entry not found');
      }

      // Copy draftBody to publishedBody and set status to published
      const updated = await strapi.entityService.update('api::log.log', id, {
        data: {
          publishedBody: entry.draftBody,
          status: 'published',
        },
      });

      return { data: updated };
    } catch (error) {
      strapi.log.error('Error approving log:', error);
      return ctx.badRequest('Failed to approve log');
    }
  },

  // Reject draft
  async reject(ctx) {
    const { id } = ctx.params;
    const { feedback } = ctx.request.body?.data || {};

    try {
      const updated = await strapi.entityService.update('api::log.log', id, {
        data: {
          status: 'needs_changes',
        },
      });

      // Optionally send feedback notification
      // await sendRejectionNotification({ ... });

      return { data: updated };
    } catch (error) {
      strapi.log.error('Error rejecting log:', error);
      return ctx.badRequest('Failed to reject log');
    }
  },

  // Trigger AI regeneration
  async regenerate(ctx) {
    const { id } = ctx.params;
    const { instructions } = ctx.request.body?.data || {};

    try {
      const entry = await strapi.entityService.findOne('api::log.log', id);

      if (!entry) {
        return ctx.notFound('Log entry not found');
      }

      const newDraft = await regenerateDraft({
        title: entry.title,
        postType: 'log',
        additionalContext: entry.excerpt || '',
        instructions,
        currentDraft: entry.draftBody,
      });

      const updated = await strapi.entityService.update('api::log.log', id, {
        data: {
          draftBody: newDraft,
          status: 'draft_ready',
        },
      });

      await sendDraftNotification({
        id,
        title: entry.title,
        postType: 'log',
        draftBody: newDraft,
      });

      return { 
        data: updated,
        message: 'Draft regenerated successfully',
      };
    } catch (error) {
      strapi.log.error('Error regenerating log:', error);
      return ctx.badRequest('Failed to regenerate log');
    }
  },
}));
```

---

## Environment Variables

Add these to your `.env` file:

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

# Base URLs
BASE_URL=http://localhost:1337
FRONTEND_BASE_URL=http://localhost:5173
```

---

## Testing the Workflow

### 1. Create a Test Entry

```bash
curl -X POST 'http://localhost:1337/api/logs' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "data": {
      "title": "Test AI Generated Post",
      "status": "pending_ai"
    }
  }'
```

### 2. Check Email

You should receive an email with:
- Draft preview
- Edit link
- Approve button
- Reject button

### 3. Review in Strapi

Navigate to the admin panel and review the generated draft in `draftBody`.

### 4. Approve

Click the approve link or use:

```bash
curl -X PUT 'http://localhost:1337/api/logs/1/approve' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

---

## Troubleshooting

### No Email Received
- Check SMTP credentials in `.env`
- Verify `ADMIN_EMAIL` is correct
- Check Strapi logs for email errors

### AI Generation Fails
- Verify `OPENAI_API_KEY` is valid
- Check OpenAI API quota/limits
- Review Strapi logs for errors

### Lifecycle Hook Not Firing
- Ensure lifecycle files are in correct location
- Restart Strapi server
- Check console for errors

---

## Next Steps

- ✅ Review [Frontend Integration](./FRONTEND_INTEGRATION.md) for React setup
- ✅ Check [Deployment Guide](./DEPLOYMENT.md) for production
- ✅ See [Admin Workflow](./ADMIN_WORKFLOW.md) for usage instructions

---

## Additional Resources

- [Strapi Lifecycle Hooks Documentation](https://docs.strapi.io/dev-docs/backend-customization/models#lifecycle-hooks)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Nodemailer Documentation](https://nodemailer.com/about/)
