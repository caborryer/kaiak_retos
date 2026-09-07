import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kaiak-app.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const routes = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/challenges', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/comunidad', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/rewards', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/km', priority: 0.8, changeFrequency: 'daily' as const },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
