/**
 * CreatePostDialog Component
 *
 * A modal dialog component that allows authenticated users to create new posts.
 * Handles form validation, file uploads, and real-time post creation.
 *
 * Features:
 * - Multi-field form with validation (title, caption, description, tags, location)
 * - File upload support for images (JPEG, PNG, GIF)
 * - Real-time form validation using Zod schema
 * - Optimistic UI updates on successful post creation
 * - Error handling with user-friendly toast notifications
 *
 * @component
 * @example
 * <CreatePostDialog />
 */

import { Icons } from "@/components/export/Icons";
import {
  ErrorDisplay,
  SubmitButton,
} from "@/components/conditional-rendering/create-post/forms";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePost } from "@/hooks/posts/usePost";
import {
  CreatePostSchema,
  createPostSchema,
  initialCreatePostCredentials,
} from "@/validations/createPostValidators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

const CreatePostDialog = (): React.ReactElement => {
  // State to control dialog open/close
  const [open, setOpen] = useState(false);
  // State to store selected file names
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Initialize React Hook Form with Zod validation
  // This provides type-safe form handling with real-time validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: initialCreatePostCredentials,
  });

  // Custom hook for post creation with loading states and error handling
  const { handleCreatePost, isLoadingCreatePost } = usePost();

  /**
   * Handles form submission and post creation
   *
   * Process:
   * 1. Validates form data using Zod schema
   * 2. Creates FormData object for file uploads
   * 3. Appends all form fields to FormData
   * 4. Calls API to create post
   * 5. Resets form and closes dialog on success
   * 6. Shows error toast on failure
   *
   * @param data - Validated form data from React Hook Form
   */
  const onSubmit = async (data: CreatePostSchema) => {
    try {
      // Create FormData to submit files properly
      // FormData is required for multipart/form-data uploads
      const formData = new FormData();

      // Add text fields to FormData
      // Only append if value exists to avoid empty fields
      if (data.title) formData.append("title", data.title);
      if (data.caption) formData.append("caption", data.caption);
      if (data.description) formData.append("description", data.description);
      if (data.location) formData.append("location", data.location);

      // Add tags as JSON string for backend processing
      // Tags are transformed from string to array by Zod schema
      if (data.tags && data.tags.length > 0) {
        formData.append("tags", JSON.stringify(data.tags));
      }

      // Add media files to FormData
      // Multiple files can be uploaded simultaneously
      if (data.media && data.media.length > 0) {
        // Convert FileList to Array for proper iteration
        const filesArray = Array.from(data.media);
        filesArray.forEach((file) => {
          formData.append("media", file);
        });
      }

      // Call API to create post
      // This will trigger optimistic UI updates and show success toast
      await handleCreatePost(formData);

      // Reset form and close dialog on successful post creation
      reset();
      setSelectedFiles([]);
      setOpen(false);
    } catch (error) {
      // Log error for debugging in production
      console.error("Error submitting post:", error);
      // Error handling is done in usePost hook with toast notifications
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          reset();
          setSelectedFiles([]);
        }
      }}
    >
      {/* Dialog Trigger - Button that opens the modal */}
      <DialogTrigger asChild>
        <Button>
          <Icons.SquarePlus /> Create Post
        </Button>
      </DialogTrigger>

      {/* Dialog Content - The modal itself */}
      <DialogContent className="!max-w-[min(90vw,600px)] !w-[min(90vw,600px)] !max-h-[min(90vh,700px)] overflow-y-auto !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 !m-0">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        {/* Form with validation and error handling */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" maxLength={40} {...register("title")} />
            <ErrorDisplay error={errors.title} />
          </div>

          {/* Caption Field */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Input id="caption" maxLength={100} {...register("caption")} />
            <ErrorDisplay error={errors.caption} />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              maxLength={500}
              {...register("description")}
            />
            <ErrorDisplay error={errors.description} />
          </div>

          {/* Tags Field - Supports comma, space, or # separated tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma, space, or # separated)</Label>
            <Input id="tags" {...register("tags")} />
            <ErrorDisplay error={errors.tags} />
          </div>

          {/* Media Upload Field */}
          <div className="space-y-2">
            <Label htmlFor="media">Media</Label>
            <label
              htmlFor="media"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Icons.Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  You can upload multiple images (PNG, JPG, GIF up to 2MB each)
                </p>
              </div>
              <Input
                id="media"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    const filesArray = Array.from(files);
                    setSelectedFiles(filesArray);
                    setValue("media", files, { shouldValidate: true });
                  } else {
                    setSelectedFiles([]);
                  }
                }}
              />
            </label>
            
            {/* Selected Files Info */}
            {selectedFiles.length > 0 && (
              <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <Icons.Upload className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-semibold text-foreground">
                    {selectedFiles.length} {selectedFiles.length === 1 ? 'image' : 'images'} selected
                  </span>
                </div>
              </div>
            )}
            
            <ErrorDisplay error={errors.media} />
          </div>

          {/* Location Field */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} />
            <ErrorDisplay error={errors.location} />
          </div>

          {/* Submit Button with Loading State */}
          <div className="pt-2">
            <SubmitButton isLoading={isLoadingCreatePost} text="Post" />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
