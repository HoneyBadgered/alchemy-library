import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        {/* <div className="hero-content">
          <h1 className="hero-title">Welcome to the Alchemy Library</h1>
          <p className="hero-subtitle">
            Your Blend. Your Crafted Magic.
          </p>
          <p className="hero-description">
            Welcome to the Library—your ever-growing archive of knowledge, rituals, stories, and discoveries. Here, curiosity is the compass and inspiration is the reward. Wander through articles, guides, logs, and grimoire entries that illuminate the world of herbs, flavor, creativity, and craft. Whether you’re seeking deep dives, quick insights, or a spark of magic for your next creation, this is your sacred space to learn, explore, and expand your craft.
          </p>
        </div> */}
      </section>

      <section className="sections">
        <div className="section-card">
          <div className="section-icon">📝</div>
          <h2>The Log</h2>
          <p>
            Stay up to date with our latest posts, announcements, and regular updates. 
            The Log is where we share our journey, insights, and thoughts on various topics.
          </p>
          <Link to="/log" className="section-link">
            Explore the Log →
          </Link>
        </div>

        <div className="section-card">
          <div className="section-icon">📚</div>
          <h2>The Grimoire</h2>
          <p>
            Dive into our collection of comprehensive guides, tutorials, and evergreen articles. 
            The Grimoire contains carefully crafted resources designed to provide lasting value.
          </p>
          <Link to="/grimoire" className="section-link">
            Browse the Grimoire →
          </Link>
        </div>
      </section>

      <section className="about">
        <div className="about-content">
          <h2>About This Library</h2>
          <p>
            The Alchemy Library is a knowledge repository designed to make information 
            accessible, organized, and valuable. We believe in the transformative power 
            of well-documented knowledge and the importance of sharing what we learn.
          </p>
          <p>
            Our content is organized into two main sections: the <strong>Log</strong> for 
            timely updates and posts, and the <strong>Grimoire</strong> for comprehensive, 
            evergreen resources. Together, they form a complete knowledge ecosystem.
          </p>
        </div>
      </section>
    </div>
  );
}
