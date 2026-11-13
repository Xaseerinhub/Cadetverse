import React, { useState } from 'react';
import { X, Image as ImageIcon, Send, Tag, Sparkles } from 'lucide-react';
import { CadetUser, CadetCollegeCode, Post } from '../types';
import { CADET_COLLEGES } from '../data/mockData';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CadetUser | null;
  onSubmitPost: (newPost: Omit<Post, 'id' | 'timestamp' | 'likesCount' | 'commentsCount' | 'repostsCount' | 'isLiked' | 'isSaved' | 'comments'>) => void;
}

interface CreatePostDialogProps {
  onClose: () => void;
  currentUser: CadetUser;
  onSubmitPost: (newPost: Omit<Post, 'id' | 'timestamp' | 'likesCount' | 'commentsCount' | 'repostsCount' | 'isLiked' | 'isSaved' | 'comments'>) => void;
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({
  onClose,
  currentUser,
  onSubmitPost,
}) => {
  const [content, setContent] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<CadetCollegeCode | ''>(
    currentUser.collegeCode !== 'PENDING' ? (currentUser.collegeCode as CadetCollegeCode) : ''
  );
  const [intakeNumber, setIntakeNumber] = useState<number>(currentUser.intake > 0 ? currentUser.intake : 0);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['CadetLife']);

  const sampleImages = [
    { label: 'Campus Grounds', url: '/src/assets/images/cadet_campus_grounds_1794029062449.jpg' },
    { label: 'Parade Formation', url: '/src/assets/images/cadet_parade_formation_1794029063294.jpg' },
    { label: 'Alumni Reunion', url: '/src/assets/images/cadet_reunion_gala_1794029063879.jpg' },
    { label: 'Athletics Meet', url: '/src/assets/images/cadet_athletics_event_1794029063781.jpg' },
  ];

  const quickTags = ['CadetLife', 'AlumniReunion', 'InterHouse', 'CadetMotto', 'SeniorJunior', 'OFA', 'MECA'];

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
      intakeTag: intakeNumber > 0 ? intakeNumber : undefined,
      image: selectedImage || undefined,
      tags: selectedTags,
    });

    setContent('');
    setSelectedImage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e2dacb] dark:border-[#2c362d]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1c1917] dark:text-[#f5f5f4] text-sm">Create Cadet Post</span>
            <span className="text-xs text-[#1b4332] dark:text-[#4ade80] font-mono">
              {currentUser.cadetNumber !== 'UNASSIGNED' ? `#${currentUser.cadetNumber}` : '(Unassigned)'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4] hover:bg-[#ede5d8]/60 dark:hover:bg-[#202721] transition-colors cursor-pointer"
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
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#1b4332]/20 dark:ring-[#15803d]/30"
            />
            <div>
              <p className="text-xs font-semibold text-[#1c1917] dark:text-[#f5f5f4]">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-[#78716c] dark:text-[#a8a29e]">
                <span>{currentUser.collegeCode !== 'PENDING' ? currentUser.collegeCode : 'College Pending'}</span>
                <span aria-hidden="true">·</span>
                <span>{currentUser.intake > 0 ? `${currentUser.intake}th Intake` : 'Intake Pending'}</span>
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
            className="w-full p-3 text-sm rounded-xl bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d] focus:ring-1 focus:ring-[#1b4332] dark:focus:ring-[#15803d] resize-none"
          />

          {/* College & Intake Selector */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[#57534e] dark:text-[#a8a29e] mb-1 text-[11px] font-medium">
                Target College Tag
              </label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value as CadetCollegeCode)}
                className="w-full p-2 rounded-lg bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] text-xs focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d]"
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
              <label className="block text-[#57534e] dark:text-[#a8a29e] mb-1 text-[11px] font-medium">
                Intake Number
              </label>
              <input
                type="number"
                value={intakeNumber || ''}
                onChange={(e) => setIntakeNumber(Number(e.target.value))}
                placeholder="e.g. 44"
                className="w-full p-2 rounded-lg bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] text-xs focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d]"
              />
            </div>
          </div>

          {/* Attach Campus Imagery */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] text-[#57534e] dark:text-[#a8a29e] font-medium mb-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#1b4332] dark:text-[#4ade80]" />
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
                        ? 'border-[#1b4332] dark:border-[#15803d] ring-2 ring-[#1b4332]/40 dark:ring-[#15803d]/40'
                        : 'border-[#e2dacb] dark:border-[#2c362d] opacity-75 hover:opacity-100'
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
            <label className="flex items-center gap-1.5 text-[11px] text-[#57534e] dark:text-[#a8a29e] font-medium mb-1.5">
              <Tag className="w-3.5 h-3.5 text-[#5c3d2e] dark:text-[#fbbf24]" />
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
                        ? 'bg-[#1b4332]/15 text-[#1b4332] dark:bg-[#15803d]/20 dark:text-[#4ade80] border border-[#1b4332]/40 dark:border-[#15803d]/40'
                        : 'bg-[#faf6ef] dark:bg-[#131713] text-[#57534e] dark:text-[#a8a29e] border border-[#e2dacb] dark:border-[#2c362d] hover:text-[#1c1917] dark:hover:text-[#f5f5f4]'
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
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#e2dacb] dark:border-[#2c362d] bg-[#faf6ef]/70 dark:bg-[#141814]/70">
          <span className="text-[11px] text-[#78716c] dark:text-[#a8a29e]">
            Visible to verified cadets & alumni
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4] hover:bg-[#ede5d8]/50 dark:hover:bg-[#202721] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handlePost}
              disabled={!content.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#1b4332]/20 dark:shadow-green-950/40 transition-colors cursor-pointer"
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

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmitPost,
}) => {
  if (!isOpen || !currentUser) return null;

  return (
    <CreatePostDialog
      onClose={onClose}
      currentUser={currentUser}
      onSubmitPost={onSubmitPost}
    />
  );
};
