import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Bookmark, 
  Share2, 
  CheckCircle2, 
  Send,
  MoreHorizontal,
  Pin
} from 'lucide-react';
import { Post, CadetUser } from '../types';

interface PostCardProps {
  post: Post;
  currentUser: CadetUser | null;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onViewAuthorProfile?: (author: CadetUser) => void;
  onPromptAuth?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onLike,
  onBookmark,
  onAddComment,
  onVotePoll,
  onViewAuthorProfile,
  onPromptAuth,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [shareToast, setShareToast] = useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
    setShowComments(true);
  };

  const handleShare = () => {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  return (
    <article className="rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] shadow-xs overflow-hidden transition-all duration-200 hover:border-[#1b4332]/40 dark:hover:border-[#15803d]/40">
      {/* Pinned Marker */}
      {post.pinned && (
        <div className="px-5 pt-3 pb-0 flex items-center gap-1.5 text-xs text-[#1b4332] dark:text-[#4ade80] font-medium">
          <Pin className="w-3.5 h-3.5 rotate-45" />
          <span>Pinned by College Council</span>
        </div>
      )}

      {/* Header: Author & Cadet Identity */}
      <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3">
        <div 
          onClick={() => onViewAuthorProfile?.(post.author)}
          className="flex items-start gap-3 cursor-pointer group"
        >
          <div className="relative shrink-0">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-[#1b4332]/20 dark:ring-[#15803d]/30 group-hover:ring-[#1b4332]/50 dark:group-hover:ring-[#4ade80]/60 transition-all"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-[#1c1917] dark:text-[#f5f5f4] group-hover:text-[#1b4332] dark:group-hover:text-[#4ade80] transition-colors">
                {post.author.name}
              </span>
              {post.author.isVerifiedAlumnus && (
                <CheckCircle2 
                  className="w-3.5 h-3.5 text-[#c59b27] dark:text-[#eab308] shrink-0" 
                  aria-label="Verified Cadet Alumnus" 
                />
              )}
            </div>

            {/* Unboxed Metadata with Typographic Separators */}
            <div className="flex items-center gap-2 text-xs text-[#78716c] dark:text-[#a8a29e] flex-wrap mt-0.5">
              <span className="font-semibold text-[#1b4332] dark:text-[#4ade80]">
                {post.author.collegeCode} #{post.author.cadetNumber}
              </span>
              <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#57534e]">·</span>
              <span>{post.author.intake}th Intake</span>
              <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#57534e]">·</span>
              <span>{post.author.house}</span>
              <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#57534e]">·</span>
              <span className="text-[#a8a29e] dark:text-[#78716c]">{post.timestamp}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleShare}
          className="text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4] p-1.5 rounded-lg hover:bg-[#ede5d8]/70 dark:hover:bg-[#202721] transition-colors cursor-pointer shrink-0"
          aria-label="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Post Text Content */}
      <div className="px-4 sm:px-5 pb-3">
        <p className="text-sm text-[#292524] dark:text-[#e7e5e4] leading-relaxed whitespace-pre-line font-normal">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 text-xs text-[#5c3d2e] dark:text-[#fbbf24] font-medium">
            {post.tags.map((tag) => (
              <span key={tag} className="hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Image with CSS Fallback Container */}
      {post.image && (
        <div className="relative w-full bg-[#ede5d8]/40 dark:bg-[#141814] border-y border-[#e2dacb] dark:border-[#2c362d] overflow-hidden max-h-[460px]">
          <img
            src={post.image}
            alt="Cadet Post attachment"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-cover max-h-[460px] hover:scale-[1.01] transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Interactive Poll */}
      {post.poll && (
        <div className="mx-4 sm:mx-5 my-3 p-4 rounded-xl bg-[#faf6ef] dark:bg-[#141814] border border-[#e2dacb] dark:border-[#2c362d] space-y-3">
          <p className="text-xs font-semibold text-[#1c1917] dark:text-[#f5f5f4]">
            {post.poll.question}
          </p>

          <div className="space-y-2">
            {post.poll.options.map((option) => {
              const isVoted = post.poll?.userVotedId === option.id;
              const percentage = post.poll && post.poll.totalVotes > 0 
                ? Math.round((option.votes / post.poll.totalVotes) * 100) 
                : 0;

              return (
                <button
                  key={option.id}
                  onClick={() => onVotePoll(post.id, option.id)}
                  className={`w-full relative text-left p-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer overflow-hidden ${
                    isVoted
                      ? 'border-[#1b4332]/60 text-[#1b4332] bg-[#1b4332]/10 dark:border-[#15803d]/60 dark:text-[#4ade80] dark:bg-[#15803d]/20'
                      : 'border-[#e2dacb] text-[#57534e] hover:border-[#1b4332]/40 bg-white dark:border-[#2c362d] dark:text-[#d6d3d1] dark:hover:border-[#15803d]/40 dark:bg-[#1e251f]'
                  }`}
                >
                  {/* Vote Progress Bar */}
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                      isVoted ? 'bg-[#1b4332]/20 dark:bg-[#15803d]/25' : 'bg-[#ede5d8]/60 dark:bg-[#283329]/40'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {isVoted && <span className="w-1.5 h-1.5 rounded-full bg-[#1b4332] dark:bg-[#4ade80]" />}
                      {option.text}
                    </span>
                    <span className="font-mono text-[11px] text-[#78716c] dark:text-[#a8a29e] tabular-nums">
                      {percentage}% ({option.votes})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#78716c] dark:text-[#a8a29e] pt-1">
            <span>{post.poll.totalVotes.toLocaleString()} Cadets voted</span>
            <span className="font-medium text-[#5c3d2e] dark:text-[#fbbf24]">Cadet Council Polling</span>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="px-4 sm:px-5 py-2.5 border-t border-[#e2dacb] dark:border-[#2c362d] flex items-center justify-between text-[#78716c] dark:text-[#a8a29e] text-xs">
        <div className="flex items-center gap-1 sm:gap-4">
          {/* Like */}
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              post.isLiked
                ? 'text-rose-600 bg-rose-500/10'
                : 'hover:text-rose-600 hover:bg-[#ede5d8]/60 dark:hover:bg-[#202721]'
            }`}
          >
            <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500 text-rose-600' : ''}`} />
            <span className="tabular-nums font-medium">{post.likesCount}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              showComments
                ? 'text-[#1b4332] bg-[#1b4332]/10 dark:text-[#4ade80] dark:bg-[#15803d]/15'
                : 'hover:text-[#1b4332] hover:bg-[#ede5d8]/60 dark:hover:text-[#4ade80] dark:hover:bg-[#202721]'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="tabular-nums font-medium">{post.commentsCount}</span>
          </button>

          {/* Repost */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:text-[#1b4332] hover:bg-[#ede5d8]/60 dark:hover:text-[#4ade80] dark:hover:bg-[#202721] transition-colors cursor-pointer"
          >
            <Repeat2 className="w-4 h-4" />
            <span className="tabular-nums font-medium">{post.repostsCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Bookmark */}
          <button
            onClick={() => onBookmark(post.id)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              post.isSaved
                ? 'text-[#5c3d2e] bg-[#5c3d2e]/10 dark:text-[#fbbf24] dark:bg-[#b45309]/20'
                : 'hover:text-[#5c3d2e] hover:bg-[#ede5d8]/60 dark:hover:text-[#fbbf24] dark:hover:bg-[#202721]'
            }`}
            aria-label="Bookmark"
          >
            <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-[#5c3d2e] dark:fill-[#fbbf24]' : ''}`} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg hover:text-[#1c1917] hover:bg-[#ede5d8]/60 dark:hover:text-[#f5f5f4] dark:hover:bg-[#202721] transition-colors cursor-pointer"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Share Toast */}
      {shareToast && (
        <div className="px-4 py-1.5 bg-[#1b4332] dark:bg-[#15803d] text-white text-xs text-center font-medium transition-all">
          Cadet post link copied to clipboard!
        </div>
      )}

      {/* Comments Drawer / Section */}
      {showComments && (
        <div className="px-4 sm:px-5 py-3 bg-[#faf6ef] dark:bg-[#141814] border-t border-[#e2dacb] dark:border-[#2c362d] space-y-3">
          {/* New Comment Input */}
          {currentUser ? (
            <form onSubmit={handleSubmitComment} className="flex items-center gap-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-[#1b4332]/30"
              />
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a cadet comment..."
                className="flex-1 py-1.5 px-3 text-xs rounded-xl bg-white dark:bg-[#1e251f] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d] focus:ring-1 focus:ring-[#1b4332] dark:focus:ring-[#15803d]"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="p-1.5 rounded-xl bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="py-2 px-3 rounded-xl bg-white dark:bg-[#1e251f] border border-[#e2dacb] dark:border-[#2c362d] text-xs text-[#78716c] dark:text-[#a8a29e] flex items-center justify-between">
              <span>Sign in to comment on cadet posts</span>
              <button
                type="button"
                onClick={onPromptAuth}
                className="text-xs text-[#1b4332] dark:text-[#4ade80] font-semibold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Existing Comments List */}
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-2.5 pt-1">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 bg-white dark:bg-[#1e251f] p-2.5 rounded-xl border border-[#e2dacb] dark:border-[#2c362d]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[#1c1917] dark:text-[#f5f5f4]">
                        {comment.author.name}{' '}
                        <span className="text-[10px] font-normal text-[#1b4332] dark:text-[#4ade80]">
                          ({comment.author.collegeCode} #{comment.author.cadetNumber})
                        </span>
                      </span>
                      <span className="text-[10px] text-[#a8a29e]">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-[#57534e] dark:text-[#d6d3d1] leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2 text-xs text-[#78716c] dark:text-[#a8a29e] italic">
              No comments yet. Start the cadet conversation!
            </div>
          )}
        </div>
      )}
    </article>
  );
};
