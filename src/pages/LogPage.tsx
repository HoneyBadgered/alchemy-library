import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import './LogPage.css';

export default function LogPage() {
  return (
    <div className="log-page">
      <header className="page-header">
        <h1>📝 The Log</h1>
        <p>Regular updates, announcements, and thoughts from the Alchemy Library</p>
      </header>

      <div className="posts-container">
        {blogPosts.map((post) => (
          <article key={post.id} className="post-card">
            <div className="post-meta">
              <span className="post-date">{new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              <span className="post-author">by {post.author}</span>
            </div>
            <h2 className="post-title">
              <Link to={`/log/${post.id}`}>{post.title}</Link>
            </h2>
            <p className="post-excerpt">{post.excerpt}</p>
            <Link to={`/log/${post.id}`} className="read-more">
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
