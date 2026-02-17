import { StyleSheet, View } from 'react-native';

import { CardWrapper } from '@/components/cards/CardWrapper';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { QuotePost } from '@/types';

interface QuoteCardProps {
  post: QuotePost;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
}

export function QuoteCard({ post, onLike, onComment, onShare, onBookmark }: QuoteCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <CardWrapper
      post={post}
      backgroundColor={colors.cardQuote}
      onLike={onLike}
      onComment={onComment}
      onShare={onShare}
      onBookmark={onBookmark}>
      <View style={styles.content}>
        <ThemedText style={[Typography.feedLabel, { color: colors.accent }]}>
          {post.label}
        </ThemedText>
        <ThemedText
          style={[
            styles.body,
            {
              fontFamily: Fonts?.serif,
              color: colors.text,
            },
          ]}>
          {post.body}
        </ThemedText>
      </View>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  body: {
    fontSize: 22,
    lineHeight: 32,
    fontStyle: 'italic',
  },
});
