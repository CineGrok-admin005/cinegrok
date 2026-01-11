/**
 * Sign Up Page
 * 
 * Allows new users to create an account
 */

'use client'

import { useState } from 'react'
import { signup, login } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import '../login/auth.css'

export default function SignUpPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    const router = useRouter()

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        // Validate password strength
        if (password.length < 8) {
            setError('Password must be at least 8 characters long')
            setLoading(false)
            return
        }

        try {
            await signup({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            setMessage('Check your email to confirm your account!');
        } catch (err: any) {
            console.error('Signup error:', err);

            // Handle "User already registered" specifically
            if (err.message && err.message.includes('User already registered')) {
                setError(
                    <span>
                        This email is already registered. <Link href="/auth/login" className="underline font-medium">Sign in here</Link>.
                    </span> as any
                );
            } else {
                setError(err.message || 'Signup failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    const handleGoogleSignUp = async () => {
        setLoading(true)
        setError(null)

        try {
            const data = await login({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (data.url) window.location.href = data.url;
        } catch (err: any) {
            console.error('OAuth error:', err);
            if (err.message && (err.message.includes('already registered') || err.message.includes('already in use'))) {
                setError(
                    <span>
                        This email is already associated with an account. <Link href="/auth/login" className="underline font-medium">Log in here</Link>.
                    </span> as any
                );
            } else {
                setError(err.message || 'Unable to sign in with Google. Please try again.');
            }
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>Create Your Account</h1>
                    <p>Join CineGrok and showcase your work</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="alert alert-success">
                        {message}
                    </div>
                )}

                {/* Email/Password Sign Up */}
                <form onSubmit={handleSignUp} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                minLength={8}
                                className="pr-10" // Add padding for the icon
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <small className="form-hint">At least 8 characters</small>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                {/* Divider */}
                <div className="divider">
                    <span>or</span>
                </div>

                {/* OAuth Providers */}
                <div className="oauth-buttons">
                    <button
                        onClick={handleGoogleSignUp}
                        className="btn btn-oauth"
                        disabled={loading}
                    >
                        <svg className="oauth-icon" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>
                </div>

                {/* Terms */}
                <p className="auth-terms">
                    By signing up, you agree to our{' '}
                    <Link href="/terms" className="link-primary">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="link-primary">Privacy Policy</Link>
                </p>

                {/* Sign In Link */}
                <div className="auth-switch">
                    <p>
                        Already have an account?{' '}
                        <Link href="/auth/login" className="link-primary">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Back to Home */}
                <div className="auth-back">
                    <Link href="/" className="link-secondary">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    )
}
