-- =============================================
-- Supabase Schema for HopeEngineer Hub
-- Run this in the Supabase SQL Editor
-- =============================================

-- 1. Blog Posts table
create table if not exists blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text,
  category text,
  image_url text,
  author_name text default 'HopeEngineer',
  author_id text,
  date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Contacts table (for the contact form / inbox)
create table if not exists contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- 3. Profiles table (optional, for user metadata)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  display_name text,
  avatar_url text,
  role text default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
alter table blog_posts enable row level security;
alter table contacts enable row level security;
alter table profiles enable row level security;

-- Blog Posts: public read, admin write
create policy "Blog posts are publicly readable"
  on blog_posts for select
  using (true);

create policy "Admin can insert blog posts"
  on blog_posts for insert
  with check (auth.jwt() ->> 'email' = 'csoft.sameera@gmail.com');

create policy "Admin can update blog posts"
  on blog_posts for update
  using (auth.jwt() ->> 'email' = 'csoft.sameera@gmail.com');

create policy "Admin can delete blog posts"
  on blog_posts for delete
  using (auth.jwt() ->> 'email' = 'csoft.sameera@gmail.com');

-- Contacts: anyone can insert (submit form), admin can read/update/delete
create policy "Anyone can submit a contact message"
  on contacts for insert
  with check (true);

create policy "Admin can read contacts"
  on contacts for select
  using (auth.jwt() ->> 'email' = 'csoft.sameera@gmail.com');

create policy "Admin can update contacts"
  on contacts for update
  using (auth.jwt() ->> 'email' = 'csoft.sameera@gmail.com');

create policy "Admin can delete contacts"
  on contacts for delete
  using (auth.jwt() ->> 'email' = 'csoft.sameera@gmail.com');

-- Profiles: users can read/update their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Admin can view all profiles
create policy "Admin can view all profiles"
  on profiles for select
  using (auth.jwt() ->> 'email' = 'csoft.sameera@gmail.com');
