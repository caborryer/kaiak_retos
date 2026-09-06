'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Activity, Gift, Users } from 'lucide-react';
import '@/styles/bottom-bar.css';

const BOTTOM_LINKS = [
  { href: '/challenges', label: 'CHALLENGES', icon: Trophy },
  { href: '/km', label: 'KM', icon: Activity },
  { href: '/rewards', label: 'REWARDS', icon: Gift },
  { href: '/comunidad', label: 'COMUNIDAD', icon: Users },
];

export default function BottomBar() {
  const pathname = usePathname();

  return (
    <nav className="bottom-bar" aria-label="Navegación inferior">
      <div className="bottom-bar-inner">
        {BOTTOM_LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`bottom-bar-item ${pathname.startsWith(href) ? 'active' : ''}`}
          >
            <Icon size={22} />
            <span className="bottom-bar-label">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
