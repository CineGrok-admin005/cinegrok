/**
 * About Page
 * 
 * Mission, vision, and purpose of CineGrok
 */

import Navigation from '@/components/Navigation';
import Link from 'next/link';
import SmartCTA from '@/components/SmartCTA';
import './about.css';

export const metadata = {
  title: 'About CineGrok - Our Mission',
  description: 'Learn about CineGrok\'s mission to empower emerging filmmakers and democratize film industry access.',
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <Navigation />

      <div className="container">
        {/* Hero */}
        <section className="about-hero">
          <h1>Empowering Emerging Filmmakers</h1>
          <p className="lead">
            CineGrok is a community-driven platform showcasing independent film talent from around the world.
          </p>
        </section>

        {/* Mission */}
        <section className="content-section">
          <div className="section-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
            </svg>
          </div>
          <h2>Our Mission</h2>
          <p>
            To create an accessible, AI-powered platform that helps emerging filmmakers gain visibility,
            connect with collaborators, and showcase their work to a global audience.
          </p>
        </section>

        {/* Vision */}
        <section className="content-section">
          <div className="section-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
          <h2>Our Vision</h2>
          <p>
            We envision a world where talent, not connections, determines success in filmmaking.
            CineGrok bridges the gap between emerging artists and industry opportunities through
            intelligent curation and discovery.
          </p>
        </section>

        {/* How It Works */}
        <section className="content-section">
          <div className="section-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Submit Your Profile</h3>
              <p>Fill out our simple form with your filmmaking experience, style, and portfolio.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI Enhancement</h3>
              <p>Our AI generates a professional bio highlighting your unique voice and vision.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Discovered</h3>
              <p>Your profile becomes searchable by role, style, genre, and experience level.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Connect & Collaborate</h3>
              <p>Industry professionals and fellow filmmakers can find and reach out to you.</p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="content-section">
          <div className="section-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12l4 6-10 13L2 9Z" />
              <path d="M11 3 8 9l4 13 4-13-3-6" />
              <path d="M2 9h20" />
            </svg>
          </div>
          <h2>Our Values</h2>
          <ul className="values-list">
            <li><strong>Accessibility:</strong> Free platform for all filmmakers, regardless of background</li>
            <li><strong>Diversity:</strong> Celebrating voices from all cultures, styles, and perspectives</li>
            <li><strong>Quality:</strong> AI-powered curation ensures professional presentation</li>
            <li><strong>Community:</strong> Building connections between emerging and established talent</li>
            <li><strong>Transparency:</strong> Open about our process and committed to filmmaker privacy</li>
          </ul>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <h2>Ready to Join?</h2>
          <p>Create your profile and become part of the global filmmaker community.</p>
          <SmartCTA text="Create Profile" variant="primary" className="btn-large" />
        </section>
      </div>
    </div>
  );
}
