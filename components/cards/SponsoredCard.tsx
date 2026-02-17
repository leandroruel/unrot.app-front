import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { CardWrapper } from '@/components/cards/CardWrapper';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { SponsoredPost } from '@/types';

interface SponsoredCardProps {
  post: SponsoredPost;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
}

export function SponsoredCard({ post, onLike, onComment, onShare, onBookmark }: SponsoredCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <CardWrapper
      post={post}
      backgroundColor={colors.sponsored}
      onLike={onLike}
      onComment={onComment}
      onShare={onShare}
      onBookmark={onBookmark}>
      <View style={styles.content}>
        <Image
          source={{ uri: post.iconUrl }}
          style={styles.icon}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <ThemedText style={[styles.title, { color: colors.text }]}>{post.title}</ThemedText>
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>SPONSORED</ThemedText>
            </View>
          </View>
          <ThemedText style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {post.description}
          </ThemedText>
        </View>
        <Pressable style={[styles.actionButton, { backgroundColor: colors.accent }]}>
          <ThemedText style={styles.actionText}>{post.actionLabel}</ThemedText>
        </Pressable>
      </View>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm + 4,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});
