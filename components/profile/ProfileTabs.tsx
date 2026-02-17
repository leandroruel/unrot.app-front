import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ProfileTabKey = 'posts' | 'saved' | 'tagged';

interface ProfileTabsProps {
  activeTab: ProfileTabKey;
  onTabChange: (tab: ProfileTabKey) => void;
}

const tabs: { key: ProfileTabKey; label: string; icon: 'photo.on.rectangle' | 'bookmark' | 'tag' }[] = [
  { key: 'posts', label: 'POSTS', icon: 'photo.on.rectangle' },
  { key: 'saved', label: 'SAVED', icon: 'bookmark' },
  { key: 'tagged', label: 'TAGGED', icon: 'tag' },
];

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={[
              styles.tab,
              isActive && { borderBottomColor: colors.accent, borderBottomWidth: 2 },
            ]}>
            <IconSymbol
              name={tab.icon}
              size={20}
              color={isActive ? colors.accent : colors.textSecondary}
            />
            <ThemedText
              style={[
                styles.label,
                { color: isActive ? colors.accent : colors.textSecondary },
              ]}>
              {tab.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 4,
    gap: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
