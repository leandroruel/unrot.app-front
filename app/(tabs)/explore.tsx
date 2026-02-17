import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFeedStore } from '@/stores/feed-store';

const categories = [
  'All',
  'Articles',
  'Quotes',
  'Videos',
  'Games',
] as const;

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const posts = useFeedStore((s) => s.posts);
  const router = useRouter();

  // Simple trending grid from existing posts
  const trendingItems = posts
    .filter((p) => p.type !== 'sponsored')
    .slice(0, 6)
    .map((p) => ({
      id: p.id,
      imageUrl:
        p.type === 'video'
          ? p.thumbnailUrl
          : p.type === 'game'
            ? p.previewImageUrl
            : `https://picsum.photos/seed/explore-${p.id}/400/400`,
    }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: colors.card }]}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.headerTitle}>Explore</ThemedText>
        </View>

        {/* Search bar */}
        <View
          style={[styles.searchBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <IconSymbol name="magnifyingglass" size={18} color={colors.textSecondary} />
          <TextInput
            placeholder="Search posts, topics..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.text }]}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}>
          {categories.map((cat, i) => (
            <Pressable
              key={cat}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: i === 0 ? colors.accent : colors.card,
                  borderColor: colors.border,
                },
              ]}>
              <ThemedText
                style={[
                  styles.categoryText,
                  { color: i === 0 ? '#fff' : colors.text },
                ]}>
                {cat}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        {/* Trending grid */}
        <ThemedText style={styles.sectionTitle}>Trending</ThemedText>
        <View style={styles.grid}>
          {trendingItems.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.push(`/post/${item.id}`)}
              style={styles.gridItem}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.gridImage}
                contentFit="cover"
                transition={200}
              />
            </Pressable>
          ))}
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
    paddingBottom: Spacing.sm + 4,
  },
  headerRow: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  content: {
    paddingBottom: 100,
  },
  categories: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm + 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  gridItem: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
});
