import { IComment } from "@/store/apis/commentApi";

// Socket event types for real-time features
export interface SocketCommentEvent {
  postId: string;
  comment: IComment;
}

export interface SocketCommentDeleteEvent {
  postId: string;
  commentId: string;
}

export interface SocketCommentLikeEvent {
  commentId: string;
  userId: string;
  action: "like" | "unlike";
}

// You can add more socket event types here as needed
export interface SocketPostLikeEvent {
  postId: string;
  userId: string;
  action: "like" | "unlike";
}
