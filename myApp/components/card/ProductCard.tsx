import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Product, formatPrice, useAppContext } from '@/context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProductCardProps {
  product: Product;
  cardWidth?: number;
  onPress?: () => void;
}

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= Math.floor(rating) ? 'star' : i - 0.5 <= rating ? 'star-half' : 'star-outline'}
        size={12}
        color={COLORS.gold}
      />
    );
  }
  return stars;
};

export default function ProductCard({ product, cardWidth, onPress }: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useAppContext();
  const liked = isInWishlist(product.id);
  const width = cardWidth || (SCREEN_WIDTH - SPACING.lg * 2 - SPACING.md) / 2;

  const toggleWishlist = () => {
    if (liked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { width }]}
      activeOpacity={0.8}
      onPress={onPress}>
      {/* Image */}
      <View style={styles.imageWrap}>
        <View style={styles.imagePlaceholder}>
          <Ionicons name="diamond-outline" size={40} color={COLORS.borderLight} />
        </View>

        {/* Badge */}
        {product.badge && (
          <View
            style={[
              styles.badge,
              product.badgeType === 'sale' && styles.badgeSale,
              product.badgeType === 'new' && styles.badgeNew,
              product.badgeType === 'outofstock' && styles.badgeOutOfStock,
            ]}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}

        {/* Wishlist button */}
        <TouchableOpacity style={styles.wishlistBtn} onPress={toggleWishlist}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={20}
            color={liked ? COLORS.red : COLORS.white}
          />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>{formatPrice(product.originalPrice)}</Text>
          )}
        </View>
        <View style={styles.ratingRow}>
          <View style={styles.starsRow}>{renderStars(product.rating)}</View>
          <Text style={styles.reviewCount}>({product.reviews})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  imageWrap: {
    height: 200,
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: COLORS.bgCardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeSale: { backgroundColor: COLORS.sale },
  badgeNew: { backgroundColor: COLORS.gold },
  badgeOutOfStock: { backgroundColor: COLORS.outOfStock },
  badgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
  wishlistBtn: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: SPACING.md,
  },
  category: {
    color: COLORS.gold,
    fontSize: FONT_SIZES.xs,
    letterSpacing: 1,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  name: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '400',
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  price: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  originalPrice: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1,
  },
  reviewCount: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
  },
});
