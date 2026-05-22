import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING, Theme } from '@/constants/theme';
import { formatPrice, useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, isAuthenticated, theme } = useAppContext();
  const router = useRouter();
  const currentTheme = Theme[theme];
  const isDarkMode = theme === 'dark';

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
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={currentTheme.background} />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]} edges={['top']}>
        <View style={[styles.header, { borderBottomColor: currentTheme.border, borderBottomWidth: 0.5 }]}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: SPACING.md }}>
            <Ionicons name="arrow-back" size={24} color={currentTheme.text} />
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <Text style={[styles.headerTitle, { color: currentTheme.text }]}>Giỏ Hàng</Text>
            <Text style={[styles.headerSubtitle, { color: currentTheme.textMuted }]}>{cart.length} sản phẩm</Text>
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
          <View style={[styles.emptyIconWrap, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
            <Ionicons name="bag-outline" size={64} color={currentTheme.textMuted} />
          </View>
          <Text style={[styles.emptyTitle, { color: currentTheme.text }]}>Giỏ hàng trống</Text>
          <Text style={[styles.emptyDesc, { color: currentTheme.textMuted }]}>
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
              <View key={item.id} style={[styles.cartItem, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
                <View style={[styles.itemImage, { backgroundColor: isDarkMode ? COLORS.bgCardLight : '#EAEAEA' }]}>
                  {item.image ? (
                    <Image source={item.image} style={{ width: '100%', height: '100%', borderRadius: BORDER_RADIUS.md }} resizeMode="cover" />
                  ) : (
                    <Ionicons name="diamond-outline" size={28} color={currentTheme.textMuted} />
                  )}
                </View>
                <View style={styles.itemDetails}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemCategory}>{item.category}</Text>
                    <TouchableOpacity onPress={() => removeFromCart(item.id, item.selectedSize || '')}>
                      <Ionicons name="trash-outline" size={18} color={COLORS.red} />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.itemName, { color: currentTheme.text }]} numberOfLines={2}>{item.name}</Text>
                  {item.selectedSize && <Text style={[styles.itemSize, { color: currentTheme.textMuted }]}>{item.selectedSize}</Text>}
                  <View style={styles.itemFooter}>
                    <Text style={[styles.itemPrice, { color: currentTheme.text }]}>{formatPrice(item.price)}</Text>
                    <View style={[styles.quantityControl, { backgroundColor: isDarkMode ? COLORS.bgCardLight : '#EAEAEA' }]}>
                      <TouchableOpacity
                        style={[styles.qtyBtn, { backgroundColor: currentTheme.border }]}
                        onPress={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}>
                        <Ionicons name="remove" size={16} color={currentTheme.text} />
                      </TouchableOpacity>
                      <Text style={[styles.qtyText, { color: currentTheme.text }]}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={[styles.qtyBtn, { backgroundColor: currentTheme.border }]}
                        onPress={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}>
                        <Ionicons name="add" size={16} color={currentTheme.text} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {/* Summary */}
            <View style={[styles.summarySection, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
              <Text style={[styles.summaryTitle, { color: currentTheme.text }]}>Tóm tắt đơn hàng</Text>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: currentTheme.textMuted }]}>Tạm tính</Text>
                <Text style={[styles.summaryValue, { color: currentTheme.text }]}>{formatPrice(cartTotal)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: currentTheme.textMuted }]}>Phí vận chuyển</Text>
                <Text style={[styles.summaryValue, shipping === 0 && styles.freeShipping, { color: shipping === 0 ? COLORS.green : currentTheme.text }]}>
                  {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: currentTheme.border }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.totalLabel, { color: currentTheme.text }]}>Tổng cộng</Text>
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
          <View style={[styles.checkoutBar, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
            <View>
              <Text style={[styles.checkoutLabel, { color: currentTheme.textMuted }]}>Tổng cộng</Text>
              <Text style={styles.checkoutTotal}>{formatPrice(total)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutBtnText}>MUA NGAY</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {},
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  },
  headerTitle: { fontSize: FONT_SIZES.xxl, fontWeight: '300', fontStyle: 'italic' },
  headerSubtitle: { fontSize: FONT_SIZES.sm, marginTop: 2 },
  clearText: { color: COLORS.red, fontSize: FONT_SIZES.sm },

  // Empty
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

  // Cart List
  cartList: { flex: 1 },
  cartItem: {
    flexDirection: 'row', marginHorizontal: SPACING.lg, marginBottom: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg, borderWidth: 0.5, gap: SPACING.lg,
  },
  itemImage: {
    width: 80, height: 80, borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center', alignItems: 'center',
  },
  itemDetails: { flex: 1 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  itemCategory: { color: COLORS.gold, fontSize: FONT_SIZES.xs, letterSpacing: 1, fontWeight: '500' },
  itemName: { fontSize: FONT_SIZES.md, fontWeight: '400', marginBottom: SPACING.xs, lineHeight: 20 },
  itemSize: { fontSize: FONT_SIZES.xs, marginBottom: SPACING.sm },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemPrice: { fontSize: FONT_SIZES.md, fontWeight: '700' },
  quantityControl: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.xs, paddingVertical: SPACING.xs,
  },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  qtyText: { fontSize: FONT_SIZES.md, fontWeight: '600', minWidth: 20, textAlign: 'center' },

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
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 0.5,
  },
  summaryTitle: { fontSize: FONT_SIZES.lg, fontWeight: '500', marginBottom: SPACING.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  summaryLabel: { fontSize: FONT_SIZES.md },
  summaryValue: { fontSize: FONT_SIZES.md, fontWeight: '500' },
  freeShipping: { color: COLORS.green },
  divider: { height: 0.5, marginVertical: SPACING.md },
  totalLabel: { fontSize: FONT_SIZES.lg, fontWeight: '600' },
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
    borderTopWidth: 0.5,
  },
  checkoutLabel: { fontSize: FONT_SIZES.xs },
  checkoutTotal: { color: COLORS.gold, fontSize: FONT_SIZES.xl, fontWeight: '700' },
  checkoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.gold, paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md,
  },
  checkoutBtnText: { color: COLORS.black, fontSize: FONT_SIZES.md, fontWeight: '700', letterSpacing: 1 },
});
