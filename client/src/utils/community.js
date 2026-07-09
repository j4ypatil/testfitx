import { supabase } from './supabase.js';

export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, post_likes(*), post_comments(*)')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

export async function createPost(content, imageUrl = null, postType = 'fitness') {
  const { data, error } = await supabase
    .from('posts')
    .insert({ content, image_url: imageUrl, post_type: postType })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePost(postId) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);
  if (error) throw error;
}

export async function toggleLike(postId, userId) {
  const { data: existing } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('id', existing.id);
    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from('post_likes')
      .insert({ post_id: postId, user_id: userId });
    if (error) throw error;
    return true;
  }
}

export async function addComment(postId, content) {
  const { data, error } = await supabase
    .from('post_comments')
    .insert({ post_id: postId, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteComment(commentId) {
  const { error } = await supabase
    .from('post_comments')
    .delete()
    .eq('id', commentId);
  if (error) throw error;
}

export async function uploadPostImage(file) {
  const ext = file.name.split('.').pop();
  const path = `community/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from('community')
    .upload(path, file);
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('community').getPublicUrl(path);
  return data.publicUrl;
}
