'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import WelcomeScene from '@/components/WelcomeScene';
import ExperienceHub from '@/components/ExperienceHub';

type Phase = 'welcome' | 'experience';

export default function HomePage() {
  const [phase, setPhase] = useState<Phase>('welcome');

  const handleWelcomeComplete = useCallback(() => {
    setPhase('experience');
  }, []);

  return (
    <div className="w-full">

      {/* Welcome scene — unmounts after complete, exit animation plays */}
      <AnimatePresence>
        {phase === 'welcome' && (
          <WelcomeScene onComplete={handleWelcomeComplete} />
        )}
      </AnimatePresence>

      {/* ExperienceHub owns everything: rooms/halls/dining + quote + gallery + testimonials + footer */}
      <AnimatePresence>
        {phase === 'experience' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ zIndex: 1 }}
          >
            <ExperienceHub />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}