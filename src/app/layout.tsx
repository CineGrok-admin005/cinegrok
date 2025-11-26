import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CineGrok - Discover Emerging Filmmakers',
  description: 'AI-powered filmmaker portfolio platform showcasing directors, cinematographers, editors, and more.',
  keywords: ['filmmakers', 'directors', 'cinematographers', 'film portfolio', 'emerging talent'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
