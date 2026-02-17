import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { CardWrapper } from '@/components/cards/CardWrapper';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { ArticlePost } from '@/types';

interface ArticleCardProps {
  post: ArticlePost;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
}

export function ArticleCard({ post, onLike, onComment, onShare, onBookmark }: ArticleCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  return (
    <CardWrapper
      post={post}
      onLike={onLike}
      onComment={onComment}
      onShare={onShare}
      onBookmark={onBookmark}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={[Typography.feedLabel, { color: colors.accent }]}>
            {post.label}
          </ThemedText>
          <ThemedText style={[styles.pageIndicator, { color: colors.textSecondary }]}>
            Page {post.currentPage} of {post.totalPages}
          </ThemedText>
        </View>

        <ThemedText
          style={[
            Typography.cardTitle,
            { fontFamily: Fonts?.serif, color: colors.text },
          ]}>
          {post.title}
        </ThemedText>

        <ThemedText
          style={[Typography.cardBody, { color: colors.textSecondary }]}
          numberOfLines={6}>
          {post.body}
        </ThemedText>

        <Pressable
          onPress={() => router.push(`/post/${post.id}`)}
          style={[styles.button, { borderColor: colors.text }]}>
          <ThemedText style={[styles.buttonText, { color: colors.text }]}>
            Continue Reading
          </ThemedText>
        </Pressable>
      </View>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageIndicator: {
    fontSize: 12,
    fontWeight: '500',
  },
  button: {
    borderWidth: 1.5,
    borderRadius: 24,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
