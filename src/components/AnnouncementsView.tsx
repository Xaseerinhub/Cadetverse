import React, { useState } from 'react';
import { 
  Megaphone, 
  Pin, 
  MapPin, 
  ExternalLink, 
  Check
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
      <div className="p-6 rounded-2xl bg-gradient-to-r from-white via-[#faf6ef] to-white dark:from-[#1a201b] dark:via-[#161c17] dark:to-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] shadow-xs">
        <div className="flex items-center gap-2.5 text-[#1b4332] dark:text-[#4ade80] mb-2">
          <Megaphone className="w-5 h-5" />
          <span className="text-xs font-bold tracking-wider uppercase">
            Cadet College Governing Body & Alumni Associations
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1c1917] dark:text-[#f5f5f4] tracking-tight">
          Official Circulars & Executive Notices
        </h1>
        <p className="text-xs sm:text-sm text-[#78716c] dark:text-[#a8a29e] mt-1 max-w-2xl leading-relaxed">
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
                  ? 'bg-[#1b4332] dark:bg-[#15803d] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1e251f] text-[#57534e] dark:text-[#a8a29e] hover:text-[#1c1917] dark:hover:text-[#f5f5f4] border border-[#e2dacb] dark:border-[#2c362d]'
              }`}
            >
              {cat === 'ALL' ? 'All Notices' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Action Toast Feedback */}
      {actionFeedback && (
        <div className="p-3 rounded-xl bg-[#1b4332]/10 border border-[#1b4332]/30 text-[#1b4332] dark:bg-[#15803d]/20 dark:border-[#15803d]/30 dark:text-[#4ade80] text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-[#1b4332] dark:text-[#4ade80] shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
          <article
            key={ann.id}
            className={`p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1a201b] border transition-all shadow-xs ${
              ann.isPinned
                ? 'border-[#c59b27]/50 dark:border-[#eab308]/40 ring-1 ring-[#c59b27]/20 dark:ring-[#eab308]/20'
                : 'border-[#e2dacb] dark:border-[#2c362d] hover:border-[#1b4332]/40 dark:hover:border-[#15803d]/40'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#78716c] dark:text-[#a8a29e] flex-wrap">
                  {ann.isPinned && (
                    <span className="flex items-center gap-1 text-[#c59b27] dark:text-[#eab308] font-semibold">
                      <Pin className="w-3.5 h-3.5 rotate-45" /> Pinned
                    </span>
                  )}
                  {ann.isPinned && <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#57534e]">·</span>}
                  <span className="font-semibold text-[#1b4332] dark:text-[#4ade80]">{ann.category}</span>
                  <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#57534e]">·</span>
                  <span className="font-mono text-[#78716c] dark:text-[#a8a29e]">{ann.date}</span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-[#1c1917] dark:text-[#f5f5f4] tracking-tight">
                  {ann.title}
                </h2>
              </div>

              {ann.actionText && (
                <button
                  onClick={() => handleActionClick(ann)}
                  className="self-start px-3.5 py-1.5 rounded-xl bg-[#1b4332]/10 text-[#1b4332] border border-[#1b4332]/30 hover:bg-[#1b4332] hover:text-white dark:bg-[#15803d]/20 dark:text-[#4ade80] dark:border-[#15803d]/30 dark:hover:bg-[#15803d] dark:hover:text-white transition-all text-xs font-medium cursor-pointer shrink-0 inline-flex items-center gap-1.5"
                >
                  <span>{ann.actionText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#d6d3d1] leading-relaxed whitespace-pre-line mb-4 font-normal">
              {ann.content}
            </p>

            <div className="pt-3 border-t border-[#e2dacb] dark:border-[#2c362d] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#78716c] dark:text-[#a8a29e]">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#1c1917] dark:text-[#f5f5f4]">{ann.issuer}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#78716c] dark:text-[#a8a29e]">{ann.issuerRole}</span>
              </div>

              {ann.location && (
                <div className="flex items-center gap-1 text-[#78716c] dark:text-[#a8a29e]">
                  <MapPin className="w-3.5 h-3.5 text-[#5c3d2e] dark:text-[#fbbf24]" />
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
