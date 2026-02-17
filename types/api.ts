export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ApiMedia {
  id: string;
  url: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
}

export interface ApiPost {
  id: string;
  authorId: string;
  type: 'NOTE' | 'ARTICLE' | 'IMAGE' | 'VIDEO' | 'LINK';
  content: string;
  category?: ApiCategory;
  media: ApiMedia[];
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  shareCount: number;
  createdAt: string;
}

export interface ApiComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface SpringPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  last: boolean;
  first: boolean;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}
