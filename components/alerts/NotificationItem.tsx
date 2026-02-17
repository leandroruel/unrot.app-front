import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Notification } from '@/types';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

interface NotificationItemProps {
  notification: Notification;
  onPress?: () => void;
}

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: notification.isRead ? 'transparent' : colors.cardQuote,
          borderBottomColor: colors.border,
        },
      ]}>
      <Image source={{ uri: notification.fromUser.avatarUrl }} style={styles.avatar} />
      <View style={styles.content}>
        <ThemedText style={styles.text} numberOfLines={2}>
          <ThemedText style={styles.name}>{notification.fromUser.name}</ThemedText>
          {' '}
          {notification.message}
        </ThemedText>
        <ThemedText style={[styles.time, { color: colors.textSecondary }]}>
          {timeAgo(notification.createdAt)}
        </ThemedText>
      </View>
      {!notification.isRead && <View style={[styles.dot, { backgroundColor: colors.accent }]} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm + 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  name: {
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
