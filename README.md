# Alchemy Library

A standalone site featuring a blog (Log) and articles section (Grimoire), built with TypeScript and React.

## 🧪 Overview

The Alchemy Library is a knowledge repository designed to organize and share content through two main sections:

- **The Log**: Regular blog posts, updates, and announcements
- **The Grimoire**: Comprehensive guides, tutorials, and evergreen articles

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The site will be available at `http://localhost:5173/`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Navigation.tsx
│   └── Navigation.css
├── pages/           # Route pages
│   ├── HomePage.tsx
│   ├── LogPage.tsx
│   ├── BlogPostPage.tsx
│   ├── GrimoirePage.tsx
│   └── ArticlePage.tsx
├── data/            # Content data
│   ├── blogPosts.ts
│   └── articles.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── App.tsx          # Main application component
├── main.tsx         # Application entry point
└── index.css        # Global styles
```

## 📝 Adding Content

### Adding a Blog Post (Log Entry)

Edit `src/data/blogPosts.ts` and add a new entry to the array:

```typescript
{
  id: '4',
  title: 'Your Blog Post Title',
  date: '2025-11-25',
  excerpt: 'A brief description of the post',
  content: `# Your Blog Post Title

Your full content here in markdown format...`,
  author: 'Author Name'
}
```

### Adding an Article (Grimoire Entry)

Edit `src/data/articles.ts` and add a new entry to the array:

```typescript
{
  id: '4',
  title: 'Your Article Title',
  date: '2025-11-25',
  category: 'Category Name',
  excerpt: 'A brief description of the article',
  content: `# Your Article Title

Your full content here in markdown format...`,
  author: 'Author Name'
}
```

## 🔄 Future Migration to HoneyBadgered/alchemy

This site is designed as a standalone application that can be integrated into the main alchemy repository in the future. Here's how:

### Migration Strategy

1. **Content Structure**: The Log and Grimoire data are stored in separate files (`src/data/blogPosts.ts` and `src/data/articles.ts`), making them easy to migrate to a CMS or database.

2. **Component Independence**: All components are self-contained and can be moved into the main alchemy project's component library.

3. **Routing**: The React Router setup uses a standard structure that can be integrated into a larger routing system.

4. **Styling**: CSS files are modular and scoped to components, preventing conflicts when integrating.

### Migration Steps

1. **Move Data Layer**: 
   - Migrate blog posts and articles from TypeScript files to your preferred backend/CMS
   - Update data fetching to use API calls instead of imports

2. **Integrate Components**:
   - Copy component files to the main project's component directory
   - Update import paths as needed
   - Merge CSS with the main project's styling system

3. **Update Routing**:
   - Integrate routes into the main application's router
   - Update navigation links to match the main site structure

4. **Customize Branding**:
   - Update colors, fonts, and styling to match the main alchemy brand
   - Replace placeholder content with production content

## 🛠️ Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **CSS3** - Styling

## 📄 License

This project is part of the Alchemy Library ecosystem.
