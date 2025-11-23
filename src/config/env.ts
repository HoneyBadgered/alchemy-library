// Configuration for environment variables
export const config = {
  strapi: {
    url: import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337',
    apiUrl: import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337/api',
  },
  enableDraftPreview: import.meta.env.VITE_ENABLE_DRAFT_PREVIEW === 'true',
};
