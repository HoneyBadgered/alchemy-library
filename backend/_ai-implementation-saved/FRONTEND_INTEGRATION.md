# Frontend Integration Guide

## Overview

This guide shows how to integrate your React 19 + TypeScript + Vite frontend with the Strapi backend to display Log and Grimoire content from The Alchemy Table Library.

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Type Definitions](#type-definitions)
3. [API Service Layer](#api-service-layer)
4. [Components](#components)
5. [Routing](#routing)
6. [SEO Considerations](#seo-considerations)
7. [Draft Preview Mode](#draft-preview-mode)

---

## Environment Setup

### 1. Create Environment Files

**`.env.development`**
```env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_URL=http://localhost:1337/api
VITE_ENABLE_DRAFT_PREVIEW=true
```

**`.env.production`**
```env
VITE_STRAPI_URL=https://your-strapi-domain.com
VITE_STRAPI_API_URL=https://your-strapi-domain.com/api
VITE_ENABLE_DRAFT_PREVIEW=false
```

### 2. Access Environment Variables

```typescript
// src/config/env.ts
export const config = {
  strapi: {
    url: import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337',
    apiUrl: import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337/api',
  },
  enableDraftPreview: import.meta.env.VITE_ENABLE_DRAFT_PREVIEW === 'true',
};
```

---

## Type Definitions

### Strapi Response Types

**`src/types/strapi.ts`**

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

export interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: unknown;
  };
}

// Content types
export interface LogAttributes {
  title: string;
  slug: string;
  postType: 'log';
  status: 'pending_ai' | 'draft_ready' | 'needs_changes' | 'published';
  draftBody?: string;
  publishedBody?: string;
  excerpt?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  tags?: {
    data: StrapiTag[];
  };
}

export interface GrimoireAttributes {
  title: string;
  slug: string;
  postType: 'grimoire';
  status: 'pending_ai' | 'draft_ready' | 'needs_changes' | 'published';
  draftBody?: string;
  publishedBody?: string;
  excerpt?: string;
  author?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
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

// Unified library post type
export type LibraryPost = StrapiLog | StrapiGrimoire;

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

### Strapi API Client

**`src/services/api.ts`**

```typescript
import { config } from '../config/env';
import type {
  StrapiResponse,
  StrapiLog,
  StrapiGrimoire,
  LibraryPost,
  NormalizedPost,
  StrapiError,
} from '../types/strapi';

class StrapiAPIError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'StrapiAPIError';
    this.status = status;
  }
}

class StrapiAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.strapi.apiUrl;
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData: StrapiError = await response.json();
        throw new StrapiAPIError(
          errorData.error.message || 'API request failed',
          response.status
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof StrapiAPIError) {
        throw error;
      }
      throw new StrapiAPIError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      );
    }
  }

  // Normalize post data for easier consumption
  private normalizePost(post: StrapiLog | StrapiGrimoire): NormalizedPost {
    const { id, attributes } = post;
    const content = attributes.publishedBody || attributes.draftBody || '';
    
    return {
      id,
      type: attributes.postType,
      title: attributes.title,
      slug: attributes.slug,
      excerpt: attributes.excerpt,
      content,
      author: attributes.author,
      category: 'category' in attributes ? attributes.category : undefined,
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
      heroImage:
        'heroImage' in attributes && attributes.heroImage?.data
          ? `${config.strapi.url}${attributes.heroImage.data.attributes.url}`
          : undefined,
      tags:
        attributes.tags?.data.map((tag) => ({
          id: tag.id,
          name: tag.attributes.name,
          slug: tag.attributes.slug,
        })) || [],
    };
  }

  // Get all published posts (combined feed)
  async getLibrary(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<{ data: NormalizedPost[]; pagination: any }> {
    const { page = 1, pageSize = 25 } = params || {};

    // Fetch both logs and grimoires
    const [logsResponse, grimoiresResponse] = await Promise.all([
      this.fetch<StrapiResponse<StrapiLog[]>>(
        `/logs?filters[status][$eq]=published&populate=tags&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
      ),
      this.fetch<StrapiResponse<StrapiGrimoire[]>>(
        `/grimoires?filters[status][$eq]=published&populate[tags]=*&populate[heroImage]=*&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
      ),
    ]);

    // Combine and sort by date
    const combined = [
      ...logsResponse.data.map(this.normalizePost.bind(this)),
      ...grimoiresResponse.data.map(this.normalizePost.bind(this)),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      data: combined,
      pagination: {
        total:
          (logsResponse.meta.pagination?.total || 0) +
          (grimoiresResponse.meta.pagination?.total || 0),
      },
    };
  }

  // Get published logs
  async getLogs(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<{ data: NormalizedPost[]; pagination: any }> {
    const { page = 1, pageSize = 25 } = params || {};

    const response = await this.fetch<StrapiResponse<StrapiLog[]>>(
      `/logs?filters[status][$eq]=published&populate=tags&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    );

    return {
      data: response.data.map(this.normalizePost.bind(this)),
      pagination: response.meta.pagination,
    };
  }

  // Get published grimoires
  async getGrimoires(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<{ data: NormalizedPost[]; pagination: any }> {
    const { page = 1, pageSize = 25 } = params || {};

    const response = await this.fetch<StrapiResponse<StrapiGrimoire[]>>(
      `/grimoires?filters[status][$eq]=published&populate[tags]=*&populate[heroImage]=*&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    );

    return {
      data: response.data.map(this.normalizePost.bind(this)),
      pagination: response.meta.pagination,
    };
  }

  // Get single post by slug
  async getPostBySlug(
    slug: string,
    type?: 'log' | 'grimoire'
  ): Promise<NormalizedPost | null> {
    if (type) {
      // Search in specific collection
      const endpoint =
        type === 'log'
          ? `/logs?filters[slug][$eq]=${slug}&filters[status][$eq]=published&populate=tags`
          : `/grimoires?filters[slug][$eq]=${slug}&filters[status][$eq]=published&populate[tags]=*&populate[heroImage]=*`;

      const response = await this.fetch<
        StrapiResponse<(StrapiLog | StrapiGrimoire)[]>
      >(endpoint);

      if (response.data.length === 0) {
        return null;
      }

      return this.normalizePost(response.data[0]);
    }

    // Search both collections
    try {
      const logResponse = await this.fetch<StrapiResponse<StrapiLog[]>>(
        `/logs?filters[slug][$eq]=${slug}&filters[status][$eq]=published&populate=tags`
      );

      if (logResponse.data.length > 0) {
        return this.normalizePost(logResponse.data[0]);
      }
    } catch (error) {
      // Continue to grimoire search
    }

    try {
      const grimoireResponse = await this.fetch<
        StrapiResponse<StrapiGrimoire[]>
      >(
        `/grimoires?filters[slug][$eq]=${slug}&filters[status][$eq]=published&populate[tags]=*&populate[heroImage]=*`
      );

      if (grimoireResponse.data.length > 0) {
        return this.normalizePost(grimoireResponse.data[0]);
      }
    } catch (error) {
      // Not found in either collection
    }

    return null;
  }

  // Get tags
  async getTags(): Promise<Array<{ id: number; name: string; slug: string }>> {
    const response = await this.fetch<
      StrapiResponse<Array<{ id: number; attributes: { name: string; slug: string } }>>
    >(`/tags?sort=name:asc`);

    return response.data.map((tag) => ({
      id: tag.id,
      name: tag.attributes.name,
      slug: tag.attributes.slug,
    }));
  }
}

export const strapiAPI = new StrapiAPI();
export { StrapiAPIError };
```

---

## Components

### LibraryList Component (Combined Feed)

**`src/components/LibraryList.tsx`**

```typescript
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { strapiAPI, StrapiAPIError } from '../services/api';
import type { NormalizedPost } from '../types/strapi';
import './LibraryList.css';

export default function LibraryList() {
  const [posts, setPosts] = useState<NormalizedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [page]);

  async function loadPosts() {
    try {
      setLoading(true);
      const response = await strapiAPI.getLibrary({ page, pageSize: 10 });
      
      if (page === 1) {
        setPosts(response.data);
      } else {
        setPosts((prev) => [...prev, ...response.data]);
      }
      
      setHasMore(response.data.length === 10);
      setError(null);
    } catch (err) {
      setError(
        err instanceof StrapiAPIError
          ? err.message
          : 'Failed to load library posts'
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  if (loading && posts.length === 0) {
    return (
      <div className="library-list">
        <div className="loading">Loading library posts...</div>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="library-list">
        <div className="error">
          <h2>Error Loading Posts</h2>
          <p>{error}</p>
          <button onClick={() => loadPosts()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="library-list">
      <header className="page-header">
        <h1>🧪 The Library</h1>
        <p>All posts from The Alchemy Table Library</p>
      </header>

      <div className="posts-container">
        {posts.map((post) => (
          <article key={`${post.type}-${post.id}`} className="post-card">
            <div className="post-type-badge">{post.type}</div>
            
            {post.heroImage && (
              <div className="post-image">
                <img src={post.heroImage} alt={post.title} />
              </div>
            )}

            <div className="post-content">
              <div className="post-meta">
                <span className="post-date">{formatDate(post.createdAt)}</span>
                {post.author && (
                  <span className="post-author">by {post.author}</span>
                )}
                {post.category && (
                  <span className="post-category">{post.category}</span>
                )}
              </div>

              <h2 className="post-title">
                <Link to={`/library/${post.type}/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>

              {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}

              {post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag) => (
                    <span key={tag.id} className="tag">
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              <Link
                to={`/library/${post.type}/${post.slug}`}
                className="read-more"
              >
                Read {post.type === 'log' ? 'post' : 'article'} →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {hasMore && (
        <div className="load-more">
          <button onClick={() => setPage((p) => p + 1)} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
```

### LogList Component

**`src/components/LogList.tsx`**

```typescript
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { strapiAPI, StrapiAPIError } from '../services/api';
import type { NormalizedPost } from '../types/strapi';
import './LogList.css';

export default function LogList() {
  const [posts, setPosts] = useState<NormalizedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [page]);

  async function loadPosts() {
    try {
      setLoading(true);
      const response = await strapiAPI.getLogs({ page, pageSize: 10 });
      
      if (page === 1) {
        setPosts(response.data);
      } else {
        setPosts((prev) => [...prev, ...response.data]);
      }
      
      setHasMore(response.data.length === 10);
      setError(null);
    } catch (err) {
      setError(
        err instanceof StrapiAPIError ? err.message : 'Failed to load logs'
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  if (loading && posts.length === 0) {
    return (
      <div className="log-list">
        <div className="loading">Loading log posts...</div>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="log-list">
        <div className="error">
          <h2>Error Loading Posts</h2>
          <p>{error}</p>
          <button onClick={() => loadPosts()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="log-list">
      <header className="page-header">
        <h1>📝 The Log</h1>
        <p>Regular updates, announcements, and thoughts from the Alchemy Library</p>
      </header>

      <div className="posts-container">
        {posts.map((post) => (
          <article key={post.id} className="post-card">
            <div className="post-meta">
              <span className="post-date">{formatDate(post.createdAt)}</span>
              {post.author && (
                <span className="post-author">by {post.author}</span>
              )}
            </div>

            <h2 className="post-title">
              <Link to={`/library/log/${post.slug}`}>{post.title}</Link>
            </h2>

            {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}

            {post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag.id} className="tag">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            <Link to={`/library/log/${post.slug}`} className="read-more">
              Read more →
            </Link>
          </article>
        ))}
      </div>

      {hasMore && (
        <div className="load-more">
          <button onClick={() => setPage((p) => p + 1)} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
```

### GrimoireList Component

**`src/components/GrimoireList.tsx`**

```typescript
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { strapiAPI, StrapiAPIError } from '../services/api';
import type { NormalizedPost } from '../types/strapi';
import './GrimoireList.css';

export default function GrimoireList() {
  const [posts, setPosts] = useState<NormalizedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [page]);

  async function loadPosts() {
    try {
      setLoading(true);
      const response = await strapiAPI.getGrimoires({ page, pageSize: 10 });
      
      if (page === 1) {
        setPosts(response.data);
      } else {
        setPosts((prev) => [...prev, ...response.data]);
      }
      
      setHasMore(response.data.length === 10);
      setError(null);
    } catch (err) {
      setError(
        err instanceof StrapiAPIError
          ? err.message
          : 'Failed to load grimoires'
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Group by category
  const groupedPosts = posts.reduce((acc, post) => {
    const category = post.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(post);
    return acc;
  }, {} as Record<string, NormalizedPost[]>);

  if (loading && posts.length === 0) {
    return (
      <div className="grimoire-list">
        <div className="loading">Loading grimoire articles...</div>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="grimoire-list">
        <div className="error">
          <h2>Error Loading Articles</h2>
          <p>{error}</p>
          <button onClick={() => loadPosts()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="grimoire-list">
      <header className="page-header">
        <h1>📚 The Grimoire</h1>
        <p>Comprehensive guides, tutorials, and evergreen knowledge</p>
      </header>

      <div className="articles-container">
        {Object.entries(groupedPosts).map(([category, categoryPosts]) => (
          <section key={category} className="category-section">
            <h2 className="category-title">{category}</h2>
            <div className="articles-grid">
              {categoryPosts.map((post) => (
                <article key={post.id} className="article-card">
                  {post.heroImage && (
                    <div className="article-image">
                      <img src={post.heroImage} alt={post.title} />
                    </div>
                  )}

                  <div className="article-content">
                    <div className="article-meta">
                      <span className="article-category">{category}</span>
                      <span className="article-date">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>

                    <h3 className="article-title">
                      <Link to={`/library/grimoire/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    {post.excerpt && (
                      <p className="article-excerpt">{post.excerpt}</p>
                    )}

                    {post.tags.length > 0 && (
                      <div className="article-tags">
                        {post.tags.map((tag) => (
                          <span key={tag.id} className="tag">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      to={`/library/grimoire/${post.slug}`}
                      className="read-more"
                    >
                      Read article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {hasMore && (
        <div className="load-more">
          <button onClick={() => setPage((p) => p + 1)} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
```

### LibraryPost Component (Individual Post)

**`src/components/LibraryPost.tsx`**

```typescript
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { strapiAPI, StrapiAPIError } from '../services/api';
import type { NormalizedPost } from '../types/strapi';
import './LibraryPost.css';

export default function LibraryPost() {
  const { type, slug } = useParams<{ type: 'log' | 'grimoire'; slug: string }>();
  const [post, setPost] = useState<NormalizedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug && type) {
      loadPost();
    }
  }, [slug, type]);

  async function loadPost() {
    if (!slug || !type) return;

    try {
      setLoading(true);
      const data = await strapiAPI.getPostBySlug(slug, type);
      setPost(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof StrapiAPIError ? err.message : 'Failed to load post'
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  if (loading) {
    return (
      <div className="library-post">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="library-post">
        <div className="error">
          <h2>Post Not Found</h2>
          <p>{error || 'The requested post could not be found.'}</p>
        </div>
      </div>
    );
  }

  // Redirect if type mismatch
  if (post.type !== type) {
    return <Navigate to={`/library/${post.type}/${post.slug}`} replace />;
  }

  return (
    <article className="library-post">
      {post.heroImage && (
        <div className="post-hero-image">
          <img src={post.heroImage} alt={post.title} />
        </div>
      )}

      <header className="post-header">
        <div className="post-type-badge">{post.type}</div>
        <h1>{post.title}</h1>
        
        <div className="post-meta">
          <span className="post-date">{formatDate(post.createdAt)}</span>
          {post.author && (
            <span className="post-author">by {post.author}</span>
          )}
          {post.category && (
            <span className="post-category">{post.category}</span>
          )}
        </div>

        {post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag.id} className="tag">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <footer className="post-footer">
        <p>Last updated: {formatDate(post.updatedAt)}</p>
      </footer>
    </article>
  );
}
```

---

## Routing

### Update App Router

**`src/App.tsx`**

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import LibraryList from './components/LibraryList';
import LogList from './components/LogList';
import GrimoireList from './components/GrimoireList';
import LibraryPost from './components/LibraryPost';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/library" element={<LibraryList />} />
            <Route path="/library/log" element={<LogList />} />
            <Route path="/library/grimoire" element={<GrimoireList />} />
            <Route path="/library/:type/:slug" element={<LibraryPost />} />
            
            {/* Legacy routes - redirect to new structure */}
            <Route path="/log" element={<LogList />} />
            <Route path="/grimoire" element={<GrimoireList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
```

---

## SEO Considerations

### Meta Tags Component

**`src/components/SEO.tsx`**

```typescript
import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export default function SEO({ title, description, image, url, type = 'website' }: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = `${title} | The Alchemy Table Library`;

    // Update meta tags
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta && description) {
      descriptionMeta.setAttribute('content', description);
    }

    // Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description || '');
    updateMetaTag('og:image', image || '');
    updateMetaTag('og:url', url || window.location.href);
    updateMetaTag('og:type', type);

    // Twitter Card tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description || '');
    updateMetaTag('twitter:image', image || '');
  }, [title, description, image, url, type]);

  return null;
}

function updateMetaTag(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}
```

---

## Draft Preview Mode

For admin users to preview drafts before publishing:

**`src/components/DraftPreview.tsx`**

```typescript
// This would require authentication and special API endpoints
// Simplified example:

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

export default function DraftPreview() {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Fetch draft with authentication
  // Display draft content
  // Show approve/reject buttons

  return (
    <div className="draft-preview">
      {/* Preview implementation */}
    </div>
  );
}
```

---

## Next Steps

- ✅ Review [Deployment Guide](./DEPLOYMENT.md) for production setup
- ✅ Check [Admin Workflow](./ADMIN_WORKFLOW.md) for content management

---

## Additional Resources

- [React 19 Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [React Router Documentation](https://reactrouter.com/)
