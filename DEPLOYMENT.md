# Deployment Guide

## Overview

This guide covers deploying both the Strapi backend and React frontend for The Alchemy Table Library to various hosting platforms.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Strapi Backend Deployment](#strapi-backend-deployment)
3. [React Frontend Deployment](#react-frontend-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Migration](#database-migration)
6. [SSL/HTTPS Setup](#sslhttps-setup)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Pre-Deployment Checklist

### Backend
- [ ] Set up production database (PostgreSQL recommended)
- [ ] Configure environment variables
- [ ] Generate secure secret keys
- [ ] Configure SMTP for email notifications
- [ ] Set up OpenAI API key
- [ ] Test AI workflow locally
- [ ] Configure CORS for production frontend URL
- [ ] Set up file upload storage (local or cloud)

### Frontend
- [ ] Update Strapi URL in environment variables
- [ ] Test API integration
- [ ] Build and test production bundle
- [ ] Configure SEO meta tags
- [ ] Set up error tracking (optional)
- [ ] Test on multiple devices/browsers

---

## Strapi Backend Deployment

### Option 1: Railway

Railway provides easy deployment with PostgreSQL database included.

#### Step 1: Prepare Your Repository

```bash
cd backend
# Ensure package.json has correct scripts
cat package.json | grep -A 5 "scripts"
```

#### Step 2: Create Railway Project

1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Set root directory to `/backend`

#### Step 3: Add PostgreSQL Database

1. Click "+ New" → "Database" → "PostgreSQL"
2. Railway automatically sets DATABASE_URL

#### Step 4: Configure Environment Variables

In Railway dashboard, add:

```env
NODE_ENV=production
APP_KEYS=generate-secure-key-1,generate-secure-key-2,generate-secure-key-3,generate-secure-key-4
API_TOKEN_SALT=generate-secure-salt
ADMIN_JWT_SECRET=generate-secure-secret
TRANSFER_TOKEN_SALT=generate-secure-salt
JWT_SECRET=generate-secure-secret

DATABASE_CLIENT=postgres
# DATABASE_URL is auto-set by Railway

FRONTEND_URL=https://your-frontend-domain.com

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM="Alchemy Library" <noreply@alchemy-library.com>
ADMIN_EMAIL=admin@alchemy-library.com

OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-4-turbo-preview

BASE_URL=https://your-backend.railway.app
FRONTEND_BASE_URL=https://your-frontend-domain.com
```

#### Step 5: Deploy

```bash
# Railway auto-deploys on git push
git push origin main
```

#### Step 6: Create Admin User

After first deployment:
1. Visit `https://your-backend.railway.app/admin`
2. Create your admin account

---

### Option 2: Render

#### Step 1: Create New Web Service

1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `alchemy-library-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Select appropriate plan

#### Step 2: Add PostgreSQL Database

1. Click "New +" → "PostgreSQL"
2. Name it and create
3. Copy the Internal Database URL

#### Step 3: Environment Variables

Add in Render dashboard:

```env
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=[paste-internal-database-url]

# Add all other variables from Railway example above
```

#### Step 4: Deploy

Render automatically deploys when you push to your repository.

---

### Option 3: DigitalOcean App Platform

#### Step 1: Create App

1. Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Select GitHub repository
4. Configure:
   - **Source Directory**: `/backend`
   - **Build Command**: `npm install && npm run build`
   - **Run Command**: `npm run start`

#### Step 2: Add Database

1. Click "Add Component" → "Database"
2. Select "PostgreSQL"
3. DigitalOcean auto-configures connection

#### Step 3: Environment Variables

Add via App Platform settings interface.

#### Step 4: Deploy

App Platform deploys automatically.

---

### Option 4: Docker Deployment (VPS/Self-Hosted)

#### Dockerfile

**`backend/Dockerfile`**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "start"]
```

#### docker-compose.yml

**`backend/docker-compose.yml`**

```yaml
version: '3.8'

services:
  strapi:
    build: .
    ports:
      - '1337:1337'
    environment:
      NODE_ENV: production
      DATABASE_CLIENT: postgres
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: strapi
      DATABASE_USERNAME: strapi
      DATABASE_PASSWORD: strapi
      DATABASE_SSL: false
    env_file:
      - .env
    volumes:
      - ./public/uploads:/app/public/uploads
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: strapi
      POSTGRES_USER: strapi
      POSTGRES_PASSWORD: strapi
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres-data:
```

#### Deploy

```bash
# On your VPS
git clone your-repo
cd backend
cp .env.example .env
# Edit .env with production values
docker-compose up -d
```

---

## React Frontend Deployment

### Option 1: Vercel

Perfect for React/Vite apps.

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Deploy

```bash
cd alchemy-library # root directory
vercel

# Or configure in vercel.json:
```

**`vercel.json`**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_STRAPI_URL": "https://your-backend.railway.app",
    "VITE_STRAPI_API_URL": "https://your-backend.railway.app/api"
  }
}
```

#### Step 3: Configure Environment

In Vercel dashboard → Settings → Environment Variables:

```
VITE_STRAPI_URL=https://your-backend.railway.app
VITE_STRAPI_API_URL=https://your-backend.railway.app/api
VITE_ENABLE_DRAFT_PREVIEW=false
```

---

### Option 2: Netlify

#### Step 1: Create netlify.toml

**`netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_STRAPI_URL = "https://your-backend.railway.app"
  VITE_STRAPI_API_URL = "https://your-backend.railway.app/api"
```

#### Step 2: Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

Or connect GitHub repository in Netlify dashboard.

---

### Option 3: Cloudflare Pages

#### Step 1: Connect Repository

1. Go to Cloudflare Pages dashboard
2. Click "Create a project"
3. Connect GitHub repository

#### Step 2: Configure Build

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (or leave empty)

#### Step 3: Environment Variables

Add in Cloudflare Pages settings:

```
VITE_STRAPI_URL=https://your-backend.railway.app
VITE_STRAPI_API_URL=https://your-backend.railway.app/api
```

---

### Option 4: Static Hosting (S3, GitHub Pages, etc.)

#### Build

```bash
npm run build
```

#### Deploy dist folder

Upload the `dist/` folder contents to your static hosting:

```bash
# AWS S3 example
aws s3 sync dist/ s3://your-bucket-name --delete

# GitHub Pages example
npm install -g gh-pages
gh-pages -d dist
```

---

## Environment Variables

### Backend (.env)

```env
# Required
NODE_ENV=production
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=salt
ADMIN_JWT_SECRET=secret
TRANSFER_TOKEN_SALT=salt
JWT_SECRET=secret

DATABASE_CLIENT=postgres
DATABASE_URL=your-postgres-url

# Optional but recommended
FRONTEND_URL=https://your-frontend.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=email@gmail.com
SMTP_PASSWORD=app-password
EMAIL_FROM=noreply@alchemy-library.com
ADMIN_EMAIL=admin@alchemy-library.com

# AI
OPENAI_API_KEY=sk-key
OPENAI_MODEL=gpt-4-turbo-preview

# URLs
BASE_URL=https://your-backend.com
FRONTEND_BASE_URL=https://your-frontend.com
```

### Frontend (.env.production)

```env
VITE_STRAPI_URL=https://your-backend.com
VITE_STRAPI_API_URL=https://your-backend.com/api
VITE_ENABLE_DRAFT_PREVIEW=false
```

---

## Database Migration

### From SQLite to PostgreSQL

#### Step 1: Export Data

```bash
# In local development
cd backend
npm run strapi export -- --file backup.tar.gz
```

#### Step 2: Import to Production

```bash
# On production server or via Strapi admin
npm run strapi import -- --file backup.tar.gz
```

#### Alternative: Manual Migration

1. Create content types in production Strapi
2. Export data as JSON from local
3. Import via Strapi Content API

---

## SSL/HTTPS Setup

### Railway/Render/Vercel/Netlify

SSL is automatically provided.

### Self-Hosted (Nginx + Let's Encrypt)

#### Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx
```

#### Nginx Configuration

**`/etc/nginx/sites-available/alchemy-library`**

```nginx
# Strapi Backend
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# React Frontend
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/alchemy-library/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Get SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com -d api.your-domain.com
```

---

## Asset Handling

### Strapi Uploads

#### Option 1: Local Storage (Default)

Files stored in `backend/public/uploads/`

Served at: `https://your-backend.com/uploads/filename.jpg`

#### Option 2: AWS S3

```bash
npm install @strapi/provider-upload-aws-s3
```

**`config/plugins.ts`**

```typescript
export default {
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET'),
        },
      },
    },
  },
};
```

#### Option 3: Cloudinary

```bash
npm install @strapi/provider-upload-cloudinary
```

Configure similarly in `config/plugins.ts`.

---

## Monitoring and Maintenance

### Health Checks

#### Strapi Health Endpoint

**`src/api/health/routes/health.ts`**

```typescript
export default {
  routes: [
    {
      method: 'GET',
      path: '/health',
      handler: 'health.check',
      config: {
        auth: false,
      },
    },
  ],
};
```

**`src/api/health/controllers/health.ts`**

```typescript
export default {
  async check(ctx) {
    ctx.body = {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  },
};
```

### Logging

#### Strapi Logs

Configure in `config/logger.ts`:

```typescript
export default {
  transports: [
    new winston.transports.Console({
      level: 'info',
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
  ],
};
```

### Backups

#### Automated Database Backups

```bash
# Cron job for daily backups
0 2 * * * pg_dump your_database > /backups/db-$(date +\%Y\%m\%d).sql
```

#### Strapi Content Backups

```bash
# Export data
npm run strapi export -- --file backup-$(date +%Y%m%d).tar.gz
```

### Updates

#### Strapi Updates

```bash
cd backend
npm outdated
npm update @strapi/strapi @strapi/plugin-users-permissions
npm run build
```

#### Frontend Updates

```bash
npm outdated
npm update react react-dom
npm run build
```

---

## Security Considerations

### 1. Rate Limiting

Configure in Strapi:

**`config/middlewares.ts`**

```typescript
{
  name: 'strapi::ratelimit',
  config: {
    interval: 60000, // 1 minute
    max: 100, // max 100 requests per minute
  },
}
```

### 2. Security Headers

Add to middleware config:

```typescript
{
  name: 'strapi::security',
  config: {
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'img-src': ["'self'", 'data:', 'blob:', 'https:'],
      },
    },
  },
}
```

### 3. API Tokens

Create API tokens in Strapi admin for programmatic access instead of using admin credentials.

### 4. HTTPS Only

Ensure all production traffic uses HTTPS.

### 5. Database Security

- Use strong passwords
- Limit database access to application only
- Enable SSL connections for database

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors

- Check `FRONTEND_URL` in backend `.env`
- Verify `config/middlewares.ts` includes frontend domain
- Restart Strapi after changes

#### 2. Database Connection Errors

- Verify DATABASE_URL format
- Check database is running
- Confirm firewall rules allow connection

#### 3. Build Failures

- Clear node_modules and reinstall
- Check Node.js version compatibility
- Review build logs for specific errors

#### 4. Email Not Sending

- Verify SMTP credentials
- Check email provider settings (Gmail: app passwords)
- Review Strapi logs for errors

---

## Performance Optimization

### Frontend

1. **Code Splitting**
```typescript
const LibraryList = lazy(() => import('./components/LibraryList'));
```

2. **Image Optimization**
   - Use Strapi image formats (thumbnail, medium, large)
   - Lazy load images

3. **Caching**
   - Implement service worker
   - Cache API responses

### Backend

1. **Database Indexing**
   - Add indexes on `slug` fields
   - Index `status` for filtering

2. **Response Caching**
   - Use Redis for caching
   - Cache published content

3. **CDN**
   - Use Cloudflare or similar
   - Cache static assets

---

## Summary Checklist

### Pre-Launch
- [ ] All environment variables set
- [ ] Database configured and backed up
- [ ] SSL certificates installed
- [ ] CORS configured correctly
- [ ] Email notifications tested
- [ ] AI workflow tested
- [ ] Performance tested
- [ ] Security reviewed
- [ ] Monitoring set up
- [ ] Backups automated

### Post-Launch
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Test all user workflows
- [ ] Verify email delivery
- [ ] Check AI generation
- [ ] Monitor API usage
- [ ] Review security

---

## Next Steps

- ✅ Review [Admin Workflow Guide](./ADMIN_WORKFLOW.md) for content management
- ✅ Set up monitoring and alerts
- ✅ Create backup procedures

---

## Additional Resources

- [Strapi Deployment Documentation](https://docs.strapi.io/dev-docs/deployment)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
