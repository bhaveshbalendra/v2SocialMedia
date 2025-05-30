import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Icons } from "../export/Icons";
import { Input } from "../ui/input";

const CreatePostDialog = () => {
  const [open, setOpen] = useState(false);

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
  const { handleCreatePost } = usePost();

  const onSubmit = async (data: CreatePostSchema) => {
    try {
      // Create FormData to submit files properly
      const formData = new FormData();

      // Add text fields
      if (data.title) formData.append("title", data.title);
      if (data.caption) formData.append("caption", data.caption);
      if (data.description) formData.append("description", data.description);
      if (data.location) formData.append("location", data.location);

      // Add tags as JSON string
      if (data.tags && data.tags.length > 0) {
        formData.append("tags", JSON.stringify(data.tags));
      }

      // Add files
      if (data.media && data.media.length > 0) {
        for (let i = 0; i < data.media.length; i++) {
          formData.append("media", data.media[i]);
        }
      }

      console.log("Submitting form with files:", data.media);
      await handleCreatePost(formData);

      reset();
      setOpen(false);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icons.SquarePlus /> Create Post
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" maxLength={40} {...register("title")} />
            {errors.title && (
              <span style={{ color: "red" }}>
                {errors.title.message as string}
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="caption">Caption</Label>
            <Input id="caption" maxLength={100} {...register("caption")} />
            {errors.caption && (
              <span style={{ color: "red" }}>
                {errors.caption.message as string}
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              maxLength={500}
              {...register("description")}
            />
            {errors.description && (
              <span style={{ color: "red" }}>
                {errors.description.message as string}
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma, space, or # separated)</Label>
            <Input id="tags" {...register("tags")} />
            {errors.tags && (
              <span style={{ color: "red" }}>
                {errors.tags.message as string}
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="media">Media</Label>
            <Input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/gif"
              onChange={(e) =>
                setValue("media", e.target.files, { shouldValidate: true })
              }
            />
            {errors.media && (
              <span style={{ color: "red" }}>
                {errors.media.message as string}
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} />
            {errors.location && (
              <span style={{ color: "red" }}>
                {errors.location.message as string}
              </span>
            )}
          </div>
          <Button type="submit" className="mt-4">
            Post
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
