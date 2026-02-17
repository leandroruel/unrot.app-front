import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { enrichPostWithInteractions, mapApiPostToPost } from '@/lib/mappers';
import { useInteractionStore } from '@/stores/interaction-store';
import type { ApiPost, SpringPage } from '@/types/api';
import type { Post } from '@/types/post';

interface FeedPage {
  posts: Post[];
  nextPage: number | undefined;
}

function useEnrichedPosts(posts: Post[]): Post[] {
  const likedPostIds = useInteractionStore((s) => s.likedPostIds);
  const bookmarkedPostIds = useInteractionStore((s) => s.bookmarkedPostIds);

  const likedSet = new Set(likedPostIds);
  const bookmarkedSet = new Set(bookmarkedPostIds);

  return posts.map((p) => enrichPostWithInteractions(p, likedSet, bookmarkedSet));
}

export function useFeed() {
  const query = useInfiniteQuery<FeedPage>({
    queryKey: ['feed'],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<ApiPost[]>('/api/feed', {
        params: { page: pageParam, size: 10 },
      });
      return {
        posts: data.map(mapApiPostToPost),
        nextPage: data.length < 10 ? undefined : (pageParam as number) + 1,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const allPosts = query.data?.pages.flatMap((p) => p.posts) ?? [];
  const posts = useEnrichedPosts(allPosts);

  return { ...query, posts };
}

export function usePosts(categorySlug?: string) {
  const query = useInfiniteQuery<FeedPage>({
    queryKey: ['posts', categorySlug],
    queryFn: async ({ pageParam }) => {
      const url = categorySlug
        ? `/api/posts/category/${categorySlug}`
        : '/api/posts';
      const { data } = await api.get<SpringPage<ApiPost>>(url, {
        params: { page: pageParam, size: 10 },
      });
      return {
        posts: data.content.map(mapApiPostToPost),
        nextPage: data.last ? undefined : data.number + 1,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const allPosts = query.data?.pages.flatMap((p) => p.posts) ?? [];
  const posts = useEnrichedPosts(allPosts);

  return { ...query, posts };
}

export function usePost(id: string) {
  const likedPostIds = useInteractionStore((s) => s.likedPostIds);
  const bookmarkedPostIds = useInteractionStore((s) => s.bookmarkedPostIds);

  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data } = await api.get<ApiPost>(`/api/posts/${id}`);
      return mapApiPostToPost(data);
    },
    select: (post) =>
      enrichPostWithInteractions(
        post,
        new Set(likedPostIds),
        new Set(bookmarkedPostIds)
      ),
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  const toggleLike = useInteractionStore((s) => s.toggleLike);
  const isLiked = useInteractionStore((s) => s.isLiked);

  return useMutation({
    mutationFn: async (postId: string) => {
      const liked = isLiked(postId);
      if (liked) {
        await api.delete(`/api/posts/${postId}/likes`);
      } else {
        await api.post(`/api/posts/${postId}/likes`);
      }
      return { postId, wasLiked: liked };
    },
    onMutate: async (postId) => {
      toggleLike(postId);
      return { postId };
    },
    onError: (_err, _vars, context) => {
      if (context?.postId) {
        toggleLike(context.postId);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useToggleBookmark() {
  const toggleBookmark = useInteractionStore((s) => s.toggleBookmark);
  const isBookmarked = useInteractionStore((s) => s.isBookmarked);

  return useMutation({
    mutationFn: async (postId: string) => {
      const bookmarked = isBookmarked(postId);
      if (bookmarked) {
        await api.delete(`/api/posts/${postId}/bookmarks`);
      } else {
        await api.post(`/api/posts/${postId}/bookmarks`);
      }
    },
    onMutate: async (postId) => {
      toggleBookmark(postId);
      return { postId };
    },
    onError: (_err, _vars, context) => {
      if (context?.postId) {
        toggleBookmark(context.postId);
      }
    },
  });
}

export function useSharePost() {
  return useMutation({
    mutationFn: async (postId: string) => {
      await api.post(`/api/posts/${postId}/shares`);
    },
  });
}
