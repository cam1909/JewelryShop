import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Collection } from '@/context/AppContext';

interface CollectionCardProps {
  collection: Collection;
  onPress?: () => void;
}

export default function CollectionCard({ collection, onPress }: CollectionCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.imagePlaceholder}>
        <Ionicons name="diamond-outline" size={36} color={COLORS.borderLight} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{collection.title}</Text>
        <Text style={styles.subtitle}>{collection.subtitle}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {collection.description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.gold} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    gap: SPACING.lg,
  },
  imagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.bgCardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '500',
    marginBottom: 2,
  },
  subtitle: {
    color: COLORS.gold,
    fontSize: FONT_SIZES.xs,
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  description: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    lineHeight: 18,
  },
});
