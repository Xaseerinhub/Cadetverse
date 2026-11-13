import React from 'react';
import { 
  Home, 
  Compass, 
  Plus, 
  Users, 
  User, 
  MessageSquare, 
  Bell, 
  Megaphone,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import { CrestLogo } from './CrestLogo';
import { ActivePage } from './NavbarDesktop';
import { CadetUser } from '../types';
import { useTheme } from '../lib/themeContext';

interface NavbarMobileProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  currentUser: CadetUser | null;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  onOpenCreatePost: () => void;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
}

export const NavbarMobile: React.FC<NavbarMobileProps> = ({
  activePage,
  onNavigate,
  currentUser,
  unreadMessagesCount,
  unreadNotificationsCount,
  onOpenCreatePost,
  onOpenAuthModal,
  onSignOut,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 bg-[#faf6ef]/95 dark:bg-[#151a15]/95 backdrop-blur-md border-b border-[#e2dacb] dark:border-[#2c362d] transition-colors duration-200">
        <div 
          onClick={() => onNavigate('home')}
          className="cursor-pointer"
        >
          <CrestLogo size="sm" />
        </div>

        <div className="flex items-center gap-1.5">
          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Khaki Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Khaki Mode' : 'Switch to Dark Mode'}
            className="p-1.5 rounded-lg text-[#57534e] hover:bg-[#ede5d8] dark:text-[#a8a29e] dark:hover:bg-[#202721] transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#eab308]" />
            ) : (
              <Moon className="w-4 h-4 text-[#5c3d2e]" />
            )}
          </button>

          <button
            onClick={() => onNavigate('announcements')}
            aria-label="Announcements"
            className={`p-1.5 rounded-lg text-[#57534e] hover:bg-[#ede5d8] dark:text-[#a8a29e] dark:hover:bg-[#202721] transition-colors ${
              activePage === 'announcements' ? 'text-[#1b4332] bg-[#1b4332]/10 dark:text-[#4ade80] dark:bg-[#15803d]/15' : ''
            }`}
          >
            <Megaphone className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('messages')}
            aria-label="Messages"
            className={`relative p-1.5 rounded-lg text-[#57534e] hover:bg-[#ede5d8] dark:text-[#a8a29e] dark:hover:bg-[#202721] transition-colors ${
              activePage === 'messages' ? 'text-[#1b4332] bg-[#1b4332]/10 dark:text-[#4ade80] dark:bg-[#15803d]/15' : ''
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#1b4332] dark:bg-[#15803d] ring-2 ring-[#faf6ef] dark:ring-[#151a15]" />
            )}
          </button>

          <button
            onClick={() => onNavigate('notifications')}
            aria-label="Notifications"
            className={`relative p-1.5 rounded-lg text-[#57534e] hover:bg-[#ede5d8] dark:text-[#a8a29e] dark:hover:bg-[#202721] transition-colors ${
              activePage === 'notifications' ? 'text-[#1b4332] bg-[#1b4332]/10 dark:text-[#4ade80] dark:bg-[#15803d]/15' : ''
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#1b4332] dark:bg-[#15803d] ring-2 ring-[#faf6ef] dark:ring-[#151a15]" />
            )}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={() => onNavigate('profile')}
                aria-label="Cadet Profile"
                className="flex items-center shrink-0 cursor-pointer"
                title="View Cadet Profile"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-[#1b4332]/50 dark:ring-[#15803d]/50"
                />
              </button>
              <button
                onClick={onSignOut}
                aria-label="Sign Out"
                title="Sign Out of CadetVerse"
                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors cursor-pointer border border-rose-200/60 dark:border-rose-900/40"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="ml-1 px-2.5 py-1 rounded-lg bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around px-2 py-2 bg-[#faf6ef]/95 dark:bg-[#151a15]/95 backdrop-blur-md border-t border-[#e2dacb] dark:border-[#2c362d] shadow-lg safe-area-bottom transition-colors duration-200">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
            activePage === 'home' ? 'text-[#1b4332] dark:text-[#4ade80]' : 'text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Feed</span>
        </button>

        <button
          onClick={() => onNavigate('explore')}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
            activePage === 'explore' ? 'text-[#1b4332] dark:text-[#4ade80]' : 'text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Explore</span>
        </button>

        {/* Action Button: New Post (Cadet Green) */}
        <button
          onClick={onOpenCreatePost}
          aria-label="Create Post"
          className="flex items-center justify-center w-11 h-11 rounded-full bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] text-white shadow-md shadow-[#1b4332]/30 dark:shadow-green-950/40 active:scale-95 transition-transform cursor-pointer -mt-3 ring-4 ring-[#f4efe6] dark:ring-[#121612]"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={() => onNavigate('communities')}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
            activePage === 'communities' ? 'text-[#1b4332] dark:text-[#4ade80]' : 'text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Colleges</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
            activePage === 'profile' ? 'text-[#1b4332] dark:text-[#4ade80]' : 'text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Profile</span>
        </button>
      </nav>
    </>
  );
};
