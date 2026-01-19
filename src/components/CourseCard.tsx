import { Clock, GraduationCap, Trash2, User, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Course } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDeleteCourse } from "@/hooks/useCourses";
import { useEnrollment, useEnrollInCourse } from "@/hooks/useEnrollments";
import { useAuth } from "@/hooks/useAuth";

interface CourseCardProps {
  course: Course;
  index: number;
}

const difficultyColors: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Intermediate: "bg-amber-100 text-amber-700 border-amber-200",
  Advanced: "bg-rose-100 text-rose-700 border-rose-200",
};

const courseImages = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop",
];

export function CourseCard({ course, index }: CourseCardProps) {
  const deleteMutation = useDeleteCourse();
  const enrollMutation = useEnrollInCourse();
  const { data: enrollment, isLoading: enrollmentLoading } = useEnrollment(course.id);
  const { isAuthenticated } = useAuth();
  
  const imageUrl = course.image_url || courseImages[index % courseImages.length];
  const isEnrolled = !!enrollment;

  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    enrollMutation.mutate(course.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteMutation.mutate(course.id);
  };

  return (
    <Link to={`/courses/${course.id}`}>
      <article
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
          
          {/* Badges */}
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            {isEnrolled && (
              <Badge className="bg-green-600 text-white border-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Enrolled
              </Badge>
            )}
            {course.difficulty && (
              <Badge
                className={`border ${
                  difficultyColors[course.difficulty] || "bg-secondary text-secondary-foreground"
                }`}
              >
                {course.difficulty}
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="mb-2 font-heading text-lg font-bold leading-tight text-card-foreground line-clamp-2">
            {course.title}
          </h3>

          <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-2">
            {course.description || "No description available"}
          </p>

          {/* Meta Info */}
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {course.instructor_name && (
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{course.instructor_name}</span>
              </div>
            )}
            {course.duration_hours && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{course.duration_hours}h</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              isEnrolled ? (
                <Button className="flex-1 bg-green-600 hover:bg-green-700" size="sm" asChild>
                  <span>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    View Course
                  </span>
                </Button>
              ) : (
                <Button 
                  className="flex-1" 
                  size="sm" 
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending || enrollmentLoading}
                >
                  <GraduationCap className="mr-2 h-4 w-4" />
                  {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                </Button>
              )
            ) : (
              <Button className="flex-1" size="sm" variant="outline">
                <GraduationCap className="mr-2 h-4 w-4" />
                Sign in to Enroll
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </article>
    </Link>
  );
}
