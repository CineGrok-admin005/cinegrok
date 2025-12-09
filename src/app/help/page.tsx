/**
 * Help & Support Page
 */

import Navigation from '@/components/Navigation';
import Link from 'next/link';
import './help.css';

export default function HelpPage() {
    return (
        <div className="help-page">
            <Navigation />
            <div className="container help-container">
                <h1>Help & Support</h1>
                <p className="subtitle">We're here to help you getting started with CineGrok.</p>

                <div className="support-card">
                    <h2>Contact Us</h2>
                    <p>Have questions, suggestions, or found a bug? We'd love to hear from you!</p>

                    <div className="contact-method">
                        <span className="icon">📧</span>
                        <div className="details">
                            <h3>Email Support</h3>
                            <a href="mailto:docmail1131@gmail.com" className="email-link">
                                docmail1131@gmail.com
                            </a>
                            <p className="sub-text">We typically respond within 24-48 hours.</p>
                        </div>
                    </div>
                </div>

                <div className="faq-section">
                    <h2>Frequently Asked Questions</h2>

                    <div className="faq-item">
                        <h3>Is CineGrok free?</h3>
                        <p>Yes! During our Beta Launch, all features are completely free for everyone.</p>
                    </div>

                    <div className="faq-item">
                        <h3>How do I verify my profile?</h3>
                        <p>Profile verification is currently being rolled out. Ensure your profile is complete with accurate information.</p>
                    </div>

                    <div className="faq-item">
                        <h3>Can I collaborate with other users?</h3>
                        <p>Yes! You can use the "Collaborate" button on filmmaker profiles to reach out to them directly via email.</p>
                    </div>
                </div>

                <Link href="/dashboard" className="btn btn-secondary back-btn">
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
