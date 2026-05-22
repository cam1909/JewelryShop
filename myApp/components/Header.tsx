import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, Theme } from '@/constants/theme';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';

interface HeaderProps {
  showMenu?: boolean;
  showSearch?: boolean;
  showNotification?: boolean;
  showBack?: boolean;
  title?: string;
  subtitle?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  onSearchPress?: () => void;
}

export default function Header({
  showMenu = false,
  showSearch = false,
  showNotification = false,
  showBack = false,
  title,
  subtitle,
  rightIcon,
  onRightPress,
  onSearchPress,
}: HeaderProps) {
  const router = useRouter();
  const navigation = useNavigation();
  const { theme } = useAppContext();
  const currentTheme = Theme[theme];

  // Brand header (Home)
  if (showMenu) {
    return (
      <View style={[styles.header, { backgroundColor: currentTheme.background, borderBottomColor: currentTheme.border, borderBottomWidth: 0.5 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="menu-outline" size={24} color={currentTheme.text} />
        </TouchableOpacity>
        <View style={styles.brandCenter}>
          <Text style={[styles.brandName, { color: currentTheme.text }]}>V E L M O R A</Text>
          <Text style={[styles.brandSub, { color: currentTheme.accent || COLORS.gold }]}>JEWELRY HOUSE</Text>
        </View>
        <View style={styles.rightGroup}>
          {showSearch && (
            <TouchableOpacity style={styles.iconBtn} onPress={onSearchPress}>
              <Ionicons name="search-outline" size={22} color={currentTheme.text} />
            </TouchableOpacity>
          )}
          {showNotification && (
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={22} color={currentTheme.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // Simple title header (other screens)
  return (
    <View style={[styles.header, { backgroundColor: currentTheme.background, borderBottomColor: currentTheme.border, borderBottomWidth: 0.5 }]}>
      {showBack && (
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: SPACING.md }}>
          <Ionicons name="arrow-back" size={24} color={currentTheme.text} />
        </TouchableOpacity>
      )}
      <View style={{ flex: 1 }}>
        <Text style={[styles.headerTitle, { color: currentTheme.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.headerSubtitle, { color: currentTheme.textMuted }]}>{subtitle}</Text>}
      </View>
      {rightIcon && (
        <TouchableOpacity onPress={onRightPress}>
          <Ionicons name={rightIcon} size={22} color={currentTheme.text} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  brandCenter: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '300',
    letterSpacing: 6,
  },
  brandSub: {
    color: COLORS.gold,
    fontSize: FONT_SIZES.xs,
    letterSpacing: 4,
    marginTop: 2,
    fontWeight: '400',
  },
  rightGroup: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  iconBtn: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '300',
    fontStyle: 'italic',
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
});
