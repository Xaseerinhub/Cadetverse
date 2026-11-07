import React, { useState } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Story, CadetUser } from '../types';

interface StoriesBarProps {
  stories: Story[];
  currentUser: CadetUser;
  onAddStory: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUser,
  onAddStory,
}) => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  const activeStory = selectedStoryIndex !== null ? stories[selectedStoryIndex] : null;

  const handleNext = () => {
    if (selectedStoryIndex !== null && selectedStoryIndex < stories.length - 1) {
      setSelectedStoryIndex(selectedStoryIndex + 1);
    } else {
      setSelectedStoryIndex(null);
    }
  };

  const handlePrev = () => {
    if (selectedStoryIndex !== null && selectedStoryIndex > 0) {
      setSelectedStoryIndex(selectedStoryIndex - 1);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3.5 overflow-x-auto pb-2 pt-1 px-1 scrollbar-none select-none">
        {/* Current User: Add Memory */}
        <div 
          onClick={onAddStory}
          className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-full p-0.5 bg-slate-800 border-2 border-dashed border-indigo-500/50 group-hover:border-indigo-400 transition-colors flex items-center justify-center">
              <img
                src={currentUser.avatar}
                alt="My Story"
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover filter brightness-90 group-hover:brightness-100 transition-all"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center ring-2 ring-[#090d16] shadow-sm">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-300 max-w-[64px] truncate">
            Add Memory
          </span>
        </div>

        {/* Stories List */}
        {stories.map((story, index) => (
          <div
            key={story.id}
            onClick={() => setSelectedStoryIndex(index)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div 
              className={`w-14 h-14 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                story.hasUnseen
                  ? 'bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-400 p-[2px]'
                  : 'ring-1 ring-slate-700 bg-slate-800'
              }`}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border border-[#090d16]">
                <img
                  src={story.author.avatar}
                  alt={story.author.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-300 max-w-[68px] truncate text-center">
              {story.author.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Story Lightbox / Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md h-[80vh] max-h-[700px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between">
            {/* Story Image Backdrop */}
            <img
              src={activeStory.imageUrl}
              alt={activeStory.caption}
              className="absolute inset-0 w-full h-full object-cover -z-10"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/85 -z-10" />

            {/* Top Bar with Progress & Author */}
            <div className="p-4 space-y-3 z-10">
              {/* Progress segments */}
              <div className="flex items-center gap-1.5">
                {stories.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i === selectedStoryIndex
                        ? 'bg-white'
                        : i < (selectedStoryIndex || 0)
                        ? 'bg-white/60'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={activeStory.author.avatar}
                    alt={activeStory.author.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-white/50"
                  />
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {activeStory.author.name}
                    </p>
                    <p className="text-[10px] text-slate-300">
                      {activeStory.author.collegeCode} #{activeStory.author.cadetNumber} · {activeStory.timestamp}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStoryIndex(null)}
                  className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation click zones & arrows */}
            <div className="flex-1 flex items-center justify-between px-2">
              <button
                onClick={handlePrev}
                disabled={selectedStoryIndex === 0}
                className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white disabled:opacity-0 transition-opacity cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-opacity cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption */}
            <div className="p-4 z-10 space-y-2">
              <p className="text-sm text-white font-medium drop-shadow-md leading-relaxed">
                {activeStory.caption}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="text-[11px] font-mono text-indigo-300">
                  {activeStory.author.house}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Eye className="w-3.5 h-3.5" /> 184 Cadets viewed
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
