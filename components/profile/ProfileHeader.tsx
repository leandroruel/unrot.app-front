import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { UserProfile } from '@/types';

function formatStat(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return k >= 10 ? `${Math.round(k)}k` : `${k.toFixed(1)}k`;
  }
  return String(n);
}

interface ProfileHeaderProps {
  user: UserProfile;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.avatarUrl }} style={styles.avatar} contentFit="cover" />
        <Pressable style={[styles.editBadge, { backgroundColor: colors.accent }]}>
          <IconSymbol name="pencil" size={14} color="#fff" />
        </Pressable>
      </View>

      {/* Name & Bio */}
      <ThemedText style={styles.name}>{user.name}</ThemedText>
      <ThemedText style={[styles.bio, { color: colors.textSecondary }]}>{user.bio}</ThemedText>

      {/* Stats */}
      <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.stat}>
          <ThemedText style={styles.statValue}>{formatStat(user.postsCount)}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>POSTS</ThemedText>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <ThemedText style={styles.statValue}>{formatStat(user.followersCount)}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
            FOLLOWERS
          </ThemedText>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <ThemedText style={styles.statValue}>{formatStat(user.followingCount)}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
            FOLLOWING
          </ThemedText>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Pressable style={[styles.outlineButton, { borderColor: colors.border }]}>
          <IconSymbol name="pencil" size={16} color={colors.text} />
          <ThemedText style={[styles.outlineButtonText, { color: colors.text }]}>
            Edit Profile
          </ThemedText>
        </Pressable>
        <Pressable style={[styles.filledButton, { backgroundColor: colors.accent }]}>
          <IconSymbol name="square.and.arrow.up" size={16} color="#fff" />
          <ThemedText style={styles.filledButtonText}>Share Profile</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    width: '100%',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm + 4,
    width: '100%',
  },
  outlineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: Spacing.sm + 4,
  },
  outlineButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  filledButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: 12,
    paddingVertical: Spacing.sm + 4,
  },
  filledButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
