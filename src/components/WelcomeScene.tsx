'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WelcomeSceneProps {
  onComplete: () => void;
}

export default function WelcomeScene({ onComplete }: WelcomeSceneProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleExit = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 1200);
  }, [isExiting, onComplete]); // ✅ dependencies declared

  useEffect(() => {
    const timer = setTimeout(() => {
      handleExit();
    }, 4200);

    return () => clearTimeout(timer);
  }, [handleExit]); // ✅ now safe to include

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (err) {
        console.log(err);
      }
    };

    playVideo();
  }, []);

  // rest of your JSX unchanged

  return (
    <>
      {!isExiting ? (
        <motion.div
          className="fixed inset-0 z-[200] overflow-hidden bg-[#0A0908]"
          style={{
    willChange: 'opacity, transform',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
  }}
          animate={{
  opacity: isExiting ? 0 : 1,
  scale: isExiting ? 1.015 : 1,
}}
transition={{
  duration: 1,
  ease: [0.76, 0, 0.24, 1],
}}
        >
          {/* VIDEO */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 6,
                ease: 'easeOut',
              }}
              className="w-full h-full object-cover will-change-transform transform-gpu backface-hidden"
            >
              <source
                src="https://res.cloudinary.com/di1chosqa/video/upload/f_mp4,q_auto:best,vc_h264,w_2560/output_dwtbca.mp4"
                type="video/mp4"
              />
            </motion.video>

            {/* CINEMATIC OVERLAYS */}
            <div className="absolute inset-0 bg-black/35" />

            <div className="absolute inset-x-0 top-0 h-[58%] bg-gradient-to-b from-[#0A0908]/95 via-[#0A0908]/82 via-30% to-transparent z-[2]" />

            <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-[#0A0908]/90 to-transparent" />

            {/* LUXURY GRAIN */}
            {/* <div className="absolute inset-0 opacity-[0.04] mix-blend-soft-light bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:6px_6px]" /> */}
          </div>

          {/* CONTENT */}
          <motion.div
            animate={{
  opacity: isExiting ? 0 : 1,
  y: isExiting ? -18 : 0,
  scale: isExiting ? 0.985 : 1,
}}
            transition={{
              duration: 0.6,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="relative z-20 flex flex-col items-center h-full px-6 pt-[14vh] md:pt-[12vh] text-center"
            style={{
  textShadow: '0 4px 30px rgba(0,0,0,0.45)',
}}
          >
            {/* EYEBROW */}
            <motion.p
              initial={{
                opacity: 0,
                y: 24,
                letterSpacing: '0.6em',
              }}
              animate={{
                opacity: 1,
                y: 0,
                letterSpacing: '0.45em',
              }}
              transition={{
                delay: 0.2,
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mb-5 text-[10px] md:text-xs uppercase text-[#C4A472] font-light"
            >
              Welcome To
            </motion.p>

            {/* TITLE */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{
                  opacity: 0,
                  y: 140,
                  letterSpacing: '0.12em',
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  letterSpacing: '0.01em',
                }}
                transition={{
                  delay: 0.45,
                  duration: 1.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-serif font-light text-[#F2ECE2] leading-none tracking-wide text-5xl sm:text-7xl md:text-[120px]"
              >
                The Grand{' '}
                <span className="italic text-[#C4A472]">
                  Icon
                </span>
              </motion.h1>
            </div>

            {/* SUBTEXT */}
            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1.15,
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-6 text-[10px] md:text-xs uppercase tracking-[0.22em] text-[#F2ECE2]/65 font-light"
            >
              Luxury • Hospitality • Timeless Comfort
            </motion.p>
          </motion.div>

          {/* BOTTOM INDICATOR */}
          <motion.button
            onClick={handleExit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 1.5,
              duration: 1,
            }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 cursor-pointer"
          >
            {/* LINE */}
            <div className="relative w-px h-16 overflow-hidden bg-white/10">
              <motion.div
                className="absolute left-0 right-0 top-full h-[60%] bg-gradient-to-t from-[#C4A472] to-transparent"
                animate={{
                  top: ['100%', '-60%'],
                }}
                transition={{
                  duration: 1.6,
                  ease: 'easeInOut',
                  repeat: Infinity,
                }}
              />
            </div>

            {/* ARROW */}
            <motion.svg
              width="14"
              height="8"
              viewBox="0 0 14 8"
              fill="none"
              animate={{
                y: [0, 4, 0],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-[#F2ECE2]/70"
            >
              <path d="M1 7L7 1L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </motion.button>
        </motion.div>
      ) : null}
    </>
  );
}