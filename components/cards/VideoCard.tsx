import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { CardWrapper } from '@/components/cards/CardWrapper';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing } from '@/constants/theme';
import type { VideoPost } from '@/types';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface VideoCardProps {
  post: VideoPost;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
}

export function VideoCard({ post, onLike, onComment, onShare, onBookmark }: VideoCardProps) {
  const progress = post.durationSeconds > 0 ? post.currentTimeSeconds / post.durationSeconds : 0;

  return (
    <CardWrapper
      post={post}
      onLike={onLike}
      onComment={onComment}
      onShare={onShare}
      onBookmark={onBookmark}>
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: post.thumbnailUrl }}
          style={styles.thumbnail}
          contentFit="cover"
          transition={200}
        />

        {/* Play button overlay */}
        <Pressable style={styles.playButton}>
          <View style={styles.playCircle}>
            <IconSymbol name="play.fill" size={28} color="#fff" />
          </View>
        </Pressable>

        {/* Bottom controls */}
        <View style={styles.controls}>
          <Pressable>
            <IconSymbol name="speaker.wave.2" size={18} color="#fff" />
          </Pressable>

          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
          </View>

          <ThemedText style={styles.time}>
            {formatTime(post.currentTimeSeconds)} / {formatTime(post.durationSeconds)}
          </ThemedText>
        </View>
      </View>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  thumbnailContainer: {
    aspectRatio: 16 / 9,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 3,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 4,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  progressContainer: {
    flex: 1,
  },
  progressTrack: {
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 1.5,
    backgroundColor: '#fff',
  },
  time: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
