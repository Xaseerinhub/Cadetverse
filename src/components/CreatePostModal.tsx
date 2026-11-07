import React, { useState } from 'react';
import { X, Image as ImageIcon, Send, Tag, Sparkles } from 'lucide-react';
import { CadetUser, CadetCollegeCode, Post } from '../types';
import { CADET_COLLEGES } from '../data/mockData';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CadetUser;
  onSubmitPost: (newPost: Omit<Post, 'id' | 'timestamp' | 'likesCount' | 'commentsCount' | 'repostsCount' | 'isLiked' | 'isSaved' | 'comments'>) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmitPost,
}) => {
  const [content, setContent] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<CadetCollegeCode | ''>(currentUser.collegeCode);
  const [intakeNumber, setIntakeNumber] = useState<number>(currentUser.intake);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['CadetLife']);

  const sampleImages = [
    { label: 'Campus Grounds', url: '/src/assets/images/cadet_campus_grounds_1794029062449.jpg' },
    { label: 'Parade Formation', url: '/src/assets/images/cadet_parade_formation_1794029063294.jpg' },
    { label: 'Alumni Reunion', url: '/src/assets/images/cadet_reunion_gala_1794029063879.jpg' },
    { label: 'Athletics Meet', url: '/src/assets/images/cadet_athletics_event_1794029063781.jpg' },
  ];

  const quickTags = ['CadetLife', 'AlumniReunion', 'InterHouse', 'CadetMotto', 'SeniorJunior', 'OFA', 'MECA'];

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handlePost = () => {
    if (!content.trim()) return;

    onSubmitPost({
      author: currentUser,
      content: content.trim(),
      collegeTag: (selectedCollege as CadetCollegeCode) || undefined,
      intakeTag: intakeNumber || undefined,
      image: selectedImage || undefined,
      tags: selectedTags,
    });

    setContent('');
    setSelectedImage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#0e1424] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100 text-sm">Create Cadet Post</span>
            <span className="text-xs text-indigo-400 font-mono">
              #{currentUser.cadetNumber}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Author info */}
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>{currentUser.collegeCode}</span>
                <span aria-hidden="true">·</span>
                <span>{currentUser.intake}th Intake</span>
                <span aria-hidden="true">·</span>
                <span>{currentUser.house}</span>
              </div>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Share memories, reunion announcements, cadet batch updates, or advice for juniors..."
            className="w-full p-3 text-sm rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
          />

          {/* College & Intake Selector */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 text-[11px] font-medium">
                Target College Tag
              </label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value as CadetCollegeCode)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="">All 12 Colleges</option>
                {CADET_COLLEGES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 text-[11px] font-medium">
                Intake Number
              </label>
              <input
                type="number"
                value={intakeNumber || ''}
                onChange={(e) => setIntakeNumber(Number(e.target.value))}
                placeholder="e.g. 44"
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Attach Campus Imagery */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mb-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
              Attach Campus Photograph / Memory
            </label>
            <div className="grid grid-cols-4 gap-2">
              {sampleImages.map((img) => {
                const isSelected = selectedImage === img.url;
                return (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => setSelectedImage(isSelected ? '' : img.url)}
                    className={`relative rounded-lg overflow-hidden border transition-all cursor-pointer aspect-video ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/40'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/70 py-0.5 text-[9px] text-white text-center truncate px-1">
                      {img.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Hashtags */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mb-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              Cadet Hashtags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickTags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      active
                        ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/50'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 bg-slate-900/40">
          <span className="text-[11px] text-slate-500">
            Visible to verified cadets & alumni
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handlePost}
              disabled={!content.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-900/40 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Post</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
