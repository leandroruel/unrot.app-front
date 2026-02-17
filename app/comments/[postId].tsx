import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAddComment, useComments, useDeleteComment } from '@/hooks/use-comments';
import type { ApiComment } from '@/types/api';

export default function CommentsScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [text, setText] = useState('');

  const { comments, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useComments(postId);
  const addComment = useAddComment(postId);
  const deleteComment = useDeleteComment(postId);

  const handleSend = () => {
    if (!text.trim()) return;
    addComment.mutate(text.trim());
    setText('');
  };

  const renderItem = useCallback(
    ({ item }: { item: ApiComment }) => (
      <View style={[styles.commentRow, { borderColor: colors.border }]}>
        <Image
          source={{
            uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.userId.slice(0, 8))}&background=random`,
          }}
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={styles.commentBody}>
          <View style={styles.commentHeader}>
            <ThemedText style={styles.commentAuthor}>{item.userId.slice(0, 8)}</ThemedText>
            <ThemedText style={[styles.commentDate, { color: colors.textSecondary }]}>
              {new Date(item.createdAt).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'short',
              })}
            </ThemedText>
          </View>
          <ThemedText style={[styles.commentText, { color: colors.text }]}>
            {item.content}
          </ThemedText>
        </View>
        <Pressable
          onPress={() => deleteComment.mutate(item.id)}
          hitSlop={8}
          style={styles.deleteBtn}>
          <IconSymbol name="trash" size={14} color={colors.textSecondary} />
        </Pressable>
      </View>
    ),
    [colors, deleteComment]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
      style={[styles.container, { backgroundColor: colors.background }]}>
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
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
            <View style={styles.center}>
              <ThemedText style={{ color: colors.textSecondary, fontSize: 15 }}>
                Nenhum comentário ainda
              </ThemedText>
            </View>
          }
        />
      )}

      {/* Input bar */}
      <View style={[styles.inputBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TextInput
          placeholder="Adicionar comentário..."
          placeholderTextColor={colors.textSecondary}
          value={text}
          onChangeText={setText}
          style={[styles.input, { color: colors.text }]}
          multiline
        />
        <Pressable
          onPress={handleSend}
          disabled={!text.trim() || addComment.isPending}
          style={[styles.sendBtn, { opacity: text.trim() ? 1 : 0.4 }]}>
          {addComment.isPending ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <IconSymbol name="paperplane.fill" size={20} color={colors.accent} />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  list: {
    paddingVertical: Spacing.sm,
    paddingBottom: 80,
  },
  commentRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm + 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentBody: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentDate: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 15,
    lineHeight: 22,
  },
  deleteBtn: {
    paddingTop: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
    paddingVertical: Spacing.sm,
  },
  sendBtn: {
    paddingBottom: Spacing.sm,
  },
  footer: {
    paddingVertical: Spacing.md,
  },
});
