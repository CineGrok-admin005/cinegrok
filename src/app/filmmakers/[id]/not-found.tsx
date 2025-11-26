import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            padding: '2rem',
        }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Filmmaker Not Found</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                The filmmaker you're looking for doesn't exist or hasn't been processed yet.
            </p>
            <Link href="/" className="btn btn-primary">
                Return Home
            </Link>
        </div>
    );
}
