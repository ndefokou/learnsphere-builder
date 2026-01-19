-- Create courses table for the e-learning platform
CREATE TABLE public.courses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    instructor_name TEXT DEFAULT 'Unknown Instructor',
    duration_hours INTEGER DEFAULT 1,
    difficulty TEXT DEFAULT 'Beginner' CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view courses (public education platform)
CREATE POLICY "Anyone can view courses" 
ON public.courses 
FOR SELECT 
USING (true);

-- Allow anyone to create courses (demo platform)
CREATE POLICY "Anyone can create courses" 
ON public.courses 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to delete courses (demo platform)
CREATE POLICY "Anyone can delete courses" 
ON public.courses 
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
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample seed data
INSERT INTO public.courses (title, description, instructor_name, duration_hours, difficulty) VALUES
('Introduction to Web Development', 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.', 'Sarah Johnson', 12, 'Beginner'),
('Python for Data Science', 'Master Python programming with a focus on data analysis and visualization.', 'Michael Chen', 20, 'Intermediate'),
('UI/UX Design Fundamentals', 'Design beautiful and user-friendly interfaces using modern design principles.', 'Emma Williams', 8, 'Beginner'),
('Advanced React Patterns', 'Deep dive into advanced React concepts including hooks, context, and performance optimization.', 'David Miller', 15, 'Advanced'),
('Machine Learning Basics', 'Introduction to machine learning algorithms and their practical applications.', 'Dr. Lisa Park', 25, 'Intermediate');