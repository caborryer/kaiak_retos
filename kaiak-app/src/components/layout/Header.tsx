'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, Link as LinkIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import '@/styles/header.css';

const NAV_LINKS = [
  { href: '/', label: 'HOME' },
  { href: '/challenges', label: 'CHALLENGES' },
  { href: '/km', label: 'KM' },
  { href: '/rewards', label: 'REWARDS' },
  { href: '/comunidad', label: 'COMUNIDAD' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleConnectStrava = () => {
    window.location.href = '/api/auth/strava';
  };

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <Link href="/" className="header-logo">
          <span className="header-logo-kaiak">KAIAK</span>
          <span className="header-logo-k21">K21</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="header-nav" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`header-nav-link ${
                (link.href === '/' ? pathname === '/' : pathname.startsWith(link.href))
                  ? 'active'
                  : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User menu */}
        <div className="header-actions" ref={menuRef}>
          <button
            className="header-user-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú de usuario"
          >
            <User size={18} />
            <ChevronDown size={12} className={`chevron ${menuOpen ? 'open' : ''}`} />
          </button>

          {menuOpen && (
            <div className="user-menu-dropdown">
              {userEmail && (
                <p className="user-menu-email">{userEmail}</p>
              )}
              <button
                className="user-menu-item"
                onClick={handleConnectStrava}
              >
                <LinkIcon size={14} />
                Conectar Strava
              </button>
              <button
                className="user-menu-item user-menu-logout"
                onClick={handleLogout}
              >
                <LogOut size={14} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
