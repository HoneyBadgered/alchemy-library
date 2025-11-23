import { Link } from 'react-router-dom';
import { articles } from '../data/articles';
import './GrimoirePage.css';

export default function GrimoirePage() {
  // Group articles by category
  const categories = Array.from(new Set(articles.map(a => a.category)));
  
  return (
    <div className="grimoire-page">
      <header className="page-header">
        <h1>📚 The Grimoire</h1>
        <p>Comprehensive guides, tutorials, and evergreen knowledge</p>
      </header>

      <div className="articles-container">
        {categories.map(category => (
          <section key={category} className="category-section">
            <h2 className="category-title">{category}</h2>
            <div className="articles-grid">
              {articles
                .filter(article => article.category === category)
                .map(article => (
                  <article key={article.id} className="article-card">
                    <div className="article-meta">
                      <span className="article-category">{article.category}</span>
                      <span className="article-date">
                        {new Date(article.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <h3 className="article-title">
                      <Link to={`/grimoire/${article.id}`}>{article.title}</Link>
                    </h3>
                    <p className="article-excerpt">{article.excerpt}</p>
                    <Link to={`/grimoire/${article.id}`} className="read-more">
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
