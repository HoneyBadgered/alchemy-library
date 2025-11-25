import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { strapiAPI, StrapiAPIError } from '../services/api';
import type { NormalizedPost } from '../types';
import './LogPage.css';

export default function LogPage() {
  const [logs, setLogs] = useState<NormalizedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      setLoading(true);
      const response = await strapiAPI.getLogs({ pageSize: 100 });
      setLogs(response.data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof StrapiAPIError ? err.message : 'Failed to load log posts'
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
      <div className="log-page">
        <header className="page-header">
          <h1>📝 The Log</h1>
          <p>
            Regular updates, announcements, and thoughts from the Alchemy
            Library
          </p>
        </header>
        <div className="loading">Loading log posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="log-page">
        <header className="page-header">
          <h1>📝 The Log</h1>
          <p>
            Regular updates, announcements, and thoughts from the Alchemy
            Library
          </p>
        </header>
        <div className="error">
          <h2>Error Loading Posts</h2>
          <p>{error}</p>
          <button onClick={() => loadLogs()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="log-page">
      <header className="page-header">
        <h1>📝 The Log</h1>
        <p>
          Regular updates, announcements, and thoughts from the Alchemy Library
        </p>
      </header>

      <div className="posts-container">
        {logs.map((post) => (
          <article key={post.id} className="post-card">
            <div className="post-meta">
              <span className="post-date">{formatDate(post.createdAt)}</span>
              {post.author && (
                <span className="post-author">by {post.author}</span>
              )}
            </div>
            <h2 className="post-title">
              <Link to={`/log/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="post-excerpt">{post.excerpt}</p>
            <Link to={`/log/${post.slug}`} className="read-more">
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
