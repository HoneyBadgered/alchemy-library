import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import LogPage from './pages/LogPage';
import BlogPostPage from './pages/BlogPostPage';
import GrimoirePage from './pages/GrimoirePage';
import ArticlePage from './pages/ArticlePage';
import LibraryList from './components/LibraryList';
import LibraryPost from './components/LibraryPost';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* Strapi-powered routes */}
            <Route path="/library" element={<LibraryList />} />
            <Route path="/library/:type/:slug" element={<LibraryPost />} />
            
            {/* Log and Grimoire routes (now using Strapi API with slug-based URLs) */}
            <Route path="/log" element={<LogPage />} />
            <Route path="/log/:slug" element={<BlogPostPage />} />
            <Route path="/grimoire" element={<GrimoirePage />} />
            <Route path="/grimoire/:slug" element={<ArticlePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
