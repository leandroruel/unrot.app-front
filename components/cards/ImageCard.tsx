import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { CardWrapper } from '@/components/cards/CardWrapper';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { ImagePost } from '@/types';

interface ImageCardProps {
  post: ImagePost;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
}

export function ImageCard({ post, onLike, onComment, onShare, onBookmark }: ImageCardProps) {
  return (
    <CardWrapper
      post={post}
      onLike={onLike}
      onComment={onComment}
      onShare={onShare}
      onBookmark={onBookmark}>
      <Image
        source={{ uri: post.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      {post.caption ? (
        <View style={styles.captionContainer}>
          <ThemedText style={styles.caption} numberOfLines={3}>
            {post.caption}
          </ThemedText>
        </View>
      ) : null}
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  captionContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm + 4,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
});
