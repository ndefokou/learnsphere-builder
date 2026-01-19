import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
}

export function useEnrollments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["enrollments", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data as Enrollment[];
    },
    enabled: !!user,
  });
}

export function useEnrollment(courseId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["enrollment", courseId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();

      if (error) throw error;
      return data as Enrollment | null;
    },
    enabled: !!user && !!courseId,
  });
}

export function useEnrollInCourse() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error("Must be logged in to enroll");

      const { data, error } = await supabase
        .from("enrollments")
        .insert([{ user_id: user.id, course_id: courseId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] });
      toast.success("Successfully enrolled in course!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to enroll: ${error.message}`);
    },
  });
}

export function useUnenrollFromCourse() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error("Must be logged in to unenroll");

      const { error } = await supabase
        .from("enrollments")
        .delete()
        .eq("user_id", user.id)
        .eq("course_id", courseId);

      if (error) throw error;
    },
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] });
      toast.success("Successfully unenrolled from course");
    },
    onError: (error: Error) => {
      toast.error(`Failed to unenroll: ${error.message}`);
    },
  });
}
