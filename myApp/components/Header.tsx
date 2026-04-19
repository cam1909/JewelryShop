import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';

interface HeaderProps {
  showMenu?: boolean;
  showSearch?: boolean;
  showNotification?: boolean;
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
  title,
  subtitle,
  rightIcon,
  onRightPress,
  onSearchPress,
}: HeaderProps) {
  // Brand header (Home)
  if (showMenu) {
    return (
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="menu-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.brandCenter}>
          <Text style={styles.brandName}>V E L M O R A</Text>
          <Text style={styles.brandSub}>JEWELRY HOUSE</Text>
        </View>
        <View style={styles.rightGroup}>
          {showSearch && (
            <TouchableOpacity style={styles.iconBtn} onPress={onSearchPress}>
              <Ionicons name="search-outline" size={22} color={COLORS.white} />
            </TouchableOpacity>
          )}
          {showNotification && (
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // Simple title header (other screens)
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      {rightIcon && (
        <TouchableOpacity onPress={onRightPress}>
          <Ionicons name={rightIcon} size={22} color={COLORS.white} />
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
    backgroundColor: COLORS.bgDark,
  },
  brandCenter: {
    alignItems: 'center',
  },
  brandName: {
    color: COLORS.white,
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
    color: COLORS.white,
    fontSize: FONT_SIZES.xxl,
    fontWeight: '300',
    fontStyle: 'italic',
  },
  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
});
