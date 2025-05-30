export interface ILikePostRTM {
  postId: string;
  userId: string;
}

export interface IUnlikePostRTM {
  postId: string;
  userId: string;
}

export interface ILikePostApiRequest {
  postId: string;
}

export interface ILikePostApiResponse {
  success: boolean;
  message: string;
}

export interface IUnlikePostApiRequest {
  postId: string;
}

export interface IUnlikePostApiResponse {
  success: boolean;
  message: string;
}
