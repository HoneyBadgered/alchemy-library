import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { strapiAPI, StrapiAPIError } from '../services/api';
import type { NormalizedPost } from '../types';
import './ArticlePage.css';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NormalizedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function loadArticle() {
    if (!slug) return;

    try {
      setLoading(true);
      const data = await strapiAPI.getPostBySlug(slug, 'grimoire');
      setArticle(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof StrapiAPIError ? err.message : 'Failed to load article'
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
      <div className="article-page">
        <nav className="breadcrumb">
          <Link to="/grimoire">← Back to Grimoire</Link>
        </nav>
        <div className="loading">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="not-found">
        <h1>Article Not Found</h1>
        <p>{error || "The article you're looking for doesn't exist."}</p>
        <Link to="/grimoire">← Back to Grimoire</Link>
      </div>
    );
  }

  return (
    <div className="article-page">
      <nav className="breadcrumb">
        <Link to="/grimoire">← Back to Grimoire</Link>
      </nav>

      <article className="article">
        <header className="article-header">
          <div className="article-meta">
            <span className="article-category">
              {article.category || 'Uncategorized'}
            </span>
            <span className="article-date">
              {formatDate(article.createdAt)}
            </span>
          </div>
          <h1>{article.title}</h1>
          {article.author && (
            <p className="article-author">by {article.author}</p>
          )}
        </header>

        <div className="article-content">
          {article.content.split('\n').map((line, index) => {
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
            } else if (line.startsWith('`') && line.endsWith('`')) {
              return (
                <code key={index}>{line.substring(1, line.length - 1)}</code>
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
