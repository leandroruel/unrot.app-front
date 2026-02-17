import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { InteractionsBar } from '@/components/feed/InteractionsBar';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePost, useSharePost, useToggleBookmark, useToggleLike } from '@/hooks/use-posts';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const { data: post, isLoading, error } = usePost(id);
  const likeMutation = useToggleLike();
  const bookmarkMutation = useToggleBookmark();
  const shareMutation = useSharePost();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ThemedText style={{ color: colors.textSecondary, fontSize: 16 }}>
          Post não encontrado
        </ThemedText>
      </View>
    );
  }

  const coverImage =
    post.type === 'video'
      ? post.thumbnailUrl
      : post.type === 'game'
        ? post.previewImage
        : null;

  const title = post.type === 'article' ? post.title : post.type === 'game' ? post.label : null;
  const body = post.type === 'article' ? post.body : post.type === 'quote' ? post.body : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cover image */}
        {coverImage && typeof coverImage === 'string' && (
          <Image
            source={{ uri: coverImage }}
            style={styles.coverImage}
            contentFit="cover"
            transition={200}
          />
        )}

        <View style={styles.content}>
          {/* Author */}
          <View style={styles.authorRow}>
            <Image
              source={{ uri: post.author.avatarUrl }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View>
              <ThemedText style={styles.authorName}>{post.author.name}</ThemedText>
              <ThemedText style={[styles.date, { color: colors.textSecondary }]}>
                {new Date(post.createdAt).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </ThemedText>
            </View>
          </View>

          {/* Title */}
          {title && <ThemedText style={styles.title}>{title}</ThemedText>}

          {/* Body */}
          {body && (
            <ThemedText style={[styles.body, { color: colors.text }]}>
              {body}
            </ThemedText>
          )}

          {/* Comments link */}
          <Pressable
            onPress={() => router.push(`/comments/${post.id}`)}
            style={[styles.commentsLink, { borderColor: colors.border }]}>
            <ThemedText style={[styles.commentsText, { color: colors.accent }]}>
              Ver comentários ({post.interactions.commentsCount})
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <InteractionsBar
          interactions={post.interactions}
          onLike={() => likeMutation.mutate(post.id)}
          onBookmark={() => bookmarkMutation.mutate(post.id)}
          onShare={() => shareMutation.mutate(post.id)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  coverImage: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  content: {
    padding: Spacing.md,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: Spacing.sm + 4,
    lineHeight: 30,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: Spacing.md,
  },
  commentsLink: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
  },
  commentsText: {
    fontSize: 15,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: 20,
  },
});
