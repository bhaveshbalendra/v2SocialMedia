/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PublicFeedApiResponse {
  success: boolean;
  message: string;
  posts: Post[];
}

export interface Post {
  _id: string;
  id: string;
  title: string;
  caption: string;
  description: string;
  tags: string[];
  media: Media[];
  visibility: string;
  author: Author;
  likes: any[]; // You can replace 'any' with a more specific type if known
  comments: any[]; // You can replace 'any' with a more specific type if known
  location: string;
  commentsCount: number;
  sharesCount: number;
  bookmarksCount: number;
  isArchived: boolean;
  isDeleted: boolean;
  isReported: boolean;
  createdAt: string; // ISO date string
}

export interface Media {
  url: string;
  type: string;
  publicId: string;
  _id: string;
  id: string;
}

export interface Author {
  _id: string;
  username: string;
  profilePicture: string;
}
