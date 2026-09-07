import type { Metadata } from 'next';
import ComunidadBanner from '@/components/comunidad/ComunidadBanner';
import WhatsAppCTA from '@/components/comunidad/WhatsAppCTA';
import '@/styles/comunidad.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kaiak-app.vercel.app';

export const metadata: Metadata = {
  title: 'Comunidad runners KAIAK — Corré y conectá',
  description:
    'Sumate a la comunidad de runners de KAIAK K21. Corré, compartí tus logros y conectá con otros apasionados del running.',
  alternates: {
    canonical: `${siteUrl}/comunidad`,
  },
  openGraph: {
    title: 'Comunidad runners KAIAK — Corré y conectá',
    description:
      'Sumate a la comunidad de runners de KAIAK K21. Corré, compartí tus logros y conectá con otros apasionados del running.',
    url: `${siteUrl}/comunidad`,
  },
  twitter: {
    title: 'Comunidad runners KAIAK — Corré y conectá',
    description:
      'Sumate a la comunidad de runners de KAIAK K21. Corré, compartí tus logros y conectá con otros apasionados del running.',
  },
};

export default function ComunidadPage() {
  return (
    <div className="comunidad-page">
      <ComunidadBanner />
      <WhatsAppCTA />
    </div>
  );
}
