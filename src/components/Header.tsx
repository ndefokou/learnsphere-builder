import { BookOpen, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "./AuthModal";
import { UserMenu } from "./UserMenu";

export function Header() {
  const { user, loading, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">
            LearnHub
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <BookOpen className="h-4 w-4" />
            Courses
          </Link>

          {!loading && (
            isAuthenticated && user ? (
              <UserMenu user={user} />
            ) : (
              <AuthModal />
            )
          )}
        </nav>
      </div>
    </header>
  );
}
