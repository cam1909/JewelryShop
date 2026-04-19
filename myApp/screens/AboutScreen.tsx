import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const MILESTONES = [
  { year: '2003', title: 'Thành lập', desc: 'VELMORA ra đời với xưởng chế tác đầu tiên tại TP.HCM' },
  { year: '2008', title: 'Mở rộng', desc: 'Khai trương showroom đầu tiên tại Quận 1' },
  { year: '2013', title: 'Quốc tế hóa', desc: 'Hợp tác với các nhà cung cấp kim cương Bỉ và Ý' },
  { year: '2018', title: '15 năm', desc: 'Đạt mốc 50.000 khách hàng thân thiết' },
  { year: '2023', title: '20 năm', desc: 'Ra mắt nền tảng mua sắm trực tuyến' },
  { year: '2025', title: 'Hiện tại', desc: '10 showroom trên toàn quốc, hệ thống online toàn diện' },
];

const VALUES = [
  { icon: 'diamond-outline' as const, title: 'Chất Lượng', desc: 'Mỗi sản phẩm đều được kiểm định nghiêm ngặt về chất liệu và đá quý' },
  { icon: 'hand-left-outline' as const, title: 'Thủ Công', desc: 'Chế tác thủ công bởi nghệ nhân lành nghề với hơn 20 năm kinh nghiệm' },
  { icon: 'heart-outline' as const, title: 'Tận Tâm', desc: 'Phục vụ khách hàng như người thân, luôn lắng nghe và thấu hiểu' },
  { icon: 'leaf-outline' as const, title: 'Bền Vững', desc: 'Cam kết sử dụng nguyên liệu có nguồn gốc rõ ràng và thân thiện môi trường' },
];

const STATS = [
  { number: '20+', label: 'Năm kinh nghiệm' },
  { number: '50K+', label: 'Khách hàng' },
  { number: '10', label: 'Showroom' },
  { number: '100+', label: 'Nghệ nhân' },
];

export default function AboutScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Về Chúng Tôi</Text>
          <View style={{ width: 22 }} />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroDiamondWrap}>
            <Ionicons name="diamond" size={56} color={COLORS.gold} />
          </View>
          <Text style={styles.heroBrand}>V E L M O R A</Text>
          <Text style={styles.heroSub}>JEWELRY HOUSE</Text>
          <View style={styles.heroDivider} />
          <Text style={styles.heroTagline}>
            "Nơi mỗi viên đá quý kể một câu chuyện,{'\n'}
            mỗi thiết kế là một tác phẩm nghệ thuật"
          </Text>
        </View>

        {/* Story */}
        <View style={styles.section}>
          <Text style={styles.sectionSub}>CÂU CHUYỆN CỦA CHÚNG TÔI</Text>
          <Text style={styles.sectionTitle}>Hành Trình 20 Năm</Text>
          <View style={styles.sectionDividerWrap}>
            <View style={styles.sectionDivider} />
          </View>
          <Text style={styles.storyText}>
            VELMORA được thành lập vào năm 2003 bởi nghệ nhân kim hoàn Nguyễn Minh Tuấn 
            với niềm đam mê tạo ra những tác phẩm trang sức tinh xảo nhất. Từ một xưởng 
            chế tác nhỏ tại TP. Hồ Chí Minh, VELMORA đã phát triển thành thương hiệu 
            trang sức hàng đầu Việt Nam.
          </Text>
          <Text style={styles.storyText}>
            Chúng tôi tin rằng trang sức không chỉ là phụ kiện, mà là biểu tượng của tình 
            yêu, của những khoảnh khắc đáng nhớ trong cuộc đời. Mỗi sản phẩm VELMORA đều 
            được chế tác thủ công tỉ mỉ, mang trong mình câu chuyện riêng.
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          {STATS.map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statNumber}>{s.number}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionSub}>HÀNH TRÌNH PHÁT TRIỂN</Text>
          <Text style={styles.sectionTitle}>Cột Mốc Quan Trọng</Text>
          <View style={styles.sectionDividerWrap}>
            <View style={styles.sectionDivider} />
          </View>

          <View style={styles.timeline}>
            {MILESTONES.map((m, i) => (
              <View key={i} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <Text style={styles.timelineYear}>{m.year}</Text>
                  <View style={styles.timelineDot} />
                  {i < MILESTONES.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineCard}>
                  <Text style={styles.timelineTitle}>{m.title}</Text>
                  <Text style={styles.timelineDesc}>{m.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Values */}
        <View style={styles.valuesSection}>
          <Text style={styles.sectionSub}>GIÁ TRỊ CỐT LÕI</Text>
          <Text style={styles.sectionTitle}>Triết Lý Của Chúng Tôi</Text>
          <View style={styles.sectionDividerWrap}>
            <View style={styles.sectionDivider} />
          </View>

          <View style={styles.valuesGrid}>
            {VALUES.map((v, i) => (
              <View key={i} style={styles.valueCard}>
                <View style={styles.valueIconWrap}>
                  <Ionicons name={v.icon} size={28} color={COLORS.gold} />
                </View>
                <Text style={styles.valueTitle}>{v.title}</Text>
                <Text style={styles.valueDesc}>{v.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionSub}>LIÊN HỆ</Text>
          <Text style={styles.sectionTitle}>Ghé Thăm Chúng Tôi</Text>
          <View style={styles.sectionDividerWrap}>
            <View style={styles.sectionDivider} />
          </View>

          {[
            { icon: 'location-outline' as const, label: '123 Đồng Khởi, Q.1, TP.HCM' },
            { icon: 'call-outline' as const, label: '1900 1234 56' },
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
            {['logo-facebook', 'logo-instagram', 'logo-tiktok', 'logo-youtube'].map((icon, i) => (
              <TouchableOpacity key={i} style={styles.socialBtn}>
                <Ionicons name={icon as any} size={22} color={COLORS.gold} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.copyright}>© 2025 VELMORA Jewelry House. All rights reserved.</Text>
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  safeArea: { backgroundColor: '#000' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  },
  headerTitle: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '500' },

  // Hero
  hero: { alignItems: 'center', paddingVertical: SPACING.huge, paddingHorizontal: SPACING.xxl },
  heroDiamondWrap: { marginBottom: SPACING.xl },
  heroBrand: { color: COLORS.white, fontSize: 26, fontWeight: '200', letterSpacing: 10 },
  heroSub: { color: COLORS.gold, fontSize: 11, letterSpacing: 6, marginTop: SPACING.xs },
  heroDivider: { width: 50, height: 1.5, backgroundColor: COLORS.gold, marginVertical: SPACING.xxl },
  heroTagline: {
    color: COLORS.textSecondary, fontSize: FONT_SIZES.md, fontStyle: 'italic',
    textAlign: 'center', lineHeight: 24,
  },

  // Section
  section: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.xxxl },
  sectionSub: { color: COLORS.gold, fontSize: FONT_SIZES.xs, letterSpacing: 3, fontWeight: '500', textAlign: 'center', marginBottom: SPACING.sm },
  sectionTitle: { color: COLORS.white, fontSize: FONT_SIZES.xxl, fontWeight: '300', fontStyle: 'italic', textAlign: 'center' },
  sectionDividerWrap: { alignItems: 'center', marginVertical: SPACING.lg },
  sectionDivider: { width: 40, height: 2, backgroundColor: COLORS.gold, borderRadius: 1 },

  storyText: { color: COLORS.textSecondary, fontSize: FONT_SIZES.md, lineHeight: 24, marginBottom: SPACING.lg },

  // Stats
  statsSection: {
    flexDirection: 'row', flexWrap: 'wrap',
    backgroundColor: COLORS.bgCard, paddingVertical: SPACING.xxl,
    borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: COLORS.border,
  },
  statItem: { width: '50%', alignItems: 'center', paddingVertical: SPACING.lg },
  statNumber: { color: COLORS.gold, fontSize: FONT_SIZES.xxxl, fontWeight: '700', marginBottom: SPACING.xs },
  statLabel: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm },

  // Timeline
  timeline: { marginTop: SPACING.xl },
  timelineItem: { flexDirection: 'row', marginBottom: SPACING.md },
  timelineLeft: { width: 60, alignItems: 'center' },
  timelineYear: { color: COLORS.gold, fontSize: FONT_SIZES.sm, fontWeight: '700', marginBottom: SPACING.sm },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.gold, borderWidth: 2, borderColor: '#000' },
  timelineLine: { width: 1.5, flex: 1, backgroundColor: COLORS.border, marginTop: 2 },
  timelineCard: {
    flex: 1, backgroundColor: COLORS.bgCard, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg, marginLeft: SPACING.md, borderWidth: 0.5, borderColor: COLORS.border,
  },
  timelineTitle: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '600', marginBottom: SPACING.xs },
  timelineDesc: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm, lineHeight: 20 },

  // Values
  valuesSection: {
    backgroundColor: COLORS.bgCard, paddingVertical: SPACING.xxxl, paddingHorizontal: SPACING.xl,
    borderTopWidth: 0.5, borderColor: COLORS.border,
  },
  valuesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md, marginTop: SPACING.lg },
  valueCard: {
    width: '47%', backgroundColor: '#000', borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl, borderWidth: 0.5, borderColor: COLORS.border,
  },
  valueIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(201, 169, 110, 0.12)',
    justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md,
  },
  valueTitle: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '600', marginBottom: SPACING.sm },
  valueDesc: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm, lineHeight: 20 },

  // Contact
  contactSection: {
    paddingVertical: SPACING.xxxl, paddingHorizontal: SPACING.xl,
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
