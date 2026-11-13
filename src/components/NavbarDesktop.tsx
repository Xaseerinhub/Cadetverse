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
  Sun,
  Moon
} from 'lucide-react';
import { CrestLogo } from './CrestLogo';
import { CadetUser } from '../types';
import { useTheme } from '../lib/themeContext';
import { canAccessAdmin } from '../lib/authContext';

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
  currentUser: CadetUser | null;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  onOpenCreatePost: () => void;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
}

export const NavbarDesktop: React.FC<NavbarDesktopProps> = ({
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
    // Only display Admin & Verification link to authenticated users with authoritative 'admin' role
    ...(canAccessAdmin(currentUser)
      ? [{ id: 'admin' as ActivePage, label: 'Admin & Verification', icon: ShieldCheck }]
      : []),
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 h-screen sticky top-0 px-4 py-6 border-r border-[#e2dacb] dark:border-[#2c362d] bg-[#faf6ef]/95 dark:bg-[#151a15]/95 backdrop-blur-md justify-between select-none z-20 transition-colors duration-200">
      <div className="flex flex-col gap-6">
        {/* Brand Lockup + Theme Switcher */}
        <div className="flex items-center justify-between px-2">
          <div 
            onClick={() => onNavigate('home')}
            className="cursor-pointer transition-opacity hover:opacity-95"
          >
            <CrestLogo size="md" />
          </div>

          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Khaki Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Khaki Mode' : 'Switch to Dark Military Mode'}
            className="p-2 rounded-xl text-[#57534e] hover:text-[#1c1917] hover:bg-[#ede5d8] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4] dark:hover:bg-[#202721] transition-colors cursor-pointer border border-[#e2dacb] dark:border-[#2c362d]"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#eab308]" />
            ) : (
              <Moon className="w-4 h-4 text-[#5c3d2e]" />
            )}
          </button>
        </div>

        {/* Primary CTA: Create Post (Cadet Green) */}
        <div className="px-1">
          <button
            onClick={onOpenCreatePost}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] text-white font-medium text-sm shadow-md shadow-[#1b4332]/20 dark:shadow-green-950/40 transition-all duration-200 active:scale-[0.98] cursor-pointer"
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
                    ? 'bg-[#1b4332]/10 text-[#1b4332] dark:bg-[#15803d]/15 dark:text-[#4ade80] font-semibold border border-[#1b4332]/25 dark:border-[#15803d]/30 shadow-xs'
                    : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#ede5d8]/60 dark:text-[#a8a29e] dark:hover:text-[#f5f5f4] dark:hover:bg-[#202721]/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive 
                        ? 'text-[#1b4332] dark:text-[#4ade80]' 
                        : 'text-[#78716c] group-hover:text-[#1c1917] dark:text-[#a8a29e] dark:group-hover:text-[#f5f5f4]'
                    }`}
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>

                {item.count && item.count > 0 ? (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#1b4332] dark:bg-[#15803d] text-white tabular-nums">
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Session Area */}
      <div className="pt-4 border-t border-[#e2dacb] dark:border-[#2c362d] px-1">
        {currentUser ? (
          <div>
            <div 
              onClick={() => onNavigate('profile')}
              className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#1e251f] hover:bg-[#f5efe6] dark:hover:bg-[#242c25] border border-[#e2dacb] dark:border-[#2c362d] transition-colors cursor-pointer group shadow-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-[#1b4332]/40 dark:ring-[#15803d]/40"
                  />
                  <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-[#5c3d2e] dark:bg-[#9a3412] text-white px-1 rounded-sm leading-tight">
                    {currentUser.collegeCode !== 'PENDING' ? currentUser.collegeCode : 'CADET'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0 text-left">
                  <span className="text-xs font-semibold text-[#1c1917] dark:text-[#f5f5f4] truncate group-hover:text-[#1b4332] dark:group-hover:text-[#4ade80]">
                    {currentUser.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#78716c] dark:text-[#a8a29e]">
                    <span>{currentUser.cadetNumber !== 'UNASSIGNED' ? `#${currentUser.cadetNumber}` : 'Unassigned'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentUser.intake > 0 ? `${currentUser.intake}th Intake` : 'Intake Pending'}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#78716c] group-hover:text-[#1c1917] dark:text-[#a8a29e] dark:group-hover:text-[#f5f5f4] transition-transform group-hover:translate-x-0.5" />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs px-1">
              <button 
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-1.5 text-[#57534e] hover:text-[#1b4332] dark:text-[#a8a29e] dark:hover:text-[#4ade80] transition-colors cursor-pointer text-xs font-medium"
              >
                <User className="w-3.5 h-3.5" />
                <span>My Profile</span>
              </button>
              <button 
                onClick={onSignOut}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-rose-700 hover:text-white hover:bg-rose-600 dark:text-rose-400 dark:hover:text-white dark:hover:bg-rose-600 transition-colors cursor-pointer text-xs font-semibold border border-rose-200/80 dark:border-rose-900/50 shadow-xs"
                title="Sign Out of CadetVerse"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={onOpenAuthModal}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] text-white font-medium text-xs shadow-md shadow-[#1b4332]/20 dark:shadow-green-950/30 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In to CadetVerse</span>
            </button>
            <p className="text-[10px] text-center text-[#78716c] dark:text-[#a8a29e]">
              Exclusive social network for Bangladesh Cadet Colleges
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
