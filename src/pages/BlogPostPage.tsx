import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import './BlogPostPage.css';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="not-found">
        <h1>Post Not Found</h1>
        <p>The blog post you're looking for doesn't exist.</p>
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
            <span className="post-date">
              {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span className="post-author">by {post.author}</span>
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
              return <ul key={index}><li>{line.substring(2)}</li></ul>;
            } else if (line.trim() === '') {
              return <br key={index} />;
            } else if (line.match(/^\d+\./)) {
              return <ol key={index}><li>{line.substring(line.indexOf('.') + 2)}</li></ol>;
            } else {
              return <p key={index}>{line}</p>;
            }
          })}
        </div>
      </article>
    </div>
  );
}
