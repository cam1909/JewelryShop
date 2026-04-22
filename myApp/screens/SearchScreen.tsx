import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppContext, formatPrice } from '@/context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TRENDING = ['Nhẫn Kim Cương', 'Dây Chuyền Ngọc Trai', 'Bông Tai Sapphire', 'Lắc Tay Vàng', 'Bộ Trang Sức Cưới'];

export default function SearchScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);

  const { products } = useAppContext();

  const results = searchText.length > 0
    ? products.filter((p: any) =>
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.category.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Search Header */}
        <View style={styles.searchHeader}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm trang sức..."
              placeholderTextColor={COLORS.textMuted}
              value={searchText}
              onChangeText={(t) => { setSearchText(t); setSearching(t.length > 0); }}
              autoFocus
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => { setSearchText(''); setSearching(false); }}>
                <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {!searching ? (
          <>
            {/* Trending searches */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tìm kiếm phổ biến</Text>
              <View style={styles.trendingList}>
                {TRENDING.map((term, i) => (
                  <TouchableOpacity key={i} style={styles.trendingChip} onPress={() => { setSearchText(term); setSearching(true); }}>
                    <Ionicons name="trending-up" size={14} color={COLORS.gold} />
                    <Text style={styles.trendingText}>{term}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Recent */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
                <TouchableOpacity><Text style={styles.clearText}>Xóa</Text></TouchableOpacity>
              </View>
              <View style={styles.recentList}>
                {['Dây Chuyền', 'Nhẫn Cưới'].map((term, i) => (
                  <TouchableOpacity key={i} style={styles.recentItem} onPress={() => { setSearchText(term); setSearching(true); }}>
                    <Ionicons name="time-outline" size={18} color={COLORS.textMuted} />
                    <Text style={styles.recentText}>{term}</Text>
                    <Ionicons name="arrow-forward-outline" size={16} color={COLORS.textMuted} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.resultCount}>{results.length} kết quả cho "{searchText}"</Text>
            {results.map((product: any) => (
              <TouchableOpacity
                key={product.id}
                style={styles.resultCard}
                onPress={() => router.push(`/product/${product.id}` as any)}>
                <View style={styles.resultImage}>
                  {product.image ? (
                    <Image source={product.image} style={{ width: '100%', height: '100%', borderRadius: 8 }} resizeMode="cover" />
                  ) : (
                    <Ionicons name="diamond-outline" size={28} color={COLORS.borderLight} />
                  )}
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultCategory}>{product.category}</Text>
                  <Text style={styles.resultName} numberOfLines={2}>{product.name}</Text>
                  <View style={styles.resultPriceRow}>
                    <Text style={styles.resultPrice}>{formatPrice(product.price)}</Text>
                    {product.originalPrice && (
                      <Text style={styles.resultOldPrice}>{formatPrice(product.originalPrice)}</Text>
                    )}
                  </View>
                  <View style={styles.resultRating}>
                    <Ionicons name="star" size={12} color={COLORS.gold} />
                    <Text style={styles.resultRatingText}>{product.rating} ({product.reviews})</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            {results.length === 0 && (
              <View style={styles.emptyResult}>
                <Ionicons name="search-outline" size={48} color={COLORS.borderLight} />
                <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
                <Text style={styles.emptySubtext}>Thử tìm kiếm với từ khóa khác</Text>
              </View>
            )}
          </>
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  safeArea: { backgroundColor: COLORS.bgDark },

  searchHeader: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.bgCard, borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  searchInput: { flex: 1, color: COLORS.white, fontSize: FONT_SIZES.md },

  section: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl },
  sectionTitle: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '500', marginBottom: SPACING.lg },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  clearText: { color: COLORS.gold, fontSize: FONT_SIZES.sm },

  // Trending
  trendingList: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  trendingChip: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.bgCard, borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  trendingText: { color: COLORS.textSecondary, fontSize: FONT_SIZES.sm },

  // Recent
  recentList: {},
  recentItem: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingVertical: SPACING.md, borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  recentText: { flex: 1, color: COLORS.white, fontSize: FONT_SIZES.md },

  // Results
  resultCount: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm, paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  resultCard: {
    flexDirection: 'row', marginHorizontal: SPACING.lg, marginBottom: SPACING.md, padding: SPACING.md,
    backgroundColor: COLORS.bgCard, borderRadius: BORDER_RADIUS.lg,
    borderWidth: 0.5, borderColor: COLORS.border, gap: SPACING.md,
  },
  resultImage: {
    width: 90, height: 90, borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.bgCardLight, justifyContent: 'center', alignItems: 'center',
  },
  resultInfo: { flex: 1, justifyContent: 'center' },
  resultCategory: { color: COLORS.gold, fontSize: FONT_SIZES.xs, letterSpacing: 1, fontWeight: '500', marginBottom: 2 },
  resultName: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '400', lineHeight: 20, marginBottom: SPACING.xs },
  resultPriceRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: 2 },
  resultPrice: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '700' },
  resultOldPrice: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm, textDecorationLine: 'line-through' },
  resultRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resultRatingText: { color: COLORS.textMuted, fontSize: FONT_SIZES.xs },

  // Empty
  emptyResult: { alignItems: 'center', paddingTop: SPACING.huge },
  emptyText: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '500', marginTop: SPACING.lg },
  emptySubtext: { color: COLORS.textMuted, fontSize: FONT_SIZES.md, marginTop: SPACING.sm },
});
