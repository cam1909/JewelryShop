import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from "@/constants/theme";
import { useAppContext } from "@/context/AppContext";
import { api } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal } from "react-native";

const CheckoutScreen = () => {
  const router = useRouter();
  const { cart, cartTotal, user, clearCart, formatPrice, addresses, defaultPaymentMethod, bankAccounts, setPaymentMethod, fetchUserData } = useAppContext();

  const [voucher, setVoucher] = useState('');
  const [voucherApplied, setVoucherApplied] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'COD' | 'BANK_TRANSFER'>('COD');

  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'success' as 'success' | 'error' | 'info', onClose: undefined as (() => void) | undefined });

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info', onClose?: () => void) => {
    setAlertConfig({ visible: true, title, message, type, onClose });
  };
  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
    if (alertConfig.onClose) {
      alertConfig.onClose();
    }
  };

  // Khi vào Checkout, đảm bảo reload address mới nhất nếu ở bên Sổ địa chỉ về
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const currentAddress = addresses.find(a => a.isDefault) || addresses[0];

  const discountValue = voucherApplied === 'VELMORA10' ? cartTotal * 0.1 : 0; 
  const shipping = cartTotal >= 10000000 ? 0 : 50000;
  
  // Nếu dùng test code, đè tổng tiền về 2000đ
  const total = voucherApplied === 'TEST2K' ? 2000 : (cartTotal - discountValue + shipping);
  // Nếu voucher là TEST2K thì tiền giảm giá chỉ hiển thị cho vui kiểu bùa chú
  const displayDiscount = voucherApplied === 'TEST2K' ? (cartTotal + shipping - 2000) : discountValue;

  const handleApplyVoucher = () => {
    const code = voucher.trim().toUpperCase();
    if (code === 'TEST2K' && selectedPaymentMethod !== 'BANK_TRANSFER') {
      showAlert('Lỗi áp dụng', 'Mã siêu hời này chỉ khả dụng khi chọn thanh toán bằng Chuyển khoản / VietQR!', 'error');
      return;
    }

    if (code === 'VELMORA10' || code === 'TEST2K') {
      setVoucherApplied(code);
      showAlert(
        code === 'TEST2K' ? 'Áp dụng mã thành công!' : 'Áp dụng thành công', 
        code === 'TEST2K' ? 'Bạn đã áp dụng MÃ GIẢM GIÁ SIÊU HỜI! Đơn hàng được giảm thẳng về 2.000đ.' : 'Đã áp dụng mã giảm 10%!',
        'success'
      );
    } else {
      setVoucherApplied(null);
      showAlert('Mã không hợp lệ', 'Rất tiếc mã giảm giá này không tồn tại hoặc đã hết hạn.', 'error');
    }
  };

  const handleConfirmOrder = async () => {
    if (!user) {
      router.push("/login" as any);
      return;
    }
    if (cart.length === 0) {
      showAlert("Giỏ hàng trống", "Chưa có sản phẩm nào trong giỏ của bạn.", "error");
      return;
    }
    if (!currentAddress) {
      showAlert("Chưa có địa chỉ", "Bạn chưa có địa chỉ giao hàng. Vui lòng thêm địa chỉ nhé!", "info", () => {
        router.push("/addresses" as any);
      });
      return;
    }

    try {
      const result = await api.createOrder({
        userId: user.uid,
        items: cart,
        total: total,
        shipping: shipping,
        paymentMethod: selectedPaymentMethod,
      });

      if (result.success) {
        clearCart();
        showAlert("Đặt hàng thành công", "Đơn hàng của bạn đã được ghi nhận. Bạn có thể theo dõi tiến độ trong mục Đơn Hàng.", "success", () => {
          router.push("/orders" as any);
        });
      } else {
        showAlert("Lỗi đặt hàng", result.message || "Đã có lỗi xảy ra khi đặt hàng.", "error");
      }
    } catch (error) {
      console.error("Error creating order: ", error);
      showAlert("Lỗi kết nối", "Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.", "error");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Shipping Address Picker */}
        <TouchableOpacity style={styles.section} onPress={() => router.push("/addresses" as any)}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={20} color={COLORS.gold} />
            <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
          </View>
          
          <View style={styles.addressBox}>
            {currentAddress ? (
              <View style={styles.addressInfo}>
                <View style={styles.addrNameRow}>
                  <Text style={styles.addrName}>{currentAddress.name}</Text>
                  <Text style={styles.addrPhone}>{currentAddress.phone}</Text>
                </View>
                <Text style={styles.addrLine}>{currentAddress.address}</Text>
              </View>
            ) : (
              <View style={styles.addressInfo}>
                <Text style={styles.noAddrText}>Chưa có địa chỉ. Hãy nhấn vào đây để thêm địa chỉ giao hàng.</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </View>
        </TouchableOpacity>

        {/* Voucher */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pricetag-outline" size={20} color={COLORS.gold} />
            <Text style={styles.sectionTitle}>Thẻ quà tặng / Coupon</Text>
          </View>
          <View style={styles.voucherRow}>
            <TextInput
              style={styles.voucherInput}
              placeholder="Nhập mã giảm giá..."
              placeholderTextColor={COLORS.textMuted}
              value={voucher}
              onChangeText={setVoucher}
            />
            <TouchableOpacity style={styles.applyBtn} onPress={handleApplyVoucher}>
              <Text style={styles.applyBtnText}>Áp Dụng</Text>
            </TouchableOpacity>
          </View>
          <Text style={{color: COLORS.textMuted, fontSize: 12, marginTop: 8, fontStyle: 'italic'}}>* Gợi ý: Chọn loại "Chuyển khoản / VietQR" và nhập mã "TEST2K" để test đơn 2K</Text>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={20} color={COLORS.gold} />
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.paymentMethod, selectedPaymentMethod === 'COD' && styles.paymentMethodActive]} 
            onPress={() => {
              if (voucherApplied === 'TEST2K') {
                setVoucherApplied(null);
                setVoucher('');
                showAlert('Đã gỡ mã', 'Mã TEST2K đã tự động bị gỡ do chỉ áp dụng cho Chuyển khoản / VietQR.', 'info');
              }
              setSelectedPaymentMethod('COD');
            }}
          >
            <View style={styles.paymentLeft}>
              <Ionicons name="cash-outline" size={24} color={selectedPaymentMethod === 'COD' ? COLORS.gold : COLORS.textMuted} />
              <Text style={[styles.paymentText, selectedPaymentMethod === 'COD' && styles.paymentTextActive]}>Thanh toán khi nhận hàng (COD)</Text>
            </View>
            <Ionicons name={selectedPaymentMethod === 'COD' ? "radio-button-on" : "radio-button-off"} size={20} color={selectedPaymentMethod === 'COD' ? COLORS.gold : COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentMethod, selectedPaymentMethod === 'BANK_TRANSFER' && styles.paymentMethodActive]} 
            onPress={() => setSelectedPaymentMethod('BANK_TRANSFER')}
          >
            <View style={styles.paymentLeft}>
              <Ionicons name="qr-code-outline" size={24} color={selectedPaymentMethod === 'BANK_TRANSFER' ? COLORS.gold : COLORS.textMuted} />
              <Text style={[styles.paymentText, selectedPaymentMethod === 'BANK_TRANSFER' && styles.paymentTextActive]}>Chuyển khoản / VietQR</Text>
            </View>
            <Ionicons name={selectedPaymentMethod === 'BANK_TRANSFER' ? "radio-button-on" : "radio-button-off"} size={20} color={selectedPaymentMethod === 'BANK_TRANSFER' ? COLORS.gold : COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
          <View style={styles.divider} />
          {cart.map(item => (
            <View key={`${item.id}-${item.selectedSize}`} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.quantity}x {item.name} {item.selectedSize ? `(Size: ${item.selectedSize})` : ''}
              </Text>
              <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tiền hàng</Text>
            <Text style={styles.summaryValue}>{formatPrice(cartTotal)}</Text>
          </View>
          {voucherApplied && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, {color: COLORS.gold}]}>Khuyến mãi</Text>
              <Text style={[styles.summaryValue, {color: COLORS.gold}]}>-{formatPrice(displayDiscount)}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
            <Text style={styles.summaryValue}>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng thanh toán</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerTotalLabel}>Tổng thanh toán</Text>
          <Text style={styles.footerTotalValue}>{formatPrice(total)}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleConfirmOrder}>
          <Text style={styles.buttonText}>ĐẶT HÀNG</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={alertConfig.visible} transparent animationType="fade" onRequestClose={hideAlert}>
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <View style={styles.alertIconWrap}>
              <Ionicons 
                name={alertConfig.type === 'success' ? 'checkmark-circle' : alertConfig.type === 'error' ? 'close-circle' : 'information-circle'} 
                size={56} 
                color={alertConfig.type === 'success' ? '#4CAF50' : alertConfig.type === 'error' ? COLORS.red : COLORS.gold} 
              />
            </View>
            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
            <Text style={styles.alertMessage}>{alertConfig.message}</Text>
            <TouchableOpacity style={styles.alertBtn} onPress={hideAlert}>
              <Text style={styles.alertBtnText}>{alertConfig.type === 'success' ? 'TUYỆT VỜI!' : 'ĐÓNG'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.bgCard,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    marginLeft: SPACING.md,
    color: COLORS.white,
  },
  content: { flex: 1 },
  section: {
    backgroundColor: COLORS.bgCard,
    marginTop: SPACING.md,
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  
  // Address Picker
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgDark,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addressInfo: { flex: 1 },
  addrNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  addrName: { color: COLORS.white, fontWeight: 'bold', fontSize: FONT_SIZES.md, marginRight: SPACING.md },
  addrPhone: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm },
  addrLine: { color: COLORS.textSecondary, fontSize: FONT_SIZES.sm },
  noAddrText: { color: COLORS.red, fontSize: FONT_SIZES.sm, fontStyle: 'italic' },
  
  // Voucher
  voucherRow: { flexDirection: 'row', gap: SPACING.md },
  voucherInput: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    color: COLORS.white,
  },
  applyBtn: {
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  applyBtnText: { color: COLORS.black, fontWeight: 'bold' },

  // Payment
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  paymentMethodActive: { borderColor: COLORS.gold, backgroundColor: 'rgba(201, 169, 110, 0.05)' },
  paymentLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  paymentText: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm },
  paymentTextActive: { color: COLORS.gold, fontWeight: 'bold' },

  // Summary
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  itemName: { flex: 1, color: COLORS.textMuted, fontSize: FONT_SIZES.sm, marginRight: SPACING.md },
  itemPrice: { color: COLORS.white, fontSize: FONT_SIZES.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textMuted },
  summaryValue: { fontSize: FONT_SIZES.sm, color: COLORS.white, fontWeight: '500' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  totalLabel: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.white },
  totalValue: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.gold },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerTotalLabel: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm },
  footerTotalValue: { color: COLORS.gold, fontSize: FONT_SIZES.xl, fontWeight: 'bold' },
  button: {
    backgroundColor: COLORS.gold,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
  },
  buttonText: { color: COLORS.black, fontSize: FONT_SIZES.md, fontWeight: "bold" },
  alertOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  alertBox: { 
    width: '100%', backgroundColor: COLORS.bgCard, borderRadius: BORDER_RADIUS.xl, 
    padding: SPACING.xxl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border 
  },
  alertIconWrap: { marginBottom: SPACING.md },
  alertTitle: { color: COLORS.white, fontSize: FONT_SIZES.xl, fontWeight: '600', marginBottom: SPACING.sm, textAlign: 'center' },
  alertMessage: { color: COLORS.textSecondary, fontSize: FONT_SIZES.md, textAlign: 'center', marginBottom: SPACING.xxl, lineHeight: 22 },
  alertBtn: { 
    backgroundColor: COLORS.gold, paddingVertical: SPACING.md, paddingHorizontal: SPACING.xxl, 
    borderRadius: BORDER_RADIUS.full, width: '100%', alignItems: 'center' 
  },
  alertBtnText: { color: COLORS.black, fontSize: FONT_SIZES.md, fontWeight: '700', letterSpacing: 1 },
});

export default CheckoutScreen;
