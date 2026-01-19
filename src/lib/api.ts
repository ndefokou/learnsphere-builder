import { supabase } from "@/integrations/supabase/client";
const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'course-videos';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  instructor_name: string | null;
  duration_hours: number | null;
  difficulty: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  course_id: string;
  title: string;
  video_url: string;
  duration_minutes: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCourseInput {
  title: string;
  description?: string;
  instructor_name?: string;
  duration_hours?: number;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
}

export interface CreateVideoInput {
  course_id: string;
  title: string;
  video_url: string;
  duration_minutes?: number;
  description?: string;
}

export interface UploadVideoFileInput {
  file: File;
  courseId: string;
  videoTitle: string;
}
export interface UploadVideoResult {
  publicUrl: string;
  path: string;
}

function withTimeout<T>(promise: Promise<T>, ms: number, action: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Request timed out while ${action}`)), ms)
    ),
  ]) as Promise<T>;
}

// Fetch all courses
export async function fetchCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// Fetch a single course by ID
export async function fetchCourseById(id: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Create a new course
export async function createCourse(input: CreateCourseInput): Promise<Course> {
  const { data, error } = await withTimeout(
    (async () =>
      await supabase
        .from("courses")
        .insert([input])
        .select()
        .single())(),
    30000,
    "creating course"
  );

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Delete a course
export async function deleteCourse(id: string): Promise<void> {
  const { error } = await withTimeout(
    (async () =>
      await supabase.from("courses").delete().eq("id", id))(),
    15000,
    "deleting course"
  );

  if (error) {
    throw new Error(error.message);
  }
}

// Create a new video
export async function createVideo(input: CreateVideoInput): Promise<Video> {
  const { data, error } = await withTimeout(
    (async () =>
      await supabase
        .from("videos")
        .insert([input])
        .select()
        .single())(),
    30000,
    "creating video"
  );

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Fetch videos for a course
export async function fetchVideosByCourseId(courseId: string): Promise<Video[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("course_id", courseId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// Upload video file to Supabase Storage
export async function uploadVideoFile(input: UploadVideoFileInput): Promise<UploadVideoResult> {
  const fileExt = input.file.name.split('.').pop();
  const fileName = `${input.courseId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const timeoutMs = Number(import.meta.env.VITE_STORAGE_UPLOAD_TIMEOUT_MS ?? '0') || (10 * 60 * 1000);
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Upload timed out after ${Math.floor(timeoutMs / 1000)}s`)), timeoutMs)
  );

  const uploadPromise = supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, input.file, {
      contentType: input.file.type || 'application/octet-stream',
      cacheControl: '3600',
      upsert: false,
    });

  type UploadResp = { data: { path: string } | null; error: { message: string } | null };
  const uploadResult = (await Promise.race([uploadPromise, timeoutPromise])) as UploadResp;

  if (uploadResult && uploadResult.error) {
    throw new Error(`Failed to upload video to bucket "${STORAGE_BUCKET}": ${uploadResult.error.message}`);
  }

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  if (!data.publicUrl) {
    throw new Error(`Failed to get public URL for uploaded video from bucket "${STORAGE_BUCKET}"`);
  }

  return { publicUrl: data.publicUrl, path: filePath };
}

export async function deleteVideoFile(path: string): Promise<void> {
  const { error } = await withTimeout(
    (async () =>
      await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([path]))(),
    15000,
    "deleting video file"
  );

  if (error) {
    throw new Error(`Failed to delete video file: ${error.message}`);
  }
}
