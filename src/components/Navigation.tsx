import { Link } from 'react-router-dom';
import './Navigation.css';

export default function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-links nav-links-left">
          <Link to="/" className="nav-link">Home</Link>
        </div>
        <Link to="/" className="nav-logo">
          The Alchemy Library
        </Link>
        <div className="nav-links nav-links-right">
          <Link to="/log" className="nav-link">Log</Link>
          <Link to="/grimoire" className="nav-link">Grimoire</Link>
        </div>
      </div>
    </nav>
  );
}
