import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { CardWrapper } from '@/components/cards/CardWrapper';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { GamePost } from '@/types';

interface GameCardProps {
  post: GamePost;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
}

export function GameCard({ post, onLike, onComment, onShare, onBookmark }: GameCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <CardWrapper
      post={post}
      onLike={onLike}
      onComment={onComment}
      onShare={onShare}
      onBookmark={onBookmark}>
      {/* Game preview area */}
      <View style={styles.gameArea}>
        <Image
          source={{ uri: post.previewImageUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.overlay} />

        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.label}>{post.label}</ThemedText>
          <ThemedText style={styles.loadingText}>{post.loadingPercent}% LOADED</ThemedText>
        </View>

        {/* Center content */}
        <View style={styles.center}>
          <ThemedText style={styles.readyText}>READY TO PLAY</ThemedText>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.arrows}>
          <Pressable style={[styles.arrowButton, { borderColor: colors.border }]}>
            <IconSymbol name="arrow.left" size={22} color={colors.text} />
          </Pressable>
          <Pressable style={[styles.arrowButton, { borderColor: colors.border }]}>
            <IconSymbol name="arrow.right" size={22} color={colors.text} />
          </Pressable>
        </View>

        <Pressable style={styles.startButton}>
          <ThemedText style={styles.startText}>START</ThemedText>
        </Pressable>
      </View>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  gameArea: {
    aspectRatio: 4 / 3,
    position: 'relative',
    justifyContent: 'space-between',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 30, 20, 0.7)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.md,
    zIndex: 1,
  },
  label: {
    ...Typography.feedLabel,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  loadingText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  center: {
    alignItems: 'center',
    paddingBottom: Spacing.xl,
    zIndex: 1,
  },
  readyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
  },
  arrows: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  arrowButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 12,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.xl,
  },
  startText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
