import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCourses, fetchCourseById, createCourse, deleteCourse, createVideo, uploadVideoFile, deleteVideoFile, CreateCourseInput } from "@/lib/api";
import { toast } from "sonner";

export interface CreateCourseWithVideoInput extends CreateCourseInput {
  video_title: string;
  video_file: File;
  video_duration_minutes?: number;
  video_description?: string;
}

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourseById(id),
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCourseWithVideoInput) => {
      // First create the course
      const course = await createCourse({
        title: input.title,
        description: input.description,
        instructor_name: input.instructor_name,
        duration_hours: input.duration_hours,
        difficulty: input.difficulty,
      });

      let uploadedPath: string | null = null;
      try {
        // Upload the video file to Supabase Storage
        const uploadRes = await uploadVideoFile({
          file: input.video_file,
          courseId: course.id,
          videoTitle: input.video_title,
        });
        uploadedPath = uploadRes.path;

        // Then create the video for the course
        await createVideo({
          course_id: course.id,
          title: input.video_title,
          video_url: uploadRes.publicUrl,
          duration_minutes: input.video_duration_minutes,
          description: input.video_description,
        });

        return course;
      } catch (err) {
        // Cleanup: remove uploaded file (if any) and the orphan course
        try {
          if (uploadedPath) {
            await deleteVideoFile(uploadedPath);
          }
        } catch (_) {
          // ignore cleanup errors
        }
        try {
          await deleteCourse(course.id);
        } catch (_) {
          // ignore cleanup errors
        }
        throw err instanceof Error ? err : new Error("Failed to create course and video");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course and video created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create course: ${error.message}`);
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete course: ${error.message}`);
    },
  });
}
