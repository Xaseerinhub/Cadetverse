/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Filter, 
  PlusSquare, 
  Users, 
  Bookmark, 
  Layers, 
  MessageCircle, 
  Search,
  CheckCircle2,
  Bell,
  ArrowRight
} from 'lucide-react';
import { 
  CadetUser, 
  Post, 
  Story, 
  Community, 
  ChatConversation, 
  Announcement, 
  NotificationItem, 
  DirectMessage,
  PostComment
} from './types';
import { 
  DEMO_USERS, 
  INITIAL_POSTS, 
  INITIAL_STORIES, 
  INITIAL_COMMUNITIES, 
  INITIAL_CONVERSATIONS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { NavbarDesktop, ActivePage } from './components/NavbarDesktop';
import { NavbarMobile } from './components/NavbarMobile';
import { RightSidebar } from './components/RightSidebar';
import { StoriesBar } from './components/StoriesBar';
import { PostCard } from './components/PostCard';
import { CreatePostModal } from './components/CreatePostModal';
import { ExploreGrid } from './components/ExploreGrid';
import { CommunitiesView } from './components/CommunitiesView';
import { MessagesView } from './components/MessagesView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { ProfileView } from './components/ProfileView';
import { NotificationsView } from './components/NotificationsView';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';

export default function App() {
  // Navigation & User State
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [currentUser, setCurrentUser] = useState<CadetUser>(DEMO_USERS[0]);
  const [viewingProfileUser, setViewingProfileUser] = useState<CadetUser | null>(null);

  // Core Data State
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [communities, setCommunities] = useState<Community[]>(INITIAL_COMMUNITIES);
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [connectedCadetIds, setConnectedCadetIds] = useState<string[]>(['user_2']);

  // UI Modals & Filters
  const [feedFilter, setFeedFilter] = useState<'all' | 'college' | 'intake' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Unread Counters
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Handlers: Navigation
  const handleNavigate = (page: ActivePage) => {
    if (page === 'profile') {
      setViewingProfileUser(currentUser);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewAuthorProfile = (author: CadetUser) => {
    setViewingProfileUser(author);
    setActivePage('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers: Post Interactions
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    const newComment: PostComment = {
      id: `c_${Date.now()}`,
      author: currentUser,
      text,
      timestamp: 'Just now',
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [newComment, ...(p.comments || [])],
          };
        }
        return p;
      })
    );
  };

  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.poll) {
          if (p.poll.userVotedId === optionId) return p;
          
          const hadPreviousVote = !!p.poll.userVotedId;
          const updatedOptions = p.poll.options.map((opt) => {
            if (opt.id === optionId) {
              return { ...opt, votes: opt.votes + 1 };
            }
            if (opt.id === p.poll?.userVotedId) {
              return { ...opt, votes: Math.max(0, opt.votes - 1) };
            }
            return opt;
          });

          return {
            ...p,
            poll: {
              ...p.poll,
              options: updatedOptions,
              totalVotes: hadPreviousVote ? p.poll.totalVotes : p.poll.totalVotes + 1,
              userVotedId: optionId,
            },
          };
        }
        return p;
      })
    );
  };

  // Handlers: Create Post
  const handleCreatePost = (newPostData: Omit<Post, 'id' | 'timestamp' | 'likesCount' | 'commentsCount' | 'repostsCount' | 'isLiked' | 'isSaved' | 'comments'>) => {
    const created: Post = {
      ...newPostData,
      id: `post_${Date.now()}`,
      timestamp: 'Just now',
      likesCount: 0,
      commentsCount: 0,
      repostsCount: 0,
      isLiked: false,
      isSaved: false,
      comments: [],
    };
    setPosts([created, ...posts]);
  };

  // Handlers: Story
  const handleAddStory = () => {
    setIsCreatePostOpen(true);
  };

  // Handlers: Communities
  const handleJoinCommunity = (id: string) => {
    setCommunities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isJoined: !c.isJoined } : c))
    );
  };

  // Handlers: Suggested Cadet Connect
  const handleConnectCadet = (cadet: CadetUser) => {
    if (connectedCadetIds.includes(cadet.id)) {
      setConnectedCadetIds((prev) => prev.filter((id) => id !== cadet.id));
    } else {
      setConnectedCadetIds((prev) => [...prev, cadet.id]);
    }
  };

  // Handlers: Direct Messages
  const handleSendMessage = (conversationId: string, text: string) => {
    const newMessage: DirectMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromMe: true,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      })
    );
  };

  // Handlers: Notifications
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Filtered Posts for Home Feed
  const filteredPosts = posts.filter((p) => {
    if (feedFilter === 'college') {
      return p.collegeTag === currentUser.collegeCode;
    }
    if (feedFilter === 'intake') {
      return p.intakeTag === currentUser.intake;
    }
    if (feedFilter === 'saved') {
      return p.isSaved;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.content.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        (p.collegeTag && p.collegeTag.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#090d16] text-[#e2e8f0] flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Mobile Top Navigation */}
      <NavbarMobile
        activePage={activePage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Desktop Layout Container */}
      <div className="flex-1 max-w-[1520px] w-full mx-auto flex justify-between">
        {/* Left Desktop Sidebar Navigation */}
        <NavbarDesktop
          activePage={activePage}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          unreadMessagesCount={unreadMessagesCount}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenCreatePost={() => setIsCreatePostOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* Center Main Work area / Feeds */}
        <main className="flex-1 min-w-0 max-w-3xl px-3 sm:px-6 py-4 sm:py-6 space-y-6 pb-24 lg:pb-12">
          {/* View 1: Home Feed */}
          {activePage === 'home' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Cadet Stories Bar */}
              <div className="p-4 rounded-2xl bg-[#0e1424]/90 border border-slate-800/80 shadow-md">
                <StoriesBar
                  stories={stories}
                  currentUser={currentUser}
                  onAddStory={handleAddStory}
                />
              </div>

              {/* Quick Post Prompt Bar */}
              <div 
                onClick={() => setIsCreatePostOpen(true)}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#0f1422] border border-slate-800/80 hover:border-slate-700 transition-colors shadow-sm cursor-pointer flex items-center gap-3 group"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-1 ring-indigo-500/40"
                />
                <div className="flex-1 py-2 px-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-400 text-xs sm:text-sm group-hover:text-slate-300 group-hover:border-slate-700 transition-all flex items-center justify-between">
                  <span>What's on your mind, Cadet #{currentUser.cadetNumber}?</span>
                  <PlusSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                </div>
              </div>

              {/* Feed Filters Strip */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                {/* Segmented Filter Control */}
                <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800/90 text-xs font-medium">
                  <button
                    onClick={() => setFeedFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      feedFilter === 'all'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All Cadets
                  </button>
                  <button
                    onClick={() => setFeedFilter('college')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      feedFilter === 'college'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    My College ({currentUser.collegeCode})
                  </button>
                  <button
                    onClick={() => setFeedFilter('intake')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      feedFilter === 'intake'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {currentUser.intake}th Intake
                  </button>
                  <button
                    onClick={() => setFeedFilter('saved')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                      feedFilter === 'saved'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Saved</span>
                  </button>
                </div>

                <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                  Showing {filteredPosts.length} Cadet Posts
                </span>
              </div>

              {/* Posts Stream */}
              <div className="space-y-4">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onLike={handleLikePost}
                      onBookmark={handleBookmarkPost}
                      onAddComment={handleAddComment}
                      onVotePoll={handleVotePoll}
                      onViewAuthorProfile={handleViewAuthorProfile}
                    />
                  ))
                ) : (
                  <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                    <p className="text-sm font-semibold text-slate-300">
                      No cadet posts match your filter criteria.
                    </p>
                    <button
                      onClick={() => setFeedFilter('all')}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 cursor-pointer"
                    >
                      Reset to All Cadets Feed
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* View 2: Explore Photo Grid */}
          {activePage === 'explore' && <ExploreGrid />}

          {/* View 3: Communities & Global Lounge */}
          {activePage === 'communities' && (
            <CommunitiesView
              communities={communities}
              currentUser={currentUser}
              onJoinCommunity={handleJoinCommunity}
            />
          )}

          {/* View 4: Messages */}
          {activePage === 'messages' && (
            <MessagesView
              conversations={conversations}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
            />
          )}

          {/* View 5: Announcements */}
          {activePage === 'announcements' && (
            <AnnouncementsView announcements={announcements} />
          )}

          {/* View 6: Profile */}
          {activePage === 'profile' && (
            <ProfileView
              user={viewingProfileUser || currentUser}
              currentUser={currentUser}
              posts={posts}
              onLikePost={handleLikePost}
              onBookmarkPost={handleBookmarkPost}
              onAddComment={handleAddComment}
              onVotePoll={handleVotePoll}
              onUpdateUser={(updated) => {
                setCurrentUser(updated);
                setViewingProfileUser(updated);
              }}
            />
          )}

          {/* View 7: Notifications */}
          {activePage === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllAsRead}
              onNotificationClick={handleNotificationClick}
            />
          )}

          {/* View 8: Admin & Verification */}
          {activePage === 'admin' && <AdminDashboard />}
        </main>

        {/* Right Desktop Sidebar */}
        <RightSidebar
          communities={communities}
          suggestedCadets={DEMO_USERS.filter((u) => u.cadetNumber !== currentUser.cadetNumber)}
          onNavigate={handleNavigate}
          onJoinCommunity={handleJoinCommunity}
          onConnectCadet={handleConnectCadet}
          connectedIds={connectedCadetIds}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        currentUser={currentUser}
        onSubmitPost={handleCreatePost}
      />

      {/* Auth & Persona Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={(u) => {
          setCurrentUser(u);
          setViewingProfileUser(u);
        }}
        onRegisterUser={(newU) => {
          setCurrentUser(newU);
          setViewingProfileUser(newU);
        }}
      />
    </div>
  );
}
