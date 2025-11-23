import { Link } from 'react-router-dom';
import './Navigation.css';

export default function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🧪 Alchemy Library
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/library" className="nav-link">Library</Link>
          <Link to="/log" className="nav-link">Log</Link>
          <Link to="/grimoire" className="nav-link">Grimoire</Link>
        </div>
      </div>
    </nav>
  );
}
