import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePost } from "@/hooks/usePost";
import React, { useRef, useState } from "react";
import { FaSquarePlus } from "react-icons/fa6";

import { zfd } from "zod-form-data";

const schema = zfd.formData({
  title: zfd.text(),
  caption: zfd.text(),
  description: zfd.text(),
  tags: zfd.repeatable(), // Handles multiple tags as an array
  media: zfd.file(), // For file uploads
});

const CreatePostModal = () => {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { handleCreatePost } = usePost();

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreviewUrl(null);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("caption", caption);
    formData.append("description", description);
    tags
      .split("#")
      .map((tag) => tag.trim())
      .forEach((tag) => {
        if (tag) formData.append("tags", tag);
      });

    if (file) formData.append("media", file);

    handleCreatePost(formData);
    // Reset form (optional)
    setTitle("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <FaSquarePlus />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={40}
            />
          </div>
          <div>
            <Label htmlFor="caption">Caption</Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={100}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="#nature, #wildlife"
            />
          </div>
          <div>
            <Label htmlFor="media">Attach Image or Video</Label>
            <Input
              id="media"
              type="file"
              accept="image/*,video/*"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {previewUrl && (
              <div className="mt-2">
                {file?.type.startsWith("image") ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-40 rounded border"
                  />
                ) : (
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-40 rounded border"
                  />
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Post</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { usePost } from "@/hooks/usePost";
// import React, { useRef, useState } from "react";
// import { FaSquarePlus } from "react-icons/fa6";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { createPostSchema, CreatePostSchema } from "./createPostSchema"; // adjust path as needed

// const CreatePostModal = () => {
//   const { handleCreatePost } = usePost();
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm<CreatePostSchema>({
//     resolver: zodResolver(createPostSchema),
//   });

//   // Watch file input for preview
//   const mediaFile = watch("media");
//   React.useEffect(() => {
//     if (mediaFile && mediaFile[0]) {
//       const file = mediaFile[0];
//       const reader = new FileReader();
//       reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
//       reader.readAsDataURL(file);
//     } else {
//       setPreviewUrl(null);
//     }
//   }, [mediaFile]);

//   // On submit, convert to FormData for backend
//   const onSubmit = (data: CreatePostSchema) => {
//     const formData = new FormData();
//     formData.append("title", data.title);
//     if (data.caption) formData.append("caption", data.caption);
//     if (data.description) formData.append("description", data.description);
//     data.tags.forEach((tag: string) => formData.append("tags", tag));
//     if (data.media && data.media[0]) formData.append("media", data.media[0]);
//     handleCreatePost(formData);
//     reset();
//     setPreviewUrl(null);
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button className="flex items-center gap-2">
//           <FaSquarePlus />
//           Create Post
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create a New Post</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <Label htmlFor="title">Title</Label>
//             <Input id="title" {...register("title")} maxLength={40} />
//             {errors.title && <span className="text-red-500">{errors.title.message}</span>}
//           </div>
//           <div>
//             <Label htmlFor="caption">Caption</Label>
//             <Input id="caption" {...register("caption")} maxLength={100} />
//             {errors.caption && <span className="text-red-500">{errors.caption.message}</span>}
//           </div>
//           <div>
//             <Label htmlFor="description">Description</Label>
//             <Textarea id="description" {...register("description")} maxLength={500} />
//             {errors.description && <span className="text-red-500">{errors.description.message}</span>}
//           </div>
//           <div>
//             <Label htmlFor="tags">Tags (comma, space, or # separated)</Label>
//             <Input
//               id="tags"
//               {...register("tags")}
//               placeholder="#nature, #wildlife"
//             />
//             {errors.tags && <span className="text-red-500">{errors.tags.message}</span>}
//           </div>
//           <div>
//             <Label htmlFor="media">Attach Image or Video</Label>
//             <Input
//               id="media"
//               type="file"
//               accept="image/*,video/*"
//               {...register("media")}
//             />
//             {previewUrl && (
//               <div className="mt-2">
//                 {mediaFile && mediaFile[0]?.type.startsWith("image") ? (
//                   <img
//                     src={previewUrl}
//                     alt="Preview"
//                     className="max-h-40 rounded border"
//                   />
//                 ) : (
//                   <video
//                     src={previewUrl}
//                     controls
//                     className="max-h-40 rounded border"
//                   />
//                 )}
//               </div>
//             )}
//           </div>
//           <DialogFooter>
//             <DialogClose asChild>
//               <Button type="button" variant="outline">
//                 Cancel
//               </Button>
//             </DialogClose>
//             <Button type="submit">Post</Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreatePostModal;
