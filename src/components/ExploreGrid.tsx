import React, { useState } from 'react';
import { Heart, MessageCircle, Eye, Sparkles, Filter, X } from 'lucide-react';
import { CadetCollegeCode, CadetUser } from '../types';
import { CADET_COLLEGES } from '../data/mockData';

interface PhotoMemory {
  id: string;
  title: string;
  college: CadetCollegeCode;
  collegeName: string;
  year: number;
  imageUrl: string;
  author: string;
  cadetNumber: string;
  likes: number;
  commentsCount: number;
  category: 'Parade & Drill' | 'Campus Sunset' | 'Athletics & PT' | 'Alumni Reunion' | 'Dining Hall & Prep';
  description: string;
}

export const ExploreGrid: React.FC = () => {
  const [selectedCollege, setSelectedCollege] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activePhoto, setActivePhoto] = useState<PhotoMemory | null>(null);
  const [likedPhotoIds, setLikedPhotoIds] = useState<string[]>([]);
  const [activePhotoComments, setActivePhotoComments] = useState<Record<string, { author: string; text: string; time: string }[]>>({
    'photo_1': [
      { author: 'Dr. Tanvir Ahsan (#1428)', text: 'The evening parade ground silence after roll call is timeless.', time: '2h ago' },
      { author: 'Kazi Farhan (#2105)', text: 'Can see the exact squad lineup from here!', time: '1h ago' }
    ]
  });
  const [newCommentText, setNewCommentText] = useState('');

  const photoMemories: PhotoMemory[] = [
    {
      id: 'photo_1',
      title: 'Academy Campus Clock Tower at Golden Dusk',
      college: 'MCC',
      collegeName: 'Mirzapur Cadet College',
      year: 2026,
      imageUrl: '/src/assets/images/cadet_campus_grounds_1794029062449.jpg',
      author: 'Tanvir Ahsan',
      cadetNumber: '1428',
      likes: 248,
      commentsCount: 31,
      category: 'Campus Sunset',
      description: 'The iconic clock tower reflecting golden hour sunlight over the football grounds and rubber athletic tracks. Every cadet remembers the dusk muster whistles from this exact spot.'
    },
    {
      id: 'photo_2',
      title: 'Passing Out Parade Drill Squad in Formation',
      college: 'FCC',
      collegeName: 'Faujdarhat Cadet College',
      year: 2025,
      imageUrl: '/src/assets/images/cadet_parade_formation_1794029063294.jpg',
      author: 'Maj. Rezwan (Retd.)',
      cadetNumber: '812',
      likes: 319,
      commentsCount: 42,
      category: 'Parade & Drill',
      description: 'Cadets in crisp ceremonial uniform marching with laser precision during the annual Passing Out Parade inspection.'
    },
    {
      id: 'photo_3',
      title: 'Annual Alumni Reunion Gala Evening',
      college: 'MGCC',
      collegeName: 'Mymensingh Girls\' Cadet College',
      year: 2026,
      imageUrl: '/src/assets/images/cadet_reunion_gala_1794029063879.jpg',
      author: 'Samira Mehnaz',
      cadetNumber: '412',
      likes: 195,
      commentsCount: 22,
      category: 'Alumni Reunion',
      description: 'Old Cadets across 15 intakes gathering under fairy lights for the alumni banquet. Catching up with seniors and juniors after decades.'
    },
    {
      id: 'photo_4',
      title: 'Inter-House 400m Track Athletics Final',
      college: 'RCC',
      collegeName: 'Rajshahi Cadet College',
      year: 2026,
      imageUrl: '/src/assets/images/cadet_athletics_event_1794029063781.jpg',
      author: 'Farhan Ahmed',
      cadetNumber: '2105',
      likes: 184,
      commentsCount: 17,
      category: 'Athletics & PT',
      description: 'High-octane sprint to the finish line with House pavilions cheering in unison. Spirit of the academy at its finest.'
    },
    {
      id: 'photo_5',
      title: 'Dormitory Grounds & Obstacle Course Coursework',
      college: 'JCC',
      collegeName: 'Jhenaidah Cadet College',
      year: 2024,
      imageUrl: '/src/assets/images/cadet_campus_grounds_1794029062449.jpg',
      author: 'Anisur Rahman',
      cadetNumber: '619',
      likes: 142,
      commentsCount: 14,
      category: 'Campus Sunset',
      description: 'Morning fog lifting off the obstacle course wall and monkey bars. The training ground of resilience.'
    },
    {
      id: 'photo_6',
      title: 'Guard of Honor Inspection at Sunrise',
      college: 'SCC',
      collegeName: 'Sylhet Cadet College',
      year: 2025,
      imageUrl: '/src/assets/images/cadet_parade_formation_1794029063294.jpg',
      author: 'Tariq Munir',
      cadetNumber: '1120',
      likes: 210,
      commentsCount: 29,
      category: 'Parade & Drill',
      description: 'The sharp cadence of boots striking tarmac during dawn muster practice.'
    }
  ];

  const categories = ['ALL', 'Parade & Drill', 'Campus Sunset', 'Athletics & PT', 'Alumni Reunion'];

  const filteredPhotos = photoMemories.filter((p) => {
    const collegeMatch = selectedCollege === 'ALL' || p.college === selectedCollege;
    const catMatch = selectedCategory === 'ALL' || p.category === selectedCategory;
    return collegeMatch && catMatch;
  });

  const togglePhotoLike = (id: string) => {
    if (likedPhotoIds.includes(id)) {
      setLikedPhotoIds(likedPhotoIds.filter((pId) => pId !== id));
    } else {
      setLikedPhotoIds([...likedPhotoIds, id]);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePhoto || !newCommentText.trim()) return;
    const existing = activePhotoComments[activePhoto.id] || [];
    setActivePhotoComments({
      ...activePhotoComments,
      [activePhoto.id]: [
        ...existing,
        {
          author: 'Cadet Tanvir Ahsan (#1428)',
          text: newCommentText.trim(),
          time: 'Just now'
        }
      ]
    });
    setNewCommentText('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Cadet Campus Archives & Memories
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
          High-resolution photography, nostalgic moments, and ceremonial archives submitted by cadets and alumni across all 12 cadet colleges.
        </p>

        {/* College Filter Strip */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCollege('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCollege === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All 12 Colleges
          </button>
          {CADET_COLLEGES.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelectedCollege(c.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCollege === c.code
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {c.code}
            </button>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto text-xs text-slate-400">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'text-indigo-300 font-semibold bg-indigo-950/60 border border-indigo-500/40'
                  : 'hover:text-slate-200 text-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredPhotos.map((item) => {
          const isLiked = likedPhotoIds.includes(item.id);
          const likeCount = item.likes + (isLiked ? 1 : 0);

          return (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-indigo-950/30"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity flex flex-col justify-between p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-black/60 text-indigo-300 backdrop-blur-md border border-indigo-500/30">
                    {item.college} · {item.year}
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium px-2 py-0.5 rounded bg-black/50 backdrop-blur-md">
                    {item.category}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-white drop-shadow-sm line-clamp-1 group-hover:text-indigo-200 transition-colors">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>
                      {item.author} (#{item.cadetNumber})
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-mono text-[11px] tabular-nums">
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'text-rose-500 fill-rose-500' : ''}`} />
                        {likeCount}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px] tabular-nums">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {item.commentsCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Photo Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c101d] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row">
            {/* Close Button */}
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Image Canvas */}
            <div className="md:w-3/5 bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full max-h-[50vh] md:max-h-[85vh] object-contain"
              />
            </div>

            {/* Right: Info & Cadet Comments */}
            <div className="md:w-2/5 p-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 bg-[#0e1424] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
                    <span>{activePhoto.collegeName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activePhoto.year}</span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">
                    {activePhoto.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Archived by {activePhoto.author} (#{activePhoto.cadetNumber})
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {activePhoto.description}
                </p>

                {/* Like / Stats bar */}
                <div className="flex items-center justify-between py-2 border-y border-slate-800 text-xs">
                  <button
                    onClick={() => togglePhotoLike(activePhoto.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      likedPhotoIds.includes(activePhoto.id)
                        ? 'text-rose-400 bg-rose-500/10'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedPhotoIds.includes(activePhoto.id) ? 'fill-rose-400' : ''}`} />
                    <span className="font-mono tabular-nums">
                      {activePhoto.likes + (likedPhotoIds.includes(activePhoto.id) ? 1 : 0)} Cadets Loved
                    </span>
                  </button>

                  <span className="text-slate-400 text-[11px]">
                    {activePhoto.category}
                  </span>
                </div>

                {/* Cadet Comments List */}
                <div className="space-y-2.5">
                  <span className="text-xs font-semibold text-slate-300">
                    Cadet Discussions
                  </span>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {(activePhotoComments[activePhoto.id] || []).map((comm, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="font-semibold text-indigo-300">{comm.author}</span>
                          <span>{comm.time}</span>
                        </div>
                        <p className="text-slate-300 leading-snug">{comm.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleAddComment} className="pt-4 border-t border-slate-800 mt-4 flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Share a campus memory..."
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 disabled:opacity-40 cursor-pointer"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
