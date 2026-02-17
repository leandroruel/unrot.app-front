import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function CommentsScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Comments</ThemedText>
      <ThemedText>Post ID: {postId}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
