export type PostType = 'quote' | 'article' | 'video' | 'game' | 'image' | 'sponsored';

export interface PostAuthor {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
}

export interface PostInteractions {
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface BasePost {
  id: string;
  type: PostType;
  author: PostAuthor;
  interactions: PostInteractions;
  createdAt: string;
}

export interface QuotePost extends BasePost {
  type: 'quote';
  label: string;
  body: string;
}

export interface ArticlePost extends BasePost {
  type: 'article';
  label: string;
  title: string;
  body: string;
  currentPage: number;
  totalPages: number;
}

export interface VideoPost extends BasePost {
  type: 'video';
  thumbnailUrl: string;
  videoUrl: string;
  durationSeconds: number;
  currentTimeSeconds: number;
}

export interface GamePost extends BasePost {
  type: 'game';
  label: string;
  previewImage: string | number;
  gameUrl: string;
}

export interface ImagePost extends BasePost {
  type: 'image';
  imageUrl: string;
  caption: string;
}

export interface SponsoredPost extends BasePost {
  type: 'sponsored';
  iconUrl: string;
  title: string;
  description: string;
  actionLabel: string;
  actionUrl: string;
}

export type Post = QuotePost | ArticlePost | VideoPost | GamePost | ImagePost | SponsoredPost;
