export interface IPublicFeedApiResponse {
  success: boolean;
  message: string;
  posts: IPost[];
}

export interface IFeedState {
  posts: IPost[];
  selectedPost: IPost | null;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

export interface IPost {
  _id?: string;
  id?: string;
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
  caption?: string;
  media?: IMedia[];
  author?: IAuthor;
  likes?: string[];
  comments?: string[];
  location?: string;
  tags?: string[];
  title?: string;
  visibility?: string;
  description?: string;
  commentsCount?: number;
  sharesCount?: number;
  bookmarksCount?: number;
  isArchived?: boolean;
  isDeleted?: boolean;
  isReported?: boolean;
}

export interface IMedia {
  url: string;
  type: string;
  publicId: string;
  _id: string;
  id: string;
}

export interface IAuthor {
  _id: string;
  username: string;
  profilePicture: string;
}

export interface IFeedApiResponse {
  success: boolean;
  message: string;
  posts: IPost[];
}

export interface ICreatePostApiRequest {
  title: string;
  caption: string;
  description: string;
  tags: string[];
  file: File;
}

export interface ICreatePostApiResponse {
  success: boolean;
  message: string;
  post: IPost;
}
