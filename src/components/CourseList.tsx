import { useCourses } from "@/hooks/useCourses";
import { CourseCard } from "./CourseCard";
import { Loader2, BookX } from "lucide-react";

export function CourseList() {
  const { data: courses, isLoading, error } = useCourses();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-destructive">
        <BookX className="mb-2 h-12 w-12 opacity-50" />
        <p className="text-lg font-medium">Failed to load courses</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
        <BookX className="mb-2 h-12 w-12 opacity-50" />
        <p className="text-lg font-medium">No courses available</p>
        <p className="text-sm">Create your first course to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, index) => (
        <CourseCard key={course.id} course={course} index={index} />
      ))}
    </div>
  );
}
