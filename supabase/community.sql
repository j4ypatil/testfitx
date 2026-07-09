-- FitCal Community / Social Tables

-- Posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  post_type TEXT DEFAULT 'fitness',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post likes
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Post comments
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add post_type column if upgrading existing table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'fitness';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post ON post_comments(post_id);

-- Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Posts: anyone can read, only own user can insert/update/delete
CREATE POLICY IF NOT EXISTS "Anyone can read posts"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Users can create their own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- Likes: anyone can read, users can like/unlike their own
CREATE POLICY IF NOT EXISTS "Anyone can read likes"
  ON post_likes FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Users can like"
  ON post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can unlike"
  ON post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Comments: anyone can read, only own user can manage
CREATE POLICY IF NOT EXISTS "Anyone can read comments"
  ON post_comments FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Users can create their own comments"
  ON post_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own comments"
  ON post_comments FOR DELETE
  USING (auth.uid() = user_id);
