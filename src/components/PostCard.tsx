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
import { Post, CadetUser, PostComment } from '../types';

interface PostCardProps {
  post: Post;
  currentUser: CadetUser;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onViewAuthorProfile?: (author: CadetUser) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onLike,
  onBookmark,
  onAddComment,
  onVotePoll,
  onViewAuthorProfile,
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
    <article className="rounded-2xl bg-[#0f1422]/90 border border-slate-800/80 shadow-md shadow-black/20 overflow-hidden transition-all duration-200 hover:border-slate-700/80">
      {/* Pinned Marker */}
      {post.pinned && (
        <div className="px-5 pt-3 pb-0 flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
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
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-400/50 transition-all"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                {post.author.name}
              </span>
              {post.author.isVerifiedAlumnus && (
                <CheckCircle2 
                  className="w-3.5 h-3.5 text-indigo-400 shrink-0" 
                  aria-label="Verified Cadet Alumnus" 
                />
              )}
            </div>

            {/* Unboxed Metadata with Typographic Separators */}
            <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap mt-0.5">
              <span className="font-medium text-indigo-300">
                {post.author.collegeCode} #{post.author.cadetNumber}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{post.author.intake}th Intake</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">{post.author.house}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-500">{post.timestamp}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleShare}
          className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer shrink-0"
          aria-label="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Post Text Content */}
      <div className="px-4 sm:px-5 pb-3">
        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-normal">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 text-xs text-indigo-400/90 font-medium">
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
        <div className="relative w-full bg-slate-900 border-y border-slate-800/80 overflow-hidden max-h-[460px]">
          <img
            src={post.image}
            alt="Cadet Post attachment"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-cover max-h-[460px] hover:scale-[1.01] transition-transform duration-300"
            onError={(e) => {
              // Graceful fallback to styled neutral gradient
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Interactive Poll */}
      {post.poll && (
        <div className="mx-4 sm:mx-5 my-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <p className="text-xs font-semibold text-slate-200">
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
                      ? 'border-indigo-500/50 text-indigo-200 bg-indigo-950/30'
                      : 'border-slate-800 text-slate-300 hover:border-slate-700 bg-slate-950/40'
                  }`}
                >
                  {/* Vote Progress Bar */}
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                      isVoted ? 'bg-indigo-600/25' : 'bg-slate-800/40'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {isVoted && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                      {option.text}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                      {percentage}% ({option.votes})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>{post.poll.totalVotes.toLocaleString()} Cadets voted</span>
            <span>Cadet Council Polling</span>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="px-4 sm:px-5 py-2.5 border-t border-slate-800/70 flex items-center justify-between text-slate-400 text-xs">
        <div className="flex items-center gap-1 sm:gap-4">
          {/* Like */}
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              post.isLiked
                ? 'text-rose-400 bg-rose-500/10'
                : 'hover:text-rose-400 hover:bg-slate-800/50'
            }`}
          >
            <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-400' : ''}`} />
            <span className="tabular-nums font-medium">{post.likesCount}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              showComments
                ? 'text-indigo-400 bg-indigo-500/10'
                : 'hover:text-indigo-400 hover:bg-slate-800/50'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="tabular-nums font-medium">{post.commentsCount}</span>
          </button>

          {/* Repost */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:text-emerald-400 hover:bg-slate-800/50 transition-colors cursor-pointer"
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
                ? 'text-indigo-400 bg-indigo-500/10'
                : 'hover:text-indigo-400 hover:bg-slate-800/50'
            }`}
            aria-label="Bookmark"
          >
            <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-indigo-400' : ''}`} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-800/50 transition-colors cursor-pointer"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Share Toast */}
      {shareToast && (
        <div className="px-4 py-1.5 bg-indigo-600 text-white text-xs text-center font-medium transition-all">
          Cadet post link copied to clipboard!
        </div>
      )}

      {/* Comments Drawer / Section */}
      {showComments && (
        <div className="px-4 sm:px-5 py-3 bg-slate-950/60 border-t border-slate-800/80 space-y-3">
          {/* New Comment Input */}
          <form onSubmit={handleSubmitComment} className="flex items-center gap-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover shrink-0"
            />
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a cadet comment..."
              className="flex-1 py-1.5 px-3 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="p-1.5 rounded-xl bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

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
                  <div className="flex-1 bg-slate-900/70 p-2.5 rounded-xl border border-slate-800/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200">
                        {comment.author.name}{' '}
                        <span className="text-[10px] font-normal text-indigo-400">
                          ({comment.author.collegeCode} #{comment.author.cadetNumber})
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2 text-xs text-slate-500 italic">
              No comments yet. Start the cadet conversation!
            </div>
          )}
        </div>
      )}
    </article>
  );
};
