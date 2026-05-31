'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Landmark, Compass, Bed, UtensilsCrossed, CalendarDays, Images, MapPin, Phone } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: (type: 'room' | 'hall' | 'dining' | 'event') => void;
}

const NAV_ITEMS = [
  { id: 'stay',     label: 'Stay',     icon: Bed },
  { id: 'halls',    label: 'Halls',    icon: Landmark },
  { id: 'dining',   label: 'Dining',   icon: UtensilsCrossed },
  { id: 'events',   label: 'Events',   icon: CalendarDays },
  { id: 'gallery',  label: 'Gallery',  icon: Images },
  { id: 'location', label: 'Find Us',  icon: MapPin },
  { id: 'contact',  label: 'Contact',  icon: Phone },
];

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Derive active page from URL
  const activePage = pathname === '/' ? 'home' : pathname.replace('/', '');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    router.push(id === 'home' ? '/' : `/${id}`);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        id="global-navbar"
        className={`fixed top-0 left-0 w-full z-40 transition-colors duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
          isScrolled
            ? 'h-16 md:h-20 bg-[#0A0908]/85 backdrop-blur-2xl border-b border-[#C4A472]/15 shadow-2xl shadow-[#0A0908]/40'
            : 'h-20 md:h-24 bg-transparent border-b border-[#C4A472]/5'
        }`}
      >
        <div className="max-w-7xl h-full mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
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

          
          {/* Desktop Links */}
{/* <nav id="desktop-nav" className="hidden lg:flex items-center gap-10">
  {NAV_ITEMS.map((item) => {
    const isActive = activePage === item.id;
    return (
      <button
        id={`nav-link-${item.id}`}
        key={item.id}
        onClick={() => handleNavClick(item.id)}
        className="relative py-2 text-[12px] tracking-[0.3em] font-sans uppercase font-medium text-[#7A7068] hover:text-[#F2ECE2] transition-colors duration-500 cursor-pointer focus:outline-none"
      >
        <span className={isActive ? 'text-[#C4A472]' : ''}>{item.label}</span>
        {isActive && (
          <motion.span
            layoutId="activeNavIndicator"
            className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C4A472]"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </button>
    );
  })}
</nav> */}

          {/* Right Controls */}
          <div className="flex items-center gap-6">
            <button
              id="header-booking-btn"
              onClick={() => onOpenBooking('room')}
              className="hidden sm:inline-flex items-center justify-center h-10 px-6 border border-[#C4A472]/45 hover:border-[#C4A472] hover:bg-[#C4A472]/5 text-[#C4A472] text-[10px] tracking-[0.25em] uppercase font-sans font-medium transition-colors duration-500 focus:outline-none cursor-pointer"
            >
              Enquire
            </button>
            <button
              id="hamburger-toggle-btn"
              onClick={() => setIsDrawerOpen(true)}
              className="group relative w-10 h-10 flex items-center justify-center border border-[#C4A472]/15 hover:border-[#C4A472]/40 bg-[#161412]/60 hover:bg-[#161412] text-[#F2ECE2] cursor-pointer focus:outline-none transition-colors duration-500"
              aria-label="Open Menu"
            >
              <div className="flex flex-col gap-1.5 items-end justify-center w-5">
                <span className="block w-5 h-[1.5px] bg-[#C4A472] group-hover:w-4 transition-colors duration-500" />
                <span className="block w-4 h-[1.5px] bg-[#C4A472] group-hover:w-5 transition-colors duration-500" />
                <span className="block w-5 h-[1.5px] bg-[#C4A472] group-hover:w-3 transition-colors duration-500" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              id="drawer-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              id="nav-drawer-panel"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: [0.76, 0, 0.24, 1], duration: 0.6 }}
              className="fixed top-0 right-0 h-full w-[85%] sm:w-[500px] z-[51] bg-[#161412] border-l border-[#C4A472]/20 flex flex-col justify-between p-8 md:p-12 shadow-2xl shadow-black"
            >
              <div className="flex items-center justify-between border-b border-[#C4A472]/10 pb-6">
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
                <button
                  id="close-drawer-btn"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-10 h-10 flex items-center justify-center border border-[#C4A472]/15 hover:border-[#C4A472]/50 text-[#7A7068] hover:text-[#F2ECE2] transition-colors duration-500 focus:outline-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav id="drawer-nav-links" className="flex-1 my-6 flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3.5">
                  <div className="group col-span-2 border-b border-[#C4A472]/15 pb-2 mb-1">
                    <button
                      id="drawer-link-home"
                      onClick={() => handleNavClick('home')}
                      className="w-full text-left font-serif font-light italic text-[18px] md:text-[21px] text-[#F2ECE2] hover:text-[#C4A472] transition-colors duration-500 flex items-center justify-between cursor-pointer focus:outline-none"
                    >
                      <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
                        Begin Here
                      </motion.span>
                      <Compass className="w-4 h-4 text-[#7A7068] group-hover:text-[#C4A472] group-hover:rotate-45 transition-colors duration-500" />
                    </button>
                  </div>

                  {NAV_ITEMS.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="group border-b border-[#C4A472]/10 pb-1.5">
                        <button
                          id={`drawer-link-${item.id}`}
                          onClick={() => handleNavClick(item.id)}
                          className="w-full text-left font-serif font-light text-[15px] md:text-[17px] text-[#F2ECE2] hover:text-[#C4A472] transition-colors duration-500 flex items-center justify-between cursor-pointer focus:outline-none"
                        >
                          <motion.span
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.12 + index * 0.04, duration: 0.4 }}
                            className={`inline-block ${activePage === item.id ? 'italic text-[#C4A472]' : ''}`}
                          >
                            {item.label}
                          </motion.span>
                          <Icon className="w-3.5 h-3.5 text-[#7A7068] group-hover:text-[#C4A472] group-hover:translate-x-1 transition-colors duration-500" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </nav>

              <div className="border-t border-[#C4A472]/10 pt-6">
                <span className="block text-[9px] tracking-[0.3em] font-mono text-[#7A7068] uppercase mb-4">
                  For Sanctuary Bookings
                </span>
                <div className="flex flex-col gap-2">
                  <a href="tel:+919604938657" className="font-mono text-[#F2ECE2] hover:text-[#C4A472] text-sm tracking-widest transition-colors duration-500">
                    +91 96049 38657
                  </a>
                  <a href="mailto:concierge@thegrandicon.com" className="font-mono text-xs text-[#7A7068] hover:text-[#C4A472] transition-colors duration-500">
                    concierge@thegrandicon.com
                  </a>
                </div>
                <div className="mt-6 flex gap-4">
                  <button onClick={() => { onOpenBooking('room'); setIsDrawerOpen(false); }}
                    className="flex-1 py-3 text-[10px] tracking-[0.25em] font-sans font-semibold uppercase border border-[#C4A472]/45 hover:border-[#C4A472] hover:bg-[#C4A472]/5 text-[#C4A472] cursor-pointer transition-colors duration-500">
                    Rooms
                  </button>
                  <button onClick={() => { onOpenBooking('hall'); setIsDrawerOpen(false); }}
                    className="flex-1 py-3 text-[10px] tracking-[0.25em] font-sans font-semibold uppercase bg-[#C4A472]/10 border border-[#C4A472]/30 hover:border-[#C4A472] text-[#C4A472] cursor-pointer transition-colors duration-500">
                    Halls
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}