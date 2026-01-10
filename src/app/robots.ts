import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cinegrok.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/admin/',
                '/dashboard/', // Don't index private dashboard
                '/profile-builder/', // Don't index editing pages
                '/settings/',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
