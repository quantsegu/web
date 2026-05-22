import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

type NavItem =
  | { type: 'route'; to: string; label: string }
  | { type: 'section'; hash: string; label: string };

const navItems: NavItem[] = [
  { type: 'route', to: '/', label: 'Home' },
  { type: 'section', hash: 'sanatan-dharma', label: 'Sanātana Dharma' },
  { type: 'section', hash: 'subsidiaries', label: 'Subsidiaries' },
  { type: 'section', hash: 'collaborations', label: 'Collaborations' },
  { type: 'section', hash: 'founders', label: 'Founders' },
  { type: 'route', to: '/software', label: 'Software' },
  { type: 'route', to: '/wealth-tools', label: 'Wealth Tools' },
  { type: 'route', to: '/resources', label: 'Resources' },
  { type: 'route', to: '/communities', label: 'Communities' },
  { type: 'section', hash: 'contact', label: 'Contact' },
];

function NavAnchor({
  item,
  className,
  onNavigate,
}: {
  item: NavItem;
  className: string;
  onNavigate?: () => void;
}) {
  const location = useLocation();

  if (item.type === 'route') {
    return (
      <Link to={item.to} className={className} onClick={onNavigate}>
        {item.label}
      </Link>
    );
  }

  const href = `/#${item.hash}`;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();
    if (location.pathname === '/') {
      e.preventDefault();
      document.getElementById(item.hash)?.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', href);
    }
  };

  return (
    <a href={href} className={className} onClick={handleClick}>
      {item.label}
    </a>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const linkClass =
    'text-white hover:text-saffron-300 px-2.5 py-2 rounded-md text-sm font-medium transition-colors';

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-bjp-navy/90 backdrop-blur-md border-b border-saffron-500/20">
      <div className="tricolor-bar" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-white text-xl font-bold tracking-tight">
            Shreshti
          </Link>
          <div className="hidden lg:flex items-baseline gap-1">
            {navItems.map((item) => (
              <NavAnchor key={item.label} item={item} className={linkClass} />
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
            {navItems.map((item) => (
              <NavAnchor
                key={item.label}
                item={item}
                className="text-white hover:text-saffron-300 block px-3 py-2 rounded-md text-base font-medium"
                onNavigate={() => setIsMenuOpen(false)}
              />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
