// Legacy types (kept for backward compatibility)
export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author: string;
}

export interface Article {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
}

// Strapi-specific types
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

// Content type attributes
export interface LogAttributes {
  title: string;
  slug: string;
  postType: 'log';
  status: 'draft' | 'pending_ai' | 'draft_ready' | 'needs_changes' | 'published';
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
  status: 'draft' | 'pending_ai' | 'draft_ready' | 'needs_changes' | 'published';
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

// Normalized post type for easier component usage
export interface NormalizedPost {
  id: number;
  type: 'log' | 'grimoire';
  title: string;
  slug: string;
  status: 'draft' | 'pending_ai' | 'draft_ready' | 'needs_changes' | 'published';
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
