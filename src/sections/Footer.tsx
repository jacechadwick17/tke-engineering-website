import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSettings } from '@/hooks/useContent';

gsap.registerPlugin(ScrollTrigger);

const footerLinks = [
  { name: 'Privacy Policy', href: '#' },
  { name: 'Terms Of Use', href: '#' },
  { name: 'Sitemap', href: '#' },
  { name: 'Contact', href: '#contact' },
];

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'Careers', href: '#careers' },
  { name: 'Contact', href: '#contact' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const { settings, loading } = useSettings();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Logo fill animation on scroll
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#') && href !== '#portal') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (loading) {
    return (
      <footer ref={footerRef} className="relative bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-16 bg-white/10 rounded w-48 mb-6" />
            <div className="h-20 bg-white/5 rounded max-w-md" />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#0a0a0a] border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div ref={logoRef} className="md:col-span-2">
            <div className="mb-6">
              {/* Added Link to Portal Here */}
              <a href="#portal" className="inline-block transition-transform hover:scale-105 cursor-pointer opacity-80 hover:opacity-100" title="Employee Portal">
                {settings?.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt="TKE Logo"
                    className="h-16 w-auto object-contain"
                  />
                ) : (
                  <div className="h-16 w-48 bg-white/10 rounded animate-pulse" />
                )}
              </a>
            </div>
            <p className="text-[#888888] text-sm leading-relaxed max-w-md">
              A medium sized consulting engineering company serving the gas and
              pipeline industry for over 30 years. Providing comprehensive
              engineering and design services throughout the continental United
              States.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-[#888888] hover:text-[#00A0A0] transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="text-[#888888]">
                {settings?.address1}
                <br />
                {settings?.address2}
              </li>
              <li>
                <a
                  href={`tel:${settings?.phone?.replace(/\./g, '')}`}
                  className="text-[#888888] hover:text-[#00A0A0] transition-colors duration-300"
                >
                  {settings?.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings?.email}`}
                  className="text-[#888888] hover:text-[#00A0A0] transition-colors duration-300"
                >
                  {settings?.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#888888] text-sm text-center md:text-left">
              Copyright &copy; {new Date().getFullYear()} TKE Engineering &
              Design, All Rights Reserved.
            </p>

            <div className="flex items-center gap-4">
              {footerLinks.map((link, index) => (
                <span key={link.name} className="flex items-center gap-4">
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-[#888888] hover:text-[#00A0A0] transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                  {index < footerLinks.length - 1 && (
                    <span className="text-white/20">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none overflow-hidden opacity-[0.02]">
        <span
          className="text-[40vw] font-bold text-white select-none"
          style={{ fontFamily: 'Oswald, sans-serif' }}
        >
          TKE
        </span>
      </div>
    </footer>
  );
}
