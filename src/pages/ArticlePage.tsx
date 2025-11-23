import { useParams, Link } from 'react-router-dom';
import { articles } from '../data/articles';
import './ArticlePage.css';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const article = articles.find(a => a.id === id);

  if (!article) {
    return (
      <div className="not-found">
        <h1>Article Not Found</h1>
        <p>The article you're looking for doesn't exist.</p>
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
            <span className="article-category">{article.category}</span>
            <span className="article-date">
              {new Date(article.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <h1>{article.title}</h1>
          <p className="article-author">by {article.author}</p>
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
              return <ul key={index}><li>{line.substring(2)}</li></ul>;
            } else if (line.trim() === '') {
              return <br key={index} />;
            } else if (line.match(/^\d+\./)) {
              return <ol key={index}><li>{line.substring(line.indexOf('.') + 2)}</li></ol>;
            } else if (line.startsWith('`') && line.endsWith('`')) {
              return <code key={index}>{line.substring(1, line.length - 1)}</code>;
            } else {
              return <p key={index}>{line}</p>;
            }
          })}
        </div>
      </article>
    </div>
  );
}
