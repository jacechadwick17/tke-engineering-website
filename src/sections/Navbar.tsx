import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';
import { useSettings } from '@/hooks/useContent';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'Careers', href: '#careers' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  const { settings, loading } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Entrance animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
      );

      if (linksRef.current) {
        gsap.fromTo(
          linksRef.current.children,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.6 }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If we are currently IN the portal, we want to LEAVE and go to the main site.
    // We allow the default browser behavior so the URL hash changes, 
    // which triggers the App.tsx listener to swap views.
    if (window.location.hash === '#portal') {
      setIsMobileMenuOpen(false);
      return; 
    }

    // If we are on the main site, handle smooth scroll as normal
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Default logo SVG
  const DefaultLogo = () => (
    <svg
      width={settings?.logoWidth || 50}
      height={settings?.logoWidth || 50}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300 hover:scale-105"
    >
      <rect width="100" height="100" rx="8" fill="#1a1a1a" />
      <text
        x="50"
        y="65"
        textAnchor="middle"
        fill="white"
        fontSize="42"
        fontWeight="bold"
        fontFamily="Oswald, sans-serif"
      >
        TKE
      </text>
      <rect x="10" y="75" width="80" height="2" fill="#00A0A0" />
    </svg>
  );

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3 px-4 md:px-8'
            : 'py-6 px-4 md:px-12'
        }`}
      >
        <div
          className={`mx-auto transition-all duration-500 ${
            isScrolled
              ? 'max-w-4xl glass-effect rounded-full px-6 py-3'
              : 'max-w-7xl'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div ref={logoRef} className="flex items-center gap-3">
              <div className="relative">
                {loading ? (
                  <div className="w-[50px] h-[50px] bg-white/10 rounded animate-pulse" />
                ) : settings?.logoUrl ? (
                  <a href="#home" onClick={(e) => handleLinkClick(e, '#home')}>
                    <img
                      src={settings.logoUrl}
                      alt="TKE Logo"
                      width={settings.logoWidth || 50}
                      height={settings.logoWidth || 50}
                      className="transition-transform duration-300 hover:scale-105 object-contain"
                    />
                  </a>
                ) : (
                  <a href="#home" onClick={(e) => handleLinkClick(e, '#home')}>
                    <DefaultLogo />
                  </a>
                )}
              </div>
            </div>

            {/* Desktop Navigation */}
            <div ref={linksRef} className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-sm text-[#e0e0e0] hover:text-[#00A0A0] transition-colors duration-300 link-underline font-medium tracking-wide"
                >
                  {link.name.toUpperCase()}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-lg transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-2xl text-white hover:text-[#00A0A0] transition-colors duration-300 font-semibold tracking-wider"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {link.name.toUpperCase()}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
