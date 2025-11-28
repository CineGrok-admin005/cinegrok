/**
 * About Page
 * 
 * Mission, vision, and purpose of CineGrok
 */

import Navigation from '@/components/Navigation';
import Link from 'next/link';

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
                    <div className="section-icon">🎯</div>
                    <h2>Our Mission</h2>
                    <p>
                        To create an accessible, AI-powered platform that helps emerging filmmakers gain visibility,
                        connect with collaborators, and showcase their work to a global audience.
                    </p>
                </section>

                {/* Vision */}
                <section className="content-section">
                    <div className="section-icon">🌟</div>
                    <h2>Our Vision</h2>
                    <p>
                        We envision a world where talent, not connections, determines success in filmmaking.
                        CineGrok bridges the gap between emerging artists and industry opportunities through
                        intelligent curation and discovery.
                    </p>
                </section>

                {/* How It Works */}
                <section className="content-section">
                    <div className="section-icon">⚙️</div>
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
                            <div-number">3</div>
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

        {/* Values */ }
    <section className="content-section">
        <div className="section-icon">💎</div>
        <h2>Our Values</h2>
        <ul className="values-list">
            <li><strong>Accessibility:</strong> Free platform for all filmmakers, regardless of background</li>
            <li><strong>Diversity:</strong> Celebrating voices from all cultures, styles, and perspectives</li>
            <li><strong>Quality:</strong> AI-powered curation ensures professional presentation</li>
            <li><strong>Community:</strong> Building connections between emerging and established talent</li>
            <li><strong>Transparency:</strong> Open about our process and committed to filmmaker privacy</li>
        </ul>
    </section>

    {/* CTA */ }
    <section className="cta-section">
        <h2>Ready to Join?</h2>
        <p>Submit your profile and become part of the global filmmaker community.</p>
        <Link href="https://forms.gle/YOUR_FORM_ID" target="_blank" className="btn btn-primary btn-large">
            Submit Your Profile
        </Link>
    </section>
      </div >

        <style jsx>{`
        .about-page {
          min-height: 100vh;
          background: #fafafa;
        }

        .about-hero {
          text-align: center;
          padding: 4rem 0 3rem;
        }

        .about-hero h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .lead {
          font-size: 1.25rem;
          color: #666;
          max-width: 700px;
          margin: 0 auto;
        }

        .content-section {
          background: white;
          padding: 3rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .section-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .content-section h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .content-section p {
          font-size: 1.125rem;
          line-height: 1.8;
          color: #666;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .step {
          text-align: center;
        }

        .step-number {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3A7BD5, #8B5CF6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 auto 1rem;
        }

        .step h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: #1a1a1a;
        }

        .step p {
          font-size: 0.9375rem;
          color: #666;
        }

        .values-list {
          list-style: none;
          padding: 0;
          margin-top: 1.5rem;
        }

        .values-list li {
          padding: 1rem 0;
          border-bottom: 1px solid #f0f0f0;
          font-size: 1.0625rem;
          color: #666;
        }

        .values-list li:last-child {
          border-bottom: none;
        }

        .values-list strong {
          color: #1a1a1a;
        }

        .cta-section {
          text-align: center;
          padding: 4rem 0;
        }

        .cta-section h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .cta-section p {
          font-size: 1.125rem;
          color: #666;
          margin-bottom: 2rem;
        }

        @media (max-width: 767px) {
          .about-hero h1 {
            font-size: 2rem;
          }

          .lead {
            font-size: 1rem;
          }

          .content-section {
            padding: 2rem 1.5rem;
          }

          .steps-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div >
  );
}
