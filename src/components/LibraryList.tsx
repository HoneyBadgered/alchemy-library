import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { strapiAPI, StrapiAPIError } from '../services/api';
import type { NormalizedPost } from '../types';
import './LibraryList.css';

export default function LibraryList() {
  const [posts, setPosts] = useState<NormalizedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function loadPosts() {
    try {
      setLoading(true);
      const response = await strapiAPI.getLibrary({ page, pageSize: 10 });
      
      if (page === 1) {
        setPosts(response.data);
      } else {
        setPosts((prev) => [...prev, ...response.data]);
      }
      
      setHasMore(response.data.length === 10);
      setError(null);
    } catch (err) {
      setError(
        err instanceof StrapiAPIError
          ? err.message
          : 'Failed to load library posts'
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

  if (loading && posts.length === 0) {
    return (
      <div className="library-list">
        <div className="loading">Loading library posts...</div>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="library-list">
        <div className="error">
          <h2>Error Loading Posts</h2>
          <p>{error}</p>
          <button onClick={() => loadPosts()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="library-list">
      <header className="page-header">
        <h1>🧪 The Library</h1>
        <p>All posts from The Alchemy Table Library</p>
      </header>

      <div className="posts-container">
        {posts.map((post) => (
          <article key={`${post.type}-${post.id}`} className="post-card">
            <div className="post-type-badge">{post.type}</div>
            
            {post.heroImage && (
              <div className="post-image">
                <img src={post.heroImage} alt={post.title} />
              </div>
            )}

            <div className="post-content">
              <div className="post-meta">
                <span className="post-date">{formatDate(post.createdAt)}</span>
                {post.author && (
                  <span className="post-author">by {post.author}</span>
                )}
                {post.category && (
                  <span className="post-category">{post.category}</span>
                )}
              </div>

              <h2 className="post-title">
                <Link to={`/library/${post.type}/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>

              {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}

              {post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag) => (
                    <span key={tag.id} className="tag">
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              <Link
                to={`/library/${post.type}/${post.slug}`}
                className="read-more"
              >
                Read {post.type === 'log' ? 'post' : 'article'} →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {hasMore && (
        <div className="load-more">
          <button onClick={() => setPage((p) => p + 1)} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
