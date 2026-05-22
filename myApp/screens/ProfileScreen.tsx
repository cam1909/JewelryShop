import Header from '@/components/Header';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING, Theme } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const MENU_SECTIONS = [
  {
    title: 'Đơn Hàng',
    items: [
      { id: '1', icon: 'receipt-outline' as const, label: 'Đơn hàng của tôi', badge: null, route: '/orders' },
      { id: '3', icon: 'refresh-outline' as const, label: 'Đổi trả & Hoàn tiền', badge: null, route: '/returns' },
    ],
  },
  {
    title: 'Tài Khoản',
    items: [
      { id: '4', icon: 'location-outline' as const, label: 'Địa chỉ giao hàng', badge: null, route: '/addresses' },
      { id: '6', icon: 'gift-outline' as const, label: 'Ưu đãi & Voucher', badge: null, route: '/vouchers' },
      { id: '7', icon: 'star-outline' as const, label: 'Hạng thành viên', badge: 'VIP', route: '/membership' },
    ],
  },
  {
    title: 'Hỗ Trợ',
    items: [
      { id: '8', icon: 'chatbubble-outline' as const, label: 'Liên hệ tư vấn', badge: null, route: '/contact' },
      { id: '9', icon: 'help-circle-outline' as const, label: 'Câu hỏi thường gặp', badge: null, route: '/faq' },
      { id: '10', icon: 'settings-outline' as const, label: 'Cài đặt', badge: null, route: '/settings' },
      { id: '11', icon: 'information-circle-outline' as const, label: 'Giới thiệu', badge: null, route: '/about' },
    ],
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { isAuthenticated, user, logout, wishlist, cart, orderCount, voucherCount, theme } = useAppContext();
  const currentTheme = Theme[theme];
  const isDarkMode = theme === 'dark';

  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // Load avatar locally when user state is loaded
  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      const loadAvatar = async () => {
        try {
          const uri = await AsyncStorage.getItem(`@user_avatar_${user.uid}`);
          setAvatarUri(uri);
        } catch (e) {
          console.error("Failed to load avatar:", e);
        }
      };
      loadAvatar();
    } else {
      setAvatarUri(null);
    }
  }, [isAuthenticated, user?.uid]);

  const handleUploadAvatar = async () => {
    if (!isAuthenticated || !user?.uid) return;

    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Quyền truy cập',
        'Xin lỗi, ứng dụng cần quyền truy cập thư viện ảnh để cập nhật ảnh đại diện của bạn!',
        [{ text: 'Đóng', style: 'cancel' }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setAvatarUri(selectedUri);
        await AsyncStorage.setItem(`@user_avatar_${user.uid}`, selectedUri);
      }
    } catch (e) {
      console.error("Error picking avatar image:", e);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tải ảnh lên. Vui lòng thử lại!');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleMenuItemPress = (route: string | null) => {
    if (route) {
      router.push(route as any);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={currentTheme.background} />
        <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]} edges={['top']}>
          <Header title="Tài Khoản" showBack={false} />
        </SafeAreaView>
        <View style={styles.lockedContainer}>
          <View style={styles.lockCircle}>
            <Ionicons name="lock-closed" size={48} color={COLORS.gold} />
          </View>
          <Text style={[styles.lockedTitle, { color: currentTheme.text }]}>Tài Khoản Của Bạn</Text>
          <Text style={[styles.lockedSubtitle, { color: currentTheme.textMuted }]}>
            Vui lòng đăng nhập hoặc đăng ký tài khoản mới để xem đơn hàng, lịch sử mua sắm và quản lý thông tin thành viên của bạn.
          </Text>
          <TouchableOpacity 
            style={styles.lockedLoginBtn} 
            onPress={() => router.push('/login' as any)}
          >
            <Text style={styles.lockedLoginBtnText}>ĐĂNG NHẬP NGAY</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.lockedRegisterBtn} 
            onPress={() => router.push('/register' as any)}
          >
            <Text style={styles.lockedRegisterBtnText}>Tạo tài khoản mới</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={currentTheme.background} />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]} edges={['top']}>
        <Header title="Tài Khoản" showBack={true} />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View
          style={[styles.profileCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}
        >
          <TouchableOpacity 
            style={styles.avatarWrap}
            onPress={isAuthenticated ? handleUploadAvatar : () => router.push('/login' as any)}
            activeOpacity={0.8}
          >
            <View style={styles.avatar}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={36} color={COLORS.gold} />
              )}
            </View>
            {isAuthenticated && (
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={11} color={COLORS.black} />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: currentTheme.text }]}>{isAuthenticated ? user?.name : 'Khách hàng'}</Text>
            <Text style={[styles.profileEmail, { color: currentTheme.textMuted }]}>
              {isAuthenticated ? user?.email : 'Đăng nhập để trải nghiệm tốt hơn'}
            </Text>
          </View>
          {!isAuthenticated && (
            <TouchableOpacity onPress={() => router.push('/login' as any)}>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gold} />
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View style={[styles.statsRow, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: currentTheme.text }]}>{isAuthenticated ? orderCount : '0'}</Text>
            <Text style={[styles.statLabel, { color: currentTheme.textMuted }]}>Đơn hàng</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: currentTheme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: currentTheme.text }]}>{wishlist.length}</Text>
            <Text style={[styles.statLabel, { color: currentTheme.textMuted }]}>Yêu thích</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: currentTheme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: currentTheme.text }]}>{isAuthenticated ? voucherCount : '0'}</Text>
            <Text style={[styles.statLabel, { color: currentTheme.textMuted }]}>Voucher</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: currentTheme.border }]} />
          <View style={styles.statItem}>
            <Ionicons name="diamond" size={18} color={COLORS.gold} />
            <Text style={[styles.statLabel, { color: currentTheme.textMuted }]}>{isAuthenticated ? 'VIP' : '---'}</Text>
          </View>
        </View>

        {/* Menu sections */}
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>{section.title}</Text>
            {section.items.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, { borderBottomColor: currentTheme.border, borderBottomWidth: 0.5 }]}
                onPress={() => handleMenuItemPress(item.route)}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name={item.icon} size={22} color={currentTheme.textMuted} />
                  <Text style={[styles.menuItemLabel, { color: currentTheme.text }]}>{item.label}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  {item.badge && (
                    <View
                      style={[
                        styles.menuBadge,
                        item.badge === 'VIP' ? styles.menuBadgeVip : {},
                      ]}>
                      <Text
                        style={[
                          styles.menuBadgeText,
                          item.badge === 'VIP' ? styles.menuBadgeTextVip : {},
                        ]}>
                        {item.badge}
                      </Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={20} color={currentTheme.textMuted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Logout Button */}
        {isAuthenticated && (
          <View style={styles.logoutSection}>
            <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: currentTheme.card }]} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>ĐĂNG XUẤT</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {},

  // Profile
  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: SPACING.lg, marginTop: SPACING.md,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg, borderWidth: 0.5,
    gap: SPACING.lg,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.gold,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%', height: '100%',
    borderRadius: 32,
    resizeMode: 'cover',
  },
  cameraBadge: {
    position: 'absolute', bottom: -2, right: -2,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: COLORS.gold, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.bgCard,
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: FONT_SIZES.lg, fontWeight: '600', marginBottom: 2 },
  profileEmail: { fontSize: FONT_SIZES.sm },

  // Auth
  authSection: { flexDirection: 'row', marginHorizontal: SPACING.lg, marginTop: SPACING.lg, gap: SPACING.md },
  loginBtn: { flex: 1, backgroundColor: COLORS.gold, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  loginBtnText: { color: COLORS.black, fontSize: FONT_SIZES.sm, fontWeight: '700', letterSpacing: 1 },
  registerBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.gold, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  registerBtnText: { color: COLORS.gold, fontSize: FONT_SIZES.sm, fontWeight: '700', letterSpacing: 1 },

  // Stats
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: SPACING.lg, marginTop: SPACING.xl,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg, borderWidth: 0.5,
  },
  statItem: { flex: 1, alignItems: 'center', gap: SPACING.xs },
  statNumber: { fontSize: FONT_SIZES.xl, fontWeight: '700' },
  statLabel: { fontSize: FONT_SIZES.xs },
  statDivider: { width: 0.5, height: 30 },

  // Menu
  section: { marginHorizontal: SPACING.lg, marginTop: SPACING.xl },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginBottom: SPACING.md,
    marginLeft: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(201, 169, 110, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: FONT_SIZES.md,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  menuBadge: {
    backgroundColor: COLORS.gold,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  menuBadgeVip: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  menuBadgeText: {
    color: COLORS.black,
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
  menuBadgeTextVip: {
    color: COLORS.gold,
  },

  // Logout
  logoutSection: {
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  logoutBtn: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: COLORS.red,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },

  // Locked State
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingBottom: 80,
  },
  lockCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(201, 169, 110, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  lockedTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    fontStyle: 'italic',
  },
  lockedSubtitle: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.md,
  },
  lockedLoginBtn: {
    backgroundColor: COLORS.gold,
    width: '100%',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  lockedLoginBtnText: {
    color: COLORS.black,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  lockedRegisterBtn: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    width: '100%',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  lockedRegisterBtnText: {
    color: COLORS.gold,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});
