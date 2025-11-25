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
