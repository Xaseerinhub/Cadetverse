import React, { useState } from 'react';
import { 
  Megaphone, 
  Pin, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Check, 
  Filter,
  Award,
  HeartHandshake
} from 'lucide-react';
import { Announcement } from '../types';

interface AnnouncementsViewProps {
  announcements: Announcement[];
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const categories = ['ALL', 'Reunion', 'CCCL', 'Scholarship', 'Obituary'];

  const filteredAnnouncements = announcements.filter((a) => {
    if (selectedCategory === 'ALL') return true;
    return a.category === selectedCategory;
  });

  const handleActionClick = (announcement: Announcement) => {
    setActionFeedback(`Action recorded for: "${announcement.title.slice(0, 32)}..."`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
        <div className="flex items-center gap-2.5 text-indigo-400 mb-2">
          <Megaphone className="w-5 h-5" />
          <span className="text-xs font-bold tracking-wider uppercase">
            Cadet College Governing Body & Alumni Associations
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Official Circulars & Executive Notices
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Verified announcements from the Cadet College Central Directorate, Cadet College Club Limited (CCCL), and college alumni councils.
        </p>

        {/* Filter Tabs */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat === 'ALL' ? 'All Notices' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Action Toast Feedback */}
      {actionFeedback && (
        <div className="p-3 rounded-xl bg-indigo-900/60 border border-indigo-500/40 text-indigo-200 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
          <article
            key={ann.id}
            className={`p-5 sm:p-6 rounded-2xl bg-[#0f1422] border transition-all ${
              ann.isPinned
                ? 'border-indigo-500/40 shadow-lg shadow-indigo-950/20'
                : 'border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                  {ann.isPinned && (
                    <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                      <Pin className="w-3.5 h-3.5 rotate-45" /> Pinned
                    </span>
                  )}
                  {ann.isPinned && <span aria-hidden="true" className="text-slate-600">·</span>}
                  <span className="font-semibold text-indigo-300">{ann.category}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="font-mono text-slate-400">{ann.date}</span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {ann.title}
                </h2>
              </div>

              {ann.actionText && (
                <button
                  onClick={() => handleActionClick(ann)}
                  className="self-start px-3.5 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all text-xs font-medium cursor-pointer shrink-0 inline-flex items-center gap-1.5"
                >
                  <span>{ann.actionText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line mb-4 font-normal">
              {ann.content}
            </p>

            <div className="pt-3 border-t border-slate-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-300">{ann.issuer}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500">{ann.issuerRole}</span>
              </div>

              {ann.location && (
                <div className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{ann.location}</span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
