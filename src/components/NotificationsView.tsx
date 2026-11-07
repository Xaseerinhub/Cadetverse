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
        return <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-indigo-400" />;
      case 'batch':
        return <Users className="w-4 h-4 text-sky-400" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-amber-400" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
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
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Stay updated with your intake, college council, and cadet network.
          </p>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/60 rounded-xl border border-slate-800/80 w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Activity
        </button>
        <button
          onClick={() => setFilter('mentions')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            filter === 'mentions'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Comments & Mentions
        </button>
        <button
          onClick={() => setFilter('batch')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            filter === 'batch'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Intake & Batch
        </button>
        <button
          onClick={() => setFilter('announcements')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            filter === 'announcements'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Announcements
        </button>
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl bg-[#0e1424] border border-slate-800 divide-y divide-slate-800/60 overflow-hidden">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onNotificationClick(notif.id)}
              className={`p-4 sm:p-5 flex items-start gap-3.5 cursor-pointer transition-colors ${
                !notif.read ? 'bg-indigo-950/20' : 'hover:bg-slate-900/40'
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                    {notif.title}
                  </p>
                  <span className="text-[11px] text-slate-500 font-mono shrink-0">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {notif.description}
                </p>
              </div>

              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 self-center" />
              )}
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-xs text-slate-500">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
};
