import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-primary py-20">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary-foreground/5 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">
              Mini E-Learning Platform
            </span>
          </div>

          <h1 className="mb-6 font-heading text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
            Learn Without{" "}
            <span className="relative">
              Limits
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 8C50 2 150 2 198 8"
                  stroke="hsl(16 85% 60%)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80">
            Discover courses created by passionate instructors. Start your
            learning journey today and unlock new skills.
          </p>
        </div>
      </div>
    </section>
  );
}
