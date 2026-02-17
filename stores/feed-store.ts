import { create } from 'zustand';

import { mockPosts } from '@/data/mock-posts';
import type { Post } from '@/types';

interface FeedState {
  posts: Post[];
  isRefreshing: boolean;
  toggleLike: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  refreshFeed: () => Promise<void>;
}

export const useFeedStore = create<FeedState>((set) => ({
  posts: mockPosts,
  isRefreshing: false,

  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              interactions: {
                ...p.interactions,
                isLiked: !p.interactions.isLiked,
                likesCount: p.interactions.isLiked
                  ? p.interactions.likesCount - 1
                  : p.interactions.likesCount + 1,
              },
            }
          : p
      ),
    })),

  toggleBookmark: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              interactions: {
                ...p.interactions,
                isBookmarked: !p.interactions.isBookmarked,
              },
            }
          : p
      ),
    })),

  refreshFeed: async () => {
    set({ isRefreshing: true });
    await new Promise((r) => setTimeout(r, 1000));
    set({ isRefreshing: false });
  },
}));
