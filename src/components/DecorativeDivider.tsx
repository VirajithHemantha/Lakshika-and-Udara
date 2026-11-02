import React from 'react';

export const DecorativeDivider: React.FC = () => {
  return (
    <div className="w-full flex justify-center items-center py-4 opacity-80 z-20 relative pointer-events-none">
      <div className="w-24 sm:w-48 h-[1px] bg-gradient-to-r from-transparent to-brand-gold/60" />
      <img src="/images/opt/ornament.webp" alt="" loading="lazy" decoding="async" className="w-10 h-10 object-contain mx-4 opacity-70" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      <div className="w-24 sm:w-48 h-[1px] bg-gradient-to-l from-transparent to-brand-gold/60" />
    </div>
  );
};
