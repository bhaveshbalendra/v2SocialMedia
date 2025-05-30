export interface IFollowServiceParameter {
  followerId: string; //me
  followingUserName: string; //other
}

export interface IFollowServiceReturn {
  message: string;
}
