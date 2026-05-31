'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  ChevronLeft, ChevronRight, Landmark, UtensilsCrossed,
  Wifi, Coffee, Tv, Bath, Wind, ShieldCheck,
  Users, Maximize, Bed, ArrowUpRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/components/ClientShell';
import GallerySection from '@/components/GallerySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';

// Inline alias so we can pass openBooking prop
function HomeFooter({ onOpenBooking }: { onOpenBooking: (type: any, name?: string) => void }) {
  return <Footer onOpenBooking={() => onOpenBooking('room')} />;
}

// ─── Types ────────────────────────────────────────────────────
type ServiceType = 'rooms' | 'halls' | 'dining';

// ─── Data ─────────────────────────────────────────────────────
const SERVICES = [
  { id: 'rooms'  as ServiceType, label: 'Rooms',   sub: 'Suites',  icon: Bed },
  { id: 'halls'  as ServiceType, label: 'Banquet', sub: 'Events',  icon: Landmark },
  { id: 'dining' as ServiceType, label: 'Dining',  sub: 'Saatvik', icon: UtensilsCrossed },
];

const COMMON_AMENITIES = [
  { label: 'High-Speed Wi-Fi',        icon: Wifi },
  { label: 'Complimentary Breakfast', icon: Coffee },
  { label: 'Smart LED TV',            icon: Tv },
  { label: 'Luxury Bathrooms',        icon: Bath },
  { label: 'Air Conditioning',        icon: Wind },
  { label: '24/7 Room Service',       icon: ShieldCheck },
];

const ROOMS = [
  {
    id: 'presidential',
    name: 'Presidential Suite',
    price: 'Starts from ₹18,000',
    note: 'Final tariff varies by occupancy, dates & inclusions',
    description:
      'Experience unmatched luxury in our Presidential Suite featuring a spacious bedroom, elegant living area, luxury bathroom, smart entertainment system, premium furnishings, and personalized services crafted for an exceptional stay.',
    images: [
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173835/presidential_room_1_in5xfg.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173835/presidential_room_2_hnjwsb.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173835/presidential_room_3_exai6l.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173835/presidential_room_4_dbeakn.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173836/presidential_room_5_t2dzhb.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173835/presidential_room_6_m6bbvy.webp',

    ],
    amenities: [
      'King Bed',
      'Private Lounge',
      'Butler Service',
      'Jacuzzi',
      'Smart Automation',
      'City View',
    ],
    size: '950 sq.ft',
    guests: 'Up to 4 Guests',
  },

  {
    id: 'executive',
    name: 'Executive Suite',
    price: 'Starts from ₹12,000',
    note: 'Final tariff varies by occupancy, dates & inclusions',
    description:
      'Designed for refined comfort, the Executive Suite offers a spacious bedroom, stylish workspace, modern bathroom, premium amenities, smart entertainment, and an elevated stay experience for business and leisure travelers alike.',
    images: [
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173885/executive_room_1_p6vphq.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173886/executive_room_2_djrwqz.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173885/executive_room_3_yw05mu.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173884/executive_room_4_tzxind.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173883/executive_room_5_uqbs02.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173882/executive_room_6_ne7tt9.webp',

    ],
    amenities: [
      'Workspace',
      'Mini Bar',
      'Rain Shower',
      'High-Speed Wi-Fi',
      'King Bed',
      'Smart TV',
    ],
    size: '720 sq.ft',
    guests: 'Up to 3 Guests',
  },

  {
    id: 'premium',
    name: 'Premium Room',
    price: 'Starts from ₹8,500',
    note: 'Final tariff varies by occupancy, dates & inclusions',
    description:
      'Experience modern elegance in our Premium Room featuring spacious interiors, plush bedding, contemporary décor, premium amenities, and a relaxing ambiance designed for a comfortable and memorable stay.',
    images: [
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173861/premium_room_1_ecz0th.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173863/premium_room_2_btk7gu.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173861/premium_room_3_udjivh.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173860/premium_room_4_qqpq1l.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173859/premium_room_5_bnc5el.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173860/premium_room_6_yrbrtm.webp',

    ],
    amenities: [
      '2 Queen Beds',
      'Mini Refrigerator',
      'Tea/Coffee Maker',
      'Breakfast',
      'Air Conditioning',
      'Lounge Sofa',
    ],
    size: '580 sq.ft',
    guests: 'Up to 4 Guests',
  },

  {
    id: 'deluxe',
    name: 'Deluxe Room',
    price: 'Starts from ₹6,500',
    note: 'Final tariff varies by occupancy, dates & inclusions',
    description:
      'Unwind in our Deluxe Room thoughtfully designed with cozy interiors, elegant furnishings, modern comforts, and essential amenities to ensure a relaxing and enjoyable stay experience.',
    images: [
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173895/delux_room_2_c8oasx.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173896/delux_room_3_jnm5em.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173893/delux_room_6_y17iws.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173893/delux_room_5_deshqi.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173894/delux_room_4_vt7ugg.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173896/delux_room_1_wllbfz.webp',

    ],
    amenities: [
      'Premium Linens',
      'Rain Shower',
      'Wi-Fi',
      'Room Service',
      'King Bed',
      'Smart TV',
    ],
    size: '450 sq.ft',
    guests: 'Up to 2 Guests',
  },

  {
    id: 'superior',
    name: 'Superior Room',
    price: 'Starts from ₹5,500',
    note: 'Final tariff varies by occupancy, dates & inclusions',
    description:
      'Enjoy a comfortable and refreshing stay in our Superior Room featuring modern interiors, comfortable bedding, essential amenities, and a peaceful ambiance perfect for effortless relaxation.',
    images: [
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173848/superier_room_1_voqhzp.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173848/superier_room_2_zxtn64.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173847/superier_room_3_wltuip.webp',
      'https://res.cloudinary.com/di1chosqa/image/upload/v1780173847/superier_room_4_mybjhp.webp',

    ],
    amenities: [
      'Queen Bed',
      'Smart TV',
      'Wi-Fi',
      'Tea/Coffee Maker',
      'Air Conditioning',
      'Room Service',
    ],
    size: '380 sq.ft',
    guests: 'Up to 2 Guests',
  },
];

const HALLS = [
  {
    id: 'sparsh', name: 'Sparsh', capacity: '80–250 Guests',
    tagline: 'Intimate elegance for curated gatherings.',
    description: 'An intimate yet grand hall perfect for corporate events, private dinners, and exclusive celebrations. Equipped with state-of-the-art audiovisual systems.',
    image: 'https://res.cloudinary.com/di1chosqa/image/upload/v1780212827/sparsh_lafyg6.webp',
    setups: ['Theatre Style', 'Cluster Setup', 'Round Table'],
    features: ['LED Wall', 'Line Array Sound', 'Stage Setup', 'Catering Services', 'Valet Parking', 'Green Room'],
  },
  {
    id: 'majesty', name: 'Majesty', capacity: '300–800 Guests',
    tagline: 'Grand scale for legendary celebrations.',
    description: 'Our flagship pillarless ballroom featuring soaring double-height ceilings, crystal chandeliers, and an opulent main stage for grand weddings and gala events.',
    image: 'https://res.cloudinary.com/di1chosqa/image/upload/v1780212827/majesty_xzowkb.webp',
    setups: ['Theatre Style', 'Cluster Setup', 'Round Table'],
    features: ['Pillarless Structure', 'Crystal Chandeliers', 'VIP Greenrooms', 'Line Array Sound', 'LED Wall', 'Backstage'],
  },
  {
    id: 'harmony', name: 'Harmony', capacity: '150–400 Guests',
    tagline: 'Where every occasion finds its rhythm.',
    description: 'A versatile mid-scale hall adaptable to conferences, receptions, and social galas. Acoustic partitioning allows dual-event setups simultaneously.',
    image: 'https://res.cloudinary.com/di1chosqa/image/upload/v1780212827/harmony_sqhlup.webp',
    setups: ['Theatre Style', 'Cluster Setup', 'Round Table'],
    features: ['Acoustic Partitioning', 'Ambient Lighting', 'Bespoke Catering', 'Projection System', 'Lounge Area', 'Wi-Fi'],
  },
  {
    id: 'suraahi', name: 'Suraahi', capacity: '500–1500 Guests',
    tagline: 'Open-air romance underneath the stars.',
    description: 'Our sprawling open-air pavilion set beneath a canopy of stars. Perfect for grand weddings, outdoor concerts, and mega-events with unmatched scale.',
    image: 'https://res.cloudinary.com/di1chosqa/image/upload/v1780212827/suraahi_heyrxk.webp',
    setups: ['Theatre Style', 'Cluster Setup', 'Round Table', 'Wedding Setup'],
    features: ['Manicured Lawns', 'Outdoor Cabanas', 'Amphitheater Acoustics', 'Botanical Arcades', 'Flood Lighting', 'Valet'],
  },
];

const DINING = {
  name: 'Saatvik Restaurant',
  tagline: 'A delightful culinary journey.',
  description: 'Saatvik Restaurant offers authentic Indian, Chinese, Continental and regional delicacies prepared by our experienced chefs. From intimate family dinners to lavish buffets — every meal is a celebration of flavour and tradition.',
  image: 'https://res.cloudinary.com/di1chosqa/image/upload/v1780212827/restaurant_Interior_tt0dih.webp',
  highlights: [
    { label: 'Live Kitchen Counter', img: 'https://res.cloudinary.com/di1chosqa/image/upload/v1780212828/kitchen_fpkykg.webp' },
    { label: 'Buffet Area',          img: 'https://res.cloudinary.com/di1chosqa/image/upload/v1780212828/buffet_area_kqihpl.webp' },
    { label: 'Family Dining',        img: 'https://res.cloudinary.com/di1chosqa/image/upload/v1780212827/family_area_un6cft.webp' },
    { label: 'Restaurant Interior',  img: 'https://res.cloudinary.com/di1chosqa/image/upload/v1780212827/restaurant_Interior_tt0dih.webp' },
  ],
  cuisines: ['Authentic Indian', 'Chinese', 'Continental', 'Regional Specialties'],
  timings: [
    { meal: 'Breakfast', time: '7:00 AM – 10:30 AM' },
    { meal: 'Lunch',     time: '12:30 PM – 3:30 PM' },
    { meal: 'Dinner',    time: '7:30 PM – 11:00 PM' },
  ],
};

// ─── Navbar height hook ───────────────────────────────────────
function useNavbarHeight() {
  const [h, setH] = useState(80);
  useEffect(() => {
    const measure = () => {
      const el = document.getElementById('global-navbar');
      if (el) setH(el.offsetHeight);
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('scroll', measure, { passive: true });
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, []);
  return h;
}

// ─── Portal wrapper ───────────────────────────────────────────
// Renders children into document.body — completely escapes every
// overflow / transform ancestor so fixed positioning always works.
function MobilePortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

// ─── Scroll-aware hook ────────────────────────────────────────
// Returns true once the referenced hero element has scrolled
// fully above the navbar — that's when we want the bar to appear.
function useScrolledPastHero(
  heroRef: React.RefObject<HTMLDivElement | null>,
  navH: number,
) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const check = () => {
      if (!heroRef.current) return;
      setPast(heroRef.current.getBoundingClientRect().bottom <= navH);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [heroRef, navH]);
  return past;
}

// ─── Service Dock ─────────────────────────────────────────────
function ServiceDock({ active, onChange }: { active: ServiceType; onChange: (s: ServiceType) => void }) {
  const [showTooltip, setShowTooltip] = useState(true);
  const [rimDone, setRimDone]         = useState(false);

  // Hide tooltip after 4s
  useEffect(() => {
    const t = setTimeout(() => setShowTooltip(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // Stop gold rim after 3s
  useEffect(() => {
    const t = setTimeout(() => setRimDone(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 z-50 flex flex-col items-center gap-2"
      style={{ x: '-50%' }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.4 }}
            className="bg-[#0D0B09]/80 text-[#7A7068] text-[8px] font-mono tracking-[0.25em] uppercase px-3 py-1.5 rounded-full whitespace-nowrap border border-[#C4A472]/15"
          >
            Tap to explore Rooms · Halls · Dining
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock */}
      <div className="relative">

        {/* Gold rim — animated stroke around the dock for first 3s */}
        {!rimDone && (
          <motion.div
            className="absolute -inset-[3px] rounded-full pointer-events-none"
            style={{
              background: 'transparent',
              boxShadow: '0 0 0 2px #C4A472',
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: [1, 0.4, 1, 0.4, 1, 0], scale: [1, 1.04, 1, 1.04, 1, 1.02] }}
            transition={{ duration: 3, ease: 'easeInOut', times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
          />
        )}

        {/* Soft glow */}
        <div className="absolute inset-0 scale-150 rounded-full bg-[#C4A472]/10 blur-2xl pointer-events-none" />

        {/* Pill — light background */}
        <div className="relative flex items-center gap-0.5 rounded-full border border-[#C4A472]/30 bg-[#F5EDD8] p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
          {SERVICES.map(({ id, label, sub, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button key={id} onClick={() => onChange(id)}
                className="relative flex items-center gap-2.5 rounded-full px-4 py-2.5 transition-all duration-300 cursor-pointer focus:outline-none">
                {isActive && (
                  <motion.div layoutId="service-pill"
                    className="absolute inset-0 rounded-full bg-[#C4A472] shadow-[0_2px_12px_rgba(196,164,114,0.4)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
                <Icon className={`relative z-10 h-4 w-4 shrink-0 transition-colors duration-300 ${isActive ? 'text-[#0A0908]' : 'text-[#8A7A62]'}`} />
                <div className="relative z-10 leading-none">
                  <p className={`text-[12px] font-sans font-semibold tracking-wide transition-colors duration-300 ${isActive ? 'text-[#0A0908]' : 'text-[#3A3020]'}`}>{label}</p>
                  <p className={`mt-[3px] text-[8px] uppercase tracking-[0.3em] transition-colors duration-300 ${isActive ? 'text-[#0A0908]/70' : 'text-[#9A8A72]'}`}>{sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Room Carousel (Embla) ────────────────────────────────────
function RoomCarousel({ room }: { room: typeof ROOMS[0] }) {
  const autoplay = useRef(Autoplay({ delay: 4500, stopOnInteraction: false }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo   = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  useEffect(() => { emblaApi?.scrollTo(0, true); }, [room.id, emblaApi]);

  return (
    <div className="relative overflow-hidden border border-[#C4A472]/10 bg-[#111]">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {room.images.map((img, idx) => (
            <div key={idx} className="relative min-w-full">
              <div className="aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-[520px]">
                <img src={img} alt={`${room.name} ${idx + 1}`}
                  className="h-full w-full object-cover"
                  style={{ filter: 'brightness(0.9) saturate(0.9)' }} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/50 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
        <button onClick={scrollPrev}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C4A472]/30 bg-[#0A0908]/70 backdrop-blur-md transition-colors duration-300 hover:border-[#C4A472] cursor-pointer focus:outline-none">
          <ChevronLeft className="h-4 w-4 text-[#F2ECE2]" />
        </button>
        <button onClick={scrollNext}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C4A472]/30 bg-[#0A0908]/70 backdrop-blur-md transition-colors duration-300 hover:border-[#C4A472] cursor-pointer focus:outline-none">
          <ChevronRight className="h-4 w-4 text-[#F2ECE2]" />
        </button>
      </div>

      <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2">
        {room.images.map((_, idx) => (
          <button key={idx} onClick={() => scrollTo(idx)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${selectedIndex === idx ? 'h-2 w-7 bg-[#C4A472]' : 'h-2 w-2 bg-white/30 hover:bg-white/50'}`} />
        ))}
      </div>

      <div className="absolute top-4 right-4 z-20 font-mono text-[10px] text-[#C4A472]/70">
        {String(selectedIndex + 1).padStart(2, '0')} / {String(room.images.length).padStart(2, '0')}
      </div>
    </div>
  );
}

// ─── Section Hero Banner ──────────────────────────────────────
function SectionHero({
  title, accent, image, heroRef,
}: {
  title: string;
  accent: string;
  image: string;
  heroRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={heroRef} className="relative flex h-[28vh] min-h-[200px] items-center justify-center overflow-hidden md:h-[34vh]">
      <img src={image} alt={title}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: 'brightness(0.38) saturate(0.65)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-[#0A0908]" />
      <div className="relative z-10 text-center translate-y-10 md:translate-y-14">
        <h2 className="font-serif text-5xl font-light leading-none tracking-[-0.03em] md:text-7xl lg:text-7xl">
          <span className="text-[#F2ECE2]">{title}</span>
          <span className="ml-3 italic text-[#C4A472]">{accent}</span>
        </h2>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export default function ExperienceHub() {
  const router = useRouter();
  const { handleOpenBooking } = useBooking();
  const [activeService, setActiveService] = useState<ServiceType>('rooms');
  const [activeRoom,    setActiveRoom]    = useState(0);
  const [activeHall,    setActiveHall]    = useState(0);
  const [activeDining,  setActiveDining]  = useState(0);
  const navH = useNavbarHeight();

  // One ref per section hero
  const roomsHeroRef  = useRef<HTMLDivElement>(null);
  const hallsHeroRef  = useRef<HTMLDivElement>(null);
  const diningHeroRef = useRef<HTMLDivElement>(null);
  const footerRef     = useRef<HTMLDivElement>(null);

  const roomsPast  = useScrolledPastHero(roomsHeroRef,  navH);
  const hallsPast  = useScrolledPastHero(hallsHeroRef,  navH);
  const diningPast = useScrolledPastHero(diningHeroRef, navH);

  // Hide dock when footer is visible
  const [footerVisible, setFooterVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (footerRef.current) obs.observe(footerRef.current);
    return () => obs.disconnect();
  }, []);

  // Show the bar only after the active section's hero is scrolled past
  const showBar =
    (activeService === 'rooms'  && roomsPast)  ||
    (activeService === 'halls'  && hallsPast)  ||
    (activeService === 'dining' && diningPast);

  return (
    <section className="relative bg-[#0A0908]">

      {/* Ambient glow */}
      <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#C4A472]/4 blur-[160px] pointer-events-none" />

      {/* Floating dock — hidden when footer is visible */}
      <AnimatePresence>
        {!footerVisible && (
          <motion.div
            key="dock"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
          >
            <ServiceDock active={activeService} onChange={setActiveService} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Portalled mobile selector ─────────────────────────
           Mounted into document.body so no overflow/transform
           ancestor can break fixed positioning.
           Slides in only after the hero has scrolled off-screen. ── */}
      <MobilePortal>
        <AnimatePresence>
          {showBar && (
            <motion.div
              key={activeService}
              className="fixed left-0 right-0 z-40 border-y border-[#C4A472]/10 bg-[#0A0908] lg:hidden"
              style={{ top: navH }}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] }}
            >
              <div className="overflow-x-auto no-scrollbar">
                <div className="flex w-max gap-2.5 px-4 py-3">

                  {activeService === 'rooms' && ROOMS.map((room, idx) => {
                    const isActive = activeRoom === idx;
                    return (
                      <button key={room.id} onClick={() => setActiveRoom(idx)}
                        className={`relative flex shrink-0 items-center rounded-full border px-5 py-3 transition-all duration-300 cursor-pointer focus:outline-none ${
  isActive
    ? 'border-[#C4A472] bg-[#C4A472]/10'
    : 'border-[#C4A472]/10 bg-[#0F0E0D]'
}`}>
                        {/* <div className="h-9 w-9 overflow-hidden rounded-full border border-[#C4A472]/20 shrink-0">
                          <img src={room.images[0]} alt={room.name} className="h-full w-full object-cover" />
                        </div> */}
                        <div className="pr-1 text-left">
                          <p
  className={`font-serif text-[18px] leading-none transition-colors duration-300 ${
    isActive
      ? 'text-[#F2ECE2]'
      : 'text-[#7A7068]'
  }`}
>
  {room.name}
</p>
                          {/* <p className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-[#C4A472]">{room.price}</p> */}
                        </div>
                      </button>
                    );
                  })}

                  {activeService === 'halls' && HALLS.map((hall, idx) => {
                    const isActive = activeHall === idx;
                    return (
                      <button key={hall.id} onClick={() => setActiveHall(idx)}
                        className={`relative flex shrink-0 items-center rounded-full border px-5 py-3 transition-all duration-300 cursor-pointer focus:outline-none ${
  isActive
    ? 'border-[#C4A472] bg-[#C4A472]/10'
    : 'border-[#C4A472]/10 bg-[#0F0E0D]'
}`}>
                        {/* <div className="h-9 w-9 overflow-hidden rounded-full border border-[#C4A472]/20 shrink-0">
                          <img src={hall.image} alt={hall.name} className="h-full w-full object-cover" />
                        </div> */}
                        <div className="pr-1 text-left">
                          <p
  className={`font-serif text-[18px] leading-none transition-colors duration-300 ${
    isActive
      ? 'text-[#F2ECE2]'
      : 'text-[#7A7068]'
  }`}
>
  {hall.name}
</p>
                          {/* <p className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-[#C4A472]">{hall.capacity}</p> */}
                        </div>
                      </button>
                    );
                  })}

                  {activeService === 'dining' && DINING.highlights.map((h, idx) => {
                    const isActive = activeDining === idx;
                    return (
                      <button key={idx} onClick={() => setActiveDining(idx)}
                        className={`relative flex shrink-0 items-center rounded-full border px-5 py-3 transition-all duration-300 cursor-pointer focus:outline-none ${
  isActive
    ? 'border-[#C4A472] bg-[#C4A472]/10'
    : 'border-[#C4A472]/10 bg-[#0F0E0D]'
}`}>
                        {/* <div className="h-9 w-9 overflow-hidden rounded-full border border-[#C4A472]/20 shrink-0">
                          <img src={h.img} alt={h.label} className="h-full w-full object-cover" />
                        </div> */}
                        <p
  className={`font-serif text-[18px] leading-none transition-colors duration-300 ${
    isActive
      ? 'text-[#F2ECE2]'
      : 'text-[#7A7068]'
  }`}
>
  {h.label}
</p>
                      </button>
                    );
                  })}

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </MobilePortal>

      {/* ── Animated content ─────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* ── ROOMS ─────────────────────────────────────────── */}
        {activeService === 'rooms' && (
          <motion.div key="rooms"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
          >
            <SectionHero
              title="Rooms" accent="& Suites"
              image="https://res.cloudinary.com/di1chosqa/image/upload/v1780173895/delux_room_2_c8oasx.webp"
              heroRef={roomsHeroRef}
            />

            <div className="bg-[#0A0908]">
              <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-14">


              {/* Inline Mobile Selector (initial state) */}
<div className="mb-6 lg:hidden">
  <div className="overflow-x-auto no-scrollbar">
    <div className="flex w-max gap-2.5 pr-4">

      {ROOMS.map((room, idx) => {

        const isActive = activeRoom === idx;

        return (
          <button
            key={room.id}
            onClick={() => setActiveRoom(idx)}
            className={`relative flex shrink-0 items-center rounded-full border px-5 py-3 transition-all duration-300 cursor-pointer focus:outline-none ${
  isActive
    ? 'border-[#C4A472] bg-[#C4A472]/10'
    : 'border-[#C4A472]/10 bg-[#0F0E0D]'
}`}
          >
            {/* <div className="h-9 w-9 overflow-hidden rounded-full border border-[#C4A472]/20 shrink-0">
              <img
                src={room.images[0]}
                alt={room.name}
                className="h-full w-full object-cover"
              />
            </div> */}

            <div className="pr-1 text-left">
              <p
  className={`font-serif text-[18px] leading-none transition-colors duration-300 ${
    isActive
      ? 'text-[#F2ECE2]'
      : 'text-[#7A7068]'
  }`}
>
  {room.name}
</p>

              {/* <p className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-[#C4A472]">
                {room.price}
              </p> */}
            </div>
          </button>
        );
      })}

    </div>
  </div>
</div>
               {/* Desktop Luxury Selector */}
<div className="mb-12 hidden lg:flex justify-center">

  <div className="flex flex-wrap items-center justify-center gap-3 rounded-full border border-[#C4A472]/10 bg-[#111111]/80 px-4 py-3 backdrop-blur-xl">

    {ROOMS.map((room, idx) => {

      const isActive = activeRoom === idx;

      return (
        <button
          key={room.id}
          onClick={() => setActiveRoom(idx)}
          className={`relative flex items-center rounded-full border px-7 py-4 transition-all duration-300 ${
  isActive
    ? 'border-[#C4A472] bg-[#C4A472]/10'
    : 'border-[#C4A472]/10 hover:border-[#C4A472]/30'
}`}
        >

          {/* <div className="h-10 w-10 overflow-hidden rounded-full">
            <img
              src={room.images[0]}
              alt={room.name}
              className="h-full w-full object-cover"
            />
          </div> */}

          <div className="text-left leading-none">

            <p
  className={`font-serif text-[19px] transition-colors duration-300 ${
    isActive
      ? 'text-[#F2ECE2]'
      : 'text-[#8A8177]'
  }`}
>
  {room.name}
</p>

            {/* <p
              className={`mt-1 text-[9px] uppercase tracking-[0.2em] ${
                isActive
                  ? 'text-[#C4A472]'
                  : 'text-[#5A524A]'
              }`}
            >
              {room.price}
            </p> */}

          </div>
        </button>
      );
    })}

  </div>
</div>

                {/* Two-column grid */}
                <div className="grid items-start gap-8 lg:grid-cols-12">

                  <div className="lg:col-span-7">
                    <div className="lg:sticky lg:top-[120px]">
                      <AnimatePresence mode="wait">
                        <motion.div key={ROOMS[activeRoom].id}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}>
                          <RoomCarousel room={ROOMS[activeRoom]} />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <AnimatePresence mode="wait">
                      <motion.div key={ROOMS[activeRoom].id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                      >
                        <h3 className="font-serif text-4xl font-light leading-none text-[#F2ECE2] md:text-5xl">
                          {ROOMS[activeRoom].name}
                        </h3>
                        <p className="mt-3 font-mono text-base text-[#C4A472]">From {ROOMS[activeRoom].price}</p>

                        <div className="mt-5 flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-[#C4A472]" />
                            <span className="text-base text-[#7A7068]">{ROOMS[activeRoom].guests}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Maximize className="h-4 w-4 text-[#C4A472]" />
                            <span className="text-base text-[#7A7068]">{ROOMS[activeRoom].size}</span>
                          </div>
                        </div>

                        <p className="mt-6 text-[17px] leading-relaxed text-[#8A8177]">{ROOMS[activeRoom].description}</p>

                        <div className="mt-8">
                          <p className="mb-3 text-[9px] uppercase tracking-[0.35em] text-[#5A524A]">Room Features</p>
                          <div className="flex flex-wrap gap-2">
                            {ROOMS[activeRoom].amenities.map(a => (
                              <span key={a} className="border border-[#C4A472]/15 bg-[#C4A472]/5 px-3 py-1.5 text-[10px] tracking-wide text-[#C4A472]">{a}</span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-8 border-t border-[#C4A472]/10 pt-7">
                          <p className="mb-4 text-[9px] uppercase tracking-[0.35em] text-[#5A524A]">Included Amenities</p>
                          <div className="grid grid-cols-2 gap-3">
                            {COMMON_AMENITIES.map(({ label, icon: Icon }) => (
                              <div key={label} className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C4A472]/10 bg-[#C4A472]/5">
                                  <Icon className="h-3.5 w-3.5 text-[#C4A472]" />
                                </div>
                                <span className="text-[15px] text-[#7A7068]">{label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3 border-t border-[#C4A472]/10 pt-7">
                          <button onClick={() => handleOpenBooking('room', ROOMS[activeRoom].name)}
                            className="h-11 border border-[#C4A472] bg-[#C4A472]/10 px-7 text-[9px] uppercase tracking-[0.3em] text-[#C4A472] transition-colors duration-300 hover:bg-[#C4A472] hover:text-[#0A0908] cursor-pointer focus:outline-none">
                            Book This Suite
                          </button>
                          <button onClick={() => router.push('/stay')}
                            className="h-11 border border-[#C4A472]/15 px-7 text-[9px] uppercase tracking-[0.3em] text-[#7A7068] transition-colors duration-300 hover:border-[#C4A472]/40 hover:text-[#F2ECE2] cursor-pointer focus:outline-none flex items-center gap-2">
                            All Rooms <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── HALLS ─────────────────────────────────────────── */}
        {activeService === 'halls' && (
          <motion.div key="halls"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
          >
            <SectionHero
              title="Banquet" accent="& Events"
              image="https://res.cloudinary.com/di1chosqa/image/upload/v1780212827/harmony_sqhlup.webp"
              heroRef={hallsHeroRef}
            />

            <div className="bg-[#0A0908]">
              <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-14">

            {/* Inline Mobile Selector */}
<div className="mb-6 lg:hidden">
  <div className="overflow-x-auto no-scrollbar">
    <div className="flex w-max gap-2.5 pr-4">

      {HALLS.map((hall, idx) => {

        const isActive = activeHall === idx;

        return (
          <button
            key={hall.id}
            onClick={() => setActiveHall(idx)}
            className={`relative flex shrink-0 items-center rounded-full border px-5 py-3 transition-all duration-300 cursor-pointer focus:outline-none ${
  isActive
    ? 'border-[#C4A472] bg-[#C4A472]/10'
    : 'border-[#C4A472]/10 bg-[#0F0E0D]'
}`}
          >

            {/* <div className="h-9 w-9 overflow-hidden rounded-full border border-[#C4A472]/20 shrink-0">
              <img
                src={hall.image}
                alt={hall.name}
                className="h-full w-full object-cover"
              />
            </div> */}

            <div className="pr-1 text-left">
              <p
  className={`font-serif text-[18px] leading-none transition-colors duration-300 ${
    isActive
      ? 'text-[#F2ECE2]'
      : 'text-[#7A7068]'
  }`}
>
  {hall.name}
</p>
              {/* <p className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-[#C4A472]">
                {hall.capacity}
              </p> */}
            </div>

          </button>
        );
      })}

    </div>
  </div>
</div>
                {/* Desktop Luxury Selector */}
<div className="mb-12 hidden lg:flex justify-center">

  <div className="flex flex-wrap items-center justify-center gap-3 rounded-full border border-[#C4A472]/10 bg-[#111111]/80 px-4 py-3 backdrop-blur-xl">

    {HALLS.map((hall, idx) => {

      const isActive = activeHall === idx;

      return (
        <button
          key={hall.id}
          onClick={() => setActiveHall(idx)}
          className={`relative flex items-center rounded-full border px-7 py-4 transition-all duration-300 ${
  isActive
    ? 'border-[#C4A472] bg-[#C4A472]/10'
    : 'border-[#C4A472]/10 hover:border-[#C4A472]/30'
}`}
        >

          {/* <div className="h-10 w-10 overflow-hidden rounded-full">
            <img
              src={hall.image}
              alt={hall.name}
              className="h-full w-full object-cover"
            />
          </div> */}

          <div className="text-left leading-none">

            <p
  className={`font-serif text-[19px] transition-colors duration-300 ${
    isActive
      ? 'text-[#F2ECE2]'
      : 'text-[#8A8177]'
  }`}
>
  {hall.name}
</p>

            {/* <p
              className={`mt-1 text-[9px] uppercase tracking-[0.2em] ${
                isActive
                  ? 'text-[#C4A472]'
                  : 'text-[#5A524A]'
              }`}
            >
              {hall.capacity}
            </p> */}

          </div>
        </button>
      );
    })}

  </div>
</div>

                <div className="grid items-start gap-8 lg:grid-cols-12">

                  <div className="lg:col-span-7">
                    <div className="lg:sticky lg:top-[120px]">
                      <AnimatePresence mode="wait">
                        <motion.div key={HALLS[activeHall].id}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="relative overflow-hidden border border-[#C4A472]/10 aspect-[4/3] lg:h-[480px] lg:aspect-auto"
                        >
                          <img src={HALLS[activeHall].image} alt={HALLS[activeHall].name}
                            className="h-full w-full object-cover"
                            style={{ filter: 'brightness(0.75) saturate(0.8)' }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/60 via-transparent to-transparent" />
                          <div className="absolute bottom-5 left-5">
                            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#C4A472] mb-1">{HALLS[activeHall].tagline}</p>
                            <p className="font-serif text-2xl text-[#F2ECE2]">{HALLS[activeHall].name}</p>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <AnimatePresence mode="wait">
                      <motion.div key={HALLS[activeHall].id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                      >
                        <h3 className="font-serif text-4xl font-light leading-none text-[#F2ECE2] md:text-5xl">{HALLS[activeHall].name}</h3>
                        <p className="mt-3 font-mono text-sm text-[#C4A472]">{HALLS[activeHall].capacity}</p>
                        <p className="mt-5 text-[17px] leading-relaxed text-[#8A8177]">{HALLS[activeHall].description}</p>

                        <div className="mt-8">
                          <p className="mb-3 text-[9px] uppercase tracking-[0.35em] text-[#5A524A]">Setup Configurations</p>
                          <div className="flex flex-wrap gap-2">
                            {HALLS[activeHall].setups.map(s => (
                              <span key={s} className="border border-[#C4A472]/20 bg-[#C4A472]/5 px-3 py-1.5 text-[10px] tracking-wide text-[#C4A472]">{s}</span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-8 border-t border-[#C4A472]/10 pt-7">
                          <p className="mb-4 text-[9px] uppercase tracking-[0.35em] text-[#5A524A]">Facilities</p>
                          <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                            {HALLS[activeHall].features.map(f => (
                              <div key={f} className="flex items-center gap-2">
                                <span className="w-1 h-1 rotate-45 bg-[#C4A472]/50 shrink-0" />
                                <span className="text-[15px] text-[#7A7068]">{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3 border-t border-[#C4A472]/10 pt-7">
                          <button onClick={() => handleOpenBooking('hall', HALLS[activeHall].name)}
                            className="h-11 border border-[#C4A472] bg-[#C4A472]/10 px-7 text-[9px] uppercase tracking-[0.3em] text-[#C4A472] transition-colors duration-300 hover:bg-[#C4A472] hover:text-[#0A0908] cursor-pointer focus:outline-none">
                            Request Proposal &rarr;
                          </button>
                          <button onClick={() => router.push('/halls')}
                            className="h-11 border border-[#C4A472]/15 px-7 text-[9px] uppercase tracking-[0.3em] text-[#7A7068] transition-colors duration-300 hover:border-[#C4A472]/40 hover:text-[#F2ECE2] cursor-pointer focus:outline-none flex items-center gap-2">
                            All Halls <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── DINING ────────────────────────────────────────── */}
        {activeService === 'dining' && (
          <motion.div key="dining"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
          >
            <SectionHero
              title="Dining" accent="Saatvik"
              image={DINING.image}
              heroRef={diningHeroRef}
            />

            <div className="bg-[#0A0908]">
              <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-14">
                {/* Inline Mobile Selector */}
<div className="mb-6 lg:hidden">
  <div className="overflow-x-auto no-scrollbar">
    <div className="flex w-max gap-2.5 pr-4">

      {DINING.highlights.map((item, idx) => {

        const isActive = activeDining === idx;

        return (
          <button
            key={idx}
            onClick={() => setActiveDining(idx)}
            className={`relative flex shrink-0 items-center rounded-full border px-5 py-3 transition-all duration-300 cursor-pointer focus:outline-none ${
  isActive
    ? 'border-[#C4A472] bg-[#C4A472]/10'
    : 'border-[#C4A472]/10 bg-[#0F0E0D]'
}`}
          >

            {/* <div className="h-9 w-9 overflow-hidden rounded-full border border-[#C4A472]/20 shrink-0">
              <img
                src={item.img}
                alt={item.label}
                className="h-full w-full object-cover"
              />
            </div> */}

            <div className="pr-1 text-left">
              <p
  className={`font-serif text-[18px] leading-none transition-colors duration-300 ${
    isActive
      ? 'text-[#F2ECE2]'
      : 'text-[#7A7068]'
  }`}
>
  {item.label}
</p>
            </div>

          </button>
        );
      })}

    </div>
  </div>
</div>

{/* Desktop Luxury Selector */}
<div className="mb-12 hidden lg:flex justify-center">

  <div className="flex flex-wrap items-center justify-center gap-3 rounded-full border border-[#C4A472]/10 bg-[#111111]/80 px-4 py-3 backdrop-blur-xl">

    {DINING.highlights.map((item, idx) => {

      const isActive = activeDining === idx;

      return (
        <button
          key={idx}
          onClick={() => setActiveDining(idx)}
          className={`relative flex items-center rounded-full border px-7 py-4 transition-all duration-300 ${
  isActive
    ? 'border-[#C4A472] bg-[#C4A472]/10'
    : 'border-[#C4A472]/10 hover:border-[#C4A472]/30'
}`}
        >

          {/* <div className="h-10 w-10 overflow-hidden rounded-full">
            <img
              src={item.img}
              alt={item.label}
              className="h-full w-full object-cover"
            />
          </div> */}

         <p
  className={`font-serif text-[19px] transition-colors duration-300 ${
    isActive
      ? 'text-[#F2ECE2]'
      : 'text-[#8A8177]'
  }`}
>
  {item.label}
</p>

        </button>
      );
    })}

  </div>
</div>
                <div className="grid items-start gap-8 lg:grid-cols-12">

                  <div className="lg:col-span-7">
                    <div className="lg:sticky lg:top-[120px]">
                      <AnimatePresence mode="wait">
                        <motion.div key={activeDining}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="relative overflow-hidden border border-[#C4A472]/10 aspect-[4/3] lg:h-[400px] lg:aspect-auto"
                        >
                          <img src={DINING.highlights[activeDining].img} alt={DINING.highlights[activeDining].label}
                            className="h-full w-full object-cover"
                            style={{ filter: 'brightness(0.78) saturate(0.8)' }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/50 via-transparent to-transparent" />
                        </motion.div>
                      </AnimatePresence>

                      <div className="mt-3 hidden grid-cols-4 gap-2 lg:grid">
                        {DINING.highlights.map((h, idx) => (
                          <button key={idx} onClick={() => setActiveDining(idx)}
                            className={`relative overflow-hidden border aspect-video transition-colors duration-300 cursor-pointer focus:outline-none ${activeDining === idx ? 'border-[#C4A472]' : 'border-[#C4A472]/10 hover:border-[#C4A472]/30'}`}>
                            <img src={h.img} alt={h.label} className="h-full w-full object-cover" style={{ filter: 'brightness(0.6) saturate(0.7)' }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/70 to-transparent" />
                            <span className="absolute bottom-1 left-1.5 text-[7px] font-mono text-[#C4A472] tracking-wider">{h.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-7">
                    <div>
                      <h3 className="font-serif text-4xl font-light text-[#F2ECE2] md:text-5xl">{DINING.name}</h3>
                      <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.4em] text-[#C4A472]">{DINING.tagline}</p>
                    </div>

                    <p className="font-serif italic text-lg text-[#8A8177] leading-relaxed">"{DINING.description}"</p>

                    <div>
                      <p className="mb-3 text-[9px] uppercase tracking-[0.35em] text-[#5A524A]">Cuisines</p>
                      <div className="flex flex-wrap gap-2">
                        {DINING.cuisines.map(c => (
                          <span key={c} className="border border-[#C4A472]/15 bg-[#C4A472]/5 px-3 py-1.5 text-[10px] tracking-wide text-[#C4A472]">{c}</span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[#C4A472]/10 pt-6">
                      <p className="mb-4 text-[9px] uppercase tracking-[0.35em] text-[#5A524A]">Dining Hours</p>
                      <div className="space-y-2">
                        {DINING.timings.map(({ meal, time }) => (
                          <div key={meal} className="flex items-center justify-between py-2 border-b border-[#C4A472]/8">
                            <span className="font-sans text-base text-[#7A7068]">{meal}</span>
                            <span className="font-mono text-[10px] text-[#C4A472] tracking-wider">{time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 border-t border-[#C4A472]/10 pt-6">
                      <button onClick={() => handleOpenBooking('dining')}
                        className="h-11 border border-[#C4A472] bg-[#C4A472]/10 px-7 text-[9px] uppercase tracking-[0.3em] text-[#C4A472] transition-colors duration-300 hover:bg-[#C4A472] hover:text-[#0A0908] cursor-pointer focus:outline-none">
                        Reserve a Table &rarr;
                      </button>
                      <button onClick={() => router.push('/dining')}
                        className="h-11 border border-[#C4A472]/15 px-7 text-[9px] uppercase tracking-[0.3em] text-[#7A7068] transition-colors duration-300 hover:border-[#C4A472]/40 hover:text-[#F2ECE2] cursor-pointer focus:outline-none flex items-center gap-2">
                        Full Menu <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── Home footer content ─────────────────────────── */}
      <div ref={footerRef} className="pb-0">
        {/* Quote divider */}
        <section className="relative bg-[#F2ECE2] px-6 md:px-12 py-20 flex items-center justify-center border-t border-[#C4A472]/15">
          <div className="max-w-3xl text-center space-y-5 select-none">
            <span className="text-xs font-mono tracking-[0.2em] text-[#9A7A4A] uppercase block">
              The Grand Commitment
            </span>
            <p className="font-serif italic font-light text-xl md:text-3xl text-[#1A1714] leading-relaxed">
              "This is not a stay. This is stepping into a memory before it unfolds — high-ceiling elegance, wild-corridor proximity, and the absolute discretion of quiet luxury."
            </p>
            <div className="w-10 h-px bg-[#C4A472]/35 mx-auto" />
          </div>
        </section>

        <GallerySection />
        <TestimonialsSection />
        <HomeFooter onOpenBooking={handleOpenBooking} />
      </div>

    </section>
  );
}