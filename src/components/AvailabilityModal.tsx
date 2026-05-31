'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bed, Landmark, UtensilsCrossed, Sparkles, MessageSquareHeart, Check, Send, IndianRupee } from 'lucide-react';

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'room' | 'hall' | 'dining' | 'event';
  initialRoomName?: string;
  initialHallName?: string;
}

// ── Room names matching ExperienceHub exactly ───────────────────
const ROOM_OPTIONS = [
  'Presidential Suite',
  'Executive Suite',
  'Premium Room',
  'Deluxe Room',
  'Superior Room',
];

const HALL_OPTIONS = [
  'Sparsh',
  'Majesty',
  'Harmony',
  'Suraahi',
];

// ── Pricing data (keyed to ExperienceHub room names) ───────────
const ROOM_PRICING: Record<string, { single: number; double: number; triple: number }> = {
  'Presidential Suite': { single: 18000, double: 18000, triple: 18000 },
  'Executive Suite':    { single: 12000, double: 12000, triple: 12000 },
  'Premium Room':       { single: 8500,  double: 8500,  triple: 8500  },
  'Deluxe Room':        { single: 6500,  double: 6500,  triple: 6500  },
  'Superior Room':      { single: 5500,  double: 5500,  triple: 5500  },
};

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

const inputCls  = "w-full h-11 bg-transparent border-b border-[#C4A472]/20 focus:border-[#C4A472] outline-none text-[#F2ECE2] text-sm font-sans transition-colors duration-300 placeholder:text-[#5A524A]";
const selectCls = "w-full h-11 bg-[#0D0B09] border-b border-[#C4A472]/20 focus:border-[#C4A472] outline-none text-[#F2ECE2] text-sm font-sans transition-colors duration-300";
const labelCls  = "block text-[9px] font-mono tracking-widest text-[#C4A472]/80 uppercase mb-1.5";

export default function AvailabilityModal({
  isOpen,
  onClose,
  initialType    = 'room',
  initialRoomName,
  initialHallName,
}: AvailabilityModalProps) {

  const [selectedType,   setSelectedType]   = useState<'room' | 'hall' | 'dining' | 'event'>(initialType);
  const [isSubmitting,   setIsSubmitting]   = useState(false);

  // Shared
  const [name,  setName]  = useState('');
  const [phone, setPhone] = useState('');

  // Room
  const [checkin,       setCheckin]       = useState('');
  const [checkout,      setCheckout]      = useState('');
  const [roomType,      setRoomType]      = useState(ROOM_OPTIONS[0]);
  const [roomOccupancy, setRoomOccupancy] = useState<'single' | 'double' | 'triple'>('double');

  // Hall
  const [hallDate,       setHallDate]       = useState('');
  const [eventType,      setEventType]      = useState('Wedding Assembly');
  const [hallPreference, setHallPreference] = useState(HALL_OPTIONS[0]);
  const [hallGuests,     setHallGuests]     = useState('100');

  // Dining
  const [diningDate,   setDiningDate]   = useState('');
  const [diningTime,   setDiningTime]   = useState('20:00');
  const [diningGuests, setDiningGuests] = useState('2');

  // Event
  const [eventDate,    setEventDate]    = useState('');
  const [occasion,     setOccasion]     = useState('Royal High Wedding');
  const [eventGuests,  setEventGuests]  = useState('200');
  const [requirements, setRequirements] = useState('');

  // ── Sync type whenever initialType changes ──────────────────
  useEffect(() => { setSelectedType(initialType); }, [initialType]);

  // ── Pre-select room name when passed from ExperienceHub ─────
  useEffect(() => {
    if (initialRoomName && ROOM_OPTIONS.includes(initialRoomName)) {
      setRoomType(initialRoomName);
    }
  }, [initialRoomName]);

  // ── Pre-select hall name when passed from ExperienceHub ─────
  useEffect(() => {
    if (initialHallName && HALL_OPTIONS.includes(initialHallName)) {
      setHallPreference(initialHallName);
    }
  }, [initialHallName]);

  // ── Live pricing ─────────────────────────────────────────────
  const livePrice = useMemo(() => {
    if (selectedType !== 'room') return null;
    return ROOM_PRICING[roomType]?.[roomOccupancy] ?? null;
  }, [selectedType, roomType, roomOccupancy]);

  const nights = useMemo(() => {
    if (!checkin || !checkout) return 0;
    return Math.max(0, Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000));
  }, [checkin, checkout]);

  const totalPrice = livePrice && nights > 0 ? livePrice * nights : null;
  const today = new Date().toISOString().split('T')[0];

  // ── WhatsApp message ─────────────────────────────────────────
  const generateWhatsAppLink = () => {
    const ph = '919604938657';
    let text = '';
    if (selectedType === 'room') {
      const priceNote = livePrice
        ? `💰 *Rate:* ${fmt(livePrice)} per night${totalPrice ? ` × ${nights} nights = ${fmt(totalPrice)}` : ''}`
        : '';
      text = `Hello The Grand Icon 🙏\n\nRoom Booking Enquiry:\n\n🛏️ *Room:* ${roomType}\n👤 *Occupancy:* ${roomOccupancy}\n📅 *Check-in:* ${checkin}\n📅 *Check-out:* ${checkout}${nights > 0 ? `\n🌙 *Nights:* ${nights}` : ''}\n${priceNote}\n\n*Name:* ${name}\n📞 *Phone:* ${phone}\n\nKindly confirm availability. Thank you.`;
    } else if (selectedType === 'hall') {
      text = `Hello The Grand Icon 🙏\n\nHall Booking Enquiry:\n\n🏛️ *Hall:* ${hallPreference}\n📋 *Event:* ${eventType}\n📅 *Date:* ${hallDate}\n👥 *Guests:* ${hallGuests}\n\n*Name:* ${name}\n📞 *Phone:* ${phone}\n\nKindly confirm availability. Thank you.`;
    } else if (selectedType === 'dining') {
      text = `Hello The Grand Icon 🙏\n\nDining Reservation:\n\n📅 *Date:* ${diningDate}\n🕐 *Time:* ${diningTime}\n👥 *Guests:* ${diningGuests}\n\n*Name:* ${name}\n📞 *Phone:* ${phone}`;
    } else {
      text = `Hello The Grand Icon 🙏\n\nEvent Enquiry:\n\n🎉 *Occasion:* ${occasion}\n📅 *Date:* ${eventDate}\n👥 *Guests:* ${eventGuests}\n📝 *Notes:* ${requirements || 'To be discussed'}\n\n*Name:* ${name}\n📞 *Phone:* ${phone}`;
    }
    return `https://wa.me/${ph}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) { alert('Please fill in your Name and Phone number.'); return; }
    setIsSubmitting(true);
    setTimeout(() => {
      window.open(generateWhatsAppLink(), '_blank');
      setIsSubmitting(false);
      onClose();
    }, 900);
  };

  const typeConfig = [
    { id: 'room',   label: 'Suite Room',      icon: Bed,             image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=300' },
    { id: 'hall',   label: 'Banquet Hall',    icon: Landmark,        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=300' },
    { id: 'dining', label: 'Fine Dining',     icon: UtensilsCrossed, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300' },
    { id: 'event',  label: 'VIP Celebration', icon: Sparkles,        image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=300' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-[6px] cursor-pointer"
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 500) onClose();
            }}
            className="fixed bottom-0 left-0 right-0 z-[51] bg-[#161412] border-t border-[#C4A472]/40 rounded-t-[20px] shadow-[0_-15px_60px_rgba(0,0,0,0.9)] max-h-[92dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle — tap or drag down to close */}
            <div
              className="flex justify-center py-3 sticky top-0 bg-[#161412] z-10 cursor-grab active:cursor-grabbing"
              onClick={onClose}
              title="Tap to close"
            >
              <span className="block w-10 h-[3px] rounded-full bg-[#C4A472]/30 hover:bg-[#C4A472]/60 transition-colors duration-200" />
            </div>

            <div className="max-w-4xl mx-auto px-5 md:px-8 pb-12 pt-2">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#C4A472]/10 pb-4 mb-7">
                <div>
                  <h3 className="font-serif text-[20px] font-light text-[#F2ECE2]">
                    Reserve <span className="italic text-[#C4A472]">An Experience</span>
                  </h3>
                  <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#7A7068] mt-1">
                    Direct Concierge Connection via WhatsApp
                  </p>
                </div>
                <button type="button" onClick={onClose}
                  className="w-9 h-9 border border-[#C4A472]/20 hover:border-[#C4A472] flex items-center justify-center text-[#7A7068] hover:text-[#F2ECE2] transition-colors duration-300 cursor-pointer focus:outline-none">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step 1 — type */}
              <div className="mb-7">
                <span className="block text-[9px] font-mono tracking-[0.3em] uppercase text-[#7A7068] mb-4">Step 01 — Choose Format</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {typeConfig.map((item) => {
                    const isSelected = selectedType === item.id;
                    const Icon = item.icon;
                    return (
                      <button key={item.id} type="button"
                        onClick={() => setSelectedType(item.id as any)}
                        className={`group relative h-24 flex flex-col justify-end items-start p-3.5 bg-[#0A0908] overflow-hidden border transition-colors duration-300 text-left focus:outline-none cursor-pointer ${isSelected ? 'border-[#C4A472]' : 'border-[#C4A472]/10 hover:border-[#C4A472]/30'}`}>
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 h-4 w-4 bg-[#C4A472] flex items-center justify-center text-[#0A0908] rounded-full">
                            <Check className="w-2.5 h-2.5 stroke-[3px]" />
                          </div>
                        )}
                        <img src={item.image} alt={item.label}
                          className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-300 saturate-50"
                          referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/60 to-transparent" />
                        <div className="relative z-10 space-y-0.5">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#C4A472]' : 'text-[#7A7068]'}`} />
                          <span className={`block font-serif text-[14px] ${isSelected ? 'text-[#F2ECE2]' : 'text-[#7A7068]'}`}>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2 — details */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <span className="block text-[9px] font-mono tracking-[0.3em] uppercase text-[#7A7068] pb-2 border-b border-[#C4A472]/10">
                  Step 02 — Your Details
                </span>

                {/* Name + phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Full Name *</label>
                    <input type="text" required placeholder="e.g. Rajvardhan Patil"
                      value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number *</label>
                    <input type="tel" required placeholder="+91 96049 38657"
                      value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
                  </div>
                </div>

                <AnimatePresence mode="wait">

                  {/* ROOM */}
                  {selectedType === 'room' && (
                    <motion.div key="room"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className={labelCls}>Room Type</label>
                          <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className={selectCls}>
                            {ROOM_OPTIONS.map(r => (
                              <option key={r} value={r} className="bg-[#161412]">{r}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Number of Guests</label>
                          <select value={roomOccupancy} onChange={(e) => setRoomOccupancy(e.target.value as any)} className={selectCls}>
                            <option value="single" className="bg-[#161412]">1 Guest — Single Occupancy</option>
                            <option value="double" className="bg-[#161412]">2 Guests — Double Occupancy</option>
                            <option value="triple" className="bg-[#161412]">3 Guests — Triple Occupancy</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className={labelCls}>Check-In Date</label>
                          <input type="date" required min={today} value={checkin}
                            onChange={(e) => { setCheckin(e.target.value); if (checkout && e.target.value >= checkout) setCheckout(''); }}
                            className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Check-Out Date</label>
                          <input type="date" required min={checkin || today} value={checkout}
                            onChange={(e) => setCheckout(e.target.value)} className={inputCls} />
                        </div>
                      </div>

                      {/* Live pricing */}
                      <AnimatePresence>
                        {livePrice && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-[#0A0908]/70 border border-[#C4A472]/25 p-4 flex flex-wrap items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <IndianRupee className="w-4 h-4 text-[#C4A472]" />
                                <div>
                                  <span className="block text-[8px] font-mono tracking-[0.3em] text-[#7A7068] uppercase">Rate per Night</span>
                                  <span className="block font-serif text-[#C4A472] text-lg">{fmt(livePrice)}</span>
                                </div>
                              </div>
                              {totalPrice && nights > 0 && (
                                <div className="text-right">
                                  <span className="block text-[8px] font-mono tracking-[0.3em] text-[#7A7068] uppercase">{nights} Night{nights > 1 ? 's' : ''} Total</span>
                                  <span className="block font-serif text-[#F2ECE2] text-lg">{fmt(totalPrice)}</span>
                                </div>
                              )}
                              <span className="w-full text-[8px] font-mono text-[#5A524A] tracking-wider">* Exclusive of taxes. Subject to availability.</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* HALL */}
                  {selectedType === 'hall' && (
                    <motion.div key="hall"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className={labelCls}>Hall Preference</label>
                          <select value={hallPreference} onChange={(e) => setHallPreference(e.target.value)} className={selectCls}>
                            {HALL_OPTIONS.map(h => (
                              <option key={h} value={h} className="bg-[#161412]">{h}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Event Type</label>
                          <select value={eventType} onChange={(e) => setEventType(e.target.value)} className={selectCls}>
                            <option className="bg-[#161412]" value="Wedding Assembly">Royal Wedding Ceremony</option>
                            <option className="bg-[#161412]" value="Sangeet / Mehendi">Sangeet / Mehendi Night</option>
                            <option className="bg-[#161412]" value="Corporate Conference">Executive Corporate Summit</option>
                            <option className="bg-[#161412]" value="Private Banquet">Private Banquet / Gala</option>
                            <option className="bg-[#161412]" value="Birthday / Anniversary">Birthday / Anniversary</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className={labelCls}>Event Date</label>
                          <input type="date" required min={today} value={hallDate}
                            onChange={(e) => setHallDate(e.target.value)} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Expected Guest Count</label>
                          <select value={hallGuests} onChange={(e) => setHallGuests(e.target.value)} className={selectCls}>
                            <option className="bg-[#161412]" value="50">Up to 50 Guests</option>
                            <option className="bg-[#161412]" value="100">50–100 Guests</option>
                            <option className="bg-[#161412]" value="200">100–200 Guests</option>
                            <option className="bg-[#161412]" value="500">200–500 Guests</option>
                            <option className="bg-[#161412]" value="800">500–800 Guests</option>
                            <option className="bg-[#161412]" value="1200">800–1200 Guests</option>
                            <option className="bg-[#161412]" value="2000">1200–2000 Guests</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* DINING */}
                  {selectedType === 'dining' && (
                    <motion.div key="dining"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-5"
                    >
                      <div>
                        <label className={labelCls}>Reservation Date</label>
                        <input type="date" required min={today} value={diningDate}
                          onChange={(e) => setDiningDate(e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Arrival Time</label>
                        <input type="time" required value={diningTime}
                          onChange={(e) => setDiningTime(e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Number of Guests</label>
                        <select value={diningGuests} onChange={(e) => setDiningGuests(e.target.value)} className={selectCls}>
                          {['1','2','4','6','8','10','15'].map(n => (
                            <option key={n} value={n} className="bg-[#161412]">{n} {n === '1' ? 'Guest' : 'Guests'}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* EVENT */}
                  {selectedType === 'event' && (
                    <motion.div key="event"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                          <label className={labelCls}>Event Date</label>
                          <input type="date" required min={today} value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Occasion Type</label>
                          <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className={selectCls}>
                            <option className="bg-[#161412]" value="Royal High Wedding">Royal Wedding Assembly</option>
                            <option className="bg-[#161412]" value="Anniversary Jubilee">Anniversary Jubilee</option>
                            <option className="bg-[#161412]" value="VIP Celebrity Assembly">VIP Celebrity Assembly</option>
                            <option className="bg-[#161412]" value="Corporate Retreat Summit">Corporate Summit Retreat</option>
                            <option className="bg-[#161412]" value="Birthday Celebration">Birthday Celebration</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Guest Headcount</label>
                          <input type="number" placeholder="e.g. 350" min="1"
                            value={eventGuests} onChange={(e) => setEventGuests(e.target.value)} className={inputCls} />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Special Requirements (Optional)</label>
                        <textarea rows={2} placeholder="e.g. VIP valet, organic Deccan menu, airport transfers..."
                          value={requirements} onChange={(e) => setRequirements(e.target.value)}
                          className="w-full bg-transparent border-b border-[#C4A472]/20 focus:border-[#C4A472] outline-none text-[#F2ECE2] text-sm font-sans py-2 resize-none transition-colors duration-300 placeholder:text-[#5A524A]" />
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>

                {/* Special requests for room/hall */}
                {(selectedType === 'room' || selectedType === 'hall') && (
                  <div>
                    <label className={labelCls}>Special Requests (Optional)</label>
                    <textarea rows={2} placeholder="e.g. Early check-in, anniversary setup, dietary preferences..."
                      value={requirements} onChange={(e) => setRequirements(e.target.value)}
                      className="w-full bg-transparent border-b border-[#C4A472]/20 focus:border-[#C4A472] outline-none text-[#F2ECE2] text-sm font-sans py-2 resize-none transition-colors duration-300 placeholder:text-[#5A524A]" />
                  </div>
                )}

                {/* Submit */}
                <div className="pt-5 border-t border-[#C4A472]/10 flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div className="flex items-center gap-2.5 text-[#7A7068] text-xs">
                    <MessageSquareHeart className="w-5 h-5 text-[#C4A472] shrink-0" />
                    <span className="font-light">Concierge responds within 4 minutes on WhatsApp.</span>
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className="w-full sm:w-auto px-7 h-12 flex items-center justify-center gap-3 border border-[#C4A472] bg-[#C4A472]/15 text-[#C4A472] text-[10px] tracking-[0.25em] font-sans font-semibold uppercase hover:bg-[#C4A472] hover:text-[#0A0908] transition-colors duration-300 focus:outline-none cursor-pointer disabled:opacity-50">
                    {isSubmitting
                      ? <span className="animate-pulse">Connecting...</span>
                      : <><span>Send via WhatsApp</span><Send className="w-3.5 h-3.5" /></>
                    }
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}