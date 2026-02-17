import { ArticleCard } from '@/components/cards/ArticleCard';
import { GameCard } from '@/components/cards/GameCard';
import { ImageCard } from '@/components/cards/ImageCard';
import { QuoteCard } from '@/components/cards/QuoteCard';
import { SponsoredCard } from '@/components/cards/SponsoredCard';
import { VideoCard } from '@/components/cards/VideoCard';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
}

export function PostCard({ post, onLike, onComment, onShare, onBookmark }: PostCardProps) {
  const interactions = { onLike, onComment, onShare, onBookmark };

  switch (post.type) {
    case 'quote':
      return <QuoteCard post={post} {...interactions} />;
    case 'article':
      return <ArticleCard post={post} {...interactions} />;
    case 'video':
      return <VideoCard post={post} {...interactions} />;
    case 'game':
      return <GameCard post={post} {...interactions} />;
    case 'image':
      return <ImageCard post={post} {...interactions} />;
    case 'sponsored':
      return <SponsoredCard post={post} {...interactions} />;
  }
}
