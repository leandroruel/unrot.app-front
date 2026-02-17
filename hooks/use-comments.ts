import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiComment, SpringPage } from '@/types/api';

interface CommentPage {
  comments: ApiComment[];
  nextPage: number | undefined;
}

export function useComments(postId: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const query = useInfiniteQuery<CommentPage>({
    queryKey: ['comments', postId],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<SpringPage<ApiComment>>(
        `/api/posts/${postId}/comments`,
        { params: { page: pageParam, size: 20 } }
      );
      return {
        comments: data.content,
        nextPage: data.last ? undefined : data.number + 1,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!postId && isAuthenticated,
  });

  const comments = query.data?.pages.flatMap((p) => p.comments) ?? [];

  return { ...query, comments };
}

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const { data } = await api.post<ApiComment>(
        `/api/posts/${postId}/comments`,
        { content }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      await api.delete(`/api/posts/${postId}/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
}
