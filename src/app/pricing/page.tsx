/**
 * Pricing Page - Beta Launch (Free Access)
 * Shows future pricing but currently free during beta
 */

'use client';

import Navigation from '@/components/Navigation';
import SmartCTA from '@/components/SmartCTA';
import './pricing.css';

export default function PricingPage() {
    return (
        <div className="pricing-page-wrapper">
            <Navigation />
            <div className="pricing-page">
                <div className="pricing-container">
                    <div className="pricing-header">
                        <div className="beta-badge">Beta Launch</div>
                        <h1>Choose Your Plan</h1>
                        <p>Create your filmmaker profile and get discovered by the industry</p>
                        <p className="beta-note">
                            <strong>Limited Time:</strong> All features are currently FREE during our beta launch.
                            Pricing will be introduced later.
                        </p>
                    </div>

                    <div className="pricing-grid">
                        <div className="pricing-card">
                            <div className="plan-header">
                                <h3>Monthly Plan</h3>
                                <div className="plan-price">
                                    <span className="original-price">₹99/month</span>
                                    <div className="current-price">
                                        <span className="free-badge">FREE</span>
                                        <span className="beta-text">During Beta</span>
                                    </div>
                                </div>
                            </div>

                            <div className="plan-description">
                                <p>Perfect for getting started with your filmmaker profile</p>
                            </div>

                            <div className="plan-features">
                                <h4>What's included:</h4>
                                <ul>
                                    <li><span className="check-icon">✓</span> <strong>No credit card required</strong></li>
                                    <li><span className="check-icon">✓</span> Create and manage filmmaker profile</li>
                                    <li><span className="check-icon">✓</span> AI-generated bio</li>
                                    <li><span className="check-icon">✓</span> Unlimited profile updates</li>
                                    <li><span className="check-icon">✓</span> Analytics dashboard</li>
                                    <li><span className="check-icon">✓</span> Featured in browse section</li>
                                </ul>
                            </div>

                            <SmartCTA text="Get Started Free" className="btn-full" />
                        </div>

                        <div className="pricing-card featured">
                            <div className="featured-badge">Best Value</div>
                            <div className="plan-header">
                                <h3>Yearly Plan</h3>
                                <div className="plan-price">
                                    <span className="original-price">₹799/year</span>
                                    <div className="current-price">
                                        <span className="free-badge">FREE</span>
                                        <span className="beta-text">During Beta</span>
                                    </div>
                                    <span className="savings">Save ₹389 per year</span>
                                </div>
                            </div>

                            <div className="plan-description">
                                <p>Best value for serious filmmakers</p>
                            </div>

                            <div className="plan-features">
                                <h4>Everything in Monthly, plus:</h4>
                                <ul>
                                    <li><span className="check-icon">✓</span> <strong>No credit card required</strong></li>
                                    <li><span className="check-icon">✓</span> Priority support</li>
                                    <li><span className="check-icon">✓</span> Featured placement</li>
                                    <li><span className="check-icon">✓</span> Advanced analytics</li>
                                    <li><span className="check-icon">✓</span> Custom profile URL</li>
                                    <li><span className="check-icon">✓</span> Early access to new features</li>
                                </ul>
                            </div>

                            <SmartCTA text="Get Started Free" className="btn-full" />
                        </div>
                    </div>

                    <div className="pricing-faq">
                        <h3>Frequently Asked Questions</h3>
                        <div className="faq-item">
                            <h4>Why is it free right now?</h4>
                            <p>We're in beta and want to build a strong community of filmmakers first.
                                Early adopters get free access to all features!</p>
                        </div>
                        <div className="faq-item">
                            <h4>Will I have to pay later?</h4>
                            <p>When we introduce pricing, early beta users will receive special discounts
                                and grandfather pricing. You'll be notified well in advance.</p>
                        </div>
                        <div className="faq-item">
                            <h4>What happens to my profile when pricing starts?</h4>
                            <p>Your profile stays live! We'll offer you exclusive early-bird pricing
                                before the standard rates apply.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
