/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  User as UserIcon
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
import { RecoveryScreen } from './components/RecoveryScreen';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { CrestLogo } from './components/CrestLogo';
import { useAuth, canAccessAdmin, canAccessPage } from './lib/authContext';

export default function App() {
  const { user, cadetUser, loading, signOut, isPasswordRecovery, recoveryError } = useAuth();
  const currentUser = cadetUser;

  // Navigation & User State
  const [activePage, setActivePage] = useState<ActivePage>('home');
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
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const resetUserScopedState = React.useCallback(() => {
    setViewingProfileUser(null);
    setPosts(INITIAL_POSTS);
    setStories(INITIAL_STORIES);
    setCommunities(INITIAL_COMMUNITIES);
    setConversations(INITIAL_CONVERSATIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setConnectedCadetIds(['user_2']);
    setFeedFilter('all');
    setSearchQuery('');
    setIsCreatePostOpen(false);
  }, []);

  // Account switching / session lifecycle synchronization
  const previousUserIdRef = React.useRef<string | null>(currentUser?.id ?? null);

  useEffect(() => {
    const currentId = currentUser?.id ?? null;
    const previousId = previousUserIdRef.current;

    // Detect login, logout, or account switch
    if (previousId !== currentId) {
      previousUserIdRef.current = currentId;

      // Reset all user-specific local state to prevent cross-account data leakage
      resetUserScopedState();

      // If user logged out and was on a protected page, redirect to home
      if (!currentId && !canAccessPage(activePage, null)) {
        setActivePage('home');
      }
    }
  }, [currentUser?.id, activePage, resetUserScopedState]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4efe6] text-[#1c1917] dark:bg-[#121612] dark:text-[#f5f5f4] flex flex-col items-center justify-center font-['Plus_Jakarta_Sans'] transition-colors duration-200">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <CrestLogo size="lg" />
          <span className="text-xs text-[#1b4332] dark:text-[#4ade80] font-medium tracking-wide">
            Restoring CadetVerse Session...
          </span>
        </div>
      </div>
    );
  }

  // Dedicated blocking Password Recovery screen — prevents bypassing into normal app navigation
  if (isPasswordRecovery || recoveryError) {
    return (
      <RecoveryScreen
        onRecoveryComplete={() => {
          resetUserScopedState();
          setActivePage('home');
          setAuthSuccessMessage('Password updated successfully! Please sign in with your new password.');
          setIsAuthModalOpen(true);
        }}
        onReturnToSignIn={() => {
          resetUserScopedState();
          setActivePage('home');
          setAuthSuccessMessage(null);
          setIsAuthModalOpen(true);
        }}
      />
    );
  }

  // Unread Counters
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Handlers: Navigation
  const handleNavigate = (page: ActivePage) => {
    if (isPasswordRecovery || recoveryError) {
      return;
    }
    if (page === 'admin') {
      // Authoritative role check: strictly deny non-admin and unauthenticated users
      if (!canAccessAdmin(currentUser)) {
        setActivePage('home');
        return;
      }
    }
    if (!canAccessPage(page, currentUser)) {
      setIsAuthModalOpen(true);
      return;
    }
    if (page === 'profile' && currentUser) {
      setViewingProfileUser(currentUser);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewAuthorProfile = (author: CadetUser) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setViewingProfileUser(author);
    setActivePage('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers: Post Interactions (Require Auth)
  const handleLikePost = (postId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
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
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
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
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
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
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsCreatePostOpen(true);
  };

  // Handlers: Communities
  const handleJoinCommunity = (id: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setCommunities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isJoined: !c.isJoined } : c))
    );
  };

  // Handlers: Suggested Cadet Connect
  const handleConnectCadet = (cadet: CadetUser) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (connectedCadetIds.includes(cadet.id)) {
      setConnectedCadetIds((prev) => prev.filter((id) => id !== cadet.id));
    } else {
      setConnectedCadetIds((prev) => [...prev, cadet.id, cadet.id]);
    }
  };

  // Handlers: Direct Messages
  const handleSendMessage = (conversationId: string, text: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
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

  // Handlers: Logout with confirmation & state teardown
  const handleOpenLogoutConfirmation = () => {
    setLogoutError(null);
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);
    try {
      const { error } = await signOut();
      if (error) {
        // Handle logout error without falsely reporting success
        setLogoutError(error.message || 'Failed to sign out. Please try again.');
        setIsLoggingOut(false);
        return;
      }

      // Successful logout: purge all user-specific local application state
      resetUserScopedState();

      setIsLogoutModalOpen(false);
      setIsLoggingOut(false);

      // Redirect to home and present welcome/login screen
      setActivePage('home');
      setIsAuthModalOpen(true);
    } catch (err: any) {
      setLogoutError(err?.message || 'An unexpected error occurred during logout.');
      setIsLoggingOut(false);
    }
  };

  // Filtered Posts for Home Feed
  const filteredPosts = posts.filter((p) => {
    if (feedFilter === 'college') {
      return currentUser && currentUser.collegeCode !== 'PENDING'
        ? p.collegeTag === currentUser.collegeCode
        : true;
    }
    if (feedFilter === 'intake') {
      return currentUser && currentUser.intake > 0
        ? p.intakeTag === currentUser.intake
        : true;
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
    <div className="min-h-screen bg-[#f4efe6] text-[#1c1917] dark:bg-[#121612] dark:text-[#f5f5f4] flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-[#1b4332]/20 selection:text-[#1b4332] dark:selection:bg-[#16a34a]/30 dark:selection:text-[#86efac] transition-colors duration-200">
      {/* Mobile Top Navigation */}
      <NavbarMobile
        activePage={activePage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenCreatePost={() => currentUser ? setIsCreatePostOpen(true) : setIsAuthModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleOpenLogoutConfirmation}
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
          onOpenCreatePost={() => currentUser ? setIsCreatePostOpen(true) : setIsAuthModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onSignOut={handleOpenLogoutConfirmation}
        />

        {/* Center Main Work area / Feeds */}
        <main className="flex-1 min-w-0 max-w-3xl px-3 sm:px-6 py-4 sm:py-6 space-y-6 pb-24 lg:pb-12">
          {/* View 1: Home Feed */}
          {activePage === 'home' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Cadet Stories Bar */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] shadow-xs">
                <StoriesBar
                  stories={stories}
                  currentUser={currentUser}
                  onAddStory={handleAddStory}
                />
              </div>

              {/* Quick Post Prompt Bar */}
              <div 
                onClick={() => currentUser ? setIsCreatePostOpen(true) : setIsAuthModalOpen(true)}
                className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] hover:border-[#1b4332]/50 dark:hover:border-[#15803d]/50 transition-colors shadow-xs cursor-pointer flex items-center gap-3 group"
              >
                {currentUser ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-1 ring-[#1b4332]/40 dark:ring-[#15803d]/40 shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b4332]/10 dark:bg-[#15803d]/20 border border-[#1b4332]/30 dark:border-[#15803d]/30 flex items-center justify-center text-[#1b4332] dark:text-[#4ade80] shrink-0">
                    <UserIcon className="w-5 h-5" />
                  </div>
                )}
                <div className="flex-1 py-2 px-4 rounded-xl bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#78716c] dark:text-[#a8a29e] text-xs sm:text-sm group-hover:text-[#1c1917] dark:group-hover:text-[#f5f5f4] group-hover:border-[#1b4332]/40 dark:group-hover:border-[#15803d]/40 transition-all flex items-center justify-between">
                  <span>
                    {currentUser
                      ? `What's on your mind, Cadet #${currentUser.cadetNumber}?`
                      : 'Sign in to share cadet posts and connect with batchmates...'}
                  </span>
                  <PlusSquare className="w-4 h-4 text-[#1b4332] dark:text-[#4ade80] shrink-0" />
                </div>
              </div>

              {/* Feed Filters Strip */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                {/* Segmented Filter Control */}
                <div className="flex items-center gap-1 p-1 bg-[#ede5d8]/70 dark:bg-[#141814] rounded-xl border border-[#e2dacb] dark:border-[#2c362d] text-xs font-medium">
                  <button
                    onClick={() => setFeedFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      feedFilter === 'all'
                        ? 'bg-[#1b4332] dark:bg-[#15803d] text-white shadow-xs'
                        : 'text-[#57534e] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
                    }`}
                  >
                    All Cadets
                  </button>
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        setIsAuthModalOpen(true);
                      } else {
                        setFeedFilter('college');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      feedFilter === 'college'
                        ? 'bg-[#1b4332] dark:bg-[#15803d] text-white shadow-xs'
                        : 'text-[#57534e] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
                    }`}
                  >
                    {currentUser && currentUser.collegeCode !== 'PENDING'
                      ? `My College (${currentUser.collegeCode})`
                      : 'My College'}
                  </button>
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        setIsAuthModalOpen(true);
                      } else {
                        setFeedFilter('intake');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      feedFilter === 'intake'
                        ? 'bg-[#1b4332] dark:bg-[#15803d] text-white shadow-xs'
                        : 'text-[#57534e] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
                    }`}
                  >
                    {currentUser && currentUser.intake > 0
                      ? `${currentUser.intake}th Intake`
                      : 'My Intake'}
                  </button>
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        setIsAuthModalOpen(true);
                      } else {
                        setFeedFilter('saved');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                      feedFilter === 'saved'
                        ? 'bg-[#1b4332] dark:bg-[#15803d] text-white shadow-xs'
                        : 'text-[#57534e] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Saved</span>
                  </button>
                </div>

                <span className="text-xs text-[#78716c] dark:text-[#a8a29e] font-mono hidden sm:inline">
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
                      onPromptAuth={() => setIsAuthModalOpen(true)}
                    />
                  ))
                ) : (
                  <div className="p-12 text-center rounded-2xl bg-white/70 dark:bg-[#1a201b]/70 border border-[#e2dacb] dark:border-[#2c362d] space-y-3">
                    <p className="text-sm font-semibold text-[#57534e] dark:text-[#d6d3d1]">
                      No cadet posts match your filter criteria.
                    </p>
                    <button
                      onClick={() => setFeedFilter('all')}
                      className="px-4 py-1.5 rounded-xl bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] text-white text-xs font-medium cursor-pointer shadow-xs transition-colors"
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
              onPromptAuth={() => setIsAuthModalOpen(true)}
            />
          )}

          {/* View 4: Messages (Protected) */}
          {activePage === 'messages' && (
            canAccessPage('messages', currentUser) ? (
              <MessagesView
                conversations={conversations}
                currentUser={currentUser}
                onSendMessage={handleSendMessage}
                onPromptAuth={() => setIsAuthModalOpen(true)}
              />
            ) : (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-[#1c1917] dark:text-[#f5f5f4]">Direct Messages</h3>
                <p className="text-xs text-[#78716c] dark:text-[#a8a29e] max-w-sm mx-auto">
                  Sign in to access private cadet communications.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-5 py-2 rounded-xl bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] text-white text-xs font-semibold shadow-md shadow-[#1b4332]/20 dark:shadow-green-950/40 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )
          )}

          {/* View 5: Announcements */}
          {activePage === 'announcements' && (
            <AnnouncementsView announcements={announcements} />
          )}

          {/* View 6: Profile (Protected) */}
          {activePage === 'profile' && (
            canAccessPage('profile', currentUser) && (viewingProfileUser || currentUser) ? (
              <ProfileView
                key={(viewingProfileUser || currentUser)!.id}
                user={viewingProfileUser || currentUser!}
                currentUser={currentUser}
                posts={posts}
                onLikePost={handleLikePost}
                onBookmarkPost={handleBookmarkPost}
                onAddComment={handleAddComment}
                onVotePoll={handleVotePoll}
                onUpdateUser={(updated) => {
                  setViewingProfileUser(updated);
                }}
                onSignOut={handleOpenLogoutConfirmation}
              />
            ) : (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-[#1c1917] dark:text-[#f5f5f4]">Cadet Profile</h3>
                <p className="text-xs text-[#78716c] dark:text-[#a8a29e] max-w-sm mx-auto">
                  Sign in to view your cadet profile, intake records, and alumni network.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-5 py-2 rounded-xl bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] text-white text-xs font-semibold shadow-md shadow-[#1b4332]/20 dark:shadow-green-950/40 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )
          )}

          {/* View 7: Notifications (Protected) */}
          {activePage === 'notifications' && (
            canAccessPage('notifications', currentUser) ? (
              <NotificationsView
                notifications={notifications}
                onMarkAllAsRead={handleMarkAllAsRead}
                onNotificationClick={handleNotificationClick}
              />
            ) : (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-[#1c1917] dark:text-[#f5f5f4]">Notifications</h3>
                <p className="text-xs text-[#78716c] dark:text-[#a8a29e] max-w-sm mx-auto">
                  Sign in to view your cadet activity notifications.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-5 py-2 rounded-xl bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] text-white text-xs font-semibold shadow-md shadow-[#1b4332]/20 dark:shadow-green-950/40 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )
          )}

          {/* View 8: Admin & Verification */}
          {activePage === 'admin' && (
            canAccessAdmin(currentUser) ? (
              <AdminDashboard />
            ) : (
              <div className="p-8 rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] text-center space-y-3">
                <h2 className="text-base font-bold text-[#1c1917] dark:text-[#f5f5f4]">Access Restricted</h2>
                <p className="text-xs text-[#78716c] dark:text-[#a8a29e]">
                  The Cadet College Council administration dashboard is restricted to authorized council administrators.
                </p>
              </div>
            )
          )}
        </main>

        {/* Right Desktop Sidebar */}
        <RightSidebar
          communities={communities}
          suggestedCadets={currentUser ? DEMO_USERS.filter((u) => u.id !== currentUser.id) : DEMO_USERS}
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

      {/* Real Supabase Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthSuccessMessage(null);
        }}
        initialSuccessMessage={authSuccessMessage}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => {
          if (!isLoggingOut) {
            setLogoutError(null);
            setIsLogoutModalOpen(false);
          }
        }}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
        errorMessage={logoutError}
      />
    </div>
  );
}
