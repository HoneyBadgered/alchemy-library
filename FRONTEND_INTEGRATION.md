# Frontend Integration Guide

## Overview

This guide shows how to integrate your React 19 + TypeScript + Vite frontend with the Strapi backend to display Log and Grimoire content from The Alchemy Table Library.

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Type Definitions](#type-definitions)
3. [API Service Layer](#api-service-layer)
4. [Components](#components)
5. [Routing](#routing)

---

## Environment Setup

### 1. Create Environment Files

**`.env.development`**
```env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_URL=http://localhost:1337/api
```

**`.env.production`**
```env
VITE_STRAPI_URL=https://your-strapi-domain.com
VITE_STRAPI_API_URL=https://your-strapi-domain.com/api
```

### 2. Access Environment Variables

```typescript
// src/config/env.ts
export const config = {
  strapi: {
    url: import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337',
    apiUrl: import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337/api',
  },
};
```

---

## Type Definitions

### Strapi Response Types

**`src/types/index.ts`**

```typescript
// Base Strapi types
export interface StrapiImage {
  id: number;
  attributes: {
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  };
}

export interface StrapiTag {
  id: number;
  attributes: {
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Content types
export interface LogAttributes {
  title: string;
  slug: string;
  body?: string;
  excerpt?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  tags?: {
    data: StrapiTag[];
  };
}

export interface GrimoireAttributes {
  title: string;
  slug: string;
  body?: string;
  excerpt?: string;
  author?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  heroImage?: {
    data: StrapiImage | null;
  };
  tags?: {
    data: StrapiTag[];
  };
}

export interface StrapiLog {
  id: number;
  attributes: LogAttributes;
}

export interface StrapiGrimoire {
  id: number;
  attributes: GrimoireAttributes;
}

// Normalized types for easier component usage
export interface NormalizedPost {
  id: number;
  type: 'log' | 'grimoire';
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  heroImage?: string;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}
```

---

## API Service Layer

The API service uses Strapi 5's built-in draft/publish system via the `status=published` query parameter to fetch only published content.

**Key endpoints:**
- `/api/logs?status=published` - Published logs
- `/api/grimoires?status=published` - Published grimoires

**Note:** In Strapi v4, the parameter was `publicationState=live`, but this was replaced with `status=published` in Strapi 5.

See `src/services/api.ts` for the full implementation.

---

## Components

### Library List

Displays a combined feed of all published Log and Grimoire entries.

### Log List

Displays published Log entries (short-form posts).

### Grimoire List

Displays published Grimoire entries (long-form articles), optionally grouped by category.

### Library Post

Displays a single post with full content.

---

## Routing

```typescript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/library" element={<LibraryList />} />
  <Route path="/library/log" element={<LogList />} />
  <Route path="/library/grimoire" element={<GrimoireList />} />
  <Route path="/library/:type/:slug" element={<LibraryPost />} />
</Routes>
```

---

## Next Steps

- ✅ Review [Deployment Guide](./DEPLOYMENT.md) for production setup
- ✅ Check [Admin Workflow](./backend/ADMIN_WORKFLOW.md) for content management

---

## Additional Resources

- [React 19 Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Strapi REST API Documentation](https://docs.strapi.io/dev-docs/api/rest)
