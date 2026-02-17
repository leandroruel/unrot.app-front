import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Dimensions, FlatList, Pressable, StyleSheet } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GAP = 2;
const ITEM_SIZE = (SCREEN_WIDTH - GAP * 2) / 3;

interface PostGridItem {
  id: string;
  thumbnailUrl: string;
}

interface PostGridProps {
  items: PostGridItem[];
}

export function PostGrid({ items }: PostGridProps) {
  const router = useRouter();

  return (
    <FlatList
      data={items}
      numColumns={3}
      scrollEnabled={false}
      keyExtractor={(item) => item.id}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <Pressable onPress={() => router.push(`/post/${item.id}`)}>
          <Image
            source={{ uri: item.thumbnailUrl }}
            style={styles.thumbnail}
            contentFit="cover"
            transition={200}
          />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    gap: GAP,
    marginBottom: GAP,
  },
  thumbnail: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
  },
});
