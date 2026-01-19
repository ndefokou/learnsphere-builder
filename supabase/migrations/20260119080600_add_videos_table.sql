-- Create videos table for course content
CREATE TABLE public.videos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view videos (public education platform)
CREATE POLICY "Anyone can view videos" 
ON public.videos 
FOR SELECT 
USING (true);

-- Allow anyone to create videos (demo platform)
CREATE POLICY "Anyone can create videos" 
ON public.videos 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to delete videos (demo platform)
CREATE POLICY "Anyone can delete videos" 
ON public.videos 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();