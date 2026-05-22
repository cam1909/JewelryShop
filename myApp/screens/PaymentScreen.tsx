import Header from '@/components/Header';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING, Theme } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { api } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Clipboard,
  ScrollView
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentScreen() {
  const router = useRouter();
  const { formatPrice, theme } = useAppContext();
  const currentTheme = Theme[theme];
  const isDarkMode = theme === 'dark';
  const { orderId, total } = useLocalSearchParams();
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingQr, setLoadingQr] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  // Lấy link thanh toán PayOS
  React.useEffect(() => {
    if (!orderId) return;
    const fetchPayOS = async () => {
      try {
        const res = await api.createPaymentLink(orderId as string);
        if (res.success && res.data) {
          setPaymentInfo(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingQr(false);
      }
    };
    fetchPayOS();
  }, [orderId]);

  // Polling check trạng thái đơn hàng (Webhooks update)
  React.useEffect(() => {
    if (!orderId) return;
    
    // Mỗi 3 giây tự động gọi lên Backend hỏi xem Cổng Ngân hàng (Webhook) 
    // đã gạch nợ cho Order này chưa.
    let interval = setInterval(async () => {
      try {
        const res = await api.getOrder(orderId as string);
        if (res.success && res.data) {
          if (res.data.status === 'shipping' || res.data.status === 'paid') {
            clearInterval(interval);
            
            // Tự động đóng cái giỏ in-app WebBrowser luôn khi tiền về!
            WebBrowser.dismissBrowser();

             showAlert('Thành công', 'Hệ thống đã nhận được tiền chuyển khoản. Cảm ơn quý khách!', 'success', () => {
              router.replace('/orders' as any);
            });
          }
        }
      } catch (e) {}
    }, 3000);
    
    return () => clearInterval(interval);
  }, [orderId]);

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

  const handleConfirmPayment = async () => {
    if (!orderId) return;
    
    setIsUpdating(true);
    try {
      const result = await api.updateOrderStatus(orderId as string, 'shipping');
      if (result.success) {
        showAlert('Thành công', 'Thanh toán của bạn đã được xác nhận!', 'success', () => {
          router.replace('/orders' as any);
        });
      } else {
        showAlert('Lỗi', 'Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại!', 'error');
      }
    } catch (e) {
      console.error(e);
      showAlert('Lỗi', 'Lỗi kết nối máy chủ.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!orderId) {
    return (
      <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
        <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]} edges={['top']}>
          <Header title="Lỗi thanh toán" showBack={true} />
        </SafeAreaView>
        <View style={styles.center}>
          <Ionicons name="warning-outline" size={64} color={COLORS.red} />
          <Text style={[styles.emptyText, { color: currentTheme.textMuted }]}>Không tìm thấy thông tin đơn hàng</Text>
        </View>
      </View>
    );
  }

  const orderTotal = Number(total) || 0;

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={currentTheme.background} />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]} edges={['top']}>
        <Header title="Thanh Toán QR" showBack={true} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.qrModalContent, { backgroundColor: currentTheme.card }]}>
          <Text style={[styles.qrDesc, { color: currentTheme.textMuted }]}>
            Quét mã VietQR này bằng ứng dụng ngân hàng để hoàn tất thanh toán tự động.
          </Text>
          
          <View style={[styles.qrBox, { backgroundColor: currentTheme.background, borderColor: currentTheme.border }]}>
            {loadingQr ? (
              <ActivityIndicator size="large" color={currentTheme.accent} style={{marginVertical: 40}} />
            ) : paymentInfo ? (
              <View style={{alignItems: 'center'}}>
                {/* VietQR Header logo banner */}
                <View style={styles.vietQrHeader}>
                  <Text style={[styles.vietQrTitle, { color: currentTheme.accent }]}>VietQR</Text>
                  <Text style={[styles.vietQrSub, { color: currentTheme.textMuted }]}>Chuyển khoản nhanh 24/7</Text>
                </View>
                
                {/* QR Code image */}
                <Image 
                  source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(paymentInfo.qrCode)}` }} 
                  style={styles.qrImage} 
                />

                {/* Amount Display */}
                <Text style={[styles.qrTotal, { color: currentTheme.accent }]}>
                  {formatPrice(paymentInfo.amount)}
                </Text>
              </View>
            ) : (
              <Text style={{ color: currentTheme.text }}>Lỗi khởi tạo cổng thanh toán. Vui lòng thử lại.</Text>
            )}
          </View>

          {/* Dấu hiệu cho thấy app đang tìm kiếm tiền vào tài khoản */}
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 16, alignSelf: 'center'}}>
            <ActivityIndicator size="small" color={currentTheme.accent} />
            <Text style={{color: currentTheme.textMuted, marginLeft: 8, fontStyle: 'italic'}}>Đang chờ hệ thống xác nhận tiền về...</Text>
          </View>

          {/* Transfer details section */}
          {paymentInfo && (
            <View style={[styles.detailsBox, { backgroundColor: currentTheme.background, borderColor: currentTheme.border }]}>
              <Text style={[styles.detailsTitle, { color: currentTheme.text }]}>Chi Tiết Chuyển Khoản Thủ Công</Text>
              
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: currentTheme.textMuted }]}>Ngân hàng</Text>
                <Text style={[styles.detailValue, { color: currentTheme.text }]}>VietinBank</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: currentTheme.textMuted }]}>Số tài khoản</Text>
                <View style={styles.rowRightCopy}>
                  <Text style={[styles.detailValue, { color: currentTheme.text }]}>{paymentInfo.accountNumber}</Text>
                  <TouchableOpacity onPress={() => {
                    Clipboard.setString(paymentInfo.accountNumber);
                    showAlert('Đã sao chép', 'Đã sao chép Số tài khoản thành công!', 'success');
                  }}>
                    <Ionicons name="copy-outline" size={16} color={currentTheme.accent} style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: currentTheme.textMuted }]}>Tên tài khoản</Text>
                <Text style={[styles.detailValue, { color: currentTheme.text }]}>{paymentInfo.accountName}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: currentTheme.textMuted }]}>Số tiền</Text>
                <View style={styles.rowRightCopy}>
                  <Text style={[styles.detailValue, { color: currentTheme.accent, fontWeight: '700' }]}>{formatPrice(paymentInfo.amount)}</Text>
                  <TouchableOpacity onPress={() => {
                    Clipboard.setString(String(paymentInfo.amount));
                    showAlert('Đã sao chép', 'Đã sao chép Số tiền thành công!', 'success');
                  }}>
                    <Ionicons name="copy-outline" size={16} color={currentTheme.accent} style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: currentTheme.textMuted }]}>Nội dung</Text>
                <View style={styles.rowRightCopy}>
                  <Text style={[styles.detailValue, { color: currentTheme.text }]}>{paymentInfo.description}</Text>
                  <TouchableOpacity onPress={() => {
                    Clipboard.setString(paymentInfo.description);
                    showAlert('Đã sao chép', 'Đã sao chép Nội dung chuyển khoản thành công!', 'success');
                  }}>
                    <Ionicons name="copy-outline" size={16} color={currentTheme.accent} style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {paymentInfo && (
            <TouchableOpacity 
              style={{marginTop: 16, padding: 8, alignSelf: 'center'}}
              onPress={() => WebBrowser.openBrowserAsync(paymentInfo.checkoutUrl)}
            >
              <Text style={{color: currentTheme.accent, textDecorationLine: 'underline', fontSize: 13}}>Mở cổng thanh toán trên web (nếu cần)</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Modal visible={alertConfig.visible} transparent animationType="fade" onRequestClose={hideAlert}>
        <View style={styles.alertOverlay}>
          <View style={[styles.alertBox, { backgroundColor: currentTheme.background, borderColor: currentTheme.border, borderWidth: 1 }]}>
            <View style={styles.alertIconWrap}>
              <Ionicons 
                name={alertConfig.type === 'success' ? 'checkmark-circle' : alertConfig.type === 'error' ? 'close-circle' : 'information-circle'} 
                size={56} 
                color={alertConfig.type === 'success' ? '#4CAF50' : alertConfig.type === 'error' ? COLORS.red : currentTheme.accent} 
              />
            </View>
            <Text style={[styles.alertTitle, { color: currentTheme.text }]}>{alertConfig.title}</Text>
            <Text style={[styles.alertMessage, { color: currentTheme.textMuted }]}>{alertConfig.message}</Text>
            <TouchableOpacity style={[styles.alertBtn, { backgroundColor: currentTheme.accent }]} onPress={hideAlert}>
              <Text style={[styles.alertBtnText, { color: isDarkMode ? COLORS.black : COLORS.white }]}>{alertConfig.type === 'success' ? 'TUYỆT VỜI!' : 'ĐÓNG'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  safeArea: { backgroundColor: COLORS.bgDark },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl * 2,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyText: { color: COLORS.textMuted, fontSize: FONT_SIZES.md, marginTop: SPACING.md },

  qrModalContent: {
    borderRadius: BORDER_RADIUS.lg,
    width: '100%',
    padding: SPACING.xl,
    alignItems: 'stretch',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  qrDesc: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  qrBox: {
    alignItems: 'center',
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    alignSelf: 'center',
    width: '100%',
  },
  vietQrHeader: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  vietQrTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  vietQrSub: {
    fontSize: 10,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  qrImage: {
    width: 220,
    height: 220,
    marginBottom: SPACING.md,
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS.sm,
  },
  qrTotal: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    marginTop: 4,
  },
  
  // Details list
  detailsBox: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    marginTop: SPACING.sm,
  },
  detailsTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(128,128,128,0.15)',
  },
  detailLabel: {
    fontSize: FONT_SIZES.sm,
  },
  detailValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  rowRightCopy: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Custom Alerts
  alertOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  alertBox: { 
    width: '100%', borderRadius: BORDER_RADIUS.xl, 
    padding: SPACING.xxl, alignItems: 'center', borderWidth: 1 
  },
  alertIconWrap: { marginBottom: SPACING.md },
  alertTitle: { fontSize: FONT_SIZES.xl, fontWeight: '600', marginBottom: SPACING.sm, textAlign: 'center' },
  alertMessage: { fontSize: FONT_SIZES.md, textAlign: 'center', marginBottom: SPACING.xxl, lineHeight: 22 },
  alertBtn: { 
    paddingVertical: SPACING.md, paddingHorizontal: SPACING.xxl, 
    borderRadius: BORDER_RADIUS.full, width: '100%', alignItems: 'center' 
  },
  alertBtnText: { fontSize: FONT_SIZES.md, fontWeight: '700', letterSpacing: 1, textAlign: 'center' },
});
