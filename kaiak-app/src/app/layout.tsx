import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Header from '@/components/layout/Header';
import BottomBar from '@/components/layout/BottomBar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KAIAK K21 — El perfume que corre contigo',
  description:
    'Registrá tus kilómetros, completá retos y desbloqueá recompensas exclusivas de KAIAK K21.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <Header />
        <main className="main-content">{children}</main>
        <BottomBar />
      </body>
    </html>
  );
}
