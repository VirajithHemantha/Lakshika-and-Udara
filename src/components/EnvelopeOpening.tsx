import React, { useState, useRef } from "react";
import { COUPLE_NAMES } from "../config/wedding";
import { motion, AnimatePresence } from 'motion/react';

export function EnvelopeOpening({ onComplete, onMusicStart, guestName }: { onComplete: () => void, onMusicStart?: () => void, guestName?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStart = () => {
    setShowButton(false);
    setIsPlaying(true);
    if (onMusicStart) onMusicStart();
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  };

  const handleVideoEnd = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-[#061e14] z-[100] flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src="/images/greenopening.mp4"
        className="absolute w-full h-full object-cover transition-opacity duration-1000"
        style={{ opacity: isPlaying ? 1 : 0.3 }}
        playsInline
        preload="auto"
        muted
        onEnded={handleVideoEnd}
      />
      
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10"
          >
            <div className="w-[1px] h-24 bg-gradient-to-b from-transparent to-brand-gold/50 mb-8" />
            {guestName && (
              <p className="px-6 mb-3 text-center font-serif italic text-2xl sm:text-3xl text-brand-gold-light drop-shadow">
                Dear {guestName}
              </p>
            )}
            <p className="px-6 mb-8 text-center font-display text-sm sm:text-base tracking-[0.3em] uppercase text-white/80">
              {COUPLE_NAMES}
            </p>
            <button
              onClick={handleStart}
              className="px-10 py-4 bg-transparent border border-brand-gold/40 text-brand-gold font-sans uppercase tracking-[0.4em] text-xs hover:bg-brand-gold hover:text-white transition-all duration-700 rounded-full shadow-[0_0_30px_rgba(197,160,89,0.1)]"
            >
              Open Invitation
            </button>
            <div className="w-[1px] h-24 bg-gradient-to-t from-transparent to-brand-gold/50 mt-8" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Skip button for convenience */}
      {!showButton && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          onClick={handleVideoEnd}
          className="absolute bottom-8 right-8 text-white/50 hover:text-white font-sans uppercase tracking-[0.2em] text-[10px] transition-colors z-20"
        >
          Skip Video
        </motion.button>
      )}
    </div>
  );
}
