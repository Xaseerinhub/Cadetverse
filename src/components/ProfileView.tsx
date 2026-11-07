import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Building2, 
  Award, 
  Calendar, 
  Edit3, 
  CheckCircle2, 
  Share2, 
  Users, 
  Sparkles,
  Camera,
  X,
  Check
} from 'lucide-react';
import { CadetUser, Post } from '../types';
import { PostCard } from './PostCard';

interface ProfileViewProps {
  user: CadetUser;
  currentUser: CadetUser;
  posts: Post[];
  onLikePost: (postId: string) => void;
  onBookmarkPost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onUpdateUser: (updatedUser: CadetUser) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  posts,
  onLikePost,
  onBookmarkPost,
  onAddComment,
  onVotePoll,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'memories' | 'badges' | 'batchmates'>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBio, setEditBio] = useState(user.bio);
  const [editProfession, setEditProfession] = useState(user.profession);
  const [editCompany, setEditCompany] = useState(user.companyOrOrg || '');
  const [editLocation, setEditLocation] = useState(user.location);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isMyProfile = user.cadetNumber === currentUser.cadetNumber;
  const userPosts = posts.filter((p) => p.author.cadetNumber === user.cadetNumber);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      bio: editBio,
      profession: editProfession,
      companyOrOrg: editCompany,
      location: editLocation,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditModalOpen(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Hero */}
      <div className="rounded-2xl bg-[#0f1422] border border-slate-800 overflow-hidden shadow-xl">
        {/* Cover Photo */}
        <div className="relative h-44 sm:h-56 bg-slate-900 w-full overflow-hidden">
          <img
            src={user.coverImage || '/src/assets/images/cadet_campus_grounds_1794029062449.jpg'}
            alt="Cover"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1422] via-transparent to-black/30" />
        </div>

        {/* Profile Card Body */}
        <div className="px-5 sm:px-8 pb-6 relative -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            {/* Avatar & Badges */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-[#0f1422] shadow-2xl bg-slate-900"
              />
              <span className="absolute bottom-2 -right-2 bg-indigo-600 text-white font-mono font-bold text-xs px-2 py-0.5 rounded-lg shadow-md border border-[#0f1422]">
                #{user.cadetNumber}
              </span>
            </div>

            {/* Profile Actions */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {isMyProfile ? (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Cadet Profile</span>
                </button>
              ) : (
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors cursor-pointer">
                  <span>Connect</span>
                </button>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {user.name}
              </h1>
              {user.isVerifiedAlumnus && (
                <span className="flex items-center gap-1 text-xs text-indigo-400 font-medium bg-indigo-950/40 px-2 py-0.5 rounded-md border border-indigo-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  Verified Cadet Alumnus
                </span>
              )}
            </div>

            {/* Cadet College Affiliation */}
            <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium flex-wrap">
              <span>{user.college}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Intake {user.intake}th</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300 font-semibold">{user.house}</span>
            </div>

            {/* Profession & Location */}
            <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap pt-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                {user.profession} {user.companyOrOrg ? `· ${user.companyOrOrg}` : ''}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {user.location}
              </span>
            </div>

            {/* Bio */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed pt-2">
              {user.bio}
            </p>

            {/* Stats Bar */}
            <div className="pt-4 flex items-center gap-6 border-t border-slate-800/80 text-xs">
              <div>
                <span className="font-bold text-white font-mono text-sm tabular-nums">
                  {user.stats.posts}
                </span>{' '}
                <span className="text-slate-400">Posts</span>
              </div>
              <div>
                <span className="font-bold text-white font-mono text-sm tabular-nums">
                  {user.stats.connections}
                </span>{' '}
                <span className="text-slate-400">Cadet Network</span>
              </div>
              <div>
                <span className="font-bold text-white font-mono text-sm tabular-nums">
                  {user.stats.batchmatesCount}
                </span>{' '}
                <span className="text-slate-400">Batchmates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="px-5 sm:px-8 border-t border-slate-800 flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'posts'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Cadet Posts ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`py-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'badges'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Cadet Honors & Badges ({user.badges.length})
          </button>
          <button
            onClick={() => setActiveTab('memories')}
            className={`py-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'memories'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Campus Archives
          </button>
          <button
            onClick={() => setActiveTab('batchmates')}
            className={`py-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'batchmates'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {user.intake}th Batch Roster
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onLike={onLikePost}
                onBookmark={onBookmarkPost}
                onAddComment={onAddComment}
                onVotePoll={onVotePoll}
              />
            ))
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
              No posts shared yet by this cadet.
            </div>
          )}
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {user.badges.map((badge, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0f1422] border border-slate-800 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-100">{badge}</p>
                <p className="text-[11px] text-slate-500">Cadet College Council Merit</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'memories' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {['/src/assets/images/cadet_campus_grounds_1794029062449.jpg', '/src/assets/images/cadet_parade_formation_1794029063294.jpg', '/src/assets/images/cadet_athletics_event_1794029063781.jpg'].map((img, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
              <img src={img} alt="Memory" className="w-full h-full object-cover hover:scale-105 transition-transform" />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'batchmates' && (
        <div className="p-4 rounded-2xl bg-[#0f1422] border border-slate-800 space-y-3">
          <p className="text-xs text-slate-400">
            {user.intake}th Intake Network ({user.collegeCode}) · 52 Enrolled Cadets
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {['Cadet #1401 - Ashfaqur R. (Fazlul Huq)', 'Cadet #1412 - Salman K. (Suhrawardy)', 'Cadet #1428 - Tanvir Ahsan (Fazlul Huq)', 'Cadet #1435 - Munir H. (Nazrul)', 'Cadet #1444 - Rayhan U. (Tariq)'].map((cadet, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-slate-300">
                {cadet}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0f1422] border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Edit Cadet Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Cadet Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Profession / Role</label>
                <input
                  type="text"
                  value={editProfession}
                  onChange={(e) => setEditProfession(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Organization / Company</label>
                <input
                  type="text"
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Current Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 flex items-center gap-1.5"
                >
                  {saveSuccess && <Check className="w-3.5 h-3.5" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
