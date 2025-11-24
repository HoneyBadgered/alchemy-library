import { config } from '../config/env';
import type {
  StrapiResponse,
  StrapiLog,
  StrapiGrimoire,
  NormalizedPost,
  StrapiError,
  LogAttributes,
  GrimoireAttributes,
} from '../types';

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

  // Type guard to check if attributes are for a grimoire
  private isGrimoireAttributes(attributes: LogAttributes | GrimoireAttributes): attributes is GrimoireAttributes {
    return 'heroImage' in attributes || 'category' in attributes;
  }

  // Normalize post data for easier consumption
  private normalizePost(post: StrapiLog | StrapiGrimoire, type: 'log' | 'grimoire'): NormalizedPost {
    const { id, attributes } = post;
    const content = attributes.body || '';
    
    return {
      id,
      type,
      title: attributes.title,
      slug: attributes.slug,
      excerpt: attributes.excerpt,
      content,
      author: attributes.author,
      category: this.isGrimoireAttributes(attributes) ? attributes.category : undefined,
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
      publishedAt: attributes.publishedAt,
      heroImage:
        this.isGrimoireAttributes(attributes) && attributes.heroImage?.data
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
  }): Promise<{ data: NormalizedPost[]; pagination: { total: number } }> {
    const { page = 1, pageSize = 25 } = params || {};

    // Fetch both logs and grimoires (using Strapi's built-in publicationState)
    const [logsResponse, grimoiresResponse] = await Promise.all([
      this.fetch<StrapiResponse<StrapiLog[]>>(
        `/logs?publicationState=live&populate=tags&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
      ),
      this.fetch<StrapiResponse<StrapiGrimoire[]>>(
        `/grimoires?publicationState=live&populate[tags]=*&populate[heroImage]=*&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
      ),
    ]);

    // Combine and sort by date
    const combined = [
      ...logsResponse.data.map(post => this.normalizePost(post, 'log')),
      ...grimoiresResponse.data.map(post => this.normalizePost(post, 'grimoire')),
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
  }): Promise<{ data: NormalizedPost[]; pagination: { page: number; pageSize: number; pageCount: number; total: number } | undefined }> {
    const { page = 1, pageSize = 25 } = params || {};

    const response = await this.fetch<StrapiResponse<StrapiLog[]>>(
      `/logs?publicationState=live&populate=tags&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    );

    return {
      data: response.data.map(post => this.normalizePost(post, 'log')),
      pagination: response.meta.pagination,
    };
  }

  // Get published grimoires
  async getGrimoires(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<{ data: NormalizedPost[]; pagination: { page: number; pageSize: number; pageCount: number; total: number } | undefined }> {
    const { page = 1, pageSize = 25 } = params || {};

    const response = await this.fetch<StrapiResponse<StrapiGrimoire[]>>(
      `/grimoires?publicationState=live&populate[tags]=*&populate[heroImage]=*&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    );

    return {
      data: response.data.map(post => this.normalizePost(post, 'grimoire')),
      pagination: response.meta.pagination,
    };
  }

  // Get single post by slug
  async getPostBySlug(
    slug: string,
    type?: 'log' | 'grimoire'
  ): Promise<NormalizedPost | null> {
    // URL encode the slug to prevent injection
    const encodedSlug = encodeURIComponent(slug);
    
    if (type) {
      // Search in specific collection
      const endpoint =
        type === 'log'
          ? `/logs?filters[slug][$eq]=${encodedSlug}&publicationState=live&populate=tags`
          : `/grimoires?filters[slug][$eq]=${encodedSlug}&publicationState=live&populate[tags]=*&populate[heroImage]=*`;

      const response = await this.fetch<
        StrapiResponse<(StrapiLog | StrapiGrimoire)[]>
      >(endpoint);

      if (response.data.length === 0) {
        return null;
      }

      return this.normalizePost(response.data[0], type);
    }

    // Search both collections
    try {
      const logResponse = await this.fetch<StrapiResponse<StrapiLog[]>>(
        `/logs?filters[slug][$eq]=${encodedSlug}&publicationState=live&populate=tags`
      );

      if (logResponse.data.length > 0) {
        return this.normalizePost(logResponse.data[0], 'log');
      }
    } catch {
      // Continue to grimoire search
    }

    try {
      const grimoireResponse = await this.fetch<
        StrapiResponse<StrapiGrimoire[]>
      >(
        `/grimoires?filters[slug][$eq]=${encodedSlug}&publicationState=live&populate[tags]=*&populate[heroImage]=*`
      );

      if (grimoireResponse.data.length > 0) {
        return this.normalizePost(grimoireResponse.data[0], 'grimoire');
      }
    } catch {
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
