import { useState, useEffect } from 'react';
import { Search, Bell, Plus, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getPosts, toggleLike, addComment, deletePost } from '../../utils/community.js';
import PostCard from './PostCard.jsx';
import CreatePostModal from './CreatePostModal.jsx';

const categories = ['For You', 'Following', 'Challenges', 'Progress', 'Groups'];

const mockPosts = [
  {
    id: 'mock-1', user_id: 'mock', user_email: 'sarah.fit@example.com',
    content: 'Just crushed a new deadlift PR! 315lbs x 5 🔥 Consistency is key. 8 weeks of dedicated training paying off.',
    post_type: 'workout_completion', image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
    post_likes: [{ user_id: 'mock2' }, { user_id: 'mock3' }, { user_id: 'mock4' }, { user_id: 'mock5' }, { user_id: 'mock6' }],
    post_comments: [
      { id: 'c1', user_email: 'jake.fitness@example.com', content: 'Beast mode! That form looks clean 💪' },
      { id: 'c2', user_email: 'emma.train@example.com', content: 'Let me get that program!' },
    ],
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'mock-2', user_id: 'mock2', user_email: 'jake.fitness@example.com',
    content: 'My 90-day transformation is just getting started. Down 12lbs and feeling incredible. Trust the process!',
    post_type: 'transformation', image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
    post_likes: [{ user_id: 'mock' }, { user_id: 'mock3' }, { user_id: 'mock4' }],
    post_comments: [
      { id: 'c3', user_email: 'sarah.fit@example.com', content: 'Amazing progress! What diet plan are you following?' },
    ],
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'mock-3', user_id: 'mock3', user_email: 'alex.move@example.com',
    content: '30-day ab challenge - Day 21! Who else is in? Let\'s finish strong together.',
    post_type: 'challenge', image_url: null,
    post_likes: [{ user_id: 'mock' }, { user_id: 'mock4' }, { user_id: 'mock5' }, { user_id: 'mock6' }, { user_id: 'mock7' }],
    post_comments: [],
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'mock-4', user_id: 'mock4', user_email: 'emma.train@example.com',
    content: 'My AI fitness twin says I\'m optimized for hypertrophy phase. Let\'s see what this cycle brings!',
    post_type: 'ai_avatar', image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
    post_likes: [{ user_id: 'mock' }, { user_id: 'mock2' }],
    post_comments: [
      { id: 'c4', user_email: 'alex.move@example.com', content: 'The AI recommendations are unreal. My split is completely dialed now.' },
      { id: 'c5', user_email: 'sarah.fit@example.com', content: 'Wait how do I get this feature?' },
    ],
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'mock-5', user_id: 'mock5', user_email: 'marcus.lift@example.com',
    content: 'Morning run in the books. 5k at 6:30 pace. There\'s something special about training while the world sleeps.',
    post_type: 'fitness', image_url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600',
    post_likes: [],
    post_comments: [],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [commentingOn, setCommentingOn] = useState(null);
  const [commentText, setCommentText] = useState('');

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      const combined = [...(data || []), ...mockPosts];
      combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPosts(combined);
    } catch {
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const handleLike = async (postId) => {
    if (postId.startsWith('mock-')) return;
    try {
      await toggleLike(postId, user?.id);
      loadPosts();
    } catch {}
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      await addComment(postId, commentText.trim());
      setCommentText('');
      setCommentingOn(null);
      loadPosts();
    } catch {}
  };

  const handleDelete = async (postId) => {
    if (postId.startsWith('mock-')) return;
    try { await deletePost(postId); loadPosts(); } catch {}
  };

  if (!user) return null;

  return (
    <div className="relative min-h-screen">
      {/* Gradient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#000000] via-[#0a0a0a] to-[#121212] pointer-events-none" />

      <div className="relative z-10 pb-32">
        {/* Header */}
        <div className="sticky top-0 z-20 pt-6 pb-3 px-5 bg-gradient-to-b from-[#000000] to-transparent backdrop-blur-xl">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-[28px] font-bold text-white/90 tracking-tight">Community</h1>
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-colors">
                <Search size={16} className="text-white/50" />
              </button>
              <button className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-colors relative">
                <Bell size={16} className="text-white/50" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#ff453a] text-white text-[8px] font-bold flex items-center justify-center border-2 border-[#000000]">
                  3
                </span>
              </button>
            </div>
          </div>
          <p className="text-[11px] text-white/30 font-medium tracking-wide">Connect. Compete. Transform.</p>
        </div>

        {/* Category tabs */}
        <div className="sticky top-[88px] z-20 pb-3 pt-1 px-5 bg-gradient-to-b from-[#000000] to-transparent backdrop-blur-xl">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-5 px-5">
            {categories.map((cat, i) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(i)}
                className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold tracking-wide border transition-all ${
                  activeCategory === i
                    ? 'bg-white text-black border-white'
                    : 'bg-white/[0.03] text-white/50 border-white/[0.06] hover:bg-white/[0.06] hover:text-white/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Feed */}
        <div className="px-4 space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="w-6 h-6 border-[1.5px] border-white/20 border-t-white/80 rounded-full animate-spin" />
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                <MessageSquare size={22} className="text-white/20" />
              </div>
              <p className="text-white/30 text-sm font-medium">No posts yet. Be the first!</p>
            </div>
          )}

          {!loading && posts.map(post => (
            <div key={post.id}>
              <PostCard
                post={post}
                currentUserId={user?.id}
                onLike={handleLike}
                onComment={(id) => setCommentingOn(commentingOn === id ? null : id)}
                onDelete={handleDelete}
              />
              {commentingOn === post.id && (
                <div className="flex items-center gap-2 mt-2 ml-4 mr-4">
                  <div className="flex-1 relative">
                    <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.06] to-transparent rounded-2xl pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                      className="relative w-full bg-black/40 border border-white/[0.06] rounded-2xl px-4 py-2.5 text-xs text-white/80 outline-none focus:border-white/20 transition-colors placeholder:text-white/20"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={() => handleAddComment(post.id)}
                    disabled={!commentText.trim()}
                    className="px-4 py-2.5 rounded-2xl bg-white/10 text-white/70 text-xs font-semibold disabled:opacity-30 hover:bg-white/20 transition-all"
                  >
                    Post
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-24 right-5 z-30 w-[52px] h-[52px] rounded-full bg-white text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)] flex items-center justify-center hover:bg-white/90 hover:scale-105 active:scale-95 transition-all"
      >
        <Plus size={22} strokeWidth={2.5} />
      </button>

      {showCreate && (
        <CreatePostModal
          onClose={() => setShowCreate(false)}
          onCreated={() => loadPosts()}
        />
      )}
    </div>
  );
}
