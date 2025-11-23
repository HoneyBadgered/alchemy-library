import type { Article } from '../types';

export const articles: Article[] = [
  {
    id: '1',
    title: 'Getting Started with Knowledge Management',
    date: '2025-11-22',
    category: 'Guides',
    excerpt: 'A comprehensive guide to organizing and managing your knowledge effectively.',
    content: `# Getting Started with Knowledge Management

Knowledge management is the process of creating, sharing, using and managing knowledge and information.

## Core Concepts

### 1. Capture
Document insights and learnings as they happen. Use various formats:
- Written notes
- Code snippets
- Diagrams
- References

### 2. Organize
Structure your knowledge for easy retrieval:
- Use consistent categorization
- Tag appropriately
- Create hierarchies
- Link related concepts

### 3. Share
Make knowledge accessible to others:
- Clear documentation
- Searchable repositories
- Regular updates
- Multiple formats

### 4. Maintain
Keep knowledge current and relevant:
- Review regularly
- Update outdated information
- Archive obsolete content
- Solicit feedback

## Practical Tips

- Start small and iterate
- Use tools that fit your workflow
- Build habits around documentation
- Make it easy to contribute

## Conclusion

Effective knowledge management is a skill that improves with practice. Start today!`,
    author: 'The Alchemy Team'
  },
  {
    id: '2',
    title: 'Markdown Best Practices',
    date: '2025-11-18',
    category: 'Technical',
    excerpt: 'Learn how to write effective documentation using Markdown.',
    content: `# Markdown Best Practices

Markdown is a lightweight markup language that's perfect for documentation.

## Why Markdown?

- Simple and readable
- Easy to learn
- Widely supported
- Version control friendly
- Portable

## Essential Syntax

### Headers
Use \`#\` for headers. More \`#\` means smaller headers.

### Lists
- Unordered lists use \`-\` or \`*\`
- Numbered lists use \`1.\`, \`2.\`, etc.

### Emphasis
- *Italic* with \`*text*\`
- **Bold** with \`**text**\`

### Code
Inline code with \`backticks\` or code blocks with triple backticks.

### Links
[Link text](URL)

## Documentation Structure

1. **Title**: Clear and descriptive
2. **Introduction**: What and why
3. **Body**: Detailed information
4. **Examples**: Practical demonstrations
5. **Conclusion**: Summary and next steps

## Tips

- Keep paragraphs short
- Use headers for structure
- Include examples
- Link to related content
- Use consistent formatting

Happy documenting!`,
    author: 'The Alchemy Team'
  },
  {
    id: '3',
    title: 'Creating Effective Learning Resources',
    date: '2025-11-10',
    category: 'Education',
    excerpt: 'Principles for creating educational content that actually helps people learn.',
    content: `# Creating Effective Learning Resources

Good educational content goes beyond just presenting information—it helps people truly understand and apply concepts.

## Key Principles

### 1. Know Your Audience
- Understand their background
- Assess their current knowledge
- Identify their goals
- Consider their constraints

### 2. Structure for Learning
- Start with fundamentals
- Build concepts progressively
- Provide context
- Show real-world applications

### 3. Use Multiple Formats
Different people learn differently:
- Written explanations
- Visual diagrams
- Code examples
- Interactive exercises
- Video tutorials

### 4. Make It Practical
- Include hands-on examples
- Provide exercises
- Show common pitfalls
- Offer troubleshooting tips

### 5. Iterate and Improve
- Gather feedback
- Update based on questions
- Fix errors promptly
- Expand on unclear sections

## Content Types

### Tutorials
Step-by-step guides for specific tasks.

### Conceptual Guides
Deep dives into how things work.

### Reference Material
Quick lookups for syntax and APIs.

### Case Studies
Real-world applications and examples.

## Conclusion

Creating great learning resources takes time and iteration. Focus on clarity, practicality, and empathy for the learner.`,
    author: 'The Alchemy Team'
  }
];
