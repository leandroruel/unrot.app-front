import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { PostGrid } from '@/components/profile/PostGrid';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs, type ProfileTabKey } from '@/components/profile/ProfileTabs';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { mockUser } from '@/data/mock-user';
import { useColorScheme } from '@/hooks/use-color-scheme';

const mockGridItems = Array.from({ length: 6 }, (_, i) => ({
  id: `grid-${i + 1}`,
  thumbnailUrl: `https://picsum.photos/seed/profile-${i + 1}/400/400`,
}));

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ProfileTabKey>('posts');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header bar */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: colors.card }]}>
        <View style={styles.headerRow}>
          <Pressable hitSlop={8}>
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Profile</ThemedText>
          <Pressable hitSlop={8}>
            <IconSymbol name="gearshape" size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingTop: Spacing.lg }}>
          <ProfileHeader user={mockUser} />
        </View>

        <View style={{ marginTop: Spacing.md }}>
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </View>

        <View style={{ marginTop: 2 }}>
          <PostGrid items={mockGridItems} />
        </View>
      </ScrollView>
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
});
