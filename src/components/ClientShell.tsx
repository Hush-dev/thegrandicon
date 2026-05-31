'use client';

import { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AvailabilityModal from '@/components/AvailabilityModal';
// import Loader from '@/components/Loader';
import PageTransition from '@/components/PageTransition';
import { usePathname } from 'next/navigation';

type BookingType = 'room' | 'hall' | 'dining' | 'event';

const BookingContext = createContext<{
  handleOpenBooking: (type?: BookingType, itemName?: string) => void;
}>({
  handleOpenBooking: () => {},
});
export const useBooking = () => useContext(BookingContext);

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [bookingType, setBookingType] = useState<BookingType>('room');
  const [bookingItemName, setBookingItemName] = useState<string | undefined>(undefined);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const cursorRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // RAF ref to throttle mousemove
  const rafRef = useRef<number | null>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const isHovered = useRef(false);

  const handleOpenBooking = useCallback((type: BookingType = 'room', itemName?: string) => {
    setIsBookingOpen(false);
    setBookingType(type);
    setBookingItemName(itemName);
    setIsBookingOpen(true);
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Custom cursor — RAF throttled
  useEffect(() => {
    if (isMobile) return;

    const updateCursor = () => {
      if (!cursorRef.current) return;
      const offset = isHovered.current ? 32 : 4;
      gsap.set(cursorRef.current, {
        x: mousePos.current.x - offset,
        y: mousePos.current.y - offset,
      });
      rafRef.current = requestAnimationFrame(updateCursor);
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Use mouseenter/mouseleave on document to avoid bubbling cost
    const isInteractive = (e: MouseEvent) => {
      // Guard: only Element nodes have .closest(), not text/comment nodes
      const target = e.target;
      if (!(target instanceof Element)) return false;
      return (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        !!target.closest('button') ||
        !!target.closest('a')
      );
    };

    const onMouseEnter = (e: MouseEvent) => {
      if (!cursorRef.current || !isInteractive(e)) return;
      if (isHovered.current) return;
      isHovered.current = true;
      gsap.to(cursorRef.current, {
        width: 56, height: 56,
        backgroundColor: 'rgba(196,164,114,0.08)',
        duration: 0.25, ease: 'power2.out', overwrite: 'auto',
      });
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (!cursorRef.current || !isInteractive(e)) return;
      if (!isHovered.current) return;
      isHovered.current = false;
      gsap.to(cursorRef.current, {
        width: 8, height: 8,
        backgroundColor: '#C4A472',
        duration: 0.2, ease: 'power2.out', overwrite: 'auto',
      });
    };

    rafRef.current = requestAnimationFrame(updateCursor);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, true);
    document.addEventListener('mouseleave', onMouseLeave, true);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter, true);
      document.removeEventListener('mouseleave', onMouseLeave, true);
    };
  }, [isMobile]);

  // Floating button shrink on scroll
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    let scrollTimeout: ReturnType<typeof setTimeout>;
    let isShrunk = false;

    const shrink = () => {
      if (isShrunk) return;
      isShrunk = true;
      if (btnRef.current) gsap.to(btnRef.current, { width: 48, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
      if (textRef.current) gsap.to(textRef.current, { opacity: 0, x: -8, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
    };

    const expand = () => {
      if (!isShrunk) return;
      isShrunk = false;
      if (btnRef.current) gsap.to(btnRef.current, { width: 190, duration: 0.4, ease: 'back.out(1.4)', overwrite: 'auto' });
      if (textRef.current) gsap.to(textRef.current, { opacity: 1, x: 0, duration: 0.3, delay: 0.06, ease: 'power2.out', overwrite: 'auto' });
    };

    const trigger = ScrollTrigger.create({
      onUpdate: (self) => {
        if (Math.abs(self.getVelocity()) > 50) shrink();
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(expand, 300);
      },
    });

    return () => { trigger.kill(); clearTimeout(scrollTimeout); };
  }, []);

  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <BookingContext.Provider value={{ handleOpenBooking }}>
      <AnimatePresence mode="wait">
        {/* {isLoading && <Loader key="loader" onComplete={() => setIsLoading(false)} />} */}
      </AnimatePresence>

      <div className="relative min-h-screen bg-[#0A0908] text-[#F2ECE2] font-sans overflow-x-hidden">

        {/* Grain: isolated layer, will-change keeps it off main thread */}
        <div className="cinematic-grain fixed inset-0 pointer-events-none z-[5]" style={{ willChange: 'transform' }} />

        {/* Custom cursor */}
        {!isMobile && (
          <div
            ref={cursorRef}
            className="fixed pointer-events-none z-50 rounded-full border border-[#C4A472] bg-[#C4A472] w-2 h-2"
            style={{ left: 0, top: 0, willChange: 'transform' }}
          />
        )}

        {/* Grid overlay */}
        <div className="fixed inset-0 pointer-events-none z-10 max-w-7xl mx-auto px-6 md:px-12 flex justify-between">
          <div className="w-px h-full bg-[#C4A472]/[0.04]" />
          <div className="hidden md:block w-px h-full bg-[#C4A472]/[0.04]" />
          <div className="hidden md:block w-px h-full bg-[#C4A472]/[0.04]" />
          <div className="w-px h-full bg-[#C4A472]/[0.04]" />
        </div>

        <Navbar onOpenBooking={handleOpenBooking} />

        <PageTransition>{children}</PageTransition>

        {/* Floating availability button — hidden on home page */}
        {!isHomePage && (
          <motion.button
            ref={btnRef}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1, ease: [0.33, 1, 0.68, 1] }}
            onClick={() => handleOpenBooking('room')}
            className="fixed bottom-7 right-7 z-30 h-12 bg-[#161412]/90 border border-[#C4A472]/50 hover:border-[#C4A472] flex items-center justify-start shadow-[0_8px_40px_rgba(0,0,0,0.5)] cursor-pointer focus:outline-none rounded-full overflow-hidden select-none"
            style={{ width: '190px', willChange: 'width' }}
          >
            <div className="flex items-center h-full w-full relative">
              <div className="absolute left-[18px] w-3 h-3 flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-[#C4A472] relative block">
                  <span className="absolute -inset-1 rounded-full bg-[#C4A472]/40 animate-ping" />
                </span>
              </div>
              <div ref={textRef} className="pl-[42px] pr-5 text-[10px] tracking-[0.25em] font-sans font-semibold uppercase text-[#C4A472] whitespace-nowrap">
                Check Availability
              </div>
            </div>
          </motion.button>
        )}

        <AvailabilityModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          initialType={bookingType}
          initialRoomName={bookingType === 'room' ? bookingItemName : undefined}
          initialHallName={bookingType === 'hall' ? bookingItemName : undefined}
        />

        {/* Footer — hidden on home page */}
        {!isHomePage && <Footer onOpenBooking={() => handleOpenBooking('room')} />}
      </div>
    </BookingContext.Provider>
  );
}