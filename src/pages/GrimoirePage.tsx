import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { strapiAPI, StrapiAPIError } from '../services/api';
import type { NormalizedPost } from '../types';
import './GrimoirePage.css';

export default function GrimoirePage() {
  const [grimoires, setGrimoires] = useState<NormalizedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGrimoires();
  }, []);

  async function loadGrimoires() {
    try {
      setLoading(true);
      const response = await strapiAPI.getGrimoires({ pageSize: 100 });
      setGrimoires(response.data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof StrapiAPIError
          ? err.message
          : 'Failed to load grimoire articles'
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Group grimoires by category
  const categories = Array.from(
    new Set(grimoires.map((g) => g.category || 'Uncategorized'))
  );

  if (loading) {
    return (
      <div className="grimoire-page">
        <header className="page-header">
          <h1>📚 The Grimoire</h1>
          <p>Comprehensive guides, tutorials, and evergreen knowledge</p>
        </header>
        <div className="loading">Loading grimoire articles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grimoire-page">
        <header className="page-header">
          <h1>📚 The Grimoire</h1>
          <p>Comprehensive guides, tutorials, and evergreen knowledge</p>
        </header>
        <div className="error">
          <h2>Error Loading Articles</h2>
          <p>{error}</p>
          <button onClick={() => loadGrimoires()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="grimoire-page">
      <header className="page-header">
        <h1>📚 The Grimoire</h1>
        <p>Comprehensive guides, tutorials, and evergreen knowledge</p>
      </header>

      <div className="articles-container">
        {categories.map((category) => (
          <section key={category} className="category-section">
            <h2 className="category-title">{category}</h2>
            <div className="articles-grid">
              {grimoires
                .filter(
                  (grimoire) =>
                    (grimoire.category || 'Uncategorized') === category
                )
                .map((grimoire) => (
                  <article key={grimoire.id} className="article-card">
                    <div className="article-meta">
                      <span className="article-category">
                        {grimoire.category || 'Uncategorized'}
                      </span>
                      <span className="article-date">
                        {formatDate(grimoire.createdAt)}
                      </span>
                    </div>
                    <h3 className="article-title">
                      <Link to={`/grimoire/${grimoire.slug}`}>
                        {grimoire.title}
                      </Link>
                    </h3>
                    <p className="article-excerpt">{grimoire.excerpt}</p>
                    <Link
                      to={`/grimoire/${grimoire.slug}`}
                      className="read-more"
                    >
                      Read article →
                    </Link>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
