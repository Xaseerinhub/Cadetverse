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
        className="relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-b from-[#1b4332] to-[#143527] dark:from-[#1e2e21] dark:to-[#121c14] p-1.5 border border-[#c59b27]/40 dark:border-[#eab308]/30 shadow-md shadow-[#1b4332]/15"
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
              <stop stopColor="#eab308" />
              <stop offset="0.5" stopColor="#c59b27" />
              <stop offset="1" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="shieldGrad" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e3a29" stopOpacity="0.9" />
              <stop offset="1" stopColor="#14281c" stopOpacity="0.98" />
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
            stroke="#fef08a" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity="0.9"
          />
          <path 
            d="M19 25L24 29.5L29 25" 
            stroke="#eab308" 
            strokeWidth="1.75" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity="0.75"
          />

          {/* Central Apex Compass Star */}
          <path 
            d="M24 10.5V16M24 16L26.2 13.5M24 16L21.8 13.5" 
            stroke="#fef08a" 
            strokeWidth="1.75" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <circle cx="24" cy="13.5" r="1.5" fill="#fef9c3" />
        </svg>

        {/* Ambient subtle light highlight */}
        <div className="absolute inset-0 rounded-xl bg-[#c59b27]/10 pointer-events-none filter blur-sm -z-10" />
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-tight text-[#1c1917] dark:text-[#f5f5f4] ${text} font-['Plus_Jakarta_Sans']`}>
              CADET<span className="text-[#1b4332] dark:text-[#4ade80]">VERSE</span>
            </span>
          </div>
          <span className={`font-medium tracking-wider text-[#78716c] dark:text-[#a8a29e] uppercase ${sub}`}>
            Cadet College Nexus
          </span>
        </div>
      )}
    </div>
  );
};
