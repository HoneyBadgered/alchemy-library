# API Routes Documentation

## Overview

This document details all REST API endpoints available for The Alchemy Table Library, including public and protected routes, request/response examples, and usage guidelines.

## Base URL

- **Development:** `http://localhost:1337/api`
- **Production:** `https://your-domain.com/api`

## Authentication

### Public Endpoints
No authentication required for reading published content.

### Admin/Protected Endpoints
Require JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Public Endpoints

### 1. List Published Log Entries

**Endpoint:** `GET /api/logs`

**Description:** Returns published Log entries.

**Query Parameters (Strapi v5 format):**
- `filters[status][$eq]=published` - Filter for published content only using Strapi v5 filter syntax
- `populate=tags` - Include related tags
- `sort=createdAt:desc` - Sort order
- `pagination[page]` - Page number
- `pagination[pageSize]` - Items per page

**Example Request:**
```bash
curl 'http://localhost:1337/api/logs?filters[status][$eq]=published&populate=tags&sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=10'
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Welcome to the Alchemy Library",
        "slug": "welcome-to-the-alchemy-library",
        "body": "<p>Content here...</p>",
        "excerpt": "An introduction to our library",
        "author": "The Alchemy Team",
        "createdAt": "2025-11-23T10:00:00.000Z",
        "updatedAt": "2025-11-23T10:30:00.000Z",
        "publishedAt": "2025-11-23T10:30:00.000Z",
        "tags": {
          "data": [
            {
              "id": 1,
              "attributes": {
                "name": "announcement",
                "slug": "announcement"
              }
            }
          ]
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 3,
      "total": 25
    }
  }
}
```

---

### 2. List Published Grimoire Entries

**Endpoint:** `GET /api/grimoires`

**Description:** Returns published Grimoire entries.

**Query Parameters (Strapi v5 format):** Same as Log endpoints, plus:
- `populate=tags,heroImage` - Include tags and hero image media

**Example Request:**
```bash
curl 'http://localhost:1337/api/grimoires?filters[status][$eq]=published&populate=tags,heroImage&sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=10'
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Getting Started Guide",
        "slug": "getting-started-guide",
        "body": "<p>Detailed guide content...</p>",
        "excerpt": "Complete guide to getting started",
        "author": "The Alchemy Team",
        "category": "Guides",
        "heroImage": {
          "data": {
            "id": 1,
            "attributes": {
              "url": "/uploads/hero_image.jpg",
              "alternativeText": "Hero image",
              "formats": {
                "large": { "url": "/uploads/large_hero_image.jpg" },
                "medium": { "url": "/uploads/medium_hero_image.jpg" },
                "small": { "url": "/uploads/small_hero_image.jpg" },
                "thumbnail": { "url": "/uploads/thumbnail_hero_image.jpg" }
              }
            }
          }
        },
        "tags": {
          "data": [
            {
              "id": 2,
              "attributes": {
                "name": "tutorial",
                "slug": "tutorial"
              }
            }
          ]
        },
        "createdAt": "2025-11-22T15:00:00.000Z",
        "updatedAt": "2025-11-22T16:00:00.000Z",
        "publishedAt": "2025-11-22T16:00:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 3,
      "total": 22
    }
  }
}
```

---

### 3. Get Single Log by Slug

**Endpoint:** `GET /api/logs`

**Description:** Fetch a specific Log entry by its slug.

**Query Parameters (Strapi v5 format):**
- `filters[slug][$eq]=your-slug-here` - Filter by slug using Strapi v5 filter syntax
- `filters[status][$eq]=published` - Only published content
- `populate=tags` - Include tags

**Example Request:**
```bash
curl 'http://localhost:1337/api/logs?filters[slug][$eq]=welcome-to-the-alchemy-library&filters[status][$eq]=published&populate=tags'
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Welcome to the Alchemy Library",
        "slug": "welcome-to-the-alchemy-library",
        "body": "<p>Full content here...</p>",
        "excerpt": "An introduction to our library",
        "author": "The Alchemy Team",
        "createdAt": "2025-11-23T10:00:00.000Z",
        "updatedAt": "2025-11-23T10:30:00.000Z",
        "publishedAt": "2025-11-23T10:30:00.000Z",
        "tags": {
          "data": [
            {
              "id": 1,
              "attributes": {
                "name": "announcement",
                "slug": "announcement"
              }
            }
          ]
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

---

### 4. Get Single Grimoire by Slug

**Endpoint:** `GET /api/grimoires`

**Description:** Fetch a specific Grimoire entry by its slug.

**Query Parameters (Strapi v5 format):** Same as Log by slug, plus:
- `populate=tags,heroImage` - Include tags and hero image

**Example Request:**
```bash
curl 'http://localhost:1337/api/grimoires?filters[slug][$eq]=getting-started-guide&filters[status][$eq]=published&populate=tags,heroImage'
```

---

### 5. List All Tags

**Endpoint:** `GET /api/tags`

**Description:** Returns all tags.

**Example Request:**
```bash
curl 'http://localhost:1337/api/tags'
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "announcement",
        "slug": "announcement",
        "createdAt": "2025-11-20T10:00:00.000Z",
        "updatedAt": "2025-11-20T10:00:00.000Z"
      }
    },
    {
      "id": 2,
      "attributes": {
        "name": "tutorial",
        "slug": "tutorial",
        "createdAt": "2025-11-20T10:05:00.000Z",
        "updatedAt": "2025-11-20T10:05:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 15
    }
  }
}
```

---

## Admin/Protected Endpoints

### 6. Create Content

**Endpoint:** `POST /api/logs` or `POST /api/grimoires`

**Description:** Create a new entry (saved as draft by default).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "data": {
    "title": "My New Post",
    "body": "<p>Content here...</p>",
    "excerpt": "A brief description",
    "author": "Your Name"
  }
}
```

---

### 7. Update Content

**Endpoint:** `PUT /api/logs/:id` or `PUT /api/grimoires/:id`

**Description:** Update an existing entry.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "data": {
    "title": "Updated Title",
    "body": "<p>Updated content...</p>"
  }
}
```

---

### 8. Publish Content

**Endpoint:** `POST /api/logs/:id/publish` or `POST /api/grimoires/:id/publish`

**Description:** Publish a draft entry (Strapi built-in action).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### 9. Unpublish Content

**Endpoint:** `POST /api/logs/:id/unpublish` or `POST /api/grimoires/:id/unpublish`

**Description:** Unpublish a published entry (Strapi built-in action).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### 10. Delete Content

**Endpoint:** `DELETE /api/logs/:id` or `DELETE /api/grimoires/:id`

**Description:** Delete an entry.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Filtering and Sorting

### Filter by Tag
```
GET /api/logs?filters[tags][slug][$eq]=tutorial
```

### Filter by Date Range
```
GET /api/logs?filters[createdAt][$gte]=2025-11-01&filters[createdAt][$lte]=2025-11-30
```

### Sort by Multiple Fields
```
GET /api/logs?sort[0]=createdAt:desc&sort[1]=title:asc
```

### Search by Title
```
GET /api/logs?filters[title][$containsi]=welcome
```

---

## Pagination

Strapi uses offset-based pagination:

```
GET /api/logs?pagination[page]=2&pagination[pageSize]=10
```

### Pagination Response
```json
{
  "meta": {
    "pagination": {
      "page": 2,
      "pageSize": 10,
      "pageCount": 5,
      "total": 47
    }
  }
}
```

---

## Population (Relations)

### Populate all relations
```
GET /api/logs?populate=*
```

### Populate specific relations
```
GET /api/grimoires?populate=tags,heroImage
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Invalid request parameters",
    "details": {}
  }
}
```

### 401 Unauthorized
```json
{
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Missing or invalid credentials"
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "status": 403,
    "name": "ForbiddenError",
    "message": "You don't have permission to perform this action"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Resource not found"
  }
}
```

---

## Rate Limiting

Strapi has built-in rate limiting. Default limits:
- Public endpoints: 100 requests per minute
- Authenticated endpoints: 1000 requests per minute

Configure in `config/middlewares.ts` if needed.

---

## Next Steps

- ✅ Check [Admin Workflow Guide](./ADMIN_WORKFLOW.md) for content management
- ✅ See [Deployment Guide](../DEPLOYMENT.md) for production

---

## Additional Resources

- [Strapi REST API Documentation](https://docs.strapi.io/dev-docs/api/rest)
- [Filtering Documentation](https://docs.strapi.io/dev-docs/api/rest/filters-locale-publication)
- [Population Documentation](https://docs.strapi.io/dev-docs/api/rest/populate-select)
- [Draft & Publish](https://docs.strapi.io/user-docs/content-manager/saving-and-publishing-content)
