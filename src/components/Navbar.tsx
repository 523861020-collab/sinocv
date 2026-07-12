'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

const locales = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'ar', label: 'AR', flag: '🇸🇦' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/heavy-truck', label: 'Heavy Trucks' },
    { href: '/machinery', label: 'Machinery' },
    { href: '/mining', label: 'Mining' },
    { href: '/trailers', label: 'Trailers' },
    { href: '/light', label: 'Light Vehicles' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="px-6 lg:px-16 max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <img src="/images/logo-new.png" alt="Logo" className="h-10 w-auto" />
            <div className="text-sm text-amber-500 font-medium leading-tight">
              <div>One-Stop Sourcing for</div>
              <div>Commercial Vehicles</div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-amber-500 transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://wa.me/8619103781257" target="_blank"
              className="rounded-md bg-green-500 px-6 py-2.5 font-semibold text-white hover:bg-green-400 transition-colors"
            >
              Get Quote
            </a>
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-400 hover:text-white text-sm font-medium px-2 py-1 rounded hover:bg-gray-800 transition-colors">
                {locales.find(l => l.code === locale)?.flag} {locale.toUpperCase()}
              </button>
              <div className="absolute right-0 top-full mt-1 bg-gray-900 border border-gray-700 rounded-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl min-w-[100px]">
                {locales.map(l => (
                  <button
                    key={l.code}
                    onClick={() => switchLocale(l.code)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-800 transition-colors ${locale === l.code ? 'text-amber-500' : 'text-gray-300'}`}
                  >
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-t border-gray-800"
          >
            <div className="py-4 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-300 hover:text-amber-500 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
              <a
                href="https://wa.me/8619103781257" target="_blank"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block mx-4 rounded-md bg-green-500 px-6 py-3 text-center font-semibold text-white hover:bg-green-400 transition-colors"
              >
                Inquire Now
              </a>
            </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
