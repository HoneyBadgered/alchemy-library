# Admin Workflow Guide

## Overview

This guide explains how to use the Strapi admin panel to create, manage, and publish content for The Alchemy Table Library.

## Table of Contents

1. [Accessing the Admin Panel](#accessing-the-admin-panel)
2. [Creating New Content](#creating-new-content)
3. [Publishing Content](#publishing-content)
4. [Managing Tags](#managing-tags)
5. [Media Management](#media-management)

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

#### Step 2: Fill in Content

```
Title: "Your Post Title Here"
Body: Write your content in the rich text editor
Excerpt: Brief description - optional
Author: Your name - optional
Tags: Select existing tags or create new ones - optional
```

#### Step 3: Save

1. Click **Save** button (top right) to save as draft
2. Click **Publish** button when ready to make it live

---

### Creating a Grimoire Entry (Long-form Article)

#### Step 1: Navigate to Grimoires

1. Click **Content Manager** in the sidebar
2. Click **Grimoire** under Collection Types
3. Click **Create new entry** button

#### Step 2: Fill in Content

```
Title: "Your Article Title Here"
Body: Write your content in the rich text editor
Category: Choose category - optional
Excerpt: Brief description - optional
Author: Your name - optional
Hero Image: Upload featured image - optional
Tags: Select relevant tags - optional
```

#### Step 3: Save

1. Click **Save** button (top right) to save as draft
2. Click **Publish** button when ready to make it live

---

## Publishing Content

Strapi's built-in draft/publish system allows you to:

1. **Save as Draft**: Content is saved but not visible on your site
2. **Publish**: Content becomes live and visible to users
3. **Unpublish**: Remove content from public view while keeping it saved

### Publishing Steps

1. Open the entry you want to publish
2. Ensure all required fields are filled
3. Click the **Publish** button in the top-right corner
4. Content is now live on your website

### Unpublishing

1. Open a published entry
2. Click the **Unpublish** button
3. Content returns to draft state

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
4. Click **Save** then **Publish**

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

### Image Best Practices

- **Recommended size**: 1200x630 for hero images
- **Format**: JPG for photos, PNG for graphics
- **Alt text**: Add in media library
- **Naming**: Use descriptive filenames

---

## Content Types

### Log

Short-form posts for updates, announcements, and casual blog content.

**Fields:**
- **Title** (required): Post title
- **Slug** (auto-generated): URL-friendly identifier
- **Body**: Main content (rich text)
- **Excerpt**: Short description
- **Author**: Author name
- **Tags**: Related tags

### Grimoire

Long-form articles for guides, tutorials, and educational content.

**Fields:**
- **Title** (required): Article title
- **Slug** (auto-generated): URL-friendly identifier
- **Body**: Main content (rich text)
- **Excerpt**: Short description
- **Author**: Author name
- **Category**: Content category
- **Hero Image**: Featured image
- **Tags**: Related tags

---

## Tips and Best Practices

### Creating Quality Content

1. **Choose Good Titles**: Clear, descriptive, SEO-friendly
2. **Use Tags Consistently**: Helps users find related content
3. **Add Excerpts**: Improves content previews
4. **Include Images**: Visual content increases engagement

### Workflow Efficiency

1. **Save Often**: Use draft to save work in progress
2. **Preview Content**: Check how it looks before publishing
3. **Tag as You Go**: Don't retroactively tag
4. **Organize Media**: Keep your media library clean

---

## Support

For issues or questions:

1. Check [Strapi documentation](https://docs.strapi.io/user-docs/intro)
2. Review this guide
3. Check backend logs for errors

---

## Additional Resources

- [Strapi Admin Panel Guide](https://docs.strapi.io/user-docs/intro)
- [Rich Text Editor](https://docs.strapi.io/user-docs/content-manager/writing-content#rich-text)
- [Media Library](https://docs.strapi.io/user-docs/media-library/adding-assets)
- [Draft & Publish](https://docs.strapi.io/user-docs/content-manager/saving-and-publishing-content)
