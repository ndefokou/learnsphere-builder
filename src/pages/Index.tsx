import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CourseList } from "@/components/CourseList";
import { CreateCourseForm } from "@/components/CreateCourseForm";
import { BookOpen } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      <main className="container py-12">
        {/* Section Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-primary">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Browse
              </span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Available Courses
            </h2>
          </div>

          <CreateCourseForm />
        </div>

        {/* Course Grid */}
        <CourseList />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 LearnHub — Mini E-Learning Platform Demo</p>
          <p className="mt-1">Built with React, TypeScript & Lovable Cloud</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
