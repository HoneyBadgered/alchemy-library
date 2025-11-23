import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { strapiAPI, StrapiAPIError } from '../services/api';
import type { NormalizedPost } from '../types';
import './LibraryPost.css';

export default function LibraryPost() {
  const { type, slug } = useParams<{ type: 'log' | 'grimoire'; slug: string }>();
  const [post, setPost] = useState<NormalizedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug && type) {
      loadPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, type]);

  async function loadPost() {
    if (!slug || !type) return;

    try {
      setLoading(true);
      const data = await strapiAPI.getPostBySlug(slug, type);
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
      <div className="library-post">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="library-post">
        <div className="error">
          <h2>Post Not Found</h2>
          <p>{error || 'The requested post could not be found.'}</p>
        </div>
      </div>
    );
  }

  // Redirect if type mismatch
  if (post.type !== type) {
    return <Navigate to={`/library/${post.type}/${post.slug}`} replace />;
  }

  return (
    <article className="library-post">
      {post.heroImage && (
        <div className="post-hero-image">
          <img src={post.heroImage} alt={post.title} />
        </div>
      )}

      <header className="post-header">
        <div className="post-type-badge">{post.type}</div>
        <h1>{post.title}</h1>
        
        <div className="post-meta">
          <span className="post-date">{formatDate(post.createdAt)}</span>
          {post.author && (
            <span className="post-author">by {post.author}</span>
          )}
          {post.category && (
            <span className="post-category">{post.category}</span>
          )}
        </div>

        {post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag.id} className="tag">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <footer className="post-footer">
        <p>Last updated: {formatDate(post.updatedAt)}</p>
      </footer>
    </article>
  );
}
