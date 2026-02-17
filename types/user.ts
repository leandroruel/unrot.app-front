export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention';

export interface Notification {
  id: string;
  type: NotificationType;
  fromUser: Pick<UserProfile, 'id' | 'name' | 'avatarUrl'>;
  postId?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}
