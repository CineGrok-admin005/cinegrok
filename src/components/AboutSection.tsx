/**
 * AboutSection Component
 * 
 * Expandable section on homepage explaining CineGrok's mission
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AboutSection() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section className="about-section">
            <div className="container">
                <div className="about-content">
                    <div className="about-header" onClick={() => setIsExpanded(!isExpanded)}>
                        <h2>About CineGrok</h2>
                        <button className="expand-btn" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
                            {isExpanded ? '−' : '+'}
                        </button>
                    </div>

                    {isExpanded && (
                        <div className="about-body">
                            <div className="mission-grid">
                                <div className="mission-item">
                                    <div className="mission-icon">🎯</div>
                                    <h3>Our Mission</h3>
                                    <p>
                                        Empower emerging filmmakers globally by providing an accessible,
                                        AI-powered platform for talent discovery and collaboration.
                                    </p>
                                </div>

                                <div className="mission-item">
                                    <div className="mission-icon">🌟</div>
                                    <h3>Our Vision</h3>
                                    <p>
                                        A world where talent, not connections, determines success in filmmaking.
                                        We bridge the gap between emerging artists and industry opportunities.
                                    </p>
                                </div>

                                <div className="mission-item">
                                    <div className="mission-icon">💡</div>
                                    <h3>Our Purpose</h3>
                                    <p>
                                        Showcase independent film talent, celebrate diverse voices, and create
                                        meaningful connections in the global filmmaking community.
                                    </p>
                                </div>
                            </div>

                            <div className="cta-row">
                                <Link href="/about" className="btn btn-secondary">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        .about-section {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding: 3rem 0;
          margin: 3rem 0;
        }

        .about-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .about-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .about-header:hover {
          background: #fafafa;
        }

        .about-header h2 {
          font-size: 1.75rem;
          font-weight: 600;
          margin: 0;
          color: #1a1a1a;
        }

        .expand-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid #3A7BD5;
          background: white;
          color: #3A7BD5;
          font-size: 1.5rem;
          font-weight: 300;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .expand-btn:hover {
          background: #3A7BD5;
          color: white;
        }

        .about-body {
          padding: 0 2rem 2rem;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mission-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 768px) {
          .mission-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .mission-item {
          text-align: center;
          padding: 1.5rem;
        }

        .mission-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .mission-item h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #1a1a1a;
        }

        .mission-item p {
          font-size: 0.9375rem;
          line-height: 1.6;
          color: #666;
          margin: 0;
        }

        .cta-row {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
        }

        @media (max-width: 767px) {
          .about-header h2 {
            font-size: 1.5rem;
          }

          .about-header,
          .about-body {
            padding: 1.5rem;
          }
        }
      `}</style>
        </section>
    );
}
