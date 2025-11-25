# The Alchemy Table Library - Strapi Integration

## 🧪 Overview

This repository contains a complete Strapi CMS backend integration for The Alchemy Table Library, featuring:

- **Automated AI Content Generation** using OpenAI
- **Two Content Types**: Log (short-form) and Grimoire (long-form)
- **Email Workflow** for draft approval
- **React 19 + TypeScript + Vite** frontend
- **Complete API Documentation**
- **Production-Ready Deployment Guides**

## 📁 Project Structure

```
alchemy-library/
├── backend/                    # Strapi CMS Backend
│   ├── src/
│   │   ├── api/
│   │   │   ├── log/           # Log content type
│   │   │   ├── grimoire/      # Grimoire content type
│   │   │   └── tag/           # Tag content type
│   │   └── services/          # AI & Email services (to be implemented)
│   ├── config/                # Strapi configuration
│   ├── SETUP.md              # Backend setup guide
│   ├── API_ROUTES.md         # API documentation
│   ├── AI_WORKFLOW.md        # AI automation guide
│   └── ADMIN_WORKFLOW.md     # Admin user guide
│
├── src/                       # React Frontend
│   ├── components/            # React components
│   ├── pages/                # Route pages
│   ├── types/                # TypeScript definitions
│   └── services/             # API client (to be implemented)
│
├── FRONTEND_INTEGRATION.md    # Frontend integration guide
├── DEPLOYMENT.md             # Deployment guide
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 6.0.0
- Git

### 1. Clone Repository

```bash
git clone https://github.com/HoneyBadgered/alchemy-library.git
cd alchemy-library
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run develop
```

**Access admin panel**: http://localhost:1337/admin

See [backend/SETUP.md](./backend/SETUP.md) for detailed instructions.

### 3. Frontend Setup

```bash
# From project root
npm install
npm run dev
```

**Access frontend**: http://localhost:5173

See [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) for React integration.

## 📚 Documentation

### Backend Documentation

- **[SETUP.md](./backend/SETUP.md)** - Complete Strapi setup guide
  - Installation instructions
  - Database configuration
  - CORS setup
  - Collection type schemas
  - Permissions configuration

- **[API_ROUTES.md](./backend/API_ROUTES.md)** - REST API documentation
  - Public endpoints (read published content)
  - Admin endpoints (approve/reject/publish)
  - Request/response examples
  - Filtering and pagination
  - Error handling

- **[AI_WORKFLOW.md](./backend/AI_WORKFLOW.md)** - AI automation system
  - Lifecycle hooks
  - OpenAI integration
  - Email notifications
  - Approve/reject workflow
  - Custom controllers

- **[ADMIN_WORKFLOW.md](./backend/ADMIN_WORKFLOW.md)** - Admin user guide
  - Creating content
  - Reviewing AI drafts
  - Publishing workflow
  - Managing tags
  - Media management

### Frontend Documentation

- **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)** - React integration
  - Environment setup
  - TypeScript definitions
  - API service layer
  - React components (LibraryList, LogList, GrimoireList)
  - Routing configuration
  - SEO considerations

### Deployment Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment
  - Railway, Render, DigitalOcean, Docker
  - Vercel, Netlify, Cloudflare Pages
  - Environment variables
  - Database migration
  - SSL/HTTPS setup
  - Monitoring and maintenance

## 🎯 Features

### Content Types

#### Log (Short-form)
- Quick posts, updates, announcements
- 300-800 words
- Conversational tone
- Status workflow: pending_ai → draft_ready → published

#### Grimoire (Long-form)
- Comprehensive guides, tutorials
- 1000-3000 words
- Authoritative tone
- Hero images, categories, tags
- Same workflow as Log

#### Tags
- Shared between Log and Grimoire
- Many-to-many relationships
- Auto-generated slugs

### AI Workflow

1. **Create Entry** - Add title, set status to "pending_ai"
2. **AI Generation** - OpenAI automatically generates draft
3. **Email Notification** - Receive email with draft preview
4. **Review** - Edit in Strapi admin panel
5. **Approve/Reject** - Click to publish or request changes
6. **Publish** - Content goes live on your site

### API Endpoints

#### Public (No Auth)
- `GET /api/logs` - List published logs
- `GET /api/grimoires` - List published grimoires
- `GET /api/library` - Combined feed (both types)
- Filter by slug, tags, date, etc.

#### Protected (Admin)
- `PUT /api/logs/:id/approve` - Approve and publish
- `PUT /api/logs/:id/reject` - Request changes
- `POST /api/logs/:id/regenerate` - Trigger AI rewrite

## 🛠️ Technology Stack

### Backend
- **Strapi 5.8.0** - Headless CMS
- **PostgreSQL** - Production database
- **SQLite** - Development database
- **OpenAI API** - AI content generation
- **Nodemailer** - Email notifications
- **TypeScript** - Type safety

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Client-side routing

## 📝 Environment Variables

### Backend (.env)

```env
# Required
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=salt
ADMIN_JWT_SECRET=secret
DATABASE_CLIENT=sqlite  # or postgres
FRONTEND_URL=http://localhost:5173

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# OpenAI
OPENAI_API_KEY=sk-your-key
```

### Frontend (.env)

```env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_URL=http://localhost:1337/api
```

## 🎨 Frontend Routes

- `/` - Homepage
- `/library` - Combined feed (all posts)
- `/library/log` - Log entries only
- `/library/grimoire` - Grimoire entries only
- `/library/log/:slug` - Individual log post
- `/library/grimoire/:slug` - Individual grimoire article

## 🔐 Security

- JWT authentication for admin endpoints
- CORS configured for frontend
- Rate limiting on API endpoints
- Secure secret key generation
- SQL injection prevention
- XSS protection

## 📖 Usage Examples

### Creating a Log Entry

```javascript
// POST /api/logs
{
  "data": {
    "title": "Getting Started with TypeScript",
    "status": "pending_ai"
  }
}

// AI generates draft automatically
// Email notification sent
// Review in admin panel
// Approve to publish
```

### Fetching Published Posts

```javascript
// GET /api/logs?filters[status][$eq]=published&populate=tags
// Uses Strapi v5 query syntax:
// - filters[status][$eq]=published for filtering published content
// - populate=tags for including related tags

{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Getting Started with TypeScript",
        "slug": "getting-started-with-typescript",
        "publishedBody": "<p>Content...</p>",
        "tags": { "data": [...] }
      }
    }
  ]
}
```

## 🚦 Workflow Status

- `pending_ai` - Waiting for AI generation
- `draft_ready` - Ready for review
- `needs_changes` - Rejected, needs editing
- `published` - Live on website

## 🧪 Testing

### Test Backend

```bash
cd backend
npm run develop
# Access http://localhost:1337/admin
# Create test entry with status "pending_ai"
# Check email for draft notification
```

### Test Frontend

```bash
npm run dev
# Access http://localhost:5173
# Navigate to /library routes
# Verify content displays
```

## 📦 Deployment

### Backend Options
- Railway (recommended for beginners)
- Render
- DigitalOcean App Platform
- Docker/VPS

### Frontend Options
- Vercel (recommended)
- Netlify
- Cloudflare Pages
- Static hosting (S3, GitHub Pages)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

This is a standalone project designed for The Alchemy Table Library. Contributions welcome!

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Strapi team for the excellent CMS
- OpenAI for GPT-4 API
- React team for React 19
- Vite team for the build tool

## 📞 Support

For issues or questions:

1. Check the documentation files
2. Review Strapi logs
3. Open an issue on GitHub
4. Check Strapi Discord community

## 🗺️ Roadmap

### Current Features ✅
- [x] Strapi backend structure
- [x] Collection type schemas
- [x] Configuration files
- [x] Comprehensive documentation
- [x] API route specifications
- [x] AI workflow design
- [x] Frontend integration guide
- [x] Deployment guides

### To Be Implemented
- [ ] AI service implementation (OpenAI integration)
- [ ] Email service implementation (Nodemailer)
- [ ] Lifecycle hooks
- [ ] Custom controllers
- [ ] Frontend components
- [ ] API client service
- [ ] Testing suite
- [ ] CI/CD pipeline

## 🎓 Learning Resources

- [Strapi Documentation](https://docs.strapi.io)
- [React 19 Documentation](https://react.dev)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Vite Documentation](https://vitejs.dev)

---

**Built with ❤️ for The Alchemy Table Library**

*Transform knowledge into wisdom through the magic of automation* ✨
