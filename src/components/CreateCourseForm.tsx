import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateCourse } from "@/hooks/useCourses";

const formSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().trim().max(1000, "Description must be less than 1000 characters").optional(),
  instructor_name: z.string().trim().max(100, "Instructor name must be less than 100 characters").optional(),
  duration_hours: z.coerce.number().min(1).max(1000).optional(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  video_title: z.string().trim().min(1, "Video title is required").max(200, "Video title must be less than 200 characters"),
  video_duration_minutes: z.coerce.number().min(1).max(600).optional(),
  video_description: z.string().trim().max(500, "Video description must be less than 500 characters").optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateCourseForm() {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const createMutation = useCreateCourse();
  const MAX_VIDEO_SIZE_MB = 200;
  const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      instructor_name: "",
      duration_hours: 1,
      difficulty: "Beginner",
      video_title: "",
      video_duration_minutes: 10,
      video_description: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!selectedFile) {
      form.setError("root", {
        message: "Please select a video file to upload",
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: values.title,
        description: values.description,
        instructor_name: values.instructor_name,
        duration_hours: values.duration_hours,
        difficulty: values.difficulty,
        video_title: values.video_title,
        video_file: selectedFile,
        video_duration_minutes: values.video_duration_minutes,
        video_description: values.video_description,
      });
      form.reset();
      setSelectedFile(null);
      setOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create course";
      form.setError("root", { message });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_VIDEO_SIZE_BYTES) {
        setSelectedFile(null);
        form.setError("root", { message: `Video must be ${MAX_VIDEO_SIZE_MB}MB or smaller` });
        try { event.target.value = ""; } catch (e) { void e; }
        return;
      }
      setSelectedFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 bg-gradient-accent text-accent-foreground shadow-lg transition-all hover:shadow-xl">
          <Plus className="h-5 w-5" />
          Create Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Create New Course</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Introduction to Python" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What will students learn?"
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="instructor_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (hours)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">First Video</h3>
              
              <FormField
                control={form.control}
                name="video_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Introduction to the course" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mb-4">
                <FormLabel>Video File *</FormLabel>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload">
                    <Button type="button" variant="outline" asChild>
                      <span className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Video
                      </span>
                    </Button>
                  </label>
                  {selectedFile && (
                    <span className="text-sm text-muted-foreground truncate">
                      {selectedFile.name}
                    </span>
                  )}
                </div>
                {!selectedFile && (
                  <FormMessage>Please select a video file</FormMessage>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="video_duration_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="video_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the video content"
                          className="min-h-[80px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {form.formState.errors.root && (
              <FormMessage>{form.formState.errors.root.message}</FormMessage>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-gradient-primary"
              >
                {createMutation.isPending ? "Creating..." : "Create Course"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
