// Strapi v5 response types (flattened format - no attributes wrapper)
export interface StrapiImage {
  id: number;
  documentId?: string;
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
}

export interface StrapiTag {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
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

// Content type definitions (Strapi v5 flattened format)
export interface LogAttributes {
  title: string;
  slug: string;
  body?: string;
  excerpt?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  tags?: StrapiTag[];
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
  heroImage?: StrapiImage | null;
  tags?: StrapiTag[];
}

export interface StrapiLog {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  body?: string;
  excerpt?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  tags?: StrapiTag[];
}

export interface StrapiGrimoire {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  body?: string;
  excerpt?: string;
  author?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  heroImage?: StrapiImage | null;
  tags?: StrapiTag[];
}

// Unified library post type
export type LibraryPost = StrapiLog | StrapiGrimoire;

// Normalized post type for easier component usage
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
