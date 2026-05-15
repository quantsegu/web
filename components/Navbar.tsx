import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="#" className="text-white text-xl font-bold">Shreshti</a>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">Home</a>
              <a href="#subsidiaries" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">Subsidiaries</a>
              <a href="#joint-ventures" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">Joint Ventures</a>
              <a href="#collaborations" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">Collaborations</a>
              <a href="#software" onClick={(e) => { e.preventDefault(); window.location.href = '#software'; }} className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">Software</a>
              <a href="#profile" onClick={(e) => { e.preventDefault(); window.location.href = '#profile'; }} className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">Founder</a>
              <a href="#contact" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">Contact</a>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-purple-300 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a 
              href="#" 
              className="text-white hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="#subsidiaries" 
              className="text-white hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Subsidiaries
            </a>
            <a 
              href="#joint-ventures" 
              className="text-white hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Joint Ventures
            </a>
            <a 
              href="#collaborations" 
              className="text-white hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Collaborations
            </a>
            <a 
              href="#software"
              onClick={(e) => { 
                e.preventDefault(); 
                window.location.href = '#software'; 
                setIsMenuOpen(false);
              }} 
              className="text-white hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium"
            >
              Software
            </a>
            <a 
              href="#profile"
              onClick={(e) => { 
                e.preventDefault(); 
                window.location.href = '#profile'; 
                setIsMenuOpen(false);
              }} 
              className="text-white hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium"
            >
              Founder
            </a>
            <a 
              href="#contact" 
              className="text-white hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}