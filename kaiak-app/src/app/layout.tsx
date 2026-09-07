import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Header from '@/components/layout/Header';
import BottomBar from '@/components/layout/BottomBar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kaiak-app.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'KAIAK K21 — El perfume que corre contigo',
    template: '%s | KAIAK K21',
  },
  description:
    'Registrá tus kilómetros, completá retos y desbloqueá recompensas exclusivas de KAIAK K21.',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'KAIAK K21',
    title: 'KAIAK K21 — El perfume que corre contigo',
    description:
      'Registrá tus kilómetros, completá retos y desbloqueá recompensas exclusivas de KAIAK K21.',
    url: siteUrl,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KAIAK K21 — El perfume que corre contigo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KAIAK K21 — El perfume que corre contigo',
    description:
      'Registrá tus kilómetros, completá retos y desbloqueá recompensas exclusivas de KAIAK K21.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      url: siteUrl,
      name: 'KAIAK K21',
      description:
        'Registrá tus kilómetros, completá retos y desbloqueá recompensas exclusivas de KAIAK K21.',
    },
    {
      '@type': 'Organization',
      name: 'KAIAK K21',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="main-content">{children}</main>
        <BottomBar />
      </body>
    </html>
  );
}
