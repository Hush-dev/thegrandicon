'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBooking } from '@/components/ClientShell';
import { ChevronRight, Bed, Landmark, UtensilsCrossed, CalendarDays, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

// ── Data ────────────────────────────────────────────────────────

const ROOMS = [
  {
    id: 'presidential',
    name: 'Presidential Suite',
    tagline: 'The pinnacle of bespoke high-living.',
    price: '₹6,000 / night',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1400',
    amenities: ['King Bed + Sofa Bed', 'Butler Service', 'Fruit Basket on Arrival', 'Jacuzzi', 'City View'],
  },
  {
    id: 'executive',
    name: 'Executive Suite',
    tagline: 'Command your world in quiet luxury.',
    price: '₹7,000 / night',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1400',
    amenities: ['King Bed + 2 Sofa Beds', 'Work Desk', 'High-Speed Wi-Fi', 'Smart LED TV', 'Electronic Safe'],
  },
  {
    id: 'premium',
    name: 'Premium Room',
    tagline: 'Double the grandeur, twice the comfort.',
    price: '₹5,000 / night',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1400',
    amenities: ['2 King Beds', 'Air Conditioning', 'Daily Newspaper', 'Tea/Coffee Maker', '24hr Room Service'],
  },
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    tagline: 'Classic comfort, quietly grand.',
    price: '₹3,800 / night',
    image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=1400',
    amenities: ['King Bed + Sofa Bed', 'Premium Toiletries', 'Mineral Water', 'Laundry Service', 'Smart TV'],
  },
  {
    id: 'superior',
    name: 'Superior Room',
    tagline: 'Refined elegance for every guest.',
    price: '₹4,500 / night',
    image: 'https://images.unsplash.com/photo-1578496479914-7ef3b0193be3?auto=format&fit=crop&q=80&w=1400',
    amenities: ['King Bed', 'Complimentary Breakfast', 'Electronic Safe', 'Air Conditioning', 'Wi-Fi'],
  },
];

const HALLS = [
  {
    id: 'sparsh',
    name: 'Sparsh',
    tagline: 'Intimate elegance for curated gatherings.',
    capacity: '80–250',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1400',
    setups: ['Theatre Style', 'Cluster Setup', 'Round Table'],
    features: ['LED Wall', 'Audio Visual', 'Stage Setup', 'Catering Services'],
  },
  {
    id: 'majesty',
    name: 'Majesty',
    tagline: 'Grand scale for legendary celebrations.',
    capacity: '300–800',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1400',
    setups: ['Theatre Style', 'Cluster Setup', 'Round Table'],
    features: ['Pillarless Structure', 'Crystal Chandeliers', 'VIP Greenrooms', 'Line Array Sound'],
  },
  {
    id: 'harmony',
    name: 'Harmony',
    tagline: 'Where every occasion finds its rhythm.',
    capacity: '150–400',
    image: 'https://images.unsplash.com/photo-1545232979-8bf34eb9757b?auto=format&fit=crop&q=80&w=1400',
    setups: ['Theatre Style', 'Cluster Setup', 'Round Table'],
    features: ['Acoustic Partitioning', 'Ambient Lighting', 'Bespoke Catering', 'Projection System'],
  },
  {
    id: 'suraahi',
    name: 'Suraahi',
    tagline: 'Open-air romance underneath the stars.',
    capacity: '500–1500',
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=1400',
    setups: ['Theatre Style', 'Cluster Setup', 'Round Table', 'Wedding Setup'],
    features: ['Manicured Lawns', 'Outdoor Cabanas', 'Amphitheater Acoustics', 'Botanical Arcades'],
  },
];

const DINING = {
  name: 'Saatvik Restaurant',
  tagline: 'A delightful culinary journey.',
  description: 'Saatvik Restaurant offers authentic Indian, Chinese, Continental and regional delicacies prepared by our experienced chefs. From intimate family dinners to lavish buffets — every meal is a celebration.',
  image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1400',
  highlights: [
    { label: 'Live Kitchen Counter', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600' },
    { label: 'Buffet Area',          img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600' },
    { label: 'Family Dining',        img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600' },
    { label: 'Restaurant Interior',  img: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&q=80&w=600' },
  ],
  cuisines: ['Indian', 'Chinese', 'Continental', 'Regional Specialties'],
};

type ServiceType = 'rooms' | 'halls' | 'dining';

// ── Common amenities for all rooms ─────────────────────────────
const COMMON_AMENITIES = [
  'Free High-Speed Wi-Fi', 'Complimentary Breakfast', 'Daily Newspaper',
  'Tea/Coffee Maker', 'Smart LED Television', 'Electronic Safe Locker',
  'Premium Toiletries', 'Laundry Service', '24-Hour Room Service',
  'Mineral Water', 'Air Conditioning',
];

// ── Component ──────────────────────────────────────────────────
export default function ExperienceHub() {
  const router = useRouter();
  const { handleOpenBooking } = useBooking();
  const [activeService, setActiveService] = useState<ServiceType>('rooms');
  const [activeRoom, setActiveRoom]       = useState(0);
  const [activeHall, setActiveHall]       = useState(0);
  const [activeDining, setActiveDining]   = useState(0);

  const services: { id: ServiceType; label: string; icon: React.ElementType }[] = [
    { id: 'rooms',  label: 'Rooms & Suites', icon: Bed },
    { id: 'halls',  label: 'Banquet Halls',  icon: Landmark },
    { id: 'dining', label: 'Dining',          icon: UtensilsCrossed },
  ];

  return (
    <section id="experience-hub" className="relative bg-[#0A0908] min-h-screen">

      {/* ── Service tabs ─────────────────────────────────────── */}
      <div className="sticky top-16 md:top-20 z-30 bg-[#0A0908]/95 backdrop-blur-xl border-b border-[#C4A472]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-12">
          <div className="flex items-center gap-1">
            {services.map(({ id, label, icon: Icon }) => {
              const isActive = activeService === id;
              return (
                <button key={id} onClick={() => setActiveService(id)}
                  className={`relative flex items-center gap-2 px-4 h-12 text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase transition-colors duration-300 cursor-pointer focus:outline-none ${
                    isActive ? 'text-[#C4A472]' : 'text-[#5A524A] hover:text-[#7A7068]'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{label}</span>
                  {isActive && (
                    <motion.span layoutId="serviceIndicator"
                      className="absolute bottom-0 left-0 right-0 h-px bg-[#C4A472]"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Eyebrow */}
          <span className="hidden md:block text-[8px] font-mono tracking-[0.4em] text-[#3A3430] uppercase">
            The Grand Icon · Chandrapur
          </span>
        </div>
      </div>

      {/* ── Content area ─────────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* ── ROOMS ─────────────────────────────────────────── */}
        {activeService === 'rooms' && (
          <motion.div key="rooms"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          >
            {/* Hero image */}
            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img key={ROOMS[activeRoom].id}
                  src={ROOMS[activeRoom].image} alt={ROOMS[activeRoom].name}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: 'brightness(0.45) saturate(0.7)' }}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0908]/70 via-transparent to-transparent" />

              {/* Room name overlay */}
              <div className="absolute bottom-8 left-6 md:left-12">
                <AnimatePresence mode="wait">
                  <motion.div key={ROOMS[activeRoom].id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45 }}
                  >
                    <span className="block text-[9px] font-mono tracking-[0.4em] text-[#C4A472] uppercase mb-2">
                      {ROOMS[activeRoom].tagline}
                    </span>
                    <h2 className="font-serif font-light text-3xl md:text-5xl text-[#F2ECE2]">
                      {ROOMS[activeRoom].name}
                    </h2>
                    <span className="block font-mono text-sm text-[#C4A472] mt-2">
                      From {ROOMS[activeRoom].price}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Room selector + details */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Room list */}
                <div className="lg:col-span-4 space-y-2">
                  <span className="block text-[8px] font-mono tracking-[0.4em] text-[#5A524A] uppercase mb-4">
                    Select Room Category
                  </span>
                  {ROOMS.map((room, idx) => (
                    <button key={room.id} onClick={() => setActiveRoom(idx)}
                      className={`group w-full flex items-center justify-between px-4 py-3.5 border text-left transition-colors duration-300 cursor-pointer focus:outline-none ${
                        activeRoom === idx
                          ? 'border-[#C4A472] bg-[#C4A472]/8 text-[#F2ECE2]'
                          : 'border-[#C4A472]/10 text-[#7A7068] hover:border-[#C4A472]/30 hover:text-[#F2ECE2]'
                      }`}
                    >
                      <span className="font-serif text-[16px]">{room.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-[#C4A472]">{room.price}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${activeRoom === idx ? 'translate-x-0.5 text-[#C4A472]' : 'text-[#3A3430]'}`} />
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => router.push('/stay')}
                    className="w-full mt-4 flex items-center justify-center gap-2 h-10 border border-[#C4A472]/20 hover:border-[#C4A472] text-[#C4A472] text-[9px] tracking-[0.3em] uppercase font-mono transition-colors duration-300 cursor-pointer focus:outline-none"
                  >
                    View All Rooms <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Room details */}
                <div className="lg:col-span-8 space-y-8">
                  <AnimatePresence mode="wait">
                    <motion.div key={ROOMS[activeRoom].id}
                      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.4 }}
                      className="space-y-7"
                    >
                      {/* Room-specific amenities */}
                      <div>
                        <span className="block text-[8px] font-mono tracking-[0.4em] text-[#5A524A] uppercase mb-3">
                          Highlights
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {ROOMS[activeRoom].amenities.map((a) => (
                            <span key={a} className="px-3 py-1.5 border border-[#C4A472]/20 text-[10px] font-mono text-[#C4A472] tracking-wider">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Common amenities */}
                      <div>
                        <span className="block text-[8px] font-mono tracking-[0.4em] text-[#5A524A] uppercase mb-3">
                          All Rooms Include
                        </span>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {COMMON_AMENITIES.map((a) => (
                            <div key={a} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-[#C4A472]/60 shrink-0" />
                              <span className="text-[10px] font-sans text-[#7A7068]">{a}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button onClick={() => handleOpenBooking('room')}
                          className="h-11 px-7 border border-[#C4A472] bg-[#C4A472]/10 hover:bg-[#C4A472] hover:text-[#0A0908] text-[#C4A472] text-[9px] tracking-[0.3em] uppercase font-sans font-medium transition-colors duration-300 cursor-pointer focus:outline-none">
                          Book This Room &rarr;
                        </button>
                        <button onClick={() => router.push('/stay')}
                          className="h-11 px-7 border border-[#C4A472]/20 hover:border-[#C4A472] text-[#7A7068] hover:text-[#F2ECE2] text-[9px] tracking-[0.3em] uppercase font-sans font-medium transition-colors duration-300 cursor-pointer focus:outline-none">
                          Explore All Suites
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── HALLS ─────────────────────────────────────────── */}
        {activeService === 'halls' && (
          <motion.div key="halls"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          >
            {/* Hero image */}
            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img key={HALLS[activeHall].id}
                  src={HALLS[activeHall].image} alt={HALLS[activeHall].name}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: 'brightness(0.4) saturate(0.6)' }}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0908]/70 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-6 md:left-12">
                <AnimatePresence mode="wait">
                  <motion.div key={HALLS[activeHall].id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45 }}
                  >
                    <span className="block text-[9px] font-mono tracking-[0.4em] text-[#C4A472] uppercase mb-2">
                      {HALLS[activeHall].tagline}
                    </span>
                    <h2 className="font-serif font-light text-3xl md:text-5xl text-[#F2ECE2]">
                      {HALLS[activeHall].name}
                    </h2>
                    <span className="block font-mono text-sm text-[#7A7068] mt-2">
                      Capacity: {HALLS[activeHall].capacity} Guests
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Hall list */}
                <div className="lg:col-span-4 space-y-2">
                  <span className="block text-[8px] font-mono tracking-[0.4em] text-[#5A524A] uppercase mb-4">
                    Select Hall
                  </span>
                  {HALLS.map((hall, idx) => (
                    <button key={hall.id} onClick={() => setActiveHall(idx)}
                      className={`group w-full flex items-center justify-between px-4 py-3.5 border text-left transition-colors duration-300 cursor-pointer focus:outline-none ${
                        activeHall === idx
                          ? 'border-[#C4A472] bg-[#C4A472]/8 text-[#F2ECE2]'
                          : 'border-[#C4A472]/10 text-[#7A7068] hover:border-[#C4A472]/30 hover:text-[#F2ECE2]'
                      }`}
                    >
                      <span className="font-serif text-[16px]">{hall.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[9px] text-[#7A7068]">{hall.capacity} guests</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${activeHall === idx ? 'translate-x-0.5 text-[#C4A472]' : 'text-[#3A3430]'}`} />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Hall details */}
                <div className="lg:col-span-8 space-y-7">
                  <AnimatePresence mode="wait">
                    <motion.div key={HALLS[activeHall].id}
                      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.4 }}
                      className="space-y-7"
                    >
                      {/* Setup options */}
                      <div>
                        <span className="block text-[8px] font-mono tracking-[0.4em] text-[#5A524A] uppercase mb-3">
                          Setup Configurations
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {HALLS[activeHall].setups.map((s) => (
                            <span key={s} className="px-3 py-1.5 border border-[#C4A472]/25 text-[10px] font-mono text-[#C4A472] tracking-wider">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <span className="block text-[8px] font-mono tracking-[0.4em] text-[#5A524A] uppercase mb-3">
                          Facilities
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {HALLS[activeHall].features.map((f) => (
                            <div key={f} className="flex items-center gap-2">
                              <span className="w-1 h-1 rotate-45 bg-[#C4A472]/60 shrink-0" />
                              <span className="text-[11px] font-sans text-[#7A7068]">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button onClick={() => handleOpenBooking('hall')}
                          className="h-11 px-7 border border-[#C4A472] bg-[#C4A472]/10 hover:bg-[#C4A472] hover:text-[#0A0908] text-[#C4A472] text-[9px] tracking-[0.3em] uppercase font-sans font-medium transition-colors duration-300 cursor-pointer focus:outline-none">
                          Request Banquet Proposal &rarr;
                        </button>
                        <button onClick={() => router.push('/halls')}
                          className="h-11 px-7 border border-[#C4A472]/20 hover:border-[#C4A472] text-[#7A7068] hover:text-[#F2ECE2] text-[9px] tracking-[0.3em] uppercase font-sans font-medium transition-colors duration-300 cursor-pointer focus:outline-none">
                          Explore All Halls
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── DINING ────────────────────────────────────────── */}
        {activeService === 'dining' && (
          <motion.div key="dining"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          >
            {/* Hero */}
            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
              <motion.img
                src={DINING.highlights[activeDining].img}
                alt={DINING.highlights[activeDining].label}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.4) saturate(0.65)' }}
                key={activeDining}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0908]/70 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-6 md:left-12">
                <span className="block text-[9px] font-mono tracking-[0.4em] text-[#C4A472] uppercase mb-2">
                  {DINING.tagline}
                </span>
                <h2 className="font-serif font-light text-3xl md:text-5xl text-[#F2ECE2]">
                  {DINING.name}
                </h2>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Photo thumbnails */}
                <div className="lg:col-span-4 space-y-2">
                  <span className="block text-[8px] font-mono tracking-[0.4em] text-[#5A524A] uppercase mb-4">
                    Explore Saatvik
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {DINING.highlights.map((h, idx) => (
                      <button key={idx} onClick={() => setActiveDining(idx)}
                        className={`relative aspect-video overflow-hidden border transition-colors duration-300 cursor-pointer focus:outline-none ${
                          activeDining === idx ? 'border-[#C4A472]' : 'border-[#C4A472]/10 hover:border-[#C4A472]/30'
                        }`}
                      >
                        <img src={h.img} alt={h.label}
                          className="w-full h-full object-cover"
                          style={{ filter: 'brightness(0.55) saturate(0.6)' }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/80 to-transparent" />
                        <span className="absolute bottom-1.5 left-2 text-[8px] font-mono text-[#C4A472] tracking-wider">
                          {h.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="lg:col-span-8 space-y-7">
                  <p className="font-serif italic font-light text-lg md:text-xl text-[#B0A898] leading-relaxed">
                    "{DINING.description}"
                  </p>

                  <div>
                    <span className="block text-[8px] font-mono tracking-[0.4em] text-[#5A524A] uppercase mb-3">
                      Cuisines
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {DINING.cuisines.map((c) => (
                        <span key={c} className="px-3 py-1.5 border border-[#C4A472]/20 text-[10px] font-mono text-[#C4A472] tracking-wider">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button onClick={() => handleOpenBooking('dining')}
                      className="h-11 px-7 border border-[#C4A472] bg-[#C4A472]/10 hover:bg-[#C4A472] hover:text-[#0A0908] text-[#C4A472] text-[9px] tracking-[0.3em] uppercase font-sans font-medium transition-colors duration-300 cursor-pointer focus:outline-none">
                      Reserve a Table &rarr;
                    </button>
                    <button onClick={() => router.push('/dining')}
                      className="h-11 px-7 border border-[#C4A472]/20 hover:border-[#C4A472] text-[#7A7068] hover:text-[#F2ECE2] text-[9px] tracking-[0.3em] uppercase font-sans font-medium transition-colors duration-300 cursor-pointer focus:outline-none">
                      View Full Menu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}