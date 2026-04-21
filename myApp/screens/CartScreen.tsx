import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { formatPrice, useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, isAuthenticated } = useAppContext();
  const router = useRouter();

  const shipping = cartTotal >= 10000000 ? 0 : 50000;
  const total = cartTotal + shipping;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    // Proceed to checkout
    router.push('/checkout');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Giỏ Hàng</Text>
            <Text style={styles.headerSubtitle}>{cart.length} sản phẩm</Text>
          </View>
          {cart.length > 0 && (
            <TouchableOpacity onPress={clearCart}>
              <Text style={styles.clearText}>Xóa tất cả</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      {cart.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="bag-outline" size={64} color={COLORS.borderLight} />
          </View>
          <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
          <Text style={styles.emptyDesc}>
            Hãy khám phá các bộ sưu tập trang sức{'\n'}và thêm sản phẩm vào giỏ hàng
          </Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/(tabs)/collections' as any)}>
            <Text style={styles.emptyBtnText}>MUA SẮM NGAY</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemImage}>
                  <Ionicons name="diamond-outline" size={28} color={COLORS.borderLight} />
                </View>
                <View style={styles.itemDetails}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemCategory}>{item.category}</Text>
                    <TouchableOpacity onPress={() => removeFromCart(item.id, item.selectedSize || '')}>
                      <Ionicons name="trash-outline" size={18} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  {item.selectedSize && <Text style={styles.itemSize}>{item.selectedSize}</Text>}
                  <View style={styles.itemFooter}>
                    <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}>
                        <Ionicons name="remove" size={16} color={COLORS.white} />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}>
                        <Ionicons name="add" size={16} color={COLORS.white} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {/* Promo */}
            <View style={styles.promoSection}>
              <View style={styles.promoInput}>
                <Ionicons name="ticket-outline" size={18} color={COLORS.gold} />
                <Text style={styles.promoPlaceholder}>Nhập mã giảm giá</Text>
              </View>
              <TouchableOpacity style={styles.promoBtn}>
                <Text style={styles.promoBtnText}>ÁP DỤNG</Text>
              </TouchableOpacity>
            </View>

            {/* Summary */}
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tạm tính</Text>
                <Text style={styles.summaryValue}>{formatPrice(cartTotal)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
                <Text style={[styles.summaryValue, shipping === 0 && styles.freeShipping]}>
                  {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Tổng cộng</Text>
                <Text style={styles.totalValue}>{formatPrice(total)}</Text>
              </View>
              {shipping === 0 && (
                <View style={styles.freeShipBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.green} />
                  <Text style={styles.freeShipText}>Bạn được miễn phí vận chuyển!</Text>
                </View>
              )}
            </View>
            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Checkout */}
          <View style={styles.checkoutBar}>
            <View>
              <Text style={styles.checkoutLabel}>Tổng cộng</Text>
              <Text style={styles.checkoutTotal}>{formatPrice(total)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutBtnText}>THANH TOÁN</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  safeArea: { backgroundColor: COLORS.bgDark },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  },
  headerTitle: { color: COLORS.white, fontSize: FONT_SIZES.xxl, fontWeight: '300', fontStyle: 'italic' },
  headerSubtitle: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm, marginTop: 2 },
  clearText: { color: COLORS.red, fontSize: FONT_SIZES.sm },

  // Empty
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xxxl },
  emptyIconWrap: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: COLORS.bgCard, justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.xxl, borderWidth: 1, borderColor: COLORS.border,
  },
  emptyTitle: { color: COLORS.white, fontSize: FONT_SIZES.xl, fontWeight: '500', marginBottom: SPACING.md },
  emptyDesc: { color: COLORS.textMuted, fontSize: FONT_SIZES.md, textAlign: 'center', lineHeight: 22, marginBottom: SPACING.xxl },
  emptyBtn: { backgroundColor: COLORS.gold, paddingHorizontal: SPACING.xxxl, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.sm },
  emptyBtnText: { color: COLORS.black, fontSize: FONT_SIZES.sm, fontWeight: '700', letterSpacing: 1.5 },

  // Cart List
  cartList: { flex: 1 },
  cartItem: {
    flexDirection: 'row', marginHorizontal: SPACING.lg, marginBottom: SPACING.md,
    padding: SPACING.lg, backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg, borderWidth: 0.5, borderColor: COLORS.border, gap: SPACING.lg,
  },
  itemImage: {
    width: 80, height: 80, borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.bgCardLight, justifyContent: 'center', alignItems: 'center',
  },
  itemDetails: { flex: 1 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  itemCategory: { color: COLORS.gold, fontSize: FONT_SIZES.xs, letterSpacing: 1, fontWeight: '500' },
  itemName: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '400', marginBottom: SPACING.xs, lineHeight: 20 },
  itemSize: { color: COLORS.textMuted, fontSize: FONT_SIZES.xs, marginBottom: SPACING.sm },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemPrice: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '700' },
  quantityControl: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.bgCardLight, borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.xs, paddingVertical: SPACING.xs,
  },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center',
  },
  qtyText: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '600', minWidth: 20, textAlign: 'center' },

  // Promo
  promoSection: { flexDirection: 'row', marginHorizontal: SPACING.lg, marginVertical: SPACING.lg, gap: SPACING.md },
  promoInput: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.bgCard, borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  promoPlaceholder: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm },
  promoBtn: {
    backgroundColor: COLORS.gold, paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center',
  },
  promoBtnText: { color: COLORS.black, fontSize: FONT_SIZES.xs, fontWeight: '700', letterSpacing: 1 },

  // Summary
  summarySection: {
    marginHorizontal: SPACING.lg, padding: SPACING.xl,
    backgroundColor: COLORS.bgCard, borderRadius: BORDER_RADIUS.lg,
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  summaryTitle: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '500', marginBottom: SPACING.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  summaryLabel: { color: COLORS.textMuted, fontSize: FONT_SIZES.md },
  summaryValue: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '500' },
  freeShipping: { color: COLORS.green },
  divider: { height: 0.5, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  totalLabel: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '600' },
  totalValue: { color: COLORS.gold, fontSize: FONT_SIZES.xl, fontWeight: '700' },
  freeShipBadge: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    marginTop: SPACING.md, backgroundColor: 'rgba(46, 204, 113, 0.1)',
    padding: SPACING.md, borderRadius: BORDER_RADIUS.md,
  },
  freeShipText: { color: COLORS.green, fontSize: FONT_SIZES.sm },

  // Checkout
  checkoutBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg,
    backgroundColor: COLORS.bgCard, borderTopWidth: 0.5, borderColor: COLORS.border,
  },
  checkoutLabel: { color: COLORS.textMuted, fontSize: FONT_SIZES.xs },
  checkoutTotal: { color: COLORS.gold, fontSize: FONT_SIZES.xl, fontWeight: '700' },
  checkoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.gold, paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md,
  },
  checkoutBtnText: { color: COLORS.black, fontSize: FONT_SIZES.md, fontWeight: '700', letterSpacing: 1 },
});
