// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols to Material Icons mappings.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation
  'house.fill': 'home',
  'magnifyingglass': 'search',
  'plus.circle.fill': 'add-circle',
  'bell.fill': 'notifications',
  'person.circle.fill': 'account-circle',
  'line.3.horizontal': 'menu',
  'chevron.left': 'chevron-left',
  'chevron.right': 'chevron-right',
  'gearshape': 'settings',
  'xmark': 'close',

  // Interactions
  'heart.fill': 'favorite',
  'heart': 'favorite-border',
  'bookmark.fill': 'bookmark',
  'bookmark': 'bookmark-border',
  'square.and.arrow.up': 'share',
  'bubble.left': 'chat-bubble-outline',

  // Content
  'play.fill': 'play-arrow',
  'speaker.wave.2': 'volume-up',
  'speaker.slash': 'volume-off',
  'arrow.left': 'arrow-back',
  'arrow.right': 'arrow-forward',
  'pencil': 'edit',
  'photo.on.rectangle': 'photo-library',
  'tag': 'label',
  'trash': 'delete',
  'rectangle.portrait.and.arrow.right': 'logout',

  // Existing
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
