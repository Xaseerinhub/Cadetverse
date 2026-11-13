import React, { useState } from 'react';
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  Users, 
  Megaphone, 
  ShieldCheck, 
  CheckCheck 
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onNotificationClick: (id: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllAsRead,
  onNotificationClick,
}) => {
  const [filter, setFilter] = useState<'all' | 'mentions' | 'batch' | 'announcements'>('all');

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-[#1b4332] dark:text-[#4ade80]" />;
      case 'batch':
        return <Users className="w-4 h-4 text-[#5c3d2e] dark:text-[#fbbf24]" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-[#c59b27] dark:text-[#eab308]" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-[#1b4332] dark:text-[#4ade80]" />;
      default:
        return <Bell className="w-4 h-4 text-[#78716c] dark:text-[#a8a29e]" />;
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'mentions') return n.type === 'comment' || n.type === 'mention';
    if (filter === 'batch') return n.type === 'batch';
    if (filter === 'announcements') return n.type === 'announcement';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-white via-[#faf6ef] to-white dark:from-[#1a201b] dark:via-[#161c17] dark:to-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1c1917] dark:text-[#f5f5f4] tracking-tight">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-[#78716c] dark:text-[#a8a29e] mt-1">
            Stay updated with your intake, college council, and cadet network.
          </p>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#1c1917] hover:bg-[#ede5d8] dark:text-[#f5f5f4] bg-[#faf6ef] dark:bg-[#202721] dark:hover:bg-[#283229] border border-[#e2dacb] dark:border-[#2c362d] transition-colors cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5 text-[#1b4332] dark:text-[#4ade80]" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#ede5d8]/70 dark:bg-[#141814] rounded-xl border border-[#e2dacb] dark:border-[#2c362d] w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-[#1b4332] dark:bg-[#15803d] text-white shadow-xs'
              : 'text-[#57534e] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
          }`}
        >
          All Activity
        </button>
        <button
          onClick={() => setFilter('mentions')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            filter === 'mentions'
              ? 'bg-[#1b4332] dark:bg-[#15803d] text-white shadow-xs'
              : 'text-[#57534e] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
          }`}
        >
          Comments & Mentions
        </button>
        <button
          onClick={() => setFilter('batch')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            filter === 'batch'
              ? 'bg-[#1b4332] dark:bg-[#15803d] text-white shadow-xs'
              : 'text-[#57534e] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
          }`}
        >
          Intake & Batch
        </button>
        <button
          onClick={() => setFilter('announcements')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            filter === 'announcements'
              ? 'bg-[#1b4332] dark:bg-[#15803d] text-white shadow-xs'
              : 'text-[#57534e] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
          }`}
        >
          Announcements
        </button>
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] divide-y divide-[#e2dacb] dark:divide-[#2c362d] overflow-hidden shadow-xs">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onNotificationClick(notif.id)}
              className={`p-4 sm:p-5 flex items-start gap-3.5 cursor-pointer transition-colors ${
                !notif.read ? 'bg-[#1b4332]/5 dark:bg-[#15803d]/10' : 'hover:bg-[#faf6ef] dark:hover:bg-[#202721]'
              }`}
            >
              <div className="p-2 rounded-xl bg-[#faf6ef] dark:bg-[#141814] border border-[#e2dacb] dark:border-[#2c362d] shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-xs sm:text-sm font-semibold text-[#1c1917] dark:text-[#f5f5f4] truncate">
                    {notif.title}
                  </p>
                  <span className="text-[11px] text-[#78716c] dark:text-[#a8a29e] font-mono shrink-0">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs text-[#57534e] dark:text-[#d6d3d1] leading-relaxed">
                  {notif.description}
                </p>
              </div>

              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-[#1b4332] dark:bg-[#15803d] shrink-0 self-center" />
              )}
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-xs text-[#78716c] dark:text-[#a8a29e]">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
};
