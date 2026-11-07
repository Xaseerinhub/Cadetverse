import React from 'react';
import { 
  Home, 
  Compass, 
  Users, 
  MessageSquare, 
  Bell, 
  Megaphone, 
  User, 
  ShieldCheck, 
  PlusSquare,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { CrestLogo } from './CrestLogo';
import { CadetUser } from '../types';

export type ActivePage = 
  | 'home' 
  | 'explore' 
  | 'communities' 
  | 'messages' 
  | 'announcements' 
  | 'notifications' 
  | 'profile' 
  | 'admin';

interface NavbarDesktopProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  currentUser: CadetUser;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  onOpenCreatePost: () => void;
  onOpenAuthModal: () => void;
}

export const NavbarDesktop: React.FC<NavbarDesktopProps> = ({
  activePage,
  onNavigate,
  currentUser,
  unreadMessagesCount,
  unreadNotificationsCount,
  onOpenCreatePost,
  onOpenAuthModal,
}) => {
  const navItems = [
    { id: 'home' as ActivePage, label: 'Feed & Stories', icon: Home },
    { id: 'explore' as ActivePage, label: 'Campus Memories', icon: Compass },
    { id: 'communities' as ActivePage, label: 'Cadet Colleges & Wings', icon: Users },
    { 
      id: 'messages' as ActivePage, 
      label: 'Direct Messages', 
      icon: MessageSquare, 
      count: unreadMessagesCount 
    },
    { 
      id: 'notifications' as ActivePage, 
      label: 'Notifications', 
      icon: Bell, 
      count: unreadNotificationsCount 
    },
    { id: 'announcements' as ActivePage, label: 'Council Notices', icon: Megaphone },
    { id: 'profile' as ActivePage, label: 'Cadet Profile', icon: User },
    { id: 'admin' as ActivePage, label: 'Admin & Verification', icon: ShieldCheck },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 h-screen sticky top-0 px-4 py-6 border-r border-slate-800/80 bg-[#0a0e1a]/95 backdrop-blur-md justify-between select-none z-20">
      <div className="flex flex-col gap-6">
        {/* Brand Lockup */}
        <div 
          onClick={() => onNavigate('home')}
          className="cursor-pointer px-2 transition-opacity hover:opacity-95"
        >
          <CrestLogo size="md" />
        </div>

        {/* Primary CTA: Create Post */}
        <div className="px-1">
          <button
            onClick={onOpenCreatePost}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-900/30 transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <PlusSquare className="w-4 h-4" />
            <span>Create Cadet Post</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>

                {item.count && item.count > 0 ? (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500 text-white tabular-nums">
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Card & Persona Switcher */}
      <div className="pt-4 border-t border-slate-800/80 px-1">
        <div 
          onClick={() => onNavigate('profile')}
          className="flex items-center justify-between p-2 rounded-xl bg-slate-900/70 hover:bg-slate-800/60 border border-slate-800 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover ring-1 ring-indigo-500/40"
              />
              <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-indigo-600 text-white px-1 rounded-sm leading-tight">
                {currentUser.collegeCode}
              </span>
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-xs font-semibold text-slate-200 truncate group-hover:text-white">
                {currentUser.name}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>#{currentUser.cadetNumber}</span>
                <span aria-hidden="true">·</span>
                <span>{currentUser.intake}th Intake</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
        </div>

        {/* Demo Switcher & Session Trigger */}
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 px-1">
          <button 
            onClick={onOpenAuthModal}
            className="flex items-center gap-1 hover:text-indigo-300 transition-colors cursor-pointer text-[11px]"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Switch Persona</span>
          </button>
          <button 
            onClick={onOpenAuthModal}
            className="flex items-center gap-1 hover:text-slate-200 transition-colors cursor-pointer text-[11px]"
          >
            <LogOut className="w-3 h-3" />
            <span>Auth</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
