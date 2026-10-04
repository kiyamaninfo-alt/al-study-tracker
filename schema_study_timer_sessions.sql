-- =========================================================================
-- SUPABASE TABLE FOR STUDY TIMER SESSIONS (OFFLINE-FIRST SYNC ARCHITECTURE)
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- =========================================================================

-- Ensure pgcrypto extension is enabled for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create table public.study_timer_sessions
CREATE TABLE IF NOT EXISTS public.study_timer_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    unit_number INTEGER DEFAULT 0,
    unit_name TEXT,
    timer_start_date DATE NOT NULL,
    timer_start_time TIME,
    timer_stop_date DATE,
    timer_stop_time TIME,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER NOT NULL DEFAULT 50,
    status TEXT DEFAULT 'completed',
    session_date DATE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- In case table already existed with missing columns or different types, ensure columns exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='study_timer_sessions' AND column_name='start_time') THEN
        ALTER TABLE public.study_timer_sessions ADD COLUMN start_time TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='study_timer_sessions' AND column_name='end_time') THEN
        ALTER TABLE public.study_timer_sessions ADD COLUMN end_time TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='study_timer_sessions' AND column_name='session_date') THEN
        ALTER TABLE public.study_timer_sessions ADD COLUMN session_date DATE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='study_timer_sessions' AND column_name='unit_number') THEN
        ALTER TABLE public.study_timer_sessions ADD COLUMN unit_number INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='study_timer_sessions' AND column_name='unit_name') THEN
        ALTER TABLE public.study_timer_sessions ADD COLUMN unit_name TEXT;
    END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_study_timer_sessions_timer_start_date 
ON public.study_timer_sessions (timer_start_date DESC);

CREATE INDEX IF NOT EXISTS idx_study_timer_sessions_subject 
ON public.study_timer_sessions (subject);

-- Enable Row Level Security (RLS)
ALTER TABLE public.study_timer_sessions ENABLE ROW LEVEL SECURITY;

-- Clean existing policies if re-running
DROP POLICY IF EXISTS "Public Select study_timer_sessions" ON public.study_timer_sessions;
DROP POLICY IF EXISTS "Public Insert study_timer_sessions" ON public.study_timer_sessions;
DROP POLICY IF EXISTS "Public Update study_timer_sessions" ON public.study_timer_sessions;
DROP POLICY IF EXISTS "Public Delete study_timer_sessions" ON public.study_timer_sessions;

-- Policies allowing public/anon and authenticated roles to SELECT, INSERT, UPDATE, and DELETE
CREATE POLICY "Public Select study_timer_sessions" 
ON public.study_timer_sessions 
FOR SELECT 
TO public, anon, authenticated 
USING (true);

CREATE POLICY "Public Insert study_timer_sessions" 
ON public.study_timer_sessions 
FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Public Update study_timer_sessions" 
ON public.study_timer_sessions 
FOR UPDATE 
TO public, anon, authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public Delete study_timer_sessions" 
ON public.study_timer_sessions 
FOR DELETE 
TO public, anon, authenticated 
USING (true);
