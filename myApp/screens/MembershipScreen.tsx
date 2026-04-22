import Header from '@/components/Header';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TIERS = [
  { id: 'Silver', color: '#C0C0C0', pts: 0, desc: 'Ưu đãi sinh nhật 5%' },
  { id: 'Gold', color: '#FFD700', pts: 10000, desc: 'Giảm 2% mọi hóa đơn\nƯu đãi sinh nhật 10%' },
  { id: 'Diamond', color: '#B9F2FF', pts: 50000, desc: 'Giảm 5% mọi hóa đơn\nBảo hành/Đánh bóng miễn phí tại nhà' },
];

export default function MembershipScreen() {
  const { user, isAuthenticated } = useAppContext();
  
  // Fake progress
  const currentPoints = 15500;
  const currentTier = 'Gold';
  const nextTier = 'Diamond';
  const pointsToNext = 50000 - currentPoints;
  const progressPercent = (currentPoints / 50000) * 100;

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Header title="" showBack={true} />
        </SafeAreaView>
        <View style={styles.center}>
          <Ionicons name="star-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Đăng nhập để xem hạng thành viên</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="" showBack={true} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Member Card */}
        <View style={styles.memberCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardName}>{user?.name}</Text>
              <Text style={styles.cardId}>ID: {user?.uid?.substring(0, 8).toUpperCase()}</Text>
            </View>
            <Ionicons name="diamond" size={32} color={COLORS.bgCard} />
          </View>
          
          <View style={styles.cardBody}>
            <Text style={styles.tierName}>{currentTier} Member</Text>
            <Text style={styles.points}>{currentPoints.toLocaleString('vi-VN')} Điểm</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Cần thêm {pointsToNext.toLocaleString('vi-VN')} điểm để lên hạng <Text style={styles.highlight}>{nextTier}</Text></Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <View style={styles.progressFooter}>
            <Text style={styles.progressMark}>0</Text>
            <Text style={styles.progressMark}>50k</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quyền lợi các rớt hạng</Text>
        
        {TIERS.map((tier) => (
          <View key={tier.id} style={styles.tierInfoCard}>
            <View style={styles.tierIconWrap}>
              <Ionicons name={tier.id === 'Diamond' ? 'diamond' : 'star'} size={24} color={tier.color} />
            </View>
            <View style={styles.tierTextWrap}>
              <Text style={styles.tierTitle}>{tier.id}</Text>
              <Text style={styles.tierCond}>Điều kiện: {tier.pts === 0 ? 'Tạo mới' : `${tier.pts.toLocaleString('vi-VN')} điểm`}</Text>
              <Text style={styles.tierDesc}>{tier.desc}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  safeArea: { backgroundColor: COLORS.bgDark },
  scrollContent: { padding: SPACING.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyText: { color: COLORS.textMuted, fontSize: FONT_SIZES.md, marginTop: SPACING.md },
  
  // Card
  memberCard: {
    backgroundColor: COLORS.gold,
    borderRadius: 16,
    padding: SPACING.xl,
    minHeight: 180,
    justifyContent: 'space-between',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: SPACING.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardName: { color: COLORS.bgDark, fontSize: FONT_SIZES.lg, fontWeight: 'bold' },
  cardId: { color: 'rgba(26,26,26,0.6)', fontSize: FONT_SIZES.sm, marginTop: 4, letterSpacing: 2 },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  tierName: { color: COLORS.bgDark, fontSize: 28, fontWeight: '900', fontStyle: 'italic', letterSpacing: 1 },
  points: { color: COLORS.bgDark, fontSize: FONT_SIZES.md, fontWeight: '600' },

  // Progress
  progressSection: {
    backgroundColor: COLORS.bgCard,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xxl,
  },
  progressHeader: { marginBottom: SPACING.md },
  progressText: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm },
  highlight: { color: COLORS.gold, fontWeight: 'bold' },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressMark: { color: COLORS.textMuted, fontSize: FONT_SIZES.xs },

  sectionTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
  },
  
  tierInfoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tierIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  tierTextWrap: {
    flex: 1,
  },
  tierTitle: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: 'bold', marginBottom: 2 },
  tierCond: { color: COLORS.gold, fontSize: FONT_SIZES.xs, marginBottom: 8 },
  tierDesc: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm, lineHeight: 20 },
});
