import { useState, useRef } from 'react';
import { X, Image, Zap, Flame, Trophy, Sparkles, Medal } from 'lucide-react';
import { createPost, uploadPostImage } from '../../utils/community.js';

const postTypes = [
  { value: 'fitness', label: 'Fitness Update', icon: Medal, color: '#a1a1a6' },
  { value: 'workout_completion', label: 'Workout Complete', icon: Zap, color: '#a1a1a6' },
  { value: 'transformation', label: 'Transformation', icon: Flame, color: '#ff9f0a' },
  { value: 'challenge', label: 'Challenge', icon: Trophy, color: '#30d158' },
  { value: 'ai_avatar', label: 'AI Avatar', icon: Sparkles, color: '#5e5ce6' },
];

export default function CreatePostModal({ onClose, onCreated }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [postType, setPostType] = useState('fitness');
  const fileRef = useRef(null);

  const handleImagePick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImage(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setBusy(true);
    try {
      let imageUrl = null;
      if (image) imageUrl = await uploadPostImage(image);
      const post = await createPost(content.trim(), imageUrl, postType);
      onCreated(post);
      onClose();
    } catch (err) {
      alert('Failed to post: ' + err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="w-full max-w-md bg-[#1c1c1e] rounded-t-[32px] sm:rounded-[32px] p-6 pb-10 border border-white/[0.06] shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <X size={16} className="text-white/50" />
          </button>
          <h2 className="text-white/90 font-bold text-base">New Post</h2>
          <div className="w-8" />
        </div>

        {/* Post type selector */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide -mx-6 px-6">
          {postTypes.map(t => {
            const Icon = t.icon;
            const active = postType === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setPostType(t.value)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-semibold border transition-all ${
                  active
                    ? 'bg-white/10 text-white border-white/20'
                    : 'bg-white/[0.03] text-white/40 border-white/[0.06] hover:bg-white/5'
                }`}
              >
                <Icon size={12} color={active ? t.color : undefined} />
                {t.label}
              </button>
            );
          })}
        </div>

        <textarea
          placeholder="Share your fitness journey..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-black/40 border border-white/[0.06] rounded-2xl p-4 text-white/80 text-sm outline-none focus:border-white/20 transition-colors placeholder:text-white/20 resize-none h-28"
          autoFocus
        />

        {imagePreview && (
          <div className="relative mt-3">
            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.08] to-transparent rounded-2xl pointer-events-none" />
            <div className="relative bg-black/40 rounded-2xl overflow-hidden">
              <img src={imagePreview} alt="" className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <button
              onClick={() => { setImage(null); setImagePreview(''); }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X size={12} className="text-white/70" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-colors"
          >
            <Image size={15} className="text-white/40" />
            <span className="text-xs text-white/50 font-medium">Add Photo</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />

          <button
            onClick={handleSubmit}
            disabled={busy || !content.trim()}
            className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-sm disabled:opacity-30 hover:bg-white/90 transition-all"
          >
            {busy ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
