-- Create storage bucket for video uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-videos',
  'course-videos',
  true,
  524288000, -- 500MB file size limit
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
);

-- Allow public access to read files from the bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'course-videos');

-- Allow authenticated users to upload videos
CREATE POLICY "Authenticated users can upload videos" ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'course-videos' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own videos
CREATE POLICY "Authenticated users can update own videos" ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'course-videos' 
  AND auth.uid() = owner
);