import { Platform } from 'react-native';

const tintColorLight = '#4A90D9';
const tintColorDark = '#5AA3F0';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F5F5F5',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    cardQuote: '#E8F0F8',
    border: '#E8E8E8',
    textSecondary: '#8E8E93',
    accent: '#4A90D9',
    danger: '#FF3B30',
    badge: '#FF3B30',
    sponsored: '#FFF8F0',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#1C1C1E',
    cardQuote: '#1A2A3A',
    border: '#38383A',
    textSecondary: '#8E8E93',
    accent: '#5AA3F0',
    danger: '#FF453A',
    badge: '#FF453A',
    sponsored: '#2A2000',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const Typography = {
  feedLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 26,
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  statLabel: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
