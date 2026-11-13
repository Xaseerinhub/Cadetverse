import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Edit3, 
  Check, 
  X,
  LogOut
} from 'lucide-react';
import { CadetUser, Post } from '../types';
import { PostCard } from './PostCard';
import {
  CADET_CAMPUS_GROUNDS_IMAGE,
  CADET_PARADE_FORMATION_IMAGE,
  CADET_ATHLETICS_EVENT_IMAGE,
} from '../assets/cadetImages';
import { checkProfileOwnership } from '../lib/authContext';

interface ProfileViewProps {
  user: CadetUser;
  currentUser: CadetUser | null;
  posts: Post[];
  onLikePost: (postId: string) => void;
  onBookmarkPost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onUpdateUser?: (updated: CadetUser) => void;
  onSignOut?: () => void;
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
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'badges' | 'memories' | 'batchmates'>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBio, setEditBio] = useState(user.bio);
  const [editProfession, setEditProfession] = useState(user.profession);
  const [editCompany, setEditCompany] = useState(user.companyOrOrg || '');
  const [editLocation, setEditLocation] = useState(user.location);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Authoritative unique user ID comparison prevents unassigned placeholder collisions
  const isMyProfile = checkProfileOwnership(currentUser, user);
  const userPosts = posts.filter((p) => p.author.id === user.id || (user.cadetNumber !== 'UNASSIGNED' && p.author.cadetNumber === user.cadetNumber));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CadetUser = {
      ...user,
      bio: editBio,
      profession: editProfession,
      companyOrOrg: editCompany,
      location: editLocation,
    };
    onUpdateUser?.(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditModalOpen(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Hero */}
      <div className="rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] overflow-hidden shadow-xs">
        {/* Cover Photo */}
        <div className="relative h-44 sm:h-56 bg-[#ede5d8] dark:bg-[#141814] w-full overflow-hidden">
          <img
            src={user.coverImage || CADET_CAMPUS_GROUNDS_IMAGE}
            alt="Cover"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1a201b] via-transparent to-black/30" />
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
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-white dark:ring-[#1a201b] shadow-xl bg-[#ede5d8] dark:bg-[#141814]"
              />
              <span className="absolute bottom-2 -right-2 bg-[#5c3d2e] dark:bg-[#9a3412] text-white font-mono font-bold text-xs px-2 py-0.5 rounded-lg shadow-md border-2 border-white dark:border-[#1a201b]">
                {user.cadetNumber !== 'UNASSIGNED' ? `#${user.cadetNumber}` : 'UNASSIGNED'}
              </span>
            </div>

            {/* Profile Actions */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              {isMyProfile ? (
                <>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ede5d8] hover:bg-[#e2dacb] text-[#1c1917] text-xs font-medium border border-[#e2dacb] dark:bg-[#202721] dark:hover:bg-[#283229] dark:text-[#f5f5f4] dark:border-[#2c362d] transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Cadet Profile</span>
                  </button>
                  {onSignOut && (
                    <button
                      onClick={onSignOut}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-rose-700 hover:text-white hover:bg-rose-600 dark:text-rose-400 dark:hover:text-white dark:hover:bg-rose-600 text-xs font-semibold border border-rose-200/80 dark:border-rose-900/60 shadow-xs transition-colors cursor-pointer"
                      title="Log Out of CadetVerse"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  )}
                </>
              ) : (
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] text-white text-xs font-medium shadow-xs transition-colors cursor-pointer">
                  <span>Connect</span>
                </button>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1c1917] dark:text-[#f5f5f4] tracking-tight">
                {user.name}
              </h1>
              {user.isVerifiedAlumnus && (
                <span className="flex items-center gap-1 text-xs text-[#c59b27] dark:text-[#eab308] font-medium bg-[#c59b27]/10 dark:bg-[#eab308]/15 px-2 py-0.5 rounded-md border border-[#c59b27]/30 dark:border-[#eab308]/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c59b27] dark:text-[#eab308]" />
                  Verified Cadet Alumnus
                </span>
              )}
            </div>

            {/* Cadet College Affiliation */}
            <div className="flex items-center gap-2 text-xs text-[#1b4332] dark:text-[#4ade80] font-medium flex-wrap">
              <span>{user.college}</span>
              <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#57534e]">·</span>
              <span>{user.intake > 0 ? `Intake ${user.intake}th` : 'Intake Pending'}</span>
              <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#57534e]">·</span>
              <span className="text-[#5c3d2e] dark:text-[#fbbf24] font-semibold">{user.house}</span>
            </div>

            {/* Profession & Location */}
            <div className="flex items-center gap-3 text-xs text-[#78716c] dark:text-[#a8a29e] flex-wrap pt-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#78716c] dark:text-[#a8a29e]" />
                {user.profession} {user.companyOrOrg ? `· ${user.companyOrOrg}` : ''}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#78716c] dark:text-[#a8a29e]" />
                {user.location}
              </span>
            </div>

            {/* Bio */}
            <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#d6d3d1] max-w-3xl leading-relaxed pt-2">
              {user.bio}
            </p>

            {/* Stats Bar */}
            <div className="pt-4 flex items-center gap-6 border-t border-[#e2dacb] dark:border-[#2c362d] text-xs">
              <div>
                <span className="font-bold text-[#1c1917] dark:text-[#f5f5f4] font-mono text-sm tabular-nums">
                  {user.stats.posts}
                </span>{' '}
                <span className="text-[#78716c] dark:text-[#a8a29e]">Posts</span>
              </div>
              <div>
                <span className="font-bold text-[#1c1917] dark:text-[#f5f5f4] font-mono text-sm tabular-nums">
                  {user.stats.connections}
                </span>{' '}
                <span className="text-[#78716c] dark:text-[#a8a29e]">Cadet Network</span>
              </div>
              <div>
                <span className="font-bold text-[#1c1917] dark:text-[#f5f5f4] font-mono text-sm tabular-nums">
                  {user.stats.batchmatesCount}
                </span>{' '}
                <span className="text-[#78716c] dark:text-[#a8a29e]">Batchmates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="px-5 sm:px-8 border-t border-[#e2dacb] dark:border-[#2c362d] flex items-center gap-4 text-xs font-medium bg-[#faf6ef]/40 dark:bg-[#141814]/40">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'posts'
                ? 'border-[#1b4332] text-[#1b4332] dark:border-[#15803d] dark:text-[#4ade80] font-bold'
                : 'border-transparent text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
            }`}
          >
            Cadet Posts ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`py-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'badges'
                ? 'border-[#1b4332] text-[#1b4332] dark:border-[#15803d] dark:text-[#4ade80] font-bold'
                : 'border-transparent text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
            }`}
          >
            Cadet Honors & Badges ({user.badges.length})
          </button>
          <button
            onClick={() => setActiveTab('memories')}
            className={`py-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'memories'
                ? 'border-[#1b4332] text-[#1b4332] dark:border-[#15803d] dark:text-[#4ade80] font-bold'
                : 'border-transparent text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
            }`}
          >
            Campus Archives
          </button>
          <button
            onClick={() => setActiveTab('batchmates')}
            className={`py-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'batchmates'
                ? 'border-[#1b4332] text-[#1b4332] dark:border-[#15803d] dark:text-[#4ade80] font-bold'
                : 'border-transparent text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
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
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] text-xs text-[#78716c] dark:text-[#a8a29e] shadow-xs">
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
              className="p-4 rounded-xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] flex items-center gap-3 shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-[#c59b27]/15 border border-[#c59b27]/30 dark:bg-[#eab308]/20 dark:border-[#eab308]/30 flex items-center justify-center text-[#c59b27] dark:text-[#eab308] shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1c1917] dark:text-[#f5f5f4]">{badge}</p>
                <p className="text-[11px] text-[#78716c] dark:text-[#a8a29e]">Cadet College Council Merit</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'memories' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[CADET_CAMPUS_GROUNDS_IMAGE, CADET_PARADE_FORMATION_IMAGE, CADET_ATHLETICS_EVENT_IMAGE].map((img, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden bg-[#faf6ef] dark:bg-[#141814] border border-[#e2dacb] dark:border-[#2c362d] shadow-xs">
              <img src={img} alt="Memory" className="w-full h-full object-cover hover:scale-105 transition-transform" />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'batchmates' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] space-y-3 shadow-xs">
          <p className="text-xs text-[#57534e] dark:text-[#a8a29e] font-medium">
            {user.intake}th Intake Network ({user.collegeCode}) · 52 Enrolled Cadets
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {['Cadet #1401 - Ashfaqur R. (Fazlul Huq)', 'Cadet #1412 - Salman K. (Suhrawardy)', 'Cadet #1428 - Tanvir Ahsan (Fazlul Huq)', 'Cadet #1435 - Munir H. (Nazrul)', 'Cadet #1444 - Rayhan U. (Tariq)'].map((cadet, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-[#faf6ef] dark:bg-[#141814] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#d6d3d1]">
                {cadet}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e2dacb] dark:border-[#2c362d] pb-3">
              <h3 className="text-sm font-bold text-[#1c1917] dark:text-[#f5f5f4]">Edit Cadet Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#57534e] dark:text-[#a8a29e] mb-1">Cadet Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-lg bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="block text-[#57534e] dark:text-[#a8a29e] mb-1">Profession / Role</label>
                <input
                  type="text"
                  value={editProfession}
                  onChange={(e) => setEditProfession(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="block text-[#57534e] dark:text-[#a8a29e] mb-1">Organization / Company</label>
                <input
                  type="text"
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="block text-[#57534e] dark:text-[#a8a29e] mb-1">Current Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e2dacb] dark:border-[#2c362d]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-[#78716c] hover:bg-[#ede5d8] dark:text-[#a8a29e] dark:hover:bg-[#202721]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] text-white font-medium flex items-center gap-1.5 shadow-xs"
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
