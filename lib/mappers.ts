import type { ApiPost } from '@/types/api';
import type { ArticlePost, GamePost, Post, QuotePost, VideoPost } from '@/types/post';

function getMediaUrl(apiPost: ApiPost): string | null {
  if (apiPost.media.length > 0) {
    return apiPost.media[0].url;
  }
  return null;
}

export function mapApiPostToPost(apiPost: ApiPost): Post {
  const baseFields = {
    id: apiPost.id,
    author: {
      id: apiPost.authorId,
      name: apiPost.authorId.slice(0, 8),
      username: apiPost.authorId.slice(0, 8),
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(apiPost.authorId.slice(0, 8))}&background=random`,
    },
    interactions: {
      likesCount: apiPost.likeCount,
      commentsCount: apiPost.commentCount,
      sharesCount: apiPost.shareCount,
      isLiked: false,
      isBookmarked: false,
    },
    createdAt: apiPost.createdAt,
  };

  const categoryName = apiPost.category?.name ?? 'Post';
  const mediaUrl = getMediaUrl(apiPost);

  switch (apiPost.type) {
    case 'NOTE':
      return {
        ...baseFields,
        type: 'quote',
        label: categoryName,
        body: apiPost.content,
      } satisfies QuotePost;

    case 'VIDEO':
      return {
        ...baseFields,
        type: 'video',
        thumbnailUrl: mediaUrl ?? `https://picsum.photos/seed/v-${apiPost.id.slice(0, 8)}/800/450`,
        videoUrl: mediaUrl ?? '',
        durationSeconds: 0,
        currentTimeSeconds: 0,
      } satisfies VideoPost;

    case 'IMAGE':
      return {
        ...baseFields,
        type: 'game',
        label: categoryName,
        previewImage: mediaUrl ?? `https://picsum.photos/seed/g-${apiPost.id.slice(0, 8)}/800/450`,
        gameUrl: '',
      } satisfies GamePost;

    case 'ARTICLE':
    case 'LINK':
    default:
      return {
        ...baseFields,
        type: 'article',
        label: categoryName,
        title: apiPost.content.slice(0, 80),
        body: apiPost.content,
        currentPage: 1,
        totalPages: 1,
      } satisfies ArticlePost;
  }
}

export function enrichPostWithInteractions(
  post: Post,
  likedIds: Set<string>,
  bookmarkedIds: Set<string>
): Post {
  const isLiked = likedIds.has(post.id);
  const isBookmarked = bookmarkedIds.has(post.id);

  if (post.interactions.isLiked === isLiked && post.interactions.isBookmarked === isBookmarked) {
    return post;
  }

  return {
    ...post,
    interactions: {
      ...post.interactions,
      isLiked,
      isBookmarked,
    },
  } as Post;
}
