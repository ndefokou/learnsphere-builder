import { useParams, Link } from "react-router-dom";
import { useCourse } from "@/hooks/useCourses";
import { useEnrollment, useEnrollInCourse, useUnenrollFromCourse } from "@/hooks/useEnrollments";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, User, BookOpen, CheckCircle } from "lucide-react";

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const courseImages = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop",
];

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: course, isLoading, error } = useCourse(id || "");
  const { data: enrollment, isLoading: enrollmentLoading } = useEnrollment(id || "");
  const enrollMutation = useEnrollInCourse();
  const unenrollMutation = useUnenrollFromCourse();
  const { user, isAuthenticated } = useAuth();

  const isEnrolled = !!enrollment;

  const handleEnroll = () => {
    if (id) enrollMutation.mutate(id);
  };

  const handleUnenroll = () => {
    if (id) unenrollMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-64 w-full rounded-xl mb-8" />
          <Skeleton className="h-10 w-2/3 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4" />
        </main>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to courses
          </Link>
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Course not found</h2>
            <p className="text-muted-foreground">The course you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    );
  }

  const imageIndex = course.title.charCodeAt(0) % courseImages.length;
  const imageUrl = course.image_url || courseImages[imageIndex];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to courses
        </Link>

        {/* Hero Image */}
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8">
          <img
            src={imageUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {course.difficulty && (
            <Badge className={`absolute top-4 right-4 ${difficultyColors[course.difficulty] || ""}`}>
              {course.difficulty}
            </Badge>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              {course.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              {course.instructor_name && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{course.instructor_name}</span>
                </div>
              )}
              {course.duration_hours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration_hours} hours</span>
                </div>
              )}
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-xl font-semibold text-foreground mb-3">About this course</h2>
              <p className="text-muted-foreground leading-relaxed">
                {course.description || "No description available for this course."}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Enrollment</h3>
              
              {!isAuthenticated ? (
                <div className="text-center">
                  <p className="text-muted-foreground text-sm mb-4">
                    Sign in to enroll in this course
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/">Go to homepage to sign in</Link>
                  </Button>
                </div>
              ) : isEnrolled ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">You're enrolled!</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleUnenroll}
                    disabled={unenrollMutation.isPending}
                  >
                    {unenrollMutation.isPending ? "Unenrolling..." : "Unenroll"}
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending || enrollmentLoading}
                >
                  {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                </Button>
              )}

              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-medium text-sm mb-3">This course includes:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {course.duration_hours || 1} hours of content
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Full lifetime access
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
