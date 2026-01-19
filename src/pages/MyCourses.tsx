import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { useEnrollments } from "@/hooks/useEnrollments";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ArrowRight, Clock, User } from "lucide-react";

const courseImages = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop",
];

export default function MyCourses() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();
  const { data: courses, isLoading: coursesLoading } = useCourses();

  const isLoading = authLoading || enrollmentsLoading || coursesLoading;

  // Get enrolled courses
  const enrolledCourses = courses?.filter((course) =>
    enrollments?.some((e) => e.course_id === course.id)
  ) || [];

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign in required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to view your enrolled courses.
            </p>
            <Button asChild>
              <Link to="/">Go to Homepage</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              My Learning
            </span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            My Enrolled Courses
          </h1>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No courses yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't enrolled in any courses yet. Start learning today!
            </p>
            <Button asChild>
              <Link to="/">Browse Courses</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => {
              const imageIndex = course.title.charCodeAt(0) % courseImages.length;
              const imageUrl = course.image_url || courseImages[imageIndex];
              const enrollment = enrollments?.find((e) => e.course_id === course.id);

              return (
                <Card key={course.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                      Enrolled
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                      {course.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                      {course.instructor_name && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{course.instructor_name}</span>
                        </div>
                      )}
                      {course.duration_hours && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{course.duration_hours}h</span>
                        </div>
                      )}
                    </div>
                    {enrollment && (
                      <p className="text-xs text-muted-foreground mb-3">
                        Enrolled on {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </p>
                    )}
                    <Button asChild variant="outline" className="w-full gap-2">
                      <Link to={`/courses/${course.id}`}>
                        Continue Learning
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
