import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { strapiAPI, StrapiAPIError } from '../services/api';
import type { NormalizedPost } from '../types';
import './BlogPostPage.css';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<NormalizedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function loadPost() {
    if (!slug) return;

    try {
      setLoading(true);
      const data = await strapiAPI.getPostBySlug(slug, 'log');
      setPost(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof StrapiAPIError ? err.message : 'Failed to load post'
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  if (loading) {
    return (
      <div className="blog-post-page">
        <nav className="breadcrumb">
          <Link to="/log">← Back to Log</Link>
        </nav>
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="not-found">
        <h1>Post Not Found</h1>
        <p>{error || "The blog post you're looking for doesn't exist."}</p>
        <Link to="/log">← Back to Log</Link>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      <nav className="breadcrumb">
        <Link to="/log">← Back to Log</Link>
      </nav>

      <article className="blog-post">
        <header className="post-header">
          <h1>{post.title}</h1>
          <div className="post-info">
            <span className="post-date">{formatDate(post.createdAt)}</span>
            {post.author && (
              <span className="post-author">by {post.author}</span>
            )}
          </div>
        </header>

        <div className="post-content">
          {post.content.split('\n').map((line, index) => {
            if (line.startsWith('### ')) {
              return <h3 key={index}>{line.substring(4)}</h3>;
            } else if (line.startsWith('## ')) {
              return <h2 key={index}>{line.substring(3)}</h2>;
            } else if (line.startsWith('# ')) {
              return <h1 key={index}>{line.substring(2)}</h1>;
            } else if (line.startsWith('- ')) {
              return (
                <ul key={index}>
                  <li>{line.substring(2)}</li>
                </ul>
              );
            } else if (line.trim() === '') {
              return <br key={index} />;
            } else if (line.match(/^\d+\./)) {
              return (
                <ol key={index}>
                  <li>{line.substring(line.indexOf('.') + 2)}</li>
                </ol>
              );
            } else {
              return <p key={index}>{line}</p>;
            }
          })}
        </div>
      </article>
    </div>
  );
}
