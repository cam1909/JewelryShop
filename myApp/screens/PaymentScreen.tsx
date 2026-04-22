import Header from '@/components/Header';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
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
  Linking
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentScreen() {
  const router = useRouter();
  const { formatPrice } = useAppContext();
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
          // Auto Launch In-App PayOS Gateway to preserve app state
          WebBrowser.openBrowserAsync(res.data.checkoutUrl);
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
              router.push('/orders' as any);
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
          router.push('/orders' as any);
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
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Header title="Lỗi thanh toán" showBack={true} />
        </SafeAreaView>
        <View style={styles.center}>
          <Ionicons name="warning-outline" size={64} color={COLORS.red} />
          <Text style={styles.emptyText}>Không tìm thấy thông tin đơn hàng</Text>
        </View>
      </View>
    );
  }

  const orderTotal = Number(total) || 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="Thanh Toán QR" showBack={true} />
      </SafeAreaView>

      <View style={styles.content}>
        <View style={styles.qrModalContent}>
          <Text style={styles.qrDesc}>
            Mã QR thanh toán PayOS (Hệ thống tự động).
          </Text>
          
          <View style={styles.qrBox}>
            {loadingQr ? (
              <ActivityIndicator size="large" color={COLORS.gold} style={{marginVertical: 40}} />
            ) : paymentInfo ? (
              <View style={{alignItems: 'center', marginVertical: 20}}>
                <ActivityIndicator size="large" color={COLORS.primary} style={{marginBottom: 16}} />
                <Text style={{color: COLORS.primaryDark, fontSize: 16, fontWeight: '600', textAlign: 'center'}}>
                  Đã chuyển hướng an toàn đến PayOS.
                </Text>
                <Text style={{color: COLORS.textSecondary, marginTop: 8, textAlign: 'center'}}>
                  Vui lòng hoàn tất thanh toán trên trình duyệt web.
                </Text>
                
                <TouchableOpacity 
                  style={{marginTop: 24, backgroundColor: COLORS.gold, padding: 12, borderRadius: 8, width: '100%', alignItems: 'center'}}
                  onPress={() => WebBrowser.openBrowserAsync(paymentInfo.checkoutUrl)}
                >
                  <Text style={{color: COLORS.white, fontWeight: 'bold'}}>Mở lại Cổng Thanh Toán</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text>Lỗi khởi tạo cổng thanh toán. Vui lòng thử lại.</Text>
            )}
          </View>

          {/* Dấu hiệu cho thấy app đang tìm kiếm tiền vào tài khoản */}
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 8}}>
            <ActivityIndicator size="small" color={COLORS.gold} />
            <Text style={{color: COLORS.textSecondary, marginLeft: 8, fontStyle: 'italic'}}>Đang chờ PayOS xác nhận tiền về...</Text>
          </View>
        </View>
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
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  safeArea: { backgroundColor: COLORS.bgDark },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyText: { color: COLORS.textMuted, fontSize: FONT_SIZES.md, marginTop: SPACING.md },

  qrModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    width: '100%',
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  qrDesc: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  qrBox: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    backgroundColor: '#fff',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#eee',
  },
  qrImage: {
    width: 250,
    height: 250,
    marginBottom: SPACING.md,
  },
  qrTotal: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 8,
  },
  qrInfo: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  qrConfirmBtn: {
    backgroundColor: COLORS.primaryDark,
    width: '100%',
    paddingVertical: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  qrConfirmText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT_SIZES.lg,
  },

  // Custom Alerts
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
  alertBtnText: { color: COLORS.black, fontSize: FONT_SIZES.md, fontWeight: '700', letterSpacing: 1, textAlign: 'center' },
});
