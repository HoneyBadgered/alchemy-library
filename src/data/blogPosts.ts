import type { BlogPost } from '../types';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Welcome to the Alchemy Library Log',
    date: '2025-11-23',
    excerpt: 'An introduction to our new blog and what you can expect from regular updates.',
    content: `# Welcome to the Alchemy Library Log

This is the first entry in our log. Here we'll share regular updates, announcements, and thoughts on various topics.

## What to Expect

- Regular updates on new content
- Announcements about new features
- Behind-the-scenes insights
- Community highlights

Stay tuned for more posts!`,
    author: 'The Alchemy Team'
  },
  {
    id: '2',
    title: 'Building a Knowledge Repository',
    date: '2025-11-20',
    excerpt: 'Thoughts on creating and maintaining a structured knowledge base.',
    content: `# Building a Knowledge Repository

Creating a structured knowledge repository requires careful planning and organization.

## Key Principles

1. **Clarity**: Information should be easy to find and understand
2. **Structure**: Logical organization of content
3. **Accessibility**: Easy navigation and discovery
4. **Maintenance**: Regular updates and improvements

This log will document our journey in building such a system.`,
    author: 'The Alchemy Team'
  },
  {
    id: '3',
    title: 'The Importance of Documentation',
    date: '2025-11-15',
    excerpt: 'Why good documentation matters and how we approach it.',
    content: `# The Importance of Documentation

Documentation is the foundation of any successful knowledge-sharing project.

## Why Documentation Matters

- Preserves institutional knowledge
- Enables self-service learning
- Reduces repetitive questions
- Improves onboarding
- Scales knowledge sharing

We're committed to creating high-quality documentation that serves our community.`,
    author: 'The Alchemy Team'
  }
];
