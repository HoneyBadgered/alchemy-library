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

### 1. List All Published Posts (Combined Feed)

**Endpoint:** `GET /api/library`

**Description:** Returns all published Log and Grimoire entries combined, sorted by creation date.

**Query Parameters:**
- `page` (number, default: 1) - Page number for pagination
- `pageSize` (number, default: 25, max: 100) - Items per page
- `sort` (string, default: 'createdAt:desc') - Sort order
- `filters` (object) - Filter criteria

**Example Request:**
```bash
curl 'http://localhost:1337/api/library?page=1&pageSize=10&sort=createdAt:desc'
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "type": "log",
      "attributes": {
        "title": "Welcome to the Alchemy Library",
        "slug": "welcome-to-the-alchemy-library",
        "postType": "log",
        "status": "published",
        "publishedBody": "<p>Content here...</p>",
        "excerpt": "An introduction to our library",
        "author": "The Alchemy Team",
        "createdAt": "2025-11-23T10:00:00.000Z",
        "updatedAt": "2025-11-23T10:30:00.000Z",
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
    },
    {
      "id": 1,
      "type": "grimoire",
      "attributes": {
        "title": "Getting Started Guide",
        "slug": "getting-started-guide",
        "postType": "grimoire",
        "status": "published",
        "publishedBody": "<p>Detailed guide content...</p>",
        "excerpt": "Complete guide to getting started",
        "author": "The Alchemy Team",
        "category": "Guides",
        "heroImage": {
          "data": {
            "id": 1,
            "attributes": {
              "url": "/uploads/hero_image.jpg",
              "formats": {
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
        "updatedAt": "2025-11-22T16:00:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 5,
      "total": 47
    }
  }
}
```

---

### 2. List Published Log Entries

**Endpoint:** `GET /api/logs`

**Description:** Returns only published Log entries.

**Query Parameters:**
- `filters[status][$eq]=published` - Filter for published only
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
        "postType": "log",
        "status": "published",
        "publishedBody": "<p>Content here...</p>",
        "excerpt": "An introduction to our library",
        "author": "The Alchemy Team",
        "createdAt": "2025-11-23T10:00:00.000Z",
        "updatedAt": "2025-11-23T10:30:00.000Z",
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

### 3. List Published Grimoire Entries

**Endpoint:** `GET /api/grimoires`

**Description:** Returns only published Grimoire entries.

**Query Parameters:** Same as Log endpoints

**Example Request:**
```bash
curl 'http://localhost:1337/api/grimoires?filters[status][$eq]=published&populate[tags]=*&populate[heroImage]=*&sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=10'
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
        "postType": "grimoire",
        "status": "published",
        "publishedBody": "<p>Detailed guide content...</p>",
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
        "updatedAt": "2025-11-22T16:00:00.000Z"
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

### 4. Get Single Log by Slug

**Endpoint:** `GET /api/logs`

**Description:** Fetch a specific Log entry by its slug.

**Query Parameters:**
- `filters[slug][$eq]=your-slug-here` - Filter by slug
- `filters[status][$eq]=published` - Only published
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
        "postType": "log",
        "status": "published",
        "publishedBody": "<p>Full content here...</p>",
        "excerpt": "An introduction to our library",
        "author": "The Alchemy Team",
        "createdAt": "2025-11-23T10:00:00.000Z",
        "updatedAt": "2025-11-23T10:30:00.000Z",
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

### 5. Get Single Grimoire by Slug

**Endpoint:** `GET /api/grimoires`

**Description:** Fetch a specific Grimoire entry by its slug.

**Query Parameters:** Same as Log by slug

**Example Request:**
```bash
curl 'http://localhost:1337/api/grimoires?filters[slug][$eq]=getting-started-guide&filters[status][$eq]=published&populate[tags]=*&populate[heroImage]=*'
```

---

### 6. List All Tags

**Endpoint:** `GET /api/tags`

**Description:** Returns all tags with their associated content counts.

**Example Request:**
```bash
curl 'http://localhost:1337/api/tags?populate[logs][count]=true&populate[grimoires][count]=true'
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

### 7. Approve Draft

**Endpoint:** `PUT /api/logs/:id/approve` or `PUT /api/grimoires/:id/approve`

**Description:** Approve a draft, copy `draftBody` to `publishedBody`, and set status to `published`.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Example Request:**
```bash
curl -X PUT 'http://localhost:1337/api/logs/1/approve' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json'
```

**Example Response:**
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Welcome to the Alchemy Library",
      "slug": "welcome-to-the-alchemy-library",
      "status": "published",
      "publishedBody": "<p>Approved content...</p>",
      "updatedAt": "2025-11-23T11:00:00.000Z"
    }
  }
}
```

---

### 8. Reject Draft

**Endpoint:** `PUT /api/logs/:id/reject` or `PUT /api/grimoires/:id/reject`

**Description:** Reject a draft and set status to `needs_changes`.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "data": {
    "feedback": "Please add more details about the implementation"
  }
}
```

**Example Request:**
```bash
curl -X PUT 'http://localhost:1337/api/logs/1/reject' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"data":{"feedback":"Please add more details"}}'
```

**Example Response:**
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Welcome to the Alchemy Library",
      "status": "needs_changes",
      "updatedAt": "2025-11-23T11:05:00.000Z"
    }
  }
}
```

---

### 9. Trigger AI Rewrite

**Endpoint:** `POST /api/logs/:id/regenerate` or `POST /api/grimoires/:id/regenerate`

**Description:** Trigger AI to regenerate the draft body.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body (optional):**
```json
{
  "data": {
    "instructions": "Make it more technical and add code examples"
  }
}
```

**Example Request:**
```bash
curl -X POST 'http://localhost:1337/api/logs/1/regenerate' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"data":{"instructions":"Make it more technical"}}'
```

**Example Response:**
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "status": "pending_ai",
      "updatedAt": "2025-11-23T11:10:00.000Z"
    }
  },
  "message": "AI regeneration queued"
}
```

---

### 10. Publish Article

**Endpoint:** `PUT /api/logs/:id` or `PUT /api/grimoires/:id`

**Description:** Manually publish an article by updating its status.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "data": {
    "status": "published",
    "publishedBody": "<p>Final published content...</p>"
  }
}
```

**Example Request:**
```bash
curl -X PUT 'http://localhost:1337/api/logs/1' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"data":{"status":"published","publishedBody":"<p>Content...</p>"}}'
```

---

## Filtering and Sorting

### Filter by Status
```
GET /api/logs?filters[status][$eq]=published
```

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
GET /api/grimoires?populate[tags]=*&populate[heroImage]=*
```

### Deep populate
```
GET /api/grimoires?populate[tags][populate][logs][count]=true
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

- ✅ Review [AI Workflow Guide](./AI_WORKFLOW.md) for automation
- ✅ Check [Frontend Integration](./FRONTEND_INTEGRATION.md) for React setup
- ✅ See [Deployment Guide](./DEPLOYMENT.md) for production

---

## Additional Resources

- [Strapi REST API Documentation](https://docs.strapi.io/dev-docs/api/rest)
- [Filtering Documentation](https://docs.strapi.io/dev-docs/api/rest/filters-locale-publication)
- [Population Documentation](https://docs.strapi.io/dev-docs/api/rest/populate-select)
