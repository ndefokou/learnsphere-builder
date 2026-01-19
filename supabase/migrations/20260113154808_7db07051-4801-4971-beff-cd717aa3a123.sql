-- Create enrollments table
CREATE TABLE public.enrollments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Users can view their own enrollments
CREATE POLICY "Users can view their own enrollments"
ON public.enrollments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can enroll themselves
CREATE POLICY "Users can enroll themselves"
ON public.enrollments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can unenroll themselves
CREATE POLICY "Users can unenroll themselves"
ON public.enrollments
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);