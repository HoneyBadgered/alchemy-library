# Admin Workflow Guide

## Overview

This guide explains how to use the Strapi admin panel to create, manage, and publish content for The Alchemy Table Library using the AI-powered workflow.

## Table of Contents

1. [Accessing the Admin Panel](#accessing-the-admin-panel)
2. [Creating New Content](#creating-new-content)
3. [AI Workflow Process](#ai-workflow-process)
4. [Reviewing and Editing Drafts](#reviewing-and-editing-drafts)
5. [Publishing Content](#publishing-content)
6. [Managing Tags](#managing-tags)
7. [Media Management](#media-management)
8. [Content Organization](#content-organization)

---

## Accessing the Admin Panel

### Login

1. Navigate to `http://localhost:1337/admin` (or your production URL)
2. Enter your admin credentials
3. You'll see the Strapi dashboard

### Dashboard Overview

- **Content Manager**: Create and manage Log/Grimoire entries
- **Content-Type Builder**: Modify content structure (use carefully!)
- **Media Library**: Manage uploaded images
- **Settings**: Configure users, permissions, and plugins

---

## Creating New Content

### Creating a Log Entry (Short-form Post)

#### Step 1: Navigate to Logs

1. Click **Content Manager** in the sidebar
2. Click **Log** under Collection Types
3. Click **Create new entry** button

#### Step 2: Choose Your Workflow

You can create posts in two ways:

**Option A: AI-Generated Content**
```
Title: "Your Post Title Here"
Status: pending_ai (select from dropdown)
Excerpt: Brief description (helps AI understand context) - optional
```

The AI will generate the draft automatically, and you'll receive an email when ready.

**Option B: Manual Content Creation**
```
Title: "Your Post Title Here"
Status: draft (default - select from dropdown)
Draft Body: Write your content directly in the rich text editor
Excerpt: Brief description - optional
Author: Your name - optional
Tags: Select existing tags or create new ones - optional
```

Write your own content without AI assistance. You can publish immediately or save as draft for later editing.

#### Step 3: Save

**For AI-Generated Posts:**
1. Click **Save** button (top right)
2. AI workflow triggers automatically
3. You'll receive an email when draft is ready

**For Manual Posts:**
1. Click **Save** button (top right)
2. Your post is saved as a draft
3. Edit the content as needed
4. Change status to `published` when ready to publish

---

### Creating a Grimoire Entry (Long-form Article)

#### Step 1: Navigate to Grimoires

1. Click **Content Manager** in the sidebar
2. Click **Grimoire** under Collection Types
3. Click **Create new entry** button

#### Step 2: Choose Your Workflow

You can create articles in two ways:

**Option A: AI-Generated Content**
```
Title: "Your Article Title Here"
Status: pending_ai
Category: Choose category (Guides, Technical, Education, etc.) - optional but recommended
Excerpt: Brief description for better AI context - optional
```

The AI will generate comprehensive long-form content automatically.

**Option B: Manual Content Creation**
```
Title: "Your Article Title Here"
Status: draft (default)
Draft Body: Write your content directly in the rich text editor
Category: Choose category - optional
Excerpt: Brief description - optional
Author: Your name - optional
Hero Image: Upload featured image - optional
Tags: Select relevant tags - optional
```

Write your own article without AI assistance. Perfect for when you want complete control over the content.

#### Step 3: Save

**For AI-Generated Articles:**
1. Click **Save**
2. AI generates comprehensive long-form content
3. Check email for draft notification

**For Manual Articles:**
1. Click **Save**
2. Your article is saved as a draft
3. Edit and refine the content as needed
4. Change status to `published` when ready to publish

---

## AI Workflow Process

### The Automatic Workflow

```
1. Create Entry (Title + pending_ai status)
        ↓
2. AI Generates Draft (automatically)
        ↓
3. Status Changes to draft_ready
        ↓
4. Email Notification Sent
        ↓
5. Review Draft in Admin Panel
        ↓
6. Approve → Published
   OR
   Reject → Needs Changes
```

### What the AI Generates

#### For Logs (Short-form):
- **Length**: 300-800 words
- **Style**: Conversational, engaging
- **Structure**: 
  - Introduction
  - 2-3 main points
  - Conclusion

#### For Grimoires (Long-form):
- **Length**: 1000-3000 words
- **Style**: Comprehensive, authoritative
- **Structure**:
  - Introduction
  - Multiple detailed sections
  - Practical examples
  - Key takeaways
  - Conclusion

### AI System Prompt

The AI follows these guidelines:
- Clear, engaging, and accessible writing
- Mystical/alchemical metaphors (sparingly)
- Focus on practical value
- Proper markdown formatting
- SEO-friendly content
- Includes examples and explanations

---

## Reviewing and Editing Drafts

### Email Notification

When draft is ready, you receive an email with:

- **Draft Preview**: First 500 characters
- **Edit in Strapi** button → Opens admin panel
- **Approve & Publish** button → Direct publish
- **Needs Changes** button → Request revision

### Reviewing in Admin Panel

#### Step 1: Open the Entry

1. Click the **Edit in Strapi** link from email
2. Or manually navigate to Content Manager → Log/Grimoire
3. Find the entry (filter by "draft_ready" status)

#### Step 2: Review the Draft

The entry has two content fields:

- **draftBody**: AI-generated content (in rich text editor)
- **publishedBody**: Empty until approved

#### Step 3: Edit as Needed

You can:
- Edit the draft directly
- Add/remove sections
- Fix formatting
- Add images
- Update metadata

#### Editing Best Practices

1. **Keep AI-generated structure** when possible
2. **Add personal touches** and insights
3. **Verify facts** and examples
4. **Check formatting** (headers, lists, etc.)
5. **Add relevant images** if missing
6. **Update tags** if needed

---

## Publishing Content

### Method 1: Approve from Email

Click **Approve & Publish** in the email notification.

This automatically:
- Copies `draftBody` to `publishedBody`
- Sets status to `published`
- Makes content live on your site

### Method 2: Approve in Admin Panel

1. Open the entry
2. Review/edit as needed
3. Click custom **Approve** action
4. Entry is published

### Method 3: Manual Publish

1. Open the entry
2. Review/edit the draft
3. Copy content from `draftBody` to `publishedBody`
4. Change **Status** dropdown to `published`
5. Click **Save**

### What Happens When Published

- Content appears on your website immediately
- Accessible via:
  - `/library` (combined feed)
  - `/library/log` or `/library/grimoire` (type-specific)
  - `/library/log/your-slug` or `/library/grimoire/your-slug` (individual post)

---

## Rejecting Drafts

### When to Reject

- Content doesn't match your vision
- Needs significant changes
- AI misunderstood the topic
- Quality isn't acceptable

### How to Reject

#### From Email:
Click **Needs Changes** button

#### In Admin Panel:
1. Use custom **Reject** action
2. Optionally add feedback
3. Status changes to `needs_changes`

### After Rejection

You can:

1. **Edit manually**: Update and publish yourself
2. **Regenerate**: Request new AI draft
3. **Delete**: Remove the entry

---

## Regenerating Drafts

### When to Regenerate

- Rejected draft needs complete rewrite
- Want different approach
- Original generation had errors

### How to Regenerate

#### Method 1: Change Status

1. Open the entry
2. Change status to `pending_ai`
3. Clear the `draftBody` field
4. Save
5. AI generates new draft

#### Method 2: Use Regenerate API

```bash
curl -X POST 'http://localhost:1337/api/logs/:id/regenerate' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"data":{"instructions":"Make it more technical with code examples"}}'
```

With special instructions:
- The AI considers your feedback
- Generates improved version
- Sends new draft notification

---

## Managing Tags

### Creating Tags

#### In Content Manager

1. Navigate to **Content Manager** → **Tag**
2. Click **Create new entry**
3. Fill fields:
   ```
   Name: tutorial
   Slug: (auto-generated from name)
   ```
4. Click **Save**

#### While Creating Content

1. In Log/Grimoire entry form
2. Scroll to **Tags** section
3. Click dropdown
4. Type new tag name
5. Press Enter to create
6. Tag is created and linked

### Organizing with Tags

**Good Tag Examples:**
- announcement
- tutorial
- guide
- beginner
- advanced
- typescript
- react
- productivity

**Tag Best Practices:**
- Use lowercase
- Be specific but not too narrow
- Reuse existing tags when possible
- Limit to 3-5 tags per post

### Viewing Tag Usage

1. Navigate to **Content Manager** → **Tag**
2. See all tags
3. Click a tag to see linked content

---

## Media Management

### Uploading Images

#### In Media Library

1. Click **Media Library** in sidebar
2. Click **Add new assets** button
3. Upload images (drag & drop or browse)
4. Images are stored and processed

#### In Content Entry

1. Navigate to **Hero Image** field (Grimoire only)
2. Click **Add media**
3. Upload new or select existing
4. Image is linked to entry

### Image Formats

Strapi automatically generates:
- **Thumbnail**: 156x156
- **Small**: 500px wide
- **Medium**: 750px wide
- **Large**: 1000px wide

Use appropriate format in frontend for performance.

### Image Best Practices

- **Recommended size**: 1200x630 for hero images
- **Format**: JPG for photos, PNG for graphics
- **Alt text**: Add in media library
- **Naming**: Use descriptive filenames

---

## Content Organization

### Filtering and Searching

#### By Status

1. Open Content Manager → Log or Grimoire
2. Click **Filters** button
3. Select **Status** filter
4. Choose: `draft`, `pending_ai`, `draft_ready`, `needs_changes`, or `published`

#### By Date

1. Click **Filters**
2. Select **Created At** or **Updated At**
3. Set date range

#### By Tag

1. Click **Filters**
2. Select **Tags**
3. Choose tag(s)

### Sorting

Click column headers to sort:
- **Title**: Alphabetical
- **Created At**: Newest/oldest first
- **Updated At**: Recently modified
- **Status**: Grouped by workflow stage

### Bulk Actions

Select multiple entries:
- Delete multiple drafts
- Bulk publish (not recommended - review first!)
- Export data

---

## Editorial Calendar

### Planning Content

**Recommended Workflow:**

1. **Weekly Planning**
   - Create 3-5 Log entries (pending_ai)
   - Create 1-2 Grimoire entries (pending_ai)
   - Let AI generate over weekend

2. **Monday Review**
   - Review all drafts
   - Edit and approve best ones
   - Reject or regenerate others

3. **Publish Schedule**
   - Logs: 2-3 per week
   - Grimoires: 1 per week

### Status Overview

At a glance:
```
draft          → Manual draft (you write the content)
pending_ai     → Waiting for AI generation
draft_ready    → AI draft generated, needs your review
needs_changes  → Rejected or needs work
published      → Live on your site
```

---

## Tips and Best Practices

### Creating Quality Content

1. **Provide Context**: Use excerpt field to guide AI
2. **Choose Good Titles**: Clear, descriptive, SEO-friendly
3. **Review Everything**: Always review before publishing
4. **Add Personal Touch**: Edit AI content to match your voice
5. **Use Tags Consistently**: Helps users find related content

### Workflow Efficiency

1. **Batch Create**: Create multiple entries at once
2. **Review Daily**: Check for new drafts
3. **Schedule Reviews**: Set aside time for content review
4. **Use Templates**: Save common structures
5. **Tag as You Go**: Don't retroactively tag

### Content Quality

1. **Read Aloud**: Catch awkward phrasing
2. **Check Facts**: Verify AI-generated information
3. **Add Examples**: Real-world applications
4. **Update Regularly**: Keep content current
5. **Get Feedback**: Ask others to review

---

## Troubleshooting

### Draft Not Generated

**Possible causes:**
- OpenAI API key invalid
- API quota exceeded
- Network error

**Solutions:**
1. Check Strapi logs
2. Verify OpenAI API key
3. Manually change status to `pending_ai` again

### Email Not Received

**Possible causes:**
- SMTP configuration incorrect
- Email in spam folder
- Wrong admin email address

**Solutions:**
1. Check spam folder
2. Verify SMTP settings
3. Check Strapi logs for errors

### Cannot Publish

**Possible causes:**
- Missing required fields
- Permission issues
- Database error

**Solutions:**
1. Fill all required fields
2. Check user permissions
3. Review error messages

---

## Advanced Features

### Custom Prompts

Modify AI system prompt in `src/services/ai.ts` to:
- Change writing style
- Add specific instructions
- Include domain knowledge
- Adjust tone and voice

### Workflow Customization

Edit lifecycle hooks to:
- Add approval steps
- Integrate with other tools
- Send to multiple reviewers
- Auto-schedule publishing

### Analytics Integration

Track content performance:
- Add analytics fields to schema
- Track views, engagement
- A/B test titles
- Monitor conversion

---

## Next Steps

Now that you understand the workflow:

1. ✅ Create your first test Log entry
2. ✅ Review the AI-generated draft
3. ✅ Publish your first post
4. ✅ Monitor how it appears on your site
5. ✅ Establish your content schedule

---

## Quick Reference

### Entry Lifecycle

**AI-Powered Workflow:**
```
Create → pending_ai → draft_ready → published
                         ↓
                   needs_changes → edit/regenerate
```

**Manual Workflow:**
```
Create → draft → edit content → published
```

### Status Meanings

- `draft`: Manual draft (you write the content yourself)
- `pending_ai`: AI generating content
- `draft_ready`: AI draft generated, ready for your review
- `needs_changes`: Needs editing or regeneration
- `published`: Live on website

### Required Fields

**Log:**
- Title ✓
- Status ✓

**Grimoire:**
- Title ✓
- Status ✓

**Tag:**
- Name ✓

---

## Support

For issues or questions:

1. Check Strapi documentation
2. Review this guide
3. Check backend logs
4. Review AI workflow configuration
5. Test with simple examples first

---

## Additional Resources

- [Strapi Admin Panel Guide](https://docs.strapi.io/user-docs/intro)
- [Rich Text Editor](https://docs.strapi.io/user-docs/content-manager/writing-content#rich-text)
- [Media Library](https://docs.strapi.io/user-docs/media-library/adding-assets)
