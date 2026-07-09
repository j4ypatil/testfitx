import { supabase } from './supabase.js';

const LOCAL_POSTS_KEY = 'fitx_local_posts';

function getLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_POSTS_KEY) || '[]'); } catch { return []; }
}
function setLocal(p) { localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(p)); }

export async function getPosts() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, post_likes(*), post_comments(*)')
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error) return data;
  } catch {}
  return getLocal();
}

export async function createPost(content, imageUrl = null, postType = 'fitness') {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert({ content, image_url: imageUrl, post_type: postType })
      .select()
      .single();
    if (!error) return data;
  } catch {}
  const post = {
    id: `local_${Date.now()}`,
    user_id: 'local_user',
    content, image_url: imageUrl, post_type: postType,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    post_likes: [], post_comments: [],
  };
  const all = getLocal();
  all.unshift(post);
  setLocal(all);
  return post;
}

export async function deletePost(postId) {
  if (!postId?.startsWith('local_')) {
    try { const { error } = await supabase.from('posts').delete().eq('id', postId); if (!error) return; } catch {}
  }
  const all = getLocal().filter(p => p.id !== postId);
  setLocal(all);
}

export async function toggleLike(postId, userId) {
  if (!postId?.startsWith('local_')) {
    try {
      const { data: existing } = await supabase.from('post_likes').select('id').eq('post_id', postId).eq('user_id', userId).maybeSingle();
      if (existing) { await supabase.from('post_likes').delete().eq('id', existing.id); return false; }
      else { await supabase.from('post_likes').insert({ post_id: postId, user_id: userId }); return true; }
    } catch {}
  }
  const all = getLocal();
  const post = all.find(p => p.id === postId);
  if (!post) return false;
  const idx = post.post_likes.findIndex(l => l.user_id === userId);
  if (idx >= 0) { post.post_likes.splice(idx, 1); setLocal(all); return false; }
  post.post_likes.push({ id: `like_${Date.now()}`, post_id: postId, user_id: userId, created_at: new Date().toISOString() });
  setLocal(all);
  return true;
}

export async function addComment(postId, content) {
  if (!postId?.startsWith('local_')) {
    try {
      const { data, error } = await supabase.from('post_comments').insert({ post_id: postId, content }).select().single();
      if (!error) return data;
    } catch {}
  }
  const all = getLocal();
  const post = all.find(p => p.id === postId);
  if (!post) return null;
  const comment = { id: `cmt_${Date.now()}`, post_id: postId, user_id: 'local_user', content, created_at: new Date().toISOString() };
  post.post_comments.push(comment);
  setLocal(all);
  return comment;
}

export async function deleteComment(commentId) {
  if (!commentId?.startsWith('cmt_') && !commentId?.startsWith('local_')) {
    try { const { error } = await supabase.from('post_comments').delete().eq('id', commentId); if (!error) return; } catch {}
  }
  const all = getLocal();
  for (const p of all) {
    const idx = p.post_comments.findIndex(c => c.id === commentId);
    if (idx >= 0) { p.post_comments.splice(idx, 1); setLocal(all); return; }
  }
}

export async function uploadPostImage(file) {
  try {
    const ext = file.name.split('.').pop();
    const path = `community/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('community').upload(path, file);
    if (!uploadError) {
      const { data } = supabase.storage.from('community').getPublicUrl(path);
      return data.publicUrl;
    }
  } catch {}
  return URL.createObjectURL(file);
}
