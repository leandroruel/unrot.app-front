import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { PostGrid } from '@/components/profile/PostGrid';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs, type ProfileTabKey } from '@/components/profile/ProfileTabs';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePosts } from '@/hooks/use-posts';
import { useAuthStore } from '@/stores/auth-store';
import type { UserProfile } from '@/types';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ProfileTabKey>('posts');
  const logout = useAuthStore((s) => s.logout);

  // Simplified profile — API doesn't have a /me endpoint yet
  const user: UserProfile = {
    id: '1',
    name: 'Usuário',
    username: 'usuario',
    avatarUrl: 'https://ui-avatars.com/api/?name=User&background=random',
    bio: '',
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  };

  const { posts } = usePosts();
  const gridItems = posts.slice(0, 9).map((p) => ({
    id: p.id,
    thumbnailUrl:
      p.type === 'video'
        ? p.thumbnailUrl
        : p.type === 'game' && typeof p.previewImage === 'string'
          ? p.previewImage
          : `https://picsum.photos/seed/profile-${p.id}/400/400`,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header bar */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: colors.card }]}>
        <View style={styles.headerRow}>
          <Pressable hitSlop={8}>
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Profile</ThemedText>
          <Pressable hitSlop={8} onPress={logout}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingTop: Spacing.lg }}>
          <ProfileHeader user={user} />
        </View>

        <View style={{ marginTop: Spacing.md }}>
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </View>

        <View style={{ marginTop: 2 }}>
          <PostGrid items={gridItems} />
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
