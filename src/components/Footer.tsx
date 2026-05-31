'use client';

import { useRouter } from 'next/navigation';
import { Instagram, Facebook, Youtube } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
}

export default function Footer({ onOpenBooking }: FooterProps) {
  const router = useRouter();

  const handleNavClick = (page: string) => {
    router.push(page === 'home' ? '/' : `/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="cinematic-footer"
      className="relative bg-[#0A0908] text-[#F2ECE2] pt-20 pb-8 mt-auto overflow-hidden border-t border-[#C4A472]/30"
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full bg-[#C4A472]/5 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
          {/* Logo + Tagline */}
          <div className="md:col-span-5 space-y-6 text-left select-none">
            <button
            id="nav-logo-btn"
            onClick={() => handleNavClick('home')}
            className="group flex items-center gap-2.5 cursor-pointer text-left focus:outline-none"
          >
            <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-[#161412] border border-[#C4A472]/40 group-hover:border-[#C4A472]/80 group-hover:scale-105 transition-all duration-500 overflow-hidden shadow-lg">
              <img
                src="/thegrandicon_logo.webp"
                alt="The Grand Icon Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="block font-serif text-[18px] md:text-[22px] tracking-[0.03em] font-light text-[#F2ECE2] group-hover:text-[#C4A472] transition-colors duration-500 leading-none">
  The Grand Icon
</span>
              {/* <span className="block text-[9px] tracking-[0.3em] font-mono text-[#7A7068] uppercase -mt-0.5">
                Chandrapur
              </span> */}
            </div>
          </button>
            <p className="font-serif italic text-base text-[#7A7068] leading-relaxed max-w-xs font-light">
              "Where Elegance Rules. Where every celebration finds its eternal memory."
            </p>
            <p className="font-sans text-[11px] text-[#7A7068] font-light tracking-wide">
              VIP Circle, Civil Lines, Chandrapur, Maharashtra — 442401, India
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 space-y-5 text-left">
            <span className="block text-[9px] font-mono tracking-[0.3em] uppercase text-[#C4A472]">
              The Sanctuary Navigation
            </span>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 font-sans text-xs text-[#7A7068]">
              {['Stay', 'Halls', 'Dining', 'Events', 'Gallery', 'Location', 'Contact'].map((item) => {
                const pageId = item.toLowerCase();
                return (
                  <li key={item}>
                    <button
                      onClick={() => handleNavClick(pageId)}
                      className="hover:text-[#F2ECE2] transition-colors duration-500 cursor-pointer focus:outline-none"
                    >
                      {item === 'Location' ? 'Find Us' : item}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 space-y-5 text-left">
            <span className="block text-[9px] font-mono tracking-[0.3em] uppercase text-[#C4A472]">
              Sanctum Concierge Desk
            </span>
            <div className="space-y-3">
              <div>
                <span className="block text-[8px] font-mono text-[#5A524A] uppercase tracking-wider mb-0.5">Voice Inquiries</span>
                <a href="tel:+919604938657" className="font-mono text-[#F2ECE2] hover:text-[#C4A472] transition-colors duration-500 text-base">
                  +91 96049 38657
                </a>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-[#5A524A] uppercase tracking-wider mb-0.5">Direct Email</span>
                <a href="mailto:concierge@thegrandicon.com" className="font-mono text-xs text-[#7A7068] hover:text-[#C4A472] transition-colors duration-500">
                  concierge@thegrandicon.com
                </a>
              </div>
            </div>
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center justify-center px-6 h-9 border border-[#C4A472]/45 hover:border-[#C4A472] text-[#C4A472] hover:bg-[#C4A472]/5 text-[9px] tracking-[0.25em] uppercase font-sans font-medium transition-colors duration-500 cursor-pointer focus:outline-none"
            >
              Inquire &rarr;
            </button>
          </div>
        </div>

        {/* Wordmark */}
        <div className="relative select-none pointer-events-none overflow-hidden h-16 md:h-28 flex items-center justify-center border-t border-[#C4A472]/10 pt-4">
          <span className="block w-full text-center font-serif font-light text-[6vw] lg:text-[7vw] tracking-[0.15em] uppercase text-[#C4A472]/8 leading-none">
            THE GRAND ICON
          </span>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-[#C4A472]/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-sans text-[#5A524A]">
          <span className="select-none">
            &copy; {new Date().getFullYear()} THE GRAND ICON. ALL RIGHTS RESERVED.
          </span>
          <span className="font-mono text-[#7A7068]/80 text-[9px] tracking-[0.2em] uppercase select-none">
            CHANDRAPUR, MAHARASHTRA
          </span>
          <div className="flex items-center gap-4">
            {[
              { href: 'https://instagram.com', Icon: Instagram, label: 'Instagram' },
              { href: 'https://facebook.com', Icon: Facebook, label: 'Facebook' },
              { href: 'https://youtube.com', Icon: Youtube, label: 'YouTube' },
            ].map(({ href, Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                className="text-[#5A524A] hover:text-[#C4A472] transition-colors duration-500" aria-label={label}>
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}