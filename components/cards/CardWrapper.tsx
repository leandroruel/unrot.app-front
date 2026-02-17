import { StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';

import { InteractionsBar } from '@/components/feed/InteractionsBar';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Post } from '@/types';

interface CardWrapperProps {
  post: Post;
  children: ReactNode;
  backgroundColor?: string;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
}

export function CardWrapper({
  post,
  children,
  backgroundColor,
  onLike,
  onComment,
  onShare,
  onBookmark,
}: CardWrapperProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: backgroundColor ?? colors.card,
          borderColor: colors.border,
        },
      ]}>
      {children}
      <InteractionsBar
        interactions={post.interactions}
        onLike={onLike}
        onComment={onComment}
        onShare={onShare}
        onBookmark={onBookmark}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
});
