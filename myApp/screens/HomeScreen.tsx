import Header from '@/components/Header';
import SectionHeader from '@/components/SectionHeader';
import ProductCard from '@/components/card/ProductCard';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ========== DATA ==========
const CATEGORIES = [
  { id: '1', name: 'Dây Chuyền', icon: 'sparkles-outline' as const },
  { id: '2', name: 'Nhẫn', icon: 'ellipse-outline' as const },
  { id: '3', name: 'Lắc Tay', icon: 'link-outline' as const },
  { id: '4', name: 'Bông Tai', icon: 'diamond-outline' as const },
];

const BENEFITS = [
  { id: '1', icon: 'car-outline' as const, title: 'Miễn Phí Vận Chuyển', desc: 'Đơn hàng từ 10.000.000đ' },
  { id: '2', icon: 'diamond-outline' as const, title: 'Chính Hãng 100%', desc: 'Kiểm định chất lượng' },
  { id: '3', icon: 'refresh-outline' as const, title: 'Đổi Trả 30 Ngày', desc: 'Hoàn tiền ngay' },
  { id: '4', icon: 'shield-checkmark-outline' as const, title: 'Bảo Hành Vĩnh Viễn', desc: 'Đánh bóng & vệ sinh' },
];

// ========== SUB-COMPONENTS ==========

function HeroBanner() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.heroBanner}>
      <View style={styles.heroImagePlaceholder}>
        <Image
          source={require('@/assets/images/products/bg.png')}
          style={{ position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' }}
        />
        <View style={styles.heroGradientOverlay} />
      </View>
      <Animated.View
        style={[styles.heroContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View>
          <Text style={styles.heroSubtitle}>BỘ SƯU TẬP MỚI 2025</Text>
          <Text style={styles.heroTitleLine1}>Tinh Hoa</Text>
          <Text style={styles.heroTitleLine2}>Trang Sức Việt</Text>
        </View>
        <View style={styles.heroBottomWrap}>
          <Text style={styles.heroDesc}>
            Tuyệt tác trang sức từ nghệ nhân lành nghề{'\n'}— Sang trọng, tinh tế & vĩnh cửu —
          </Text>
          <View style={styles.heroBtnRow}>
            <TouchableOpacity style={styles.heroBtnPrimary} onPress={() => router.push('/(tabs)/collections' as any)}>
              <Text style={styles.heroBtnPrimaryText}>KHÁM PHÁ NGAY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

function CategorySection() {
  const router = useRouter();
  return (
    <View style={styles.section}>
      <SectionHeader
        subtitle="KHÁM PHÁ THEO DANH MỤC"
        title="Bộ Sưu Tập"
        onPress={() => router.push('/(tabs)/collections' as any)}
      />
      <View style={styles.categoryGrid}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.categoryCard}
            onPress={() => router.push(`/(tabs)/collections?category=${cat.name}` as any)}>
            <View style={styles.categoryIconWrap}>
              <Ionicons name={cat.icon} size={28} color={COLORS.gold} />
            </View>
            <Text style={styles.categoryName}>{cat.name}</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function BenefitsSection() {
  return (
    <View style={styles.benefitsSection}>
      <View style={styles.benefitsGrid}>
        {BENEFITS.map((b) => (
          <View key={b.id} style={styles.benefitCard}>
            <View style={styles.benefitIconWrap}>
              <Ionicons name={b.icon} size={24} color={COLORS.gold} />
            </View>
            <View style={styles.benefitTextWrap}>
              <Text style={styles.benefitTitle}>{b.title}</Text>
              <Text style={styles.benefitDesc}>{b.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function FeaturedProducts() {
  const { products } = useAppContext();
  const router = useRouter();
  const featured = products.slice(0, 4);

  return (
    <View style={styles.section}>
      <SectionHeader
        subtitle="ĐƯỢC YÊU THÍCH NHẤT"
        title="Sản Phẩm Nổi Bật"
        onPress={() => router.push('/(tabs)/collections' as any)}
      />
      <FlatList
        data={featured}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => router.push(`/product/${item.id}` as any)} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        scrollEnabled={false}
        contentContainerStyle={styles.productGrid}
      />
      <TouchableOpacity style={styles.viewAllBtn} onPress={() => router.push('/(tabs)/collections' as any)}>
        <Text style={styles.viewAllBtnText}>XEM TẤT CẢ SẢN PHẨM</Text>
      </TouchableOpacity>
    </View>
  );
}

function StorySection() {
  const router = useRouter();
  return (
    <View style={styles.storySection}>
      <Text style={styles.storySub}>CÂU CHUYỆN CỦA CHÚNG TÔI</Text>
      <Text style={styles.storyTitle}>Nghệ Thuật{'\n'}Từ Thế Hệ Này{'\n'}Sang Thế Hệ Khác</Text>
      <Text style={styles.storyDesc}>
        Hơn 20 năm kinh nghiệm trong nghề kim hoàn, chúng tôi tự hào mang đến những tác phẩm trang sức tinh xảo nhất.
      </Text>
      <TouchableOpacity style={styles.storyBtn} onPress={() => router.push('/about' as any)}>
        <Text style={styles.storyBtnText}>TÌM HIỂU THÊM</Text>
        <Ionicons name="arrow-forward" size={16} color={COLORS.gold} />
      </TouchableOpacity>
    </View>
  );
}

function HomeFooter() {
  return (
    <View style={styles.contactSection}>
      <Text style={styles.sectionSub}>LIÊN HỆ</Text>
      <Text style={styles.sectionTitle}>Ghé Thăm Chúng Tôi</Text>
      <View style={styles.sectionDividerWrap}>
        <View style={styles.sectionDivider} />
      </View>

      {[
        { icon: 'location-outline' as const, label: '235 Hoàng Quốc Việt, Cầu Giấy, Hà Nội' },
        { icon: 'call-outline' as const, label: '0962 977 820' },
        { icon: 'mail-outline' as const, label: 'contact@velmora.vn' },
        { icon: 'time-outline' as const, label: '09:00 - 21:00, T2 - CN' },
      ].map((c, i) => (
        <View key={i} style={styles.contactItem}>
          <View style={styles.contactIcon}>
            <Ionicons name={c.icon} size={20} color={COLORS.gold} />
          </View>
          <Text style={styles.contactText}>{c.label}</Text>
        </View>
      ))}

      {/* Social */}
      <View style={styles.socialRow}>
        {[
          { icon: 'logo-facebook', link: 'https://www.facebook.com/profile.php?id=61584859067174' },
          { icon: 'logo-instagram', link: 'https://www.instagram.com/cmcm.1909/?hl=vi' },
          { icon: 'logo-tiktok', link: 'https://zalo.me/0962977820' },
        ].map((social, i) => (
          <TouchableOpacity key={i} style={styles.socialBtn} onPress={() => Linking.openURL(social.link)}>
            <Ionicons name={social.icon as any} size={22} color={COLORS.gold} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.copyright}>© 2025 VELMORA Jewelry House. All rights reserved.</Text>
    </View>
  );
}

// ========== MAIN SCREEN ==========
export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header showMenu showSearch showNotification onSearchPress={() => router.push('/search')} />
      </SafeAreaView>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} bounces>
        <HeroBanner />
        <CategorySection />
        <BenefitsSection />
        <FeaturedProducts />
        <StorySection />
        <HomeFooter />
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

// ========== STYLES ==========
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  safeArea: { backgroundColor: COLORS.bgDark },
  scrollView: { flex: 1 },

  // Hero
  heroBanner: { height: 420, position: 'relative', overflow: 'hidden' },
  heroImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroGradientOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  heroContent: {
    ...StyleSheet.absoluteFillObject,
    padding: SPACING.xxl,
    paddingTop: SPACING.xl,
    justifyContent: 'space-between',
  },
  heroSubtitle: {
    color: COLORS.gold,
    fontSize: FONT_SIZES.sm,
    letterSpacing: 4,
    fontWeight: '600',
    marginBottom: SPACING.md,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroTitleLine1: {
    fontFamily: 'Allura_400Regular',
    color: COLORS.white, fontSize: 64, lineHeight: 70,
    textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 12
  },
  heroTitleLine2: {
    fontFamily: 'Allura_400Regular',
    color: COLORS.gold, fontSize: 52, lineHeight: 60,
    textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 12
  },
  heroBottomWrap: {
    paddingBottom: SPACING.xl,
  },
  heroDesc: {
    color: COLORS.white, fontSize: 13, fontStyle: 'italic', lineHeight: 22, marginBottom: SPACING.xl,
    textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 5
  },
  heroBtnRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg },
  heroBtnPrimary: { backgroundColor: COLORS.white, paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.sm },
  heroBtnPrimaryText: { color: COLORS.black, fontSize: FONT_SIZES.sm, fontWeight: '700', letterSpacing: 1.5 },
  heroBtnSecondary: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  heroBtnSecondaryText: { color: COLORS.white, fontSize: FONT_SIZES.md, textDecorationLine: 'underline' },

  // Section
  section: { paddingVertical: SPACING.xxxl },

  // Categories
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  categoryCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    width: '48%',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(201, 169, 110, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  categoryName: { color: COLORS.white, fontSize: FONT_SIZES.sm, fontWeight: '500', textAlign: 'center' },

  // Benefits
  benefitsSection: {
    backgroundColor: COLORS.bgCard,
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: COLORS.border,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    width: '48%', // Approximately 2 items per row with some spacing
    marginBottom: SPACING.lg,
  },
  benefitIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitTextWrap: { flex: 1 },
  benefitTitle: { color: COLORS.white, fontSize: FONT_SIZES.sm, fontWeight: '600', marginBottom: 2 },
  benefitDesc: { color: COLORS.textMuted, fontSize: FONT_SIZES.xs },

  // Products
  productGrid: { paddingHorizontal: SPACING.lg },
  productRow: { justifyContent: 'space-between', marginBottom: SPACING.lg },
  viewAllBtn: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.xxl,
  },
  viewAllBtnText: { color: COLORS.white, fontSize: FONT_SIZES.sm, fontWeight: '600', letterSpacing: 1.5 },

  // Story
  storySection: {
    backgroundColor: COLORS.bgCard,
    padding: SPACING.xxxl,
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderColor: COLORS.border,
  },
  storySub: { color: COLORS.gold, fontSize: FONT_SIZES.xs, letterSpacing: 3, fontWeight: '500', marginBottom: SPACING.sm },
  storyTitle: { color: COLORS.white, fontSize: FONT_SIZES.xxxl, fontWeight: '200', fontStyle: 'italic', textAlign: 'center', lineHeight: 40, marginVertical: SPACING.xl },
  storyDesc: { color: COLORS.textSecondary, fontSize: FONT_SIZES.md, textAlign: 'center', lineHeight: 22, marginBottom: SPACING.xxl, fontStyle: 'italic' },
  storyBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.gold, paddingBottom: SPACING.xs },
  storyBtnText: { color: COLORS.gold, fontSize: FONT_SIZES.sm, fontWeight: '700', letterSpacing: 1.5 },

  // Shared Sub & Title
  sectionSub: { color: COLORS.gold, fontSize: FONT_SIZES.xs, letterSpacing: 3, fontWeight: '500', textAlign: 'center', marginBottom: SPACING.sm },
  sectionTitle: { color: COLORS.white, fontSize: FONT_SIZES.xxl, fontWeight: '300', fontStyle: 'italic', textAlign: 'center' },
  sectionDividerWrap: { alignItems: 'center', marginVertical: SPACING.lg },
  sectionDivider: { width: 40, height: 2, backgroundColor: COLORS.gold, borderRadius: 1 },

  // Footer / Contact
  contactSection: {
    paddingVertical: SPACING.xxxl, paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.bgDark, borderTopWidth: 0.5, borderColor: COLORS.border,
    marginTop: SPACING.xxl,
  },
  contactItem: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  contactIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(201, 169, 110, 0.12)',
    justifyContent: 'center', alignItems: 'center',
  },
  contactText: { color: COLORS.textSecondary, fontSize: FONT_SIZES.md },
  socialRow: {
    flexDirection: 'row', justifyContent: 'center', gap: SPACING.lg, marginTop: SPACING.xxl,
  },
  socialBtn: {
    width: 48, height: 48, borderRadius: 24,
    borderWidth: 1, borderColor: COLORS.border,
    justifyContent: 'center', alignItems: 'center',
  },
  copyright: {
    color: COLORS.textMuted, fontSize: FONT_SIZES.xs, textAlign: 'center',
    marginTop: SPACING.xl, letterSpacing: 0.5,
  },
});
