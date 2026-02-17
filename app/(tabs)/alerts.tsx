import { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NotificationItem } from '@/components/alerts/NotificationItem';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useUserStore } from '@/stores/user-store';
import type { Notification } from '@/types';

export default function AlertsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const notifications = useUserStore((s) => s.notifications);
  const markAsRead = useUserStore((s) => s.markAsRead);
  const markAllAsRead = useUserStore((s) => s.markAllAsRead);

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationItem notification={item} onPress={() => markAsRead(item.id)} />
    ),
    [markAsRead]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: colors.card }]}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.headerTitle}>Notifications</ThemedText>
          <Pressable onPress={markAllAsRead} hitSlop={8}>
            <ThemedText style={[styles.markAll, { color: colors.accent }]}>Mark all read</ThemedText>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  markAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 100,
  },
});
