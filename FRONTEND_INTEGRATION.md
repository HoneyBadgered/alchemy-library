# Frontend Integration Guide

## Overview

This guide shows how to integrate your React 19 + TypeScript + Vite frontend with the Strapi backend to display Log and Grimoire content from The Alchemy Table Library.

All data is fetched asynchronously from the Strapi backend API. The frontend components use React's `useEffect` hook to fetch data and handle loading/error states gracefully.

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Type Definitions](#type-definitions)
3. [API Service Layer](#api-service-layer)
4. [Components](#components)
5. [Routing](#routing)
6. [Data Fetching Pattern](#data-fetching-pattern)

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

The API service uses Strapi v4's filter syntax to fetch only published content.

**Query Parameter Conventions (Strapi v4):**

- **Filtering**: Use `filters[field][$operator]=value` syntax
  - Example: `filters[status][$eq]=published`
- **Population**: Use `populate[relation]=*` for relations
  - Example: `populate[tags]=*`, `populate[heroImage]=*`
- **Sorting**: Use `sort=field:direction`
  - Example: `sort=createdAt:desc`
- **Pagination**: Use `pagination[page]=N` and `pagination[pageSize]=N`

**Key endpoints:**
- `/api/logs?filters[status][$eq]=published&populate[tags]=*` - Published logs with tags
- `/api/grimoires?filters[status][$eq]=published&populate[tags]=*&populate[heroImage]=*` - Published grimoires with tags and hero images

See `src/services/api.ts` for the full implementation with detailed comments.

---

## Components

### Log Page (`src/pages/LogPage.tsx`)

Displays published Log entries (short-form posts) fetched from the Strapi `/api/logs` endpoint.

### Grimoire Page (`src/pages/GrimoirePage.tsx`)

Displays published Grimoire entries (long-form articles) grouped by category, fetched from the Strapi `/api/grimoires` endpoint.

### Blog Post Page (`src/pages/BlogPostPage.tsx`)

Displays a single log post fetched by slug.

### Article Page (`src/pages/ArticlePage.tsx`)

Displays a single grimoire article fetched by slug.

### Library List (`src/components/LibraryList.tsx`)

Displays a combined feed of all published Log and Grimoire entries.

### Library Post (`src/components/LibraryPost.tsx`)

Displays a single post with full content.

---

## Routing

```typescript
<Routes>
  <Route path="/" element={<HomePage />} />
  
  {/* Strapi-powered routes */}
  <Route path="/library" element={<LibraryList />} />
  <Route path="/library/:type/:slug" element={<LibraryPost />} />
  
  {/* Log and Grimoire routes (using Strapi API with slug-based URLs) */}
  <Route path="/log" element={<LogPage />} />
  <Route path="/log/:slug" element={<BlogPostPage />} />
  <Route path="/grimoire" element={<GrimoirePage />} />
  <Route path="/grimoire/:slug" element={<ArticlePage />} />
</Routes>
```

---

## Data Fetching Pattern

All pages follow a consistent pattern for fetching data from the Strapi API:

```typescript
import { useState, useEffect } from 'react';
import { strapiAPI, StrapiAPIError } from '../services/api';
import type { NormalizedPost } from '../types';

export default function ExamplePage() {
  const [data, setData] = useState<NormalizedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const response = await strapiAPI.getLogs(); // or getGrimoires(), getPostBySlug(), etc.
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof StrapiAPIError
          ? err.message
          : 'Failed to load data'
      );
    } finally {
      setLoading(false);
    }
  }

  // Handle loading state
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Handle error state
  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => loadData()}>Try Again</button>
      </div>
    );
  }

  // Render data
  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
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
