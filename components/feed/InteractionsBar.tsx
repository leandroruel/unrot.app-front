import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { PostInteractions } from '@/types';

function formatCount(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
  }
  return String(n);
}

interface InteractionsBarProps {
  interactions: PostInteractions;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
}

export function InteractionsBar({
  interactions,
  onLike,
  onComment,
  onShare,
  onBookmark,
}: InteractionsBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const likeScale = useSharedValue(1);
  const bookmarkScale = useSharedValue(1);

  const likeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const bookmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.value }],
  }));

  const handleLike = () => {
    likeScale.value = withSequence(
      withTiming(1.3, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onLike?.();
  };

  const handleBookmark = () => {
    bookmarkScale.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onBookmark?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        <Pressable onPress={handleLike} style={styles.action} hitSlop={6}>
          <Animated.View style={likeAnimatedStyle}>
            <IconSymbol
              name={interactions.isLiked ? 'heart.fill' : 'heart'}
              size={20}
              color={interactions.isLiked ? colors.danger : colors.icon}
            />
          </Animated.View>
          <ThemedText style={[styles.count, { color: colors.textSecondary }]}>
            {formatCount(interactions.likesCount)}
          </ThemedText>
        </Pressable>

        <Pressable onPress={onComment} style={styles.action} hitSlop={6}>
          <IconSymbol name="bubble.left" size={20} color={colors.icon} />
          <ThemedText style={[styles.count, { color: colors.textSecondary }]}>
            {formatCount(interactions.commentsCount)}
          </ThemedText>
        </Pressable>

        <Pressable onPress={onShare} style={styles.action} hitSlop={6}>
          <IconSymbol name="square.and.arrow.up" size={20} color={colors.icon} />
        </Pressable>
      </View>

      <Pressable onPress={handleBookmark} hitSlop={6}>
        <Animated.View style={bookmarkAnimatedStyle}>
          <IconSymbol
            name={interactions.isBookmarked ? 'bookmark.fill' : 'bookmark'}
            size={20}
            color={interactions.isBookmarked ? colors.accent : colors.icon}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
  },
  count: {
    fontSize: 13,
    fontWeight: '600',
  },
});
