import { config } from '../config/env';
import type {
  StrapiResponse,
  StrapiLog,
  StrapiGrimoire,
  NormalizedPost,
  StrapiError,
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

/**
 * Strapi API client for The Alchemy Table Library.
 * 
 * Query Parameter Conventions (Strapi v4):
 * - Filtering: Use `filters[field][$operator]=value` syntax
 *   Example: `filters[status][$eq]=published`
 * - Population: Use `populate[relation]=*` for relations
 *   Example: `populate[tags]=*`, `populate[heroImage]=*`
 * - Sorting: Use `sort=field:direction`
 *   Example: `sort=createdAt:desc`
 * - Pagination: Use `pagination[page]=N` and `pagination[pageSize]=N`
 * 
 * @see https://docs.strapi.io/dev-docs/api/rest/filters-locale-publication
 */
class StrapiAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.strapi.apiUrl;
  }

  /**
   * Fetch data from Strapi API with error handling.
   * Handles network errors, JSON parse errors, and Strapi-specific error responses.
   */
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
        // Handle error responses gracefully - check if response is JSON
        let errorMessage = 'API request failed';
        try {
          const errorData: StrapiError = await response.json();
          errorMessage = errorData.error?.message || errorMessage;
        } catch {
          // Response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new StrapiAPIError(errorMessage, response.status);
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

  /**
   * Normalize Strapi post data for easier component consumption.
   * Safely handles missing or undefined fields from the API response.
   * 
   * @param post - The raw Strapi post response
   * @param type - The type of post ('log' or 'grimoire')
   * @returns Normalized post object with consistent structure
   */
  private normalizePost(post: StrapiLog | StrapiGrimoire, type: 'log' | 'grimoire'): NormalizedPost {
    const { id, attributes } = post;
    // Safely handle missing body field
    const content = attributes?.body || '';
    
    // Cast to grimoire attributes only when type is grimoire
    const grimoireAttrs = type === 'grimoire' ? attributes as GrimoireAttributes : null;
    
    // Safely extract heroImage URL if present
    let heroImageUrl: string | undefined;
    if (grimoireAttrs?.heroImage?.data?.attributes?.url) {
      heroImageUrl = `${config.strapi.url}${grimoireAttrs.heroImage.data.attributes.url}`;
    }
    
    // Safely extract tags, handling missing or malformed tags data
    const tags = attributes?.tags?.data?.map((tag) => ({
      id: tag.id,
      name: tag.attributes?.name || '',
      slug: tag.attributes?.slug || '',
    })) || [];
    
    return {
      id,
      type,
      title: attributes?.title || '',
      slug: attributes?.slug || '',
      excerpt: attributes?.excerpt,
      content,
      author: attributes?.author,
      category: grimoireAttrs?.category,
      createdAt: attributes?.createdAt || new Date().toISOString(),
      updatedAt: attributes?.updatedAt || new Date().toISOString(),
      publishedAt: attributes?.publishedAt,
      heroImage: heroImageUrl,
      tags,
    };
  }

  /**
   * Get all published posts (combined feed of logs and grimoires).
   * 
   * Strapi v4 Query Format:
   * - Filter by status: `filters[status][$eq]=published`
   * - Populate relations: `populate[tags]=*`, `populate[heroImage]=*`
   * - Sort: `sort=createdAt:desc`
   * - Pagination: `pagination[page]=N`, `pagination[pageSize]=N`
   * 
   * @param params - Pagination parameters
   * @returns Combined list of normalized posts sorted by creation date
   */
  async getLibrary(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<{ data: NormalizedPost[]; pagination: { total: number } }> {
    const { page = 1, pageSize = 25 } = params || {};

    // Fetch both logs and grimoires using Strapi v4 query syntax
    // filters[status][$eq]=published - Filter for published content only
    // populate[tags]=* - Include related tags
    // populate[heroImage]=* - Include hero image for grimoires
    const [logsResponse, grimoiresResponse] = await Promise.all([
      this.fetch<StrapiResponse<StrapiLog[]>>(
        `/logs?filters[status][$eq]=published&populate[tags]=*&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
      ),
      this.fetch<StrapiResponse<StrapiGrimoire[]>>(
        `/grimoires?filters[status][$eq]=published&populate[tags]=*&populate[heroImage]=*&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
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

  /**
   * Get published logs.
   * 
   * Strapi v4 Query Format:
   * - Filter by status: `filters[status][$eq]=published`
   * - Populate relations: `populate[tags]=*`
   * - Sort: `sort=createdAt:desc`
   * - Pagination: `pagination[page]=N`, `pagination[pageSize]=N`
   * 
   * @param params - Pagination parameters
   * @returns List of normalized log posts
   */
  async getLogs(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<{ data: NormalizedPost[]; pagination: { page: number; pageSize: number; pageCount: number; total: number } | undefined }> {
    const { page = 1, pageSize = 25 } = params || {};

    const response = await this.fetch<StrapiResponse<StrapiLog[]>>(
      `/logs?filters[status][$eq]=published&populate[tags]=*&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    );

    return {
      data: response.data.map(post => this.normalizePost(post, 'log')),
      pagination: response.meta.pagination,
    };
  }

  /**
   * Get published grimoires.
   * 
   * Strapi v4 Query Format:
   * - Filter by status: `filters[status][$eq]=published`
   * - Populate relations: `populate[tags]=*`, `populate[heroImage]=*`
   * - Sort: `sort=createdAt:desc`
   * - Pagination: `pagination[page]=N`, `pagination[pageSize]=N`
   * 
   * @param params - Pagination parameters
   * @returns List of normalized grimoire posts
   */
  async getGrimoires(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<{ data: NormalizedPost[]; pagination: { page: number; pageSize: number; pageCount: number; total: number } | undefined }> {
    const { page = 1, pageSize = 25 } = params || {};

    const response = await this.fetch<StrapiResponse<StrapiGrimoire[]>>(
      `/grimoires?filters[status][$eq]=published&populate[tags]=*&populate[heroImage]=*&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    );

    return {
      data: response.data.map(post => this.normalizePost(post, 'grimoire')),
      pagination: response.meta.pagination,
    };
  }

  /**
   * Get a single post by its slug.
   * Can search in a specific collection (log or grimoire) or both.
   * 
   * Strapi v4 Query Format:
   * - Filter by slug: `filters[slug][$eq]=slug-value`
   * - Filter by status: `filters[status][$eq]=published`
   * - Populate relations: `populate[tags]=*`, `populate[heroImage]=*`
   * 
   * @param slug - The post's URL slug
   * @param type - Optional type to search in a specific collection
   * @returns The normalized post or null if not found
   */
  async getPostBySlug(
    slug: string,
    type?: 'log' | 'grimoire'
  ): Promise<NormalizedPost | null> {
    // URL encode the slug to prevent injection
    const encodedSlug = encodeURIComponent(slug);
    
    if (type) {
      // Search in specific collection using Strapi v4 query syntax
      const endpoint =
        type === 'log'
          ? `/logs?filters[slug][$eq]=${encodedSlug}&filters[status][$eq]=published&populate[tags]=*`
          : `/grimoires?filters[slug][$eq]=${encodedSlug}&filters[status][$eq]=published&populate[tags]=*&populate[heroImage]=*`;

      const response = await this.fetch<
        StrapiResponse<(StrapiLog | StrapiGrimoire)[]>
      >(endpoint);

      if (response.data.length === 0) {
        return null;
      }

      return this.normalizePost(response.data[0], type);
    }

    // Search both collections using Strapi v4 query syntax
    try {
      const logResponse = await this.fetch<StrapiResponse<StrapiLog[]>>(
        `/logs?filters[slug][$eq]=${encodedSlug}&filters[status][$eq]=published&populate[tags]=*`
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
        `/grimoires?filters[slug][$eq]=${encodedSlug}&filters[status][$eq]=published&populate[tags]=*&populate[heroImage]=*`
      );

      if (grimoireResponse.data.length > 0) {
        return this.normalizePost(grimoireResponse.data[0], 'grimoire');
      }
    } catch {
      // Not found in either collection
    }

    return null;
  }

  /**
   * Get all available tags.
   * 
   * Strapi v4 Query Format:
   * - Sort: `sort=name:asc`
   * 
   * Note: Tags don't require status filtering as they are simple lookup values.
   * 
   * @returns Array of tag objects with id, name, and slug
   */
  async getTags(): Promise<Array<{ id: number; name: string; slug: string }>> {
    const response = await this.fetch<
      StrapiResponse<Array<{ id: number; attributes: { name: string; slug: string } }>>
    >(`/tags?sort=name:asc`);

    // Safely handle missing or malformed tag data
    return response.data.map((tag) => ({
      id: tag.id,
      name: tag.attributes?.name || '',
      slug: tag.attributes?.slug || '',
    }));
  }
}

export const strapiAPI = new StrapiAPI();
export { StrapiAPIError };
