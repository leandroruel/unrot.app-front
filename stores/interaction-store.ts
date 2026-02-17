import { create } from 'zustand';

interface InteractionState {
  likedPostIds: string[];
  bookmarkedPostIds: string[];
  toggleLike: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  isLiked: (postId: string) => boolean;
  isBookmarked: (postId: string) => boolean;
}

export const useInteractionStore = create<InteractionState>((set, get) => ({
  likedPostIds: [],
  bookmarkedPostIds: [],

  toggleLike: (postId) =>
    set((state) => {
      const exists = state.likedPostIds.includes(postId);
      return {
        likedPostIds: exists
          ? state.likedPostIds.filter((id) => id !== postId)
          : [...state.likedPostIds, postId],
      };
    }),

  toggleBookmark: (postId) =>
    set((state) => {
      const exists = state.bookmarkedPostIds.includes(postId);
      return {
        bookmarkedPostIds: exists
          ? state.bookmarkedPostIds.filter((id) => id !== postId)
          : [...state.bookmarkedPostIds, postId],
      };
    }),

  isLiked: (postId) => get().likedPostIds.includes(postId),
  isBookmarked: (postId) => get().bookmarkedPostIds.includes(postId),
}));
