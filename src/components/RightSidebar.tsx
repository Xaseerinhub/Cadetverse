import React from 'react';
import { 
  Search, 
  Calendar, 
  Award, 
  Check, 
  ArrowRight
} from 'lucide-react';
import { Community, CadetUser } from '../types';
import { ActivePage } from './NavbarDesktop';

interface RightSidebarProps {
  communities: Community[];
  suggestedCadets: CadetUser[];
  onNavigate: (page: ActivePage) => void;
  onJoinCommunity: (id: string) => void;
  onConnectCadet: (cadet: CadetUser) => void;
  connectedIds: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  communities,
  suggestedCadets,
  onNavigate,
  onJoinCommunity,
  onConnectCadet,
  connectedIds,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <aside className="hidden xl:flex flex-col w-80 shrink-0 h-screen sticky top-0 px-4 py-6 border-l border-[#e2dacb] dark:border-[#2c362d] bg-[#faf6ef]/95 dark:bg-[#151a15]/95 backdrop-blur-md overflow-y-auto space-y-6 transition-colors duration-200">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716c] dark:text-[#a8a29e]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search cadets, intakes, colleges..."
          className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#1e251f] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d] focus:ring-1 focus:ring-[#1b4332] dark:focus:ring-[#15803d] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]"
          >
            ×
          </button>
        )}
      </div>

      {/* Cadet Fraternity Creed Card */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-[#1b4332]/10 via-white to-[#5c3d2e]/10 dark:from-[#1b4332]/20 dark:via-[#1a201b] dark:to-[#5c3d2e]/20 border border-[#c59b27]/30 dark:border-[#eab308]/25 text-[#1c1917] dark:text-[#f5f5f4] shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-[#1b4332] dark:text-[#4ade80] text-xs font-semibold">
          <Award className="w-4 h-4 text-[#c59b27] dark:text-[#eab308]" />
          <span>Cadet Creed</span>
        </div>
        <p className="text-xs text-[#57534e] dark:text-[#d6d3d1] leading-relaxed italic">
          "Once a Cadet, Always a Cadet. Bound by discipline, honor, and brotherhood across 12 colleges."
        </p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-[#78716c] dark:text-[#a8a29e]">
          <span>12 Colleges · 65+ Years Legacy</span>
          <button 
            onClick={() => onNavigate('communities')}
            className="text-[#1b4332] hover:text-[#143527] dark:text-[#4ade80] dark:hover:text-[#86efac] font-medium inline-flex items-center gap-0.5 cursor-pointer"
          >
            Directory <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Trending Communities */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1c1917] dark:text-[#f5f5f4] uppercase tracking-wider">
            Cadet Communities
          </span>
          <button
            onClick={() => onNavigate('communities')}
            className="text-xs text-[#1b4332] hover:text-[#143527] dark:text-[#4ade80] cursor-pointer"
          >
            See all
          </button>
        </div>

        <div className="space-y-2">
          {communities.slice(0, 4).map((comm) => (
            <div
              key={comm.id}
              className="p-2.5 rounded-xl bg-white dark:bg-[#1a201b] hover:bg-[#faf6ef] dark:hover:bg-[#202721] border border-[#e2dacb] dark:border-[#2c362d] transition-all group shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#1c1917] dark:text-[#f5f5f4] group-hover:text-[#1b4332] dark:group-hover:text-[#4ade80] transition-colors truncate">
                      {comm.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#78716c] dark:text-[#a8a29e] mt-0.5">
                    <span>{comm.memberCount.toLocaleString()} Cadets</span>
                    <span aria-hidden="true">·</span>
                    <span>{comm.category}</span>
                  </div>
                </div>

                <button
                  onClick={() => onJoinCommunity(comm.id)}
                  className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    comm.isJoined
                      ? 'bg-[#ede5d8] text-[#57534e] dark:bg-[#242c25] dark:text-[#a8a29e]'
                      : 'bg-[#1b4332]/10 text-[#1b4332] border border-[#1b4332]/30 hover:bg-[#1b4332] hover:text-white dark:bg-[#15803d]/20 dark:text-[#4ade80] dark:border-[#15803d]/30 dark:hover:bg-[#15803d] dark:hover:text-white'
                  }`}
                >
                  {comm.isJoined ? 'Joined' : 'Join'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cadets You May Know / Batchmates */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1c1917] dark:text-[#f5f5f4] uppercase tracking-wider">
            Cadet Network
          </span>
          <span className="text-[11px] text-[#78716c] dark:text-[#a8a29e]">By Intake & House</span>
        </div>

        <div className="space-y-2.5">
          {suggestedCadets.map((cadet) => {
            const isConnected = connectedIds.includes(cadet.id);
            return (
              <div
                key={cadet.id}
                className="flex items-center justify-between gap-2.5 p-2 rounded-xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] hover:border-[#1b4332]/40 dark:hover:border-[#15803d]/40 transition-all shadow-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={cadet.avatar}
                    alt={cadet.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-[#1b4332]/30 dark:ring-[#15803d]/30 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#1c1917] dark:text-[#f5f5f4] truncate">
                      {cadet.name}
                    </p>
                    <p className="text-[11px] text-[#78716c] dark:text-[#a8a29e] truncate">
                      {cadet.collegeCode} · #{cadet.cadetNumber} · {cadet.house}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onConnectCadet(cadet)}
                  className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    isConnected
                      ? 'bg-[#1b4332]/10 text-[#1b4332] dark:bg-[#15803d]/20 dark:text-[#4ade80] border border-[#1b4332]/30 dark:border-[#15803d]/30'
                      : 'bg-[#ede5d8] hover:bg-[#1b4332] hover:text-white text-[#57534e] dark:bg-[#242c25] dark:hover:bg-[#15803d] dark:text-[#d6d3d1] dark:hover:text-white border border-[#e2dacb] dark:border-[#2c362d]'
                  }`}
                >
                  {isConnected ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-3 h-3" /> Connected
                    </span>
                  ) : (
                    'Connect'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Reunions & Meets */}
      <div className="space-y-2.5 pt-2 border-t border-[#e2dacb] dark:border-[#2c362d]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1c1917] dark:text-[#f5f5f4] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#5c3d2e] dark:text-[#fbbf24]" />
            Upcoming Meets
          </span>
          <button
            onClick={() => onNavigate('announcements')}
            className="text-xs text-[#1b4332] hover:text-[#143527] dark:text-[#4ade80] cursor-pointer"
          >
            All
          </button>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] text-xs space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#1c1917] dark:text-[#f5f5f4]">MECA Grand Reunion 2026</span>
            <span className="text-[10px] text-[#5c3d2e] dark:text-[#fbbf24] font-mono font-semibold">Jan 15–17</span>
          </div>
          <p className="text-[11px] text-[#57534e] dark:text-[#a8a29e]">
            Mirzapur Cadet College Campus, Tangail. All batches welcome.
          </p>
          <div className="pt-1 flex items-center justify-between text-[11px] text-[#78716c] dark:text-[#a8a29e]">
            <span>2,400+ Confirmed Cadets</span>
            <button 
              onClick={() => onNavigate('announcements')}
              className="text-[#1b4332] dark:text-[#4ade80] hover:underline cursor-pointer"
            >
              Details
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] text-xs space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#1c1917] dark:text-[#f5f5f4]">CCCL National Golf Cup</span>
            <span className="text-[10px] text-[#5c3d2e] dark:text-[#fbbf24] font-mono font-semibold">Dec 12</span>
          </div>
          <p className="text-[11px] text-[#57534e] dark:text-[#a8a29e]">
            Kurmitola Golf Club & Purbachal Club Lounge.
          </p>
        </div>
      </div>

      {/* Footer Minimal Notice */}
      <div className="pt-2 text-[11px] text-[#78716c] dark:text-[#a8a29e] text-center leading-relaxed">
        CadetVerse · Dedicated to the Cadet College Fraternity of Bangladesh
      </div>
    </aside>
  );
};
