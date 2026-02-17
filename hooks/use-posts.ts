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

  const mutation = useMutation({
    // Variables carry wasLiked captured before the optimistic toggle
    mutationFn: async ({ postId, wasLiked }: { postId: string; wasLiked: boolean }) => {
      if (wasLiked) {
        await api.delete(`/api/posts/${postId}/likes`);
      } else {
        await api.post(`/api/posts/${postId}/likes`);
      }
    },
    onMutate: async ({ postId }) => {
      toggleLike(postId);
    },
    onError: (_err, { postId }) => {
      toggleLike(postId); // rollback
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return {
    ...mutation,
    mutate: (postId: string) => mutation.mutate({ postId, wasLiked: isLiked(postId) }),
  };
}

export function useToggleBookmark() {
  const toggleBookmark = useInteractionStore((s) => s.toggleBookmark);
  const isBookmarked = useInteractionStore((s) => s.isBookmarked);

  const mutation = useMutation({
    mutationFn: async ({ postId, wasBookmarked }: { postId: string; wasBookmarked: boolean }) => {
      if (wasBookmarked) {
        await api.delete(`/api/posts/${postId}/bookmarks`);
      } else {
        await api.post(`/api/posts/${postId}/bookmarks`);
      }
    },
    onMutate: async ({ postId }) => {
      toggleBookmark(postId);
    },
    onError: (_err, { postId }) => {
      toggleBookmark(postId); // rollback
    },
  });

  return {
    ...mutation,
    mutate: (postId: string) => mutation.mutate({ postId, wasBookmarked: isBookmarked(postId) }),
  };
}

export function useSharePost() {
  return useMutation({
    mutationFn: async (postId: string) => {
      await api.post(`/api/posts/${postId}/shares`);
    },
  });
}
