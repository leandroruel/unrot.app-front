import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PostScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Create Post</ThemedText>
      <ThemedText>Admin only — coming soon.</ThemedText>
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
