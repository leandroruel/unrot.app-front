import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';

import { PostCard } from '@/components/cards/PostCard';
import { FeedHeader } from '@/components/feed/FeedHeader';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFeed, useSharePost, useToggleBookmark, useToggleLike } from '@/hooks/use-posts';
import type { Post } from '@/types';

import { ThemedText } from '@/components/themed-text';

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { posts, isLoading, isRefetching, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFeed();
  const likeMutation = useToggleLike();
  const bookmarkMutation = useToggleBookmark();
  const shareMutation = useSharePost();

  const renderItem = useCallback(
    ({ item }: { item: Post }) => {
      return (
        <PostCard
          post={item}
          onLike={() => likeMutation.mutate(item.id)}
          onBookmark={() => bookmarkMutation.mutate(item.id)}
          onShare={() => shareMutation.mutate(item.id)}
        />
      );
    },
    [likeMutation, bookmarkMutation, shareMutation]
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <FeedHeader />
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
      </View>
    );
  }

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
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={colors.tint}
          />
        }
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={styles.footer} color={colors.accent} />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText style={{ color: colors.textSecondary, fontSize: 16 }}>
              Nenhum post ainda
            </ThemedText>
          </View>
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
  center: {
    alignItems: 'center',
  },
  list: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  footer: {
    paddingVertical: Spacing.md,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
});
