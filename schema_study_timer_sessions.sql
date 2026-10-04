-- =========================================================================
-- SUPABASE TABLE FOR STUDY TIMER SESSIONS
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.study_timer_sessions (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    unit_number INTEGER,
    unit_name TEXT,
    timer_start_date DATE NOT NULL,
    timer_start_time TIME NOT NULL,
    timer_stop_date DATE NOT NULL,
    timer_stop_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.study_timer_sessions ENABLE ROW LEVEL SECURITY;

-- Allow public read and write access for Study Tracker anonymous key
CREATE POLICY "Public Read study_timer_sessions" 
ON public.study_timer_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Public Insert study_timer_sessions" 
ON public.study_timer_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update study_timer_sessions" 
ON public.study_timer_sessions 
FOR UPDATE 
USING (true);

CREATE POLICY "Public Delete study_timer_sessions" 
ON public.study_timer_sessions 
FOR DELETE 
USING (true);

-- Helpful index for fast date queries
CREATE INDEX IF NOT EXISTS idx_study_timer_sessions_start_date 
ON public.study_timer_sessions (timer_start_date DESC);
