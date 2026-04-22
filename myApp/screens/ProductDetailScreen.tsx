import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { Product, formatPrice, useAppContext } from '@/context/AppContext';
import { getProductReviews, addProductReview } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
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
            {product.image ? (
              <Image source={product.image} style={{ width: 72, height: 72, borderRadius: 8 }} resizeMode="cover" />
            ) : (
              <Ionicons name="diamond-outline" size={32} color={COLORS.borderLight} />
            )}
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
const IMAGE_HEIGHT = 420;

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, addToCart, isInWishlist, toggleWishlist, isAuthenticated, user } = useAppContext();

  const product = products.find((p) => p.id === id);

  const liked = product ? isInWishlist(product.id) : false;
  const [showSheet, setShowSheet] = useState(false);
  const addAnim = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  // Fade-in animations
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const slideAnim1 = useRef(new Animated.Value(30)).current;
  const slideAnim2 = useRef(new Animated.Value(30)).current;
  const slideAnim3 = useRef(new Animated.Value(30)).current;

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const loadReviews = async () => {
    if (!product) return;
    setLoadingReviews(true);
    const data = await getProductReviews(product.id);
    if (data.success) {
      setReviews(data.data || []);
    }
    setLoadingReviews(false);
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }
    if (!newComment.trim()) return;

    const userName = (user as any).displayName || user.email?.split('@')[0] || 'Khách';
    const res = await addProductReview(product!.id, user.uid, userName, newRating, newComment);
    if (res.success) {
      setShowReviewModal(false);
      setNewComment('');
      setNewRating(5);
      loadReviews(); 
    } else {
      alert('Đã có lỗi xảy ra khi gửi đánh giá');
    }
  };

  useEffect(() => {
    // Staggered fade-in animations
    Animated.stagger(200, [
      Animated.parallel([
        Animated.timing(fadeAnim1, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim1, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim2, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim2, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim3, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim3, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();

    loadReviews();
  }, [product]);

  // Parallax: ảnh di chuyển chậm hơn khi cuộn
  const imageTranslate = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT],
    outputRange: [0, IMAGE_HEIGHT * 0.4],
    extrapolate: 'clamp',
  });
  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.3, 1],
    extrapolate: 'clamp',
  });

  // Header background opacity: trong suốt → mờ đục khi cuộn
  const headerBgOpacity = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT - 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (!product) {
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
    addToCart(product, 1, 'default');
    router.push('/checkout');
  };

  const handleConfirmAdd = (size: string | null, qty: number) => {
    addToCart(product, qty, size || 'default');
    setShowSheet(false);
    Animated.sequence([
      Animated.timing(addAnim, { toValue: 1.15, duration: 150, useNativeDriver: true }),
      Animated.timing(addAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Animated Header - trong suốt → mờ đục */}
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Animated.View style={[styles.headerBg, { opacity: headerBgOpacity }]} />
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Animated.Text style={[styles.headerTitle, { opacity: headerBgOpacity }]}>
            {product.name}
          </Animated.Text>
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

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Parallax Product Image */}
        <View style={styles.imageSection}>
          <Animated.View style={[
            styles.imageWrapper,
            { transform: [{ translateY: imageTranslate }, { scale: imageScale }] }
          ]}>
            {product.image ? (
              <Image source={product.image} style={styles.productImage} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="diamond-outline" size={80} color={COLORS.borderLight} />
              </View>
            )}
          </Animated.View>

          {/* Gradient overlay: ảnh chuyển tiếp mượt sang nền tối */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', COLORS.bgDark]}
            style={styles.imageGradient}
          />

          {product.badge && (
            <View style={[
              styles.badge,
              product.badgeType === 'sale' && styles.badgeSale,
              product.badgeType === 'new' && styles.badgeNew,
            ]}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}
        </View>

        {/* Product Info - Fade in animation */}
        <Animated.View style={[styles.infoSection, { opacity: fadeAnim1, transform: [{ translateY: slideAnim1 }] }]}>
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
        </Animated.View>

        <View style={styles.divider} />

        {/* Description - Fade in animation */}
        <Animated.View style={[styles.descSection, { opacity: fadeAnim2, transform: [{ translateY: slideAnim2 }] }]}>
          <Text style={styles.sectionLabel}>Mô tả sản phẩm</Text>
          <Text style={styles.descText}>
            {product.description || 'Sản phẩm được chế tác thủ công bởi các nghệ nhân lành nghề với hơn 20 năm kinh nghiệm. Chất liệu vàng 18K cao cấp, đảm bảo chất lượng và độ bền vượt trội. Thiết kế sang trọng, tinh tế phù hợp cho mọi dịp đặc biệt.'}
          </Text>
        </Animated.View>

        <View style={styles.divider} />

        {/* Benefits - Fade in animation */}
        <Animated.View style={[styles.benefitsRow, { opacity: fadeAnim3, transform: [{ translateY: slideAnim3 }] }]}>
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
        </Animated.View>

        <View style={styles.divider} />

        {/* Real Reviews Section */}
        <View style={styles.reviewsSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Đánh giá thực tế ({reviews.length})</Text>
            <TouchableOpacity onPress={() => setShowReviewModal(true)}>
              <Text style={styles.writeReviewText}>Viết đánh giá</Text>
            </TouchableOpacity>
          </View>
          
          {loadingReviews ? (
            <Text style={{ color: COLORS.textMuted, paddingHorizontal: SPACING.xl }}>Đang tải đánh giá...</Text>
          ) : reviews.length === 0 ? (
            <Text style={{ color: COLORS.textMuted, paddingHorizontal: SPACING.xl }}>Chưa có đánh giá nào. Hãy là người đầu tiên!</Text>
          ) : (
            reviews.map((r, i) => (
              <View key={i} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{r.userName.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={styles.reviewUserInfo}>
                    <Text style={styles.reviewUserName}>{r.userName}</Text>
                    <View style={styles.reviewStars}>{renderStars(r.rating)}</View>
                  </View>
                  <Text style={styles.reviewDate}>
                    {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
                <Text style={styles.reviewComment}>{r.comment}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.divider} />

        {/* Related products */}
        {related.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.sectionLabel}>Sản phẩm liên quan</Text>
            <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedList}>
              {related.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.relatedCard}
                  onPress={() => router.push(`/product/${p.id}` as any)}>
                  <View style={styles.relatedImage}>
                    {p.image ? (
                      <Image source={p.image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    ) : (
                      <Ionicons name="diamond-outline" size={28} color={COLORS.borderLight} />
                    )}
                  </View>
                  <Text style={styles.relatedName} numberOfLines={2}>{p.name}</Text>
                  <Text style={styles.relatedPrice}>{formatPrice(p.price)}</Text>
                </TouchableOpacity>
              ))}
            </Animated.ScrollView>
          </View>
        )}

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

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

      {/* Full Screen Review Modal */}
      <Modal visible={showReviewModal} transparent animationType="slide" onRequestClose={() => setShowReviewModal(false)}>
        <View style={sheetStyles.overlay}>
          <View style={[sheetStyles.container, { marginTop: 'auto', padding: SPACING.xl }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl }}>
              <Text style={sheetStyles.sectionLabel}>Viết Đánh Giá</Text>
              <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            
            <Text style={{ color: COLORS.white, marginBottom: SPACING.sm }}>Đánh giá của bạn:</Text>
            <View style={{ flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setNewRating(star)}>
                  <Ionicons name={star <= newRating ? 'star' : 'star-outline'} size={32} color={COLORS.gold} />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={{ color: COLORS.white, marginBottom: SPACING.sm }}>Chi tiết đánh giá:</Text>
            <View style={{ backgroundColor: COLORS.bgDark, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, marginBottom: SPACING.xl }}>
              <TextInput 
                style={{ color: COLORS.white, minHeight: 100, textAlignVertical: 'top' }}
                placeholder="Ví dụ: Sản phẩm rất đẹp và sang trọng..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                value={newComment}
                onChangeText={setNewComment}
              />
            </View>

            <TouchableOpacity style={sheetStyles.confirmBtn} onPress={handleSubmitReview}>
              <Text style={[sheetStyles.confirmBtnText, { textAlign: 'center', flex: 1 }]}>GỬI ĐÁNH GIÁ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  safeArea: { backgroundColor: 'transparent', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  },
  headerBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.bgDark,
  },
  headerBtn: { padding: SPACING.xs, zIndex: 1 },
  headerTitle: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '500', flex: 1, textAlign: 'center', zIndex: 1 },
  headerRight: { flexDirection: 'row', gap: SPACING.md, zIndex: 1 },

  imageSection: { height: IMAGE_HEIGHT, position: 'relative', overflow: 'hidden' },
  imageWrapper: {
    width: '100%', height: '100%',
  },
  productImage: {
    width: '100%', height: '100%',
  },
  imagePlaceholder: {
    flex: 1, backgroundColor: COLORS.bgCardLight,
    justifyContent: 'center', alignItems: 'center',
  },
  imageGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 150,
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

  reviewsSection: { paddingVertical: SPACING.xxl },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg },
  writeReviewText: { color: COLORS.gold, fontSize: FONT_SIZES.sm, fontWeight: '500' },
  reviewCard: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.bgCardLight, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  reviewAvatarText: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '700' },
  reviewUserInfo: { flex: 1 },
  reviewUserName: { color: COLORS.white, fontSize: FONT_SIZES.sm, fontWeight: '500', marginBottom: 2 },
  reviewStars: { flexDirection: 'row' },
  reviewDate: { color: COLORS.textMuted, fontSize: FONT_SIZES.xs },
  reviewComment: { color: COLORS.textSecondary, fontSize: FONT_SIZES.sm, lineHeight: 22 },

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
