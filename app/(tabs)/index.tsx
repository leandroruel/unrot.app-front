import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';

import { PostCard } from '@/components/cards/PostCard';
import { FeedHeader } from '@/components/feed/FeedHeader';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFeedStore } from '@/stores/feed-store';
import type { Post } from '@/types';

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const posts = useFeedStore((s) => s.posts);
  const isRefreshing = useFeedStore((s) => s.isRefreshing);
  const refreshFeed = useFeedStore((s) => s.refreshFeed);
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const toggleBookmark = useFeedStore((s) => s.toggleBookmark);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => {
      return (
        <PostCard
          post={item}
          onLike={() => toggleLike(item.id)}
          onBookmark={() => toggleBookmark(item.id)}
        />
      );
    },
    [toggleLike, toggleBookmark]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FeedHeader />
      <FlashList
        data={posts}
        renderItem={renderItem}
        estimatedItemSize={300}
        getItemType={(item) => item.type}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshFeed}
            tintColor={colors.tint}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingTop: 16,
    paddingBottom: 100,
  },
});
