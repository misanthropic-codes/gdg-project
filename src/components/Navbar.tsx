'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';

// Configuration for navigation links (memoized to prevent unnecessary re-renders)
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/members', label: 'Members' },
  { href: '/events', label: 'Events' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/contact', label: 'Contact us' },
];

const Navbar = () => {
  // Use pathname hook
  const pathname = usePathname();

  // State management with useCallback to memoize state setters
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Memoized toggle functions to prevent unnecessary re-renders
  const toggleDarkMode = useCallback(() => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    // Optional: Persist dark mode preference in localStorage
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  }, [isDarkMode]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Memoized scroll and dark mode handler
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 20);

    // Automatically close mobile menu when scrolling down
    if (scrollY > 50 && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMenuOpen]);

  // Optimization: Use effect for initial setup and event listeners
  useEffect(() => {
    // Check for saved dark mode preference or system preference
    const savedDarkMode = localStorage.getItem('darkMode');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let initialDarkMode = prefersDarkMode;
    
    // Safely parse dark mode preference
    try {
      if (savedDarkMode !== null) {
        const parsedMode = JSON.parse(savedDarkMode);
        // Ensure parsed value is a boolean
        if (typeof parsedMode === 'boolean') {
          initialDarkMode = parsedMode;
        }
      }
    } catch (error) {
      // If parsing fails, fall back to system preference
      console.warn('Failed to parse dark mode preference:', error);
    }
    
    setIsDarkMode(initialDarkMode);
    document.documentElement.classList.toggle('dark', initialDarkMode);

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Memoized background classes to prevent unnecessary recalculations
  const navbarBackgroundClasses = useMemo(() => {
    if (isScrolled) {
      return isDarkMode 
        ? 'bg-black/90 backdrop-blur-xl' 
        : 'bg-white/80 backdrop-blur-xl';
    }
    return isDarkMode 
      ? 'bg-black' 
      : 'bg-gradient-to-r from-white via-white/95 to-white';
  }, [isScrolled, isDarkMode]);

  // Memoized link classes
  const getLinkClasses = useCallback((href:string) => {
    const isActive = pathname === href;
    return `
      relative px-4 py-2 rounded-xl text-sm font-medium
      group transition-all duration-300 ease-in-out
      ${isActive 
        ? 'bg-blue-600 text-white hover:bg-blue-700' 
        : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800/50'
      }
      ${isDarkMode 
        ? 'dark:hover:border-blue-400 dark:hover:border' 
        : ''
      }
    `;
  }, [pathname, isDarkMode]);

  // Memoized link text classes
  const getLinkTextClasses = useCallback((href:string) => {
    return pathname === href 
      ? 'text-white' 
      : isDarkMode 
        ? 'text-gray-100' 
        : 'text-gray-800';
  }, [pathname, isDarkMode]);

  // Memoized mobile menu background classes
  const mobileMenuBackgroundClasses = useMemo(() => {
    return `
      p-4 my-2 rounded-2xl  // Increased border radius
      ${isDarkMode 
        ? 'bg-black/90 border border-gray-800/50' 
        : 'bg-white/90 border border-gray-200/20'}
      backdrop-blur-xl
      transform transition-all duration-500 ease-in-out
      ${isMenuOpen 
        ? 'opacity-100 translate-y-0 scale-100' 
        : 'opacity-0 translate-y-4 scale-95'}
    `;
  }, [isDarkMode, isMenuOpen]);

  return (
    <nav className={`
      fixed top-0 w-full transition-all duration-300 z-50
      ${navbarBackgroundClasses}
    `}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Navbar Container */}
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img 
                src="/assets/logo-gdg.png" 
                alt="Google Developer Groups" 
                className="h-8 w-auto "
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  ${getLinkClasses(link.href)}
                  ${!isDarkMode ? 'group' : ''}
                `}
              >
                <span className={`
                  relative z-10 
                  ${getLinkTextClasses(link.href)}
                  ${!isDarkMode && pathname !== link.href ? 'nav-link-glaze' : ''}
                `}>
                  {link.label}
                </span>
              </Link>
            ))}

            {/* Theme Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className={`
                  p-2 rounded-full transition-all duration-500 
                  bg-transparent
                  text-gray-700 dark:text-gray-200
                `}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-400 transition-transform duration-300 hover:rotate-45" />
                ) : (
                  <Moon className="h-5 w-5 text-blue-600 transition-transform duration-300 hover:rotate-45" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`
                p-2 rounded-full transition-all duration-500 relative group
                bg-transparent
              `}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-400 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="h-5 w-5 text-blue-600 transition-transform duration-300 hover:rotate-45" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className={`
                p-2 rounded-full transition-all duration-300 relative overflow-hidden
                bg-transparent
              `}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span className={` absolute left-0 w-6 h-0.5 
                  ${isDarkMode ? 'bg-white' : 'bg-black'}
                  transform transition-all duration-300
                  ${isMenuOpen ? 'top-3 rotate-45' : 'top-2'}
                `} />
                <span className={`
                  absolute left-0 top-3 w-6 h-0.5 
                  ${isDarkMode ? 'bg-white' : 'bg-black'}
                  transform transition-all duration-300
                  ${isMenuOpen ? 'opacity-0' : 'opacity-100'}
                `} />
                <span className={`
                  absolute left-0 w-6 h-0.5 
                  ${isDarkMode ? 'bg-white' : 'bg-black'}
                  transform transition-all duration-300
                  ${isMenuOpen ? 'top-3 -rotate-45' : 'top-4'}
                `} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`
          md:hidden overflow-hidden transition-all duration-500 ease-in-out
          ${isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className={mobileMenuBackgroundClasses}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={toggleMenu}
                className={`
                  block px-4 py-3 rounded-xl text-base font-medium
                  transition-all duration-300 mb-2 last:mb-0
                  ${pathname === link.href
                    ? 'bg-blue-600 text-white' 
                    : isDarkMode
                      ? 'text-gray-100 hover:bg-gray-800/50 hover:border hover:border-blue-400'
                      : 'text-gray-800 hover:bg-gray-100'
                  }
                  transform transition-transform duration-300 hover:scale-[1.02]
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;