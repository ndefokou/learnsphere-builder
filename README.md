# LearnHub - Mini E-Learning Platform

A modern, full-stack e-learning platform built with React, TypeScript, Supabase, and Docker. LearnHub enables users to create, manage, and consume educational content with video support.

## 🚀 Features

- **Course Management**: Create, view, and delete courses with rich metadata
- **Video Upload**: Upload and stream video content directly to Supabase Storage
- **Responsive Design**: Mobile-first UI built with Tailwind CSS and shadcn/ui
- **Real-time Data**: Powered by Supabase PostgreSQL with TypeScript types
- **Microservices Architecture**: Scalable backend with Docker containerization
- **Modern Development Stack**: Vite, React Query, React Hook Form, Zod validation

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and state management
- **shadcn/ui** - Accessible UI components
- **Tailwind CSS** - Utility-first styling
- **React Hook Form** + **Zod** - Form handling and validation

### Backend
- **Supabase** - PostgreSQL database and file storage
- **Docker** - Containerization and microservices
- **Express.js** - Microservice API servers
- **Node.js** - Runtime environment

### Development Tools
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Vitest** - Unit testing
- **Bun** - Package manager (alternative to npm)

## 📁 Project Structure

```
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── CourseCard.tsx        # Course display component
│   │   ├── CreateCourseForm.tsx  # Course creation form
│   │   └── Header.tsx            # Navigation header
│   ├── hooks/                    # Custom React hooks
│   │   ├── useCourses.ts         # Course data hooks
│   │   └── useAuth.ts            # Authentication hooks
│   ├── integrations/             # Third-party integrations
│   │   └── supabase/             # Supabase client and types
│   ├── lib/                      # Utility functions
│   │   └── api.ts                # API client functions
│   ├── pages/                    # Page components
│   │   ├── Index.tsx             # Home page
│   │   ├── CourseDetail.tsx      # Course details
│   │   └── MyCourses.tsx         # User courses
│   └── App.tsx                   # Root component
├── compose/                      # Docker microservices
│   ├── docker-compose.yml        # Service orchestration
│   └── services/                 # Microservice containers
│       ├── gateway/              # API Gateway
│       ├── users/                # User service
│       ├── courses/              # Course service
│       └── videos/               # Video service
├── supabase/                     # Database migrations
│   └── migrations/               # SQL schema files
├── public/                       # Static assets
└── package.json                  # Dependencies and scripts
```

## 🗄 Database Schema

### Courses Table
```sql
id: UUID (Primary Key)
title: TEXT
description: TEXT (nullable)
instructor_name: TEXT (nullable)
duration_hours: INTEGER (nullable)
difficulty: TEXT (nullable)
image_url: TEXT (nullable)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### Videos Table
```sql
id: UUID (Primary Key)
course_id: UUID (Foreign Key → courses.id)
title: TEXT
video_url: TEXT
duration_minutes: INTEGER (nullable)
description: TEXT (nullable)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### Enrollments Table
```sql
id: UUID (Primary Key)
user_id: TEXT
course_id: UUID (Foreign Key → courses.id)
enrolled_at: TIMESTAMP
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_STORAGE_BUCKET=course-videos

# Optional: Storage upload timeout (default: 10 minutes)
VITE_STORAGE_UPLOAD_TIMEOUT_MS=600000
```

For Docker deployment, create `compose/.env`:

```env
# Docker Configuration
DOCKERHUB_NS=your-dockerhub-namespace
GATEWAY_PORT=8080

# Service Routes (internal Docker network)
ROUTE_USERS=http://users:3001
ROUTE_COURSES=http://courses:3002
ROUTE_VIDEOS=http://videos:3003
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Docker and Docker Compose (for microservices)
- Supabase account and project

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd learnhub
   bun install  # or npm install
   ```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the migrations in `supabase/migrations/` to set up the database schema
   - Create a storage bucket named `course-videos`

3. **Configure environment:**
   ```bash
   cp .env.example .env  # Create from example if available
   # Edit .env with your Supabase credentials
   ```

4. **Run development server:**
   ```bash
   bun dev  # or npm run dev
   ```
   The app will be available at `http://localhost:5173`

### Docker Deployment

Build and run all microservices:

```bash
cd compose
docker-compose up --build
```

Services will be available:
- Gateway: `http://localhost:8080`
- Frontend: `http://localhost:5173` (when running separately)

## 📡 API Endpoints

### Frontend API (Supabase)

All data operations go through Supabase client:

- `GET /courses` - Fetch all courses
- `GET /courses/:id` - Fetch single course
- `POST /courses` - Create new course
- `DELETE /courses/:id` - Delete course
- `GET /videos?course_id=:id` - Fetch videos for course
- `POST /videos` - Create video entry
- `POST /storage/v1/object/course-videos` - Upload video file

### Microservices API (Docker)

When using Docker microservices:

- `GET /health` - Health check
- `GET /users/*` - User service routes
- `GET /courses/*` - Course service routes
- `GET /videos/*` - Video service routes

## 🧪 Testing

Run the test suite:

```bash
# Frontend tests
bun test  # or npm test

# Watch mode
bun test:watch  # or npm run test:watch

# Microservice tests
cd compose/services/gateway && npm test
cd compose/services/users && npm test
cd compose/services/courses && npm test
cd compose/services/videos && npm test
```

## 🎨 Key Components

### CreateCourseForm
Multi-step form for creating courses with video upload:
- Zod validation for all fields
- File upload with size validation (200MB limit)
- Automatic video upload to Supabase Storage
- Error handling with cleanup on failure

### CourseList
Displays available courses in a responsive grid:
- Fetches data using React Query
- Loading and error states
- Responsive card layout

### useCourses Hook
Manages course data with React Query:
- `useCourses()` - Fetch all courses
- `useCourse(id)` - Fetch single course
- `useCreateCourse()` - Create course with video
- `useDeleteCourse()` - Delete course

## 🔄 Development Workflow

1. **Start development server:**
   ```bash
   bun dev
   ```

2. **Make changes to components:**
   - UI components in `src/components/`
