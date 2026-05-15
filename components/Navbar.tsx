import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#', label: 'Home' },
  { href: '#sanatan-dharma', label: 'Sanātana Dharma' },
  { href: '#bjp-support', label: 'BJP Vision' },
  { href: '#subsidiaries', label: 'Subsidiaries' },
  { href: '#collaborations', label: 'Collaborations' },
  { href: '#founders', label: 'Founders' },
  { href: '#software', label: 'Software', hashRoute: true },
  { href: '#profile', label: 'Founder', hashRoute: true },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, hashRoute?: boolean) => {
    if (hashRoute) {
      e.preventDefault();
      const href = e.currentTarget.getAttribute('href') || '#';
      const hash = href.startsWith('#') ? href : `#${href}`;
      if (window.location.hash !== hash) {
        window.location.hash = hash;
      } else {
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-bjp-navy/90 backdrop-blur-md border-b border-saffron-500/20">
      <div className="tricolor-bar" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="text-white text-xl font-bold tracking-tight">
            Shreshti
          </a>
          <div className="hidden lg:flex items-baseline gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNav(e, link.hashRoute)}
                className="text-white hover:text-saffron-300 px-2.5 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:text-saffron-300 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-bjp-navy/95 backdrop-blur-md border-t border-saffron-500/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNav(e, link.hashRoute)}
                className="text-white hover:text-saffron-300 block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
