import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Zap, Flame, Trophy, Sparkles, Medal } from 'lucide-react';

const typeConfig = {
  workout_completion: { icon: Zap, label: 'Workout Complete', color: '#a1a1a6' },
  transformation: { icon: Flame, label: 'Transformation', color: '#ff9f0a' },
  challenge: { icon: Trophy, label: 'Challenge', color: '#30d158' },
  ai_avatar: { icon: Sparkles, label: 'AI Avatar', color: '#5e5ce6' },
  fitness: { icon: Medal, label: 'Fitness Update', color: '#a1a1a6' },
};

export default function PostCard({ post, currentUserId, onLike, onComment, onDelete }) {
  const liked = post.post_likes?.some(l => l.user_id === currentUserId) || false;
  const likesCount = post.post_likes?.length || 0;
  const comments = post.post_comments || [];
  const isOwn = post.user_id === currentUserId;
  const type = post.post_type || 'fitness';
  const TypeIcon = typeConfig[type]?.icon || Medal;
  const typeColor = typeConfig[type]?.color || '#a1a1a6';
  const username = post.user_email?.split('@')[0] || 'anonymous';
  const timeAgo = getTimeAgo(post.created_at);

  return (
    <div className="relative group">
      <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.08] to-transparent rounded-[28px] pointer-events-none" />
      <div className="relative bg-[rgba(28,28,30,0.6)] backdrop-blur-xl rounded-[28px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
        {/* Type badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/[0.08]">
          <TypeIcon size={10} color={typeColor} />
          <span className="text-[9px] font-semibold tracking-wide uppercase" style={{ color: typeColor }}>{typeConfig[type]?.label}</span>
        </div>

        {isOwn && (
          <button onClick={() => onDelete(post.id)} className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/[0.08] flex items-center justify-center hover:bg-white/10 transition-colors">
            <MoreHorizontal size={12} className="text-white/50" />
          </button>
        )}

        {/* User row */}
        <div className="pt-6 px-5 pb-3 flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center ring-2 ring-white/[0.12]">
              <span className="text-sm font-bold text-white/80">{username[0].toUpperCase()}</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#30d158] border-2 border-black" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white/90 truncate">{username}</p>
            <p className="text-[10px] text-white/40 font-medium">{timeAgo}</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-3">
          <p className="text-sm text-white/80 leading-relaxed">{post.content}</p>
        </div>

        {/* Media */}
        {post.image_url && (
          <div className="relative mx-3 rounded-2xl overflow-hidden bg-black/40 mb-3">
            <img src={post.image_url} alt="" className="w-full h-56 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>
        )}

        {/* Stats row */}
        <div className="px-5 pb-2 flex items-center gap-4">
          <span className="text-[11px] text-white/40 font-medium">{likesCount > 0 ? `${likesCount} likes` : ''}</span>
          <span className="text-[11px] text-white/40 font-medium">{comments.length > 0 ? `${comments.length} comments` : ''}</span>
        </div>

        {/* Actions */}
        <div className="px-5 pb-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-5">
            <button onClick={() => onLike(post.id)} className="flex items-center gap-1.5 group/btn">
              <Heart size={18} className={liked ? 'fill-[#ff453a] text-[#ff453a]' : 'text-white/40 group-hover/btn:text-white/80 transition-colors'} />
              <span className={`text-xs font-medium ${liked ? 'text-[#ff453a]' : 'text-white/40'} group-hover/btn:text-white/80 transition-colors`}>{likesCount > 0 ? likesCount : ''}</span>
            </button>
            <button onClick={() => onComment(post.id)} className="flex items-center gap-1.5 group/btn">
              <MessageCircle size={18} className="text-white/40 group-hover/btn:text-white/80 transition-colors" />
              <span className="text-xs font-medium text-white/40 group-hover/btn:text-white/80 transition-colors">{comments.length > 0 ? comments.length : ''}</span>
            </button>
            <button className="flex items-center gap-1.5 group/btn">
              <Share2 size={18} className="text-white/40 group-hover/btn:text-white/80 transition-colors" />
            </button>
          </div>
          <button className="group/btn">
            <Bookmark size={18} className="text-white/40 group-hover/btn:text-white/80 transition-colors" />
          </button>
        </div>

        {/* Comments */}
        {comments.length > 0 && (
          <div className="mx-5 pb-4 space-y-2.5 border-t border-white/[0.06] pt-3">
            {comments.slice(0, 2).map(c => (
              <div key={c.id} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[7px] font-bold text-white/60">{(c.user_email?.split('@')[0] || 'U')[0]}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-white/70">{c.user_email?.split('@')[0] || 'User'}</span>
                  <span className="text-[11px] text-white/50 ml-1.5">{c.content}</span>
                </div>
              </div>
            ))}
            {comments.length > 2 && (
              <button className="text-[11px] text-white/40 font-medium hover:text-white/60 transition-colors ml-7">
                View all {comments.length} comments
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getTimeAgo(dateStr) {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
