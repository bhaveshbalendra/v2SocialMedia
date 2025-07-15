interface IComment {
  _id: string;
  user: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  post: string;
  content: string;
  likes: string[];
  likesCount: number;
  parentComment: string | null | IComment[];
  createdAt: string;
  id: string;
}

interface ICommentRTM {
  postId: string;
  comment: IComment;
}

interface ICreateCommentResponse {
  success: boolean;
  message: string;
  comment: IComment;
}

interface ICreateCommentRequest {
  content: string;
  postId: string;
}

interface IGetCommentsRequest {
  postId: string;
  nextCursor?: string;
}

interface IGetCommentsResponse {
  success: boolean;
  message: string;
  postId: string;
  comments: IComment[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export type {
  IComment,
  ICommentRTM,
  ICreateCommentRequest,
  ICreateCommentResponse,
  IGetCommentsRequest,
  IGetCommentsResponse,
};
