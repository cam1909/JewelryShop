import Header from '@/components/Header';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING, Theme } from '@/constants/theme';
import { formatPrice, useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WishlistScreen() {
  const { wishlist, products, toggleWishlist, addToCart, isAuthenticated, theme } = useAppContext();
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const router = useRouter();
  const currentTheme = Theme[theme];
  const isDarkMode = theme === 'dark';

  const handleAddToCart = (item: any) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    addToCart(item, 1, item.size || '');
    setAddedToCart(item.id);
    setTimeout(() => {
      setAddedToCart(null);
    }, 1000); // Hide message after 1 second
  };

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={currentTheme.background} />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]} edges={['top']}>
        <Header title="Yêu Thích" showBack={true} subtitle={`${wishlistedProducts.length} sản phẩm`} />
      </SafeAreaView>

      {wishlistedProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIconWrap, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
            <Ionicons name="heart-outline" size={64} color={currentTheme.textMuted} />
          </View>
          <Text style={[styles.emptyTitle, { color: currentTheme.text }]}>Chưa có sản phẩm yêu thích</Text>
          <Text style={[styles.emptyDesc, { color: currentTheme.textMuted }]}>
            Khám phá các bộ sưu tập và thêm những{'\n'}sản phẩm bạn yêu thích vào đây
          </Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/collections')}>
            <Text style={styles.emptyBtnText}>KHÁM PHÁ NGAY</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {wishlistedProducts.map((item) => (
              <View key={item.id} style={[styles.card, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
                <View style={styles.cardImageWrap}>
                  {item.image ? (
                    <Image source={item.image} style={styles.productImage} />
                  ) : (
                    <View style={[styles.cardImagePlaceholder, { backgroundColor: isDarkMode ? COLORS.bgCardLight : '#EAEAEA' }]}>
                      <Ionicons name="diamond-outline" size={36} color={currentTheme.textMuted} />
                    </View>
                  )}
                  <TouchableOpacity style={styles.removeBtn} onPress={() => toggleWishlist(item.id)}>
                    <Ionicons name="close" size={16} color={COLORS.white} />
                  </TouchableOpacity>
                  {!item.inStock && (
                    <View style={styles.outOfStockOverlay}>
                      <Text style={styles.outOfStockText}>HẾT HÀNG</Text>
                    </View>
                  )}
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardCategory}>{item.category}</Text>
                  <Text style={[styles.cardName, { color: currentTheme.text }]} numberOfLines={2}>{item.name}</Text>
                  <View style={styles.priceRow}>
                    <Text style={[styles.cardPrice, { color: currentTheme.text }]}>{formatPrice(item.price)}</Text>
                    {item.originalPrice && (
                      <Text style={[styles.cardOriginalPrice, { color: currentTheme.textMuted }]}>{formatPrice(item.originalPrice)}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.addToCartBtn,
                      !item.inStock && styles.addToCartDisabled,
                      addedToCart === item.id && styles.addedBtn,
                    ]}
                    disabled={!item.inStock || addedToCart === item.id}
                    onPress={() => handleAddToCart(item)}>
                    <Ionicons
                      name={addedToCart === item.id ? 'checkmark' : 'bag-add-outline'}
                      size={16}
                      color={item.inStock ? COLORS.black : COLORS.textMuted}
                    />
                    <Text
                      style={[
                        styles.addToCartText,
                        !item.inStock && styles.addToCartTextDisabled,
                      ]}>
                      {addedToCart === item.id ? 'ĐÃ THÊM' : item.inStock ? 'THÊM VÀO GIỎ' : 'HẾT HÀNG'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {},

  // Empty State
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xxxl },
  emptyIconWrap: {
    width: 120, height: 120, borderRadius: 60,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.xxl, borderWidth: 1,
  },
  emptyTitle: { fontSize: FONT_SIZES.xl, fontWeight: '500', marginBottom: SPACING.md },
  emptyDesc: { fontSize: FONT_SIZES.md, textAlign: 'center', lineHeight: 22, marginBottom: SPACING.xxl },
  emptyBtn: { backgroundColor: COLORS.gold, paddingHorizontal: SPACING.xxxl, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.sm },
  emptyBtnText: { color: COLORS.black, fontSize: FONT_SIZES.sm, fontWeight: '700', letterSpacing: 1.5 },

  // Grid
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: SPACING.lg,
  },
  card: {
    width: (SCREEN_WIDTH - SPACING.lg * 2 - SPACING.md) / 2,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden', marginBottom: SPACING.lg,
    borderWidth: 0.5,
  },
  cardImageWrap: { height: 180, position: 'relative' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardImagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  removeBtn: {
    position: 'absolute', top: SPACING.sm, right: SPACING.sm,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  outOfStockOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  outOfStockText: { color: COLORS.white, fontSize: FONT_SIZES.sm, fontWeight: '700', letterSpacing: 1 },

  cardInfo: { padding: SPACING.md },
  cardCategory: { color: COLORS.gold, fontSize: FONT_SIZES.xs, letterSpacing: 1, fontWeight: '500', marginBottom: SPACING.xs },
  cardName: { fontSize: FONT_SIZES.md, fontWeight: '400', marginBottom: SPACING.sm, lineHeight: 20 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  cardPrice: { fontSize: FONT_SIZES.md, fontWeight: '700' },
  cardOriginalPrice: { fontSize: FONT_SIZES.sm, textDecorationLine: 'line-through' },
  addToCartBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: SPACING.sm, backgroundColor: COLORS.gold,
    paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.sm,
  },
  addToCartDisabled: { backgroundColor: COLORS.bgCardLight },
  addedBtn: { backgroundColor: COLORS.green },
  addToCartText: { color: COLORS.black, fontSize: FONT_SIZES.xs, fontWeight: '700', letterSpacing: 1 },
  addToCartTextDisabled: { color: COLORS.textMuted },
});
