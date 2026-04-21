import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { Product, formatPrice, useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= Math.floor(rating) ? 'star' : i - 0.5 <= rating ? 'star-half' : 'star-outline'}
        size={16}
        color={COLORS.gold}
      />
    );
  }
  return stars;
};

// ========== BOTTOM SHEET: Chọn Size + Số lượng ==========
function AddToCartSheet({
  visible,
  onClose,
  product,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  product: Product;
  onConfirm: (size: string | null, qty: number) => void;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const sizes = ['Size 12', 'Size 14', 'Size 16', 'Size 18'];

  const handleConfirm = () => {
    onConfirm(selectedSize, quantity);
    setSelectedSize(null);
    setQuantity(1);
  };

  const total = product.price * quantity;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={sheetStyles.overlay} />
      </TouchableWithoutFeedback>
      <View style={sheetStyles.container}>
        {/* Handle bar */}
        <View style={sheetStyles.handleBar} />

        {/* Product preview */}
        <View style={sheetStyles.productPreview}>
          <View style={sheetStyles.previewImage}>
            <Ionicons name="diamond-outline" size={32} color={COLORS.borderLight} />
          </View>
          <View style={sheetStyles.previewInfo}>
            <Text style={sheetStyles.previewName} numberOfLines={2}>{product.name}</Text>
            <Text style={sheetStyles.previewPrice}>{formatPrice(product.price)}</Text>
            {product.originalPrice && (
              <Text style={sheetStyles.previewOldPrice}>{formatPrice(product.originalPrice)}</Text>
            )}
          </View>
          <TouchableOpacity style={sheetStyles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={sheetStyles.divider} />

        {/* Size Selection */}
        <View style={sheetStyles.section}>
          <Text style={sheetStyles.sectionLabel}>Kích thước</Text>
          <View style={sheetStyles.sizeGrid}>
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[sheetStyles.sizeChip, selectedSize === size && sheetStyles.sizeChipActive]}
                onPress={() => setSelectedSize(size)}>
                <Text style={[sheetStyles.sizeChipText, selectedSize === size && sheetStyles.sizeChipTextActive]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={sheetStyles.divider} />

        {/* Quantity */}
        <View style={sheetStyles.section}>
          <View style={sheetStyles.quantityRow}>
            <Text style={sheetStyles.sectionLabel}>Số lượng</Text>
            <View style={sheetStyles.quantityControl}>
              <TouchableOpacity
                style={[sheetStyles.qtyBtn, quantity <= 1 && sheetStyles.qtyBtnDisabled]}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}>
                <Ionicons name="remove" size={18} color={quantity <= 1 ? COLORS.textMuted : COLORS.white} />
              </TouchableOpacity>
              <Text style={sheetStyles.qtyText}>{quantity}</Text>
              <TouchableOpacity style={sheetStyles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
                <Ionicons name="add" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={sheetStyles.divider} />

        {/* Total + Confirm */}
        <View style={sheetStyles.footer}>
          <View>
            <Text style={sheetStyles.totalLabel}>Tổng cộng</Text>
            <Text style={sheetStyles.totalPrice}>{formatPrice(total)}</Text>
          </View>
          <TouchableOpacity style={sheetStyles.confirmBtn} onPress={handleConfirm}>
            <Ionicons name="bag-add-outline" size={18} color={COLORS.black} />
            <Text style={sheetStyles.confirmBtnText}>THÊM VÀO GIỎ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ========== MAIN SCREEN ==========
export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, addToCart, isInWishlist, toggleWishlist, isAuthenticated } = useAppContext();

  const product = products.find((p) => p.id === id);

  const liked = product ? isInWishlist(product.id) : false;
  const [showSheet, setShowSheet] = useState(false);
  const addAnim = useRef(new Animated.Value(1)).current;

  if (!product) {
    // Optional: Render a loading or not found state
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white', textAlign: 'center', marginTop: 50 }}>Sản phẩm không tồn tại.</Text>
      </View>
    );
  }

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    toggleWishlist(product.id);
  };

  const handleAddToCartPress = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setShowSheet(true);
  };

  const handleBuyNowPress = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    // Add to cart and navigate to checkout
    addToCart(product, 1, 'default');
    router.push('/checkout');
  };

  const handleConfirmAdd = (size: string | null, qty: number) => {
    addToCart(product, qty, size || 'default');
    setShowSheet(false);
    // Animation bounce feedback
    Animated.sequence([
      Animated.timing(addAnim, { toValue: 1.15, duration: 150, useNativeDriver: true }),
      Animated.timing(addAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />

      {/* Header */}
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi Tiết</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerBtn} onPress={handleToggleWishlist}>
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? COLORS.red : COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn}>
              <Ionicons name="share-outline" size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageSection}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="diamond-outline" size={80} color={COLORS.borderLight} />
          </View>
          {product.badge && (
            <View style={[
              styles.badge,
              product.badgeType === 'sale' && styles.badgeSale,
              product.badgeType === 'new' && styles.badgeNew,
            ]}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}
          <View style={styles.dotsRow}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>{renderStars(product.rating)}</View>
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.reviewCount}>({product.reviews} đánh giá)</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>{formatPrice(product.originalPrice)}</Text>
            )}
            {product.originalPrice && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Description */}
        <View style={styles.descSection}>
          <Text style={styles.sectionLabel}>Mô tả sản phẩm</Text>
          <Text style={styles.descText}>
            Sản phẩm được chế tác thủ công bởi các nghệ nhân lành nghề với hơn 20 năm kinh nghiệm.
            Chất liệu vàng 18K cao cấp, đảm bảo chất lượng và độ bền vượt trội.
            Thiết kế sang trọng, tinh tế phù hợp cho mọi dịp đặc biệt.
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Benefits */}
        <View style={styles.benefitsRow}>
          {[
            { icon: 'shield-checkmark-outline' as const, text: 'Bảo hành\nvĩnh viễn' },
            { icon: 'car-outline' as const, text: 'Giao hàng\nmiễn phí' },
            { icon: 'refresh-outline' as const, text: 'Đổi trả\n30 ngày' },
            { icon: 'diamond-outline' as const, text: 'Chính hãng\n100%' },
          ].map((b, i) => (
            <View key={i} style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Ionicons name={b.icon} size={20} color={COLORS.gold} />
              </View>
              <Text style={styles.benefitText}>{b.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Related products */}
        {related.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.sectionLabel}>Sản phẩm liên quan</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedList}>
              {related.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.relatedCard}
                  onPress={() => router.push(`/product/${p.id}` as any)}>
                  <View style={styles.relatedImage}>
                    <Ionicons name="diamond-outline" size={28} color={COLORS.borderLight} />
                  </View>
                  <Text style={styles.relatedName} numberOfLines={2}>{p.name}</Text>
                  <Text style={styles.relatedPrice}>{formatPrice(p.price)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom action bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomChatBtn}>
          <Ionicons name="chatbubble-outline" size={22} color={COLORS.gold} />
        </TouchableOpacity>
        <Animated.View style={{ flex: 1, transform: [{ scale: addAnim }] }}>
          <TouchableOpacity
            style={[styles.addToCartBtn, !product.inStock && styles.addToCartDisabled]}
            onPress={handleAddToCartPress}
            disabled={!product.inStock}>
            <Ionicons name="bag-add-outline" size={20} color={product.inStock ? COLORS.black : COLORS.textMuted} />
            <Text style={[styles.addToCartText, !product.inStock && styles.addToCartTextDisabled]}>
              {product.inStock ? 'THÊM VÀO GIỎ HÀNG' : 'HẾT HÀNG'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity
          style={styles.buyNowBtn}
          onPress={handleBuyNowPress}
          disabled={!product.inStock}>
          <Text style={styles.buyNowText}>MUA NGAY</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet Modal */}
      <AddToCartSheet
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        product={product}
        onConfirm={handleConfirmAdd}
      />
    </View>
  );
}

// ========== BOTTOM SHEET STYLES ==========
const sheetStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  container: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    paddingBottom: SPACING.xxxl,
    maxHeight: '70%',
  },
  handleBar: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  productPreview: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  previewImage: {
    width: 72, height: 72, borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.bgCardLight,
    justifyContent: 'center', alignItems: 'center',
  },
  previewInfo: { flex: 1, justifyContent: 'center' },
  previewName: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '500', marginBottom: SPACING.xs },
  previewPrice: { color: COLORS.gold, fontSize: FONT_SIZES.lg, fontWeight: '700' },
  previewOldPrice: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm, textDecorationLine: 'line-through' },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.border,
    justifyContent: 'center', alignItems: 'center',
  },
  divider: { height: 0.5, backgroundColor: COLORS.border, marginHorizontal: SPACING.xl },
  section: { padding: SPACING.xl },
  sectionLabel: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '500', marginBottom: SPACING.md },
  sizeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  sizeChip: {
    paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    minWidth: 80, alignItems: 'center',
  },
  sizeChipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  sizeChipText: { color: COLORS.textSecondary, fontSize: FONT_SIZES.md, fontWeight: '500' },
  sizeChipTextActive: { color: COLORS.black, fontWeight: '700' },
  quantityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  quantityControl: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xl,
    backgroundColor: COLORS.bgCardLight, borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  qtyBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center',
  },
  qtyBtnDisabled: { opacity: 0.4 },
  qtyText: {
    color: COLORS.white, fontSize: FONT_SIZES.xl, fontWeight: '700',
    minWidth: 28, textAlign: 'center',
  },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl,
  },
  totalLabel: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm, marginBottom: 2 },
  totalPrice: { color: COLORS.gold, fontSize: FONT_SIZES.xxl, fontWeight: '700' },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.gold, paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md,
  },
  confirmBtnText: { color: COLORS.black, fontSize: FONT_SIZES.md, fontWeight: '700', letterSpacing: 0.5 },
});

// ========== MAIN STYLES ==========
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  safeArea: { backgroundColor: COLORS.bgDark },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  },
  headerBtn: { padding: SPACING.xs },
  headerTitle: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '500' },
  headerRight: { flexDirection: 'row', gap: SPACING.md },

  imageSection: { height: 380, position: 'relative' },
  imagePlaceholder: {
    flex: 1, backgroundColor: COLORS.bgCardLight,
    justifyContent: 'center', alignItems: 'center',
  },
  badge: {
    position: 'absolute', top: SPACING.lg, left: SPACING.lg,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.sm,
  },
  badgeSale: { backgroundColor: COLORS.sale },
  badgeNew: { backgroundColor: COLORS.gold },
  badgeText: { color: COLORS.white, fontSize: FONT_SIZES.sm, fontWeight: '700' },
  dotsRow: {
    position: 'absolute', bottom: SPACING.lg,
    flexDirection: 'row', alignSelf: 'center', gap: SPACING.sm,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  dotActive: { backgroundColor: COLORS.gold, width: 24 },

  infoSection: { padding: SPACING.xl },
  category: { color: COLORS.gold, fontSize: FONT_SIZES.xs, letterSpacing: 2, fontWeight: '500', marginBottom: SPACING.sm },
  productName: { color: COLORS.white, fontSize: FONT_SIZES.xxl, fontWeight: '400', fontStyle: 'italic', lineHeight: 30, marginBottom: SPACING.md },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.lg },
  starsRow: { flexDirection: 'row', gap: 2 },
  ratingText: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '600' },
  reviewCount: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  price: { color: COLORS.white, fontSize: FONT_SIZES.xxxl, fontWeight: '700' },
  originalPrice: { color: COLORS.textMuted, fontSize: FONT_SIZES.lg, textDecorationLine: 'line-through' },
  discountBadge: { backgroundColor: COLORS.sale, paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  discountText: { color: COLORS.white, fontSize: FONT_SIZES.xs, fontWeight: '700' },

  divider: { height: 0.5, backgroundColor: COLORS.border, marginHorizontal: SPACING.xl },

  sectionLabel: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '500', marginBottom: SPACING.md },

  descSection: { padding: SPACING.xl },
  descText: { color: COLORS.textSecondary, fontSize: FONT_SIZES.md, lineHeight: 24 },

  benefitsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    padding: SPACING.xl, backgroundColor: COLORS.bgCard, marginHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg, borderWidth: 0.5, borderColor: COLORS.border,
    marginVertical: SPACING.xl,
  },
  benefitItem: { alignItems: 'center', gap: SPACING.sm },
  benefitIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(201, 169, 110, 0.12)', justifyContent: 'center', alignItems: 'center',
  },
  benefitText: { color: COLORS.textMuted, fontSize: FONT_SIZES.xs, textAlign: 'center', lineHeight: 16 },

  relatedSection: { padding: SPACING.xl },
  relatedList: { gap: SPACING.md },
  relatedCard: {
    width: 140, backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg, overflow: 'hidden',
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  relatedImage: {
    height: 120, backgroundColor: COLORS.bgCardLight,
    justifyContent: 'center', alignItems: 'center',
  },
  relatedName: { color: COLORS.white, fontSize: FONT_SIZES.sm, padding: SPACING.sm, lineHeight: 18 },
  relatedPrice: { color: COLORS.gold, fontSize: FONT_SIZES.sm, fontWeight: '700', paddingHorizontal: SPACING.sm, paddingBottom: SPACING.sm },

  bottomBar: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    backgroundColor: COLORS.bgCard, borderTopWidth: 0.5, borderColor: COLORS.border,
  },
  bottomChatBtn: {
    width: 48, height: 48, borderRadius: BORDER_RADIUS.md,
    borderWidth: 1, borderColor: COLORS.gold,
    justifyContent: 'center', alignItems: 'center',
  },
  addToCartBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.gold, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md,
  },
  addToCartDisabled: { backgroundColor: COLORS.bgCardLight },
  addToCartText: { color: COLORS.black, fontSize: FONT_SIZES.sm, fontWeight: '700', letterSpacing: 0.5 },
  addToCartTextDisabled: { color: COLORS.textMuted },
  buyNowBtn: {
    backgroundColor: COLORS.white, paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md,
  },
  buyNowText: { color: COLORS.black, fontSize: FONT_SIZES.sm, fontWeight: '700', letterSpacing: 0.5 },
});
