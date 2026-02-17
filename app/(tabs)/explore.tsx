import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCategories } from '@/hooks/use-categories';
import { usePosts } from '@/hooks/use-posts';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(undefined);

  const { data: categories } = useCategories();
  const { posts, isLoading } = usePosts(selectedSlug);

  const categoryList = [
    { id: 0, name: 'All', slug: undefined as string | undefined },
    ...(categories?.map((c) => ({ ...c, slug: c.slug as string | undefined })) ?? []),
  ];

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
          {categoryList.map((cat) => {
            const isActive = cat.slug === selectedSlug;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedSlug(cat.slug)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isActive ? colors.accent : colors.card,
                    borderColor: colors.border,
                  },
                ]}>
                <ThemedText
                  style={[
                    styles.categoryText,
                    { color: isActive ? '#fff' : colors.text },
                  ]}>
                  {cat.name}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Posts grid */}
        <ThemedText style={styles.sectionTitle}>
          {selectedSlug ? categoryList.find((c) => c.slug === selectedSlug)?.name : 'Trending'}
        </ThemedText>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
        ) : posts.length === 0 ? (
          <View style={styles.empty}>
            <ThemedText style={{ color: colors.textSecondary, fontSize: 15 }}>
              Nenhum post encontrado
            </ThemedText>
          </View>
        ) : (
          <View style={styles.grid}>
            {posts.slice(0, 12).map((item) => {
              const imageUrl =
                item.type === 'video'
                  ? item.thumbnailUrl
                  : item.type === 'game'
                    ? item.previewImage
                    : item.type === 'image'
                      ? item.imageUrl
                      : `https://picsum.photos/seed/explore-${item.id}/400/400`;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => router.push(`/post/${item.id}`)}
                  style={styles.gridItem}>
                  <Image
                    source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
                    style={styles.gridImage}
                    contentFit="cover"
                    transition={200}
                  />
                </Pressable>
              );
            })}
          </View>
        )}
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
  empty: {
    alignItems: 'center',
    paddingTop: 40,
  },
});
