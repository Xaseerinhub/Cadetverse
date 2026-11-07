import React from 'react';

interface CrestLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const CrestLogo: React.FC<CrestLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 36, text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 48, text: 'text-2xl', sub: 'text-xs' },
  };

  const { icon, text, sub } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Geometric Crest Mark */}
      <div 
        className="relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-b from-[#192237] to-[#0f1422] p-1.5 border border-indigo-500/25 shadow-lg shadow-indigo-950/40"
        style={{ width: icon + 8, height: icon + 8 }}
      >
        <svg 
          width={icon} 
          height={icon} 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
        >
          <defs>
            <linearGradient id="crestGrad" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818cf8" />
              <stop offset="0.5" stopColor="#6366f1" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="shieldGrad" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e293b" stopOpacity="0.8" />
              <stop offset="1" stopColor="#0f172a" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Outer Shield Geometry */}
          <path 
            d="M24 4L39 9.5V23C39 33.2 32.6 39.8 24 44C15.4 39.8 9 33.2 9 23V9.5L24 4Z" 
            fill="url(#shieldGrad)"
            stroke="url(#crestGrad)" 
            strokeWidth="1.75" 
            strokeLinejoin="round" 
          />

          {/* Inner Chevron / Honor V */}
          <path 
            d="M17 19L24 25.5L31 19" 
            stroke="#c7d2fe" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity="0.85"
          />
          <path 
            d="M19 25L24 29.5L29 25" 
            stroke="#818cf8" 
            strokeWidth="1.75" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity="0.65"
          />

          {/* Central Apex Compass Star */}
          <path 
            d="M24 10.5V16M24 16L26.2 13.5M24 16L21.8 13.5" 
            stroke="#a5b4fc" 
            strokeWidth="1.75" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <circle cx="24" cy="13.5" r="1.5" fill="#e0e7ff" />
        </svg>

        {/* Ambient subtle light highlight */}
        <div className="absolute inset-0 rounded-xl bg-indigo-500/10 pointer-events-none filter blur-sm -z-10" />
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-tight text-white ${text} font-['Plus_Jakarta_Sans']`}>
              CADET<span className="text-indigo-400">VERSE</span>
            </span>
          </div>
          <span className={`font-medium tracking-wider text-slate-400 uppercase ${sub}`}>
            Cadet College Nexus
          </span>
        </div>
      )}
    </div>
  );
};
