export interface FollowRequest {
  followerId: number;
  followedId: number;
}

export interface FollowResponse {
  followerId: number;
  followedId: number;
  createdAt: string;
}
