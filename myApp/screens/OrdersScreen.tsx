import Header from '@/components/Header';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { api, addProductReview } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABS = [
  { id: 'pending', label: 'Chờ thanh toán' },
  { id: 'shipping', label: 'Đang giao' },
  { id: 'completed', label: 'Hoàn thành' },
];

export default function OrdersScreen() {
  const router = useRouter();
  const { user, isAuthenticated, formatPrice, addToCart } = useAppContext();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'shipping' | 'completed'>('pending');

  // Modals Data
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewProduct, setReviewProduct] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Custom Alerts
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'success' as 'success' | 'error' | 'info' });
  const [confirmConfig, setConfirmConfig] = useState({ visible: false, title: '', message: '', onConfirm: () => {} });

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertConfig({ visible: true, title, message, type });
  };
  const hideAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmConfig({ visible: true, title, message, onConfirm });
  };
  const hideConfirm = () => setConfirmConfig(prev => ({ ...prev, visible: false }));

  const fetchOrders = async () => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await api.getOrders(user.uid);
      if (result.success) {
        const sorted = result.data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sorted);
      }
    } catch (error) {
      console.error('Error fetching orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated, user]);

  const filteredOrders = orders.filter(o => activeTab === 'completed' ? (o.status === 'completed' || o.status === 'cancelled') : o.status === activeTab);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    const result = await api.updateOrderStatus(orderId, status);
    if (result.success) {
      fetchOrders();
      if (status === 'completed') {
        setActiveTab('completed');
        showAlert('Thành công', 'Cảm ơn bạn đã mua sắm tại VELMORA!', 'success');
      } else if (status === 'cancelled') {
        setActiveTab('completed');
        showAlert('Đã hủy', 'Đơn hàng đã được hủy thành công!', 'info');
      }
    } else {
      showAlert('Lỗi', 'Không thể cập nhật trạng thái đơn hàng', 'error');
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewProduct) return;
    if (rating < 1 || rating > 5) return showAlert('Lỗi', 'Vui lòng chọn số sao hợp lệ', 'error');
    
    // Fallback info for user display name
    const userName = (user as any)?.displayName || user?.email?.split('@')[0] || 'Khách hàng';

    const res = await addProductReview(
      reviewProduct.id, 
      user?.uid || 'unknown',
      userName,
      rating,
      comment
    );

    if (res.success) {
      showAlert('Thành công', 'Đánh giá của bạn đã được ghi nhận!', 'success');
      setReviewModalVisible(false);
      setComment('');
      setRating(5);
    } else {
      showAlert('Lỗi', 'Có lỗi xảy ra khi nộp đánh giá.', 'error');
    }
  };

  const handleRebuy = (prod: any) => {
    // Add product back to cart
    addToCart({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image || ''
    } as any, 1, 'Mặc định');
    // Chuyển thẳng sang trang đặt hàng (checkout)
    router.push('/checkout' as any);
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Header title="Đơn Hàng" showBack={true} />
        </SafeAreaView>
        <View style={styles.center}>
          <Ionicons name="lock-closed-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Vui lòng đăng nhập để xem đơn hàng</Text>
        </View>
      </View>
    );
  }

  const renderStars = () => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: SPACING.md }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={rating >= star ? 'star' : 'star-outline'}
              size={36}
              color={COLORS.gold}
              style={{ marginHorizontal: 4 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    const date = new Date(item.createdAt).toLocaleDateString('vi-VN');
    
    let orderItems = item.items;
    if (typeof orderItems === 'string') {
      try { orderItems = JSON.parse(orderItems); } catch(e) { orderItems = []; }
    }
    if (!Array.isArray(orderItems)) orderItems = [];
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Mã ĐH: {item.id}</Text>
          <View style={[styles.statusBadge, item.status === 'cancelled' && {backgroundColor: 'rgba(244, 67, 54, 0.1)'}]}>
            <Text style={[styles.statusText, item.status === 'cancelled' && {color: COLORS.red}]}>
              {activeTab === 'pending' ? 'Chờ thanh toán' : activeTab === 'shipping' ? 'Đang giao' : item.status === 'cancelled' ? 'Đã Hủy' : 'Hoàn thành'}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        
        {orderItems.map((prod: any, idx: number) => (
          <View key={idx} style={styles.productWrap}>
            <View style={styles.productRow}>
              <Text style={styles.productName} numberOfLines={1}>
                {prod.quantity}x {prod.name}
              </Text>
              <Text style={styles.productPrice}>{formatPrice(prod.price * prod.quantity)}</Text>
            </View>
            
            {/* Nếu hoàn thành, cho phép mua lại và đánh giá theo từng sản phẩm */}
            {activeTab === 'completed' && (
              <View style={styles.actionRowInfo}>
                {item.status === 'completed' && (
                  <TouchableOpacity 
                    style={styles.reviewBtn} 
                    onPress={() => {
                      setReviewProduct(prod);
                      setReviewModalVisible(true);
                    }}>
                    <Text style={styles.reviewBtnText}>Đánh giá</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={[styles.rebuyBtn, item.status === 'cancelled' && { marginLeft: 'auto' }]}
                  onPress={() => handleRebuy(prod)}>
                  <Text style={styles.rebuyBtnText}>Mua lại</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        <View style={styles.divider} />
        <View style={styles.orderFooter}>
          <Text style={styles.dateText}>{date}</Text>
          <View style={styles.totalWrap}>
            <Text style={styles.totalLabel}>Tổng cộng: </Text>
            <Text style={styles.totalValue}>{formatPrice(item.total)}</Text>
          </View>
        </View>

        {/* Nút thao tác riêng cho mỗi thẻ (cả Đơn Hàng) */}
        {activeTab === 'pending' && (
          <View style={{flexDirection: 'row', gap: SPACING.md}}>
            <TouchableOpacity 
              style={[styles.primaryActionBtn, { flex: 1, backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.red }]}
              onPress={() => {
                showConfirm('Xác Nhận Hủy Đơn', 'Bạn có chắc chắn muốn hủy đơn hàng này không? Quá trình này không thể hoàn tác.', () => handleUpdateStatus(item.id, 'cancelled'));
              }}>
              <Ionicons name="close-circle-outline" size={20} color={COLORS.red} style={{ marginRight: 8 }} />
              <Text style={[styles.primaryActionText, { color: COLORS.red }]}>Hủy Đơn</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.primaryActionBtn, { flex: 1 }]}
              onPress={() => {
                router.push({ pathname: '/payment' as any, params: { orderId: item.id, total: item.total } });
              }}>
              <Ionicons name="qr-code-outline" size={20} color={COLORS.black} style={{ marginRight: 8 }} />
              <Text style={styles.primaryActionText}>Thanh Toán QR</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'shipping' && (
          <TouchableOpacity 
            style={[styles.primaryActionBtn, { backgroundColor: '#4CAF50' }]}
            onPress={() => handleUpdateStatus(item.id, 'completed')}>
            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
            <Text style={[styles.primaryActionText, { color: COLORS.white }]}>Đã nhận được hàng</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="Đơn Hàng" showBack={true} />
      </SafeAreaView>

      {/* TABS HEADER */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity 
              key={tab.id} 
              style={[styles.tabBtn, isActive && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.gold} />
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="receipt-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Chưa có đơn hàng nào tại đây</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* MODAL ĐÁNH GIÁ SẢN PHẨM */}
      <Modal visible={reviewModalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.reviewModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Đánh giá sản phẩm</Text>
              <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            
            {reviewProduct && (
              <Text style={styles.reviewProductName} numberOfLines={2}>
                {reviewProduct.name}
              </Text>
            )}

            {renderStars()}

            <TextInput
              style={styles.inputComment}
              placeholder="Chia sẻ cảm nhận của bạn về kiệt tác này..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              value={comment}
              onChangeText={setComment}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.submitReviewBtn} onPress={handleReviewSubmit}>
              <Text style={styles.submitReviewText}>GỬI ĐÁNH GIÁ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Custom Info Alert */}
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

      {/* Custom Confirm Alert */}
      <Modal visible={confirmConfig.visible} transparent animationType="fade" onRequestClose={hideConfirm}>
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <View style={styles.alertIconWrap}>
              <Ionicons name="help-circle" size={56} color={COLORS.red} />
            </View>
            <Text style={styles.alertTitle}>{confirmConfig.title}</Text>
            <Text style={styles.alertMessage}>{confirmConfig.message}</Text>
            <View style={{flexDirection: 'row', gap: SPACING.md, width: '100%', marginTop: SPACING.lg}}>
              <TouchableOpacity style={[styles.alertBtn, {flex: 1, backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.border}]} onPress={hideConfirm}>
                <Text style={[styles.alertBtnText, {color: COLORS.white}]}>SUY NGHĨ LẠI</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.alertBtn, {flex: 1, backgroundColor: COLORS.red}]} onPress={() => { hideConfirm(); confirmConfig.onConfirm(); }}>
                <Text style={[styles.alertBtnText, {color: COLORS.white}]}>CÓ, HỦY</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  safeArea: { backgroundColor: COLORS.bgDark },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyText: { color: COLORS.textMuted, fontSize: FONT_SIZES.md, marginTop: SPACING.md },
  
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bgDark,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  tabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gold,
  },
  tabText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.gold,
    fontWeight: '700',
  },

  listContainer: { padding: SPACING.lg },
  
  orderCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  orderId: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  statusText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },

  productWrap: {
    marginBottom: SPACING.md,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productName: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    flex: 1,
    marginRight: SPACING.md,
  },
  productPrice: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  
  // Hành động với sản phẩm đã mua
  actionRowInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  reviewBtn: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  reviewBtnText: {
    color: COLORS.gold,
    fontSize: 11,
  },
  rebuyBtn: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  rebuyBtnText: {
    color: COLORS.black,
    fontSize: 11,
    fontWeight: '600',
  },

  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.md,
  },
  dateText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
  },
  totalWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
  },
  totalValue: {
    color: COLORS.gold,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },

  // Nút hành động chính (QR, Xác nhận)
  primaryActionBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.gold,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryActionText: {
    color: COLORS.black,
    fontWeight: '700',
    fontSize: FONT_SIZES.sm,
  },

  // Modals
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  qrModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    width: '100%',
    padding: SPACING.xl,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    color: COLORS.black,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  qrDesc: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  qrBox: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: SPACING.sm,
  },
  qrTotal: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  qrInfo: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  qrConfirmBtn: {
    backgroundColor: COLORS.primaryDark,
    width: '100%',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  qrConfirmText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT_SIZES.md,
  },

  // Review Modal
  reviewModalContent: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    width: '100%',
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewProductName: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  inputComment: {
    backgroundColor: '#1a1a1a',
    color: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    height: 120,
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  submitReviewBtn: {
    backgroundColor: COLORS.gold,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  submitReviewText: {
    color: COLORS.black,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    letterSpacing: 2,
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
