import React from 'react';
import { 
  Home, 
  Compass, 
  Plus, 
  Users, 
  User, 
  MessageSquare, 
  Bell, 
  ShieldCheck, 
  Megaphone 
} from 'lucide-react';
import { CrestLogo } from './CrestLogo';
import { ActivePage } from './NavbarDesktop';
import { CadetUser } from '../types';

interface NavbarMobileProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  currentUser: CadetUser;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  onOpenCreatePost: () => void;
  onOpenAuthModal: () => void;
}

export const NavbarMobile: React.FC<NavbarMobileProps> = ({
  activePage,
  onNavigate,
  currentUser,
  unreadMessagesCount,
  unreadNotificationsCount,
  onOpenCreatePost,
  onOpenAuthModal,
}) => {
  return (
    <>
      {/* Mobile Top Bar */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 bg-[#0a0e1a]/95 backdrop-blur-md border-b border-slate-800/80">
        <div 
          onClick={() => onNavigate('home')}
          className="cursor-pointer"
        >
          <CrestLogo size="sm" />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onNavigate('announcements')}
            aria-label="Announcements"
            className={`p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors ${
              activePage === 'announcements' ? 'text-indigo-400 bg-indigo-950/40' : ''
            }`}
          >
            <Megaphone className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('messages')}
            aria-label="Messages"
            className={`relative p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors ${
              activePage === 'messages' ? 'text-indigo-400 bg-indigo-950/40' : ''
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#0a0e1a]" />
            )}
          </button>

          <button
            onClick={() => onNavigate('notifications')}
            aria-label="Notifications"
            className={`relative p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors ${
              activePage === 'notifications' ? 'text-indigo-400 bg-indigo-950/40' : ''
            }`}
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#0a0e1a]" />
            )}
          </button>

          <button
            onClick={onOpenAuthModal}
            aria-label="Cadet Profile Switcher"
            className="ml-1 flex items-center shrink-0 cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500/50"
            />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around px-2 py-2 bg-[#090d16]/95 backdrop-blur-md border-t border-slate-800/90 shadow-2xl safe-area-bottom">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
            activePage === 'home' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Feed</span>
        </button>

        <button
          onClick={() => onNavigate('explore')}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
            activePage === 'explore' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Explore</span>
        </button>

        {/* Action Button: New Post */}
        <button
          onClick={onOpenCreatePost}
          aria-label="Create Post"
          className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/50 active:scale-95 transition-transform cursor-pointer -mt-3 ring-4 ring-[#090d16]"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={() => onNavigate('communities')}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
            activePage === 'communities' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Colleges</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
            activePage === 'profile' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Profile</span>
        </button>
      </nav>
    </>
  );
};
