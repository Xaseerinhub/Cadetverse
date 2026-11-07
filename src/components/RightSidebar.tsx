import React, { useState } from 'react';
import { 
  Search, 
  Users, 
  Calendar, 
  Award, 
  Check, 
  ExternalLink, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Community, CadetUser } from '../types';
import { formatHouseLabel } from '../data/collegeReference';
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
  const [activeTab, setActiveTab] = useState<'trending' | 'events'>('trending');

  return (
    <aside className="hidden xl:flex flex-col w-80 shrink-0 h-screen sticky top-0 px-4 py-6 border-l border-slate-800/80 bg-[#0a0e1a]/70 backdrop-blur-sm overflow-y-auto space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search cadets, intakes, colleges..."
          className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
          >
            ×
          </button>
        )}
      </div>

      {/* Cadet Fraternity Creed Card */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-violet-950/30 border border-indigo-500/20 text-slate-300">
        <div className="flex items-center gap-2 mb-2 text-indigo-300 text-xs font-semibold">
          <Award className="w-4 h-4 text-indigo-400" />
          <span>Cadet Creed</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed italic">
          "Once a Cadet, Always a Cadet. Bound by discipline, honor, and brotherhood across 12 colleges."
        </p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>12 Colleges · 65+ Years Legacy</span>
          <button 
            onClick={() => onNavigate('communities')}
            className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-0.5 cursor-pointer"
          >
            Directory <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Trending Communities */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Cadet Communities
          </span>
          <button
            onClick={() => onNavigate('communities')}
            className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
          >
            See all
          </button>
        </div>

        <div className="space-y-2">
          {communities.slice(0, 4).map((comm) => (
            <div
              key={comm.id}
              className="p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/40 border border-slate-800/80 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors truncate">
                      {comm.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>{comm.memberCount.toLocaleString()} Cadets</span>
                    <span aria-hidden="true">·</span>
                    <span>{comm.category}</span>
                  </div>
                </div>

                <button
                  onClick={() => onJoinCommunity(comm.id)}
                  className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    comm.isJoined
                      ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white'
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
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Cadet Network
          </span>
          <span className="text-[11px] text-slate-500">By Intake & House</span>
        </div>

        <div className="space-y-2.5">
          {suggestedCadets.map((cadet) => {
            const isConnected = connectedIds.includes(cadet.id);
            return (
              <div
                key={cadet.id}
                className="flex items-center justify-between gap-2.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/80 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={cadet.avatar}
                    alt={cadet.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">
                      {cadet.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {cadet.collegeCode} · #{cadet.cadetNumber} · {formatHouseLabel(cadet.houseId)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onConnectCadet(cadet)}
                  className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    isConnected
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-200 border border-slate-700'
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
      <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            Upcoming Meets
          </span>
          <button
            onClick={() => onNavigate('announcements')}
            className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
          >
            All
          </button>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">MECA Grand Reunion 2026</span>
            <span className="text-[10px] text-indigo-400 font-mono">Jan 15–17</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Mirzapur Cadet College Campus, Tangail. All batches welcome.
          </p>
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>2,400+ Confirmed Cadets</span>
            <button 
              onClick={() => onNavigate('announcements')}
              className="text-indigo-400 hover:underline"
            >
              Details
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">CCCL National Golf Cup</span>
            <span className="text-[10px] text-indigo-400 font-mono">Dec 12</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Kurmitola Golf Club & Purbachal Club Lounge.
          </p>
        </div>
      </div>

      {/* Footer Minimal Notice */}
      <div className="pt-2 text-[11px] text-slate-500 text-center leading-relaxed">
        CadetVerse · Dedicated to the Cadet College Fraternity of Bangladesh
      </div>
    </aside>
  );
};
