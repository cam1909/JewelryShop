import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';

interface SectionHeaderProps {
  subtitle: string;
  title: string;
  onPress?: () => void;
}

export default function SectionHeader({ subtitle, title, onPress }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.divider} />
      {onPress && (
        <TouchableOpacity style={styles.viewAll} onPress={onPress}>
          <Text style={styles.viewAllText}>Xem tất cả</Text>
          <Ionicons name="arrow-forward" size={14} color={COLORS.gold} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    position: 'relative',
  },
  subtitle: {
    color: COLORS.gold,
    fontSize: FONT_SIZES.xs,
    letterSpacing: 3,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  title: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xxl,
    fontWeight: '300',
    fontStyle: 'italic',
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.gold,
    marginTop: SPACING.md,
    borderRadius: 1,
  },
  viewAll: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: -SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  viewAllText: {
    color: COLORS.gold,
    fontSize: FONT_SIZES.sm,
  },
});
