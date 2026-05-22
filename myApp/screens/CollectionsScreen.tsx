import Header from '@/components/Header';
import SectionHeader from '@/components/SectionHeader';
import ProductCard from '@/components/card/ProductCard';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING, Theme } from '@/constants/theme';
import { formatPrice, useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FILTER_CATEGORIES = [
  { id: 'all', name: 'Tất Cả', icon: 'grid-outline' as const },
  { id: 'DÂY CHUYỀN', name: 'Dây Chuyền', icon: 'sparkles-outline' as const },
  { id: 'NHẪN', name: 'Nhẫn', icon: 'ellipse-outline' as const },
  { id: 'LẮC TAY', name: 'Lắc Tay', icon: 'link-outline' as const },
  { id: 'BÔNG TAI', name: 'Bông Tai', icon: 'diamond-outline' as const },
  { id: 'BỘ TRANG SỨC', name: 'Bộ Trang Sức', icon: 'gift-outline' as const },
];

const SORT_OPTIONS = [
  { id: 'default', name: 'Mặc định' },
  { id: 'price_low', name: 'Giá thấp → cao' },
  { id: 'price_high', name: 'Giá cao → thấp' },
  { id: 'rating', name: 'Đánh giá cao nhất' },
  { id: 'newest', name: 'Mới nhất' },
];

export default function CollectionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showSort, setShowSort] = useState(false);
  const { products, collections, theme } = useAppContext();
  const currentTheme = Theme[theme];
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    if (params.category && typeof params.category === 'string') {
      const categoryId = FILTER_CATEGORIES.find(c => c.name === params.category)?.id;
      if (categoryId) {
        setSelectedCategory(categoryId);
      }
    }
  }, [params.category]);

  // Get unique categories with counts
  const categoryStats = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchText.length > 0) {
      const q = searchText.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price_low': list.sort((a, b) => a.price - b.price); break;
      case 'price_high': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'newest': list.sort((a, b) => (b.badgeType === 'new' ? 1 : 0) - (a.badgeType === 'new' ? 1 : 0)); break;
    }

    return list;
  }, [products, selectedCategory, searchText, sortBy]);

  const selectedCatName = FILTER_CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'Tất cả';

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={currentTheme.background} />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]} edges={['top']}>
        <Header title="Bộ Sưu Tập" showBack={true} rightIcon="filter-outline" onRightPress={() => setShowSort(!showSort)} />

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
            <Ionicons name="search-outline" size={18} color={currentTheme.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: currentTheme.text }]}
              placeholder="Tìm kiếm trang sức..."
              placeholderTextColor={currentTheme.textMuted}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={18} color={currentTheme.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Filter Chips (Sticky) */}
        <View style={{ paddingBottom: 8 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryFilter}>
            {FILTER_CATEGORIES.map((cat) => {
              const count = cat.id === 'all' ? products.length : (categoryStats[cat.id] || 0);
              const isActive = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip, 
                    { 
                      backgroundColor: currentTheme.card, 
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(122, 99, 68, 0.22)' 
                    }, 
                    isActive && [styles.categoryChipActive, { backgroundColor: currentTheme.accent, borderColor: currentTheme.accent }]
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}>
                  <Text style={[styles.categoryChipText, { color: currentTheme.text }, isActive && [styles.categoryChipTextActive, { color: isDarkMode ? COLORS.black : COLORS.white }]]}>
                    {cat.name}
                  </Text>
                  <View style={[
                    styles.chipCount, 
                    { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }, 
                    isActive && [styles.chipCountActive, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.22)' }]
                  ]}>
                    <Text style={[
                      styles.chipCountText, 
                      { color: currentTheme.text }, 
                      isActive && [styles.chipCountTextActive, { color: isDarkMode ? COLORS.black : COLORS.white }]
                    ]}>
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Sort dropdown */}
        {showSort && (
          <View style={[styles.sortDropdown, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.sortOption, { borderBottomColor: currentTheme.border }, sortBy === opt.id && styles.sortOptionActive]}
                onPress={() => { setSortBy(opt.id); setShowSort(false); }}>
                <Text style={[styles.sortOptionText, { color: currentTheme.text }, sortBy === opt.id && [styles.sortOptionTextActive, { color: currentTheme.accent }]]}>
                  {opt.name}
                </Text>
                {sortBy === opt.id && <Ionicons name="checkmark" size={16} color={currentTheme.accent} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Result header */}
        <View style={styles.resultHeader}>
          <View>
            <Text style={[styles.resultTitle, { color: currentTheme.text }]}>
              {selectedCategory === 'all' ? 'Tất Cả Sản Phẩm' : selectedCatName}
            </Text>
            <Text style={[styles.resultCount, { color: currentTheme.textMuted }]}>{filteredProducts.length} sản phẩm</Text>
          </View>
          <TouchableOpacity style={[styles.sortBtn, { borderColor: currentTheme.border }]} onPress={() => setShowSort(!showSort)}>
            <Ionicons name="swap-vertical-outline" size={16} color={currentTheme.accent} />
            <Text style={[styles.sortBtnText, { color: currentTheme.text }]}>Sắp xếp</Text>
          </TouchableOpacity>
        </View>

        {/* Products Grid */}
        <View style={styles.productGrid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => router.push(`/product/${product.id}` as any)}
            />
          ))}
        </View>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={currentTheme.border} />
            <Text style={[styles.emptyTitle, { color: currentTheme.text }]}>Không tìm thấy sản phẩm</Text>
            <Text style={[styles.emptySubtext, { color: currentTheme.textMuted }]}>Thử chọn danh mục khác hoặc thay đổi từ khóa</Text>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: currentTheme.accent }]}
              onPress={() => { setSelectedCategory('all'); setSearchText(''); }}>
              <Text style={[styles.emptyBtnText, { color: isDarkMode ? COLORS.black : COLORS.white }]}>XEM TẤT CẢ</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Category Summary Cards (only shown when viewing all) */}
        {selectedCategory === 'all' && searchText.length === 0 && (
          <View style={styles.categorySummary}>
            <SectionHeader subtitle="DANH MỤC" title="Mua Sắm Theo Loại" />
            <View style={styles.catSummaryGrid}>
              {FILTER_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                const count = categoryStats[cat.id] || 0;
                const catProducts = products.filter((p) => p.category === cat.id);
                const minPrice = catProducts.length > 0 ? Math.min(...catProducts.map((p) => p.price)) : 0;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catSummaryCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}
                    onPress={() => setSelectedCategory(cat.id)}>
                    <View style={[styles.catSummaryIconWrap, { backgroundColor: isDarkMode ? 'rgba(201, 169, 110, 0.12)' : 'rgba(92, 64, 51, 0.08)' }]}>
                      <Ionicons name={cat.icon} size={28} color={currentTheme.accent} />
                    </View>
                    <Text style={[styles.catSummaryName, { color: currentTheme.text }]} numberOfLines={1}>{cat.name}</Text>
                    <Text style={[styles.catSummaryCount, { color: currentTheme.textMuted }]}>{count} sản phẩm</Text>
                    {minPrice > 0 && (
                      <Text style={[styles.catSummaryPrice, { color: currentTheme.accent }]}>Từ {formatPrice(minPrice)}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  safeArea: { backgroundColor: COLORS.bgDark },

  // Search
  searchContainer: { 
    paddingHorizontal: SPACING.lg, 
    paddingTop: SPACING.sm, 
    paddingBottom: SPACING.sm 
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard, borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderWidth: 0.5, borderColor: COLORS.border, gap: SPACING.sm,
  },
  searchInput: { flex: 1, color: COLORS.white, fontSize: FONT_SIZES.md },

  // Category Filter
  categoryFilter: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, gap: SPACING.sm },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border,
  },
  categoryChipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  categoryChipText: { color: COLORS.textSecondary, fontSize: FONT_SIZES.sm, fontWeight: '500' },
  categoryChipTextActive: { color: COLORS.black, fontWeight: '600' },
  chipCount: {
    backgroundColor: COLORS.border, borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: 6, paddingVertical: 1, minWidth: 20, alignItems: 'center',
  },
  chipCountActive: { backgroundColor: 'rgba(0,0,0,0.2)' },
  chipCountText: { color: COLORS.textMuted, fontSize: 10, fontWeight: '700' },
  chipCountTextActive: { color: COLORS.black },

  // Sort
  sortDropdown: {
    marginHorizontal: SPACING.lg, backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg, borderWidth: 0.5, borderColor: COLORS.border,
    marginBottom: SPACING.md, overflow: 'hidden',
  },
  sortOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  sortOptionActive: { backgroundColor: 'rgba(201, 169, 110, 0.08)' },
  sortOptionText: { color: COLORS.textSecondary, fontSize: FONT_SIZES.md },
  sortOptionTextActive: { color: COLORS.gold, fontWeight: '600' },

  section: { paddingTop: SPACING.xxxl, paddingBottom: SPACING.xxl },

  // Result header
  resultHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl, paddingBottom: SPACING.lg,
  },
  resultTitle: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '600' },
  resultCount: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm, marginTop: 2 },
  sortBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
  },
  sortBtnText: { color: COLORS.gold, fontSize: FONT_SIZES.sm },

  // Products Grid
  productGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between', paddingHorizontal: SPACING.lg, gap: SPACING.md,
  },

  // Empty
  emptyState: { alignItems: 'center', paddingVertical: SPACING.huge },
  emptyTitle: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '500', marginTop: SPACING.lg },
  emptySubtext: { color: COLORS.textMuted, fontSize: FONT_SIZES.md, marginTop: SPACING.sm },
  emptyBtn: {
    marginTop: SPACING.xxl, backgroundColor: COLORS.gold,
    paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md,
  },
  emptyBtnText: { color: COLORS.black, fontSize: FONT_SIZES.sm, fontWeight: '700', letterSpacing: 1 },

  // Category Summary
  categorySummary: { paddingTop: SPACING.xxxl },
  catSummaryGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, gap: SPACING.md, marginTop: SPACING.md,
  },
  catSummaryCard: {
    width: '47%', backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl,
    borderWidth: 0.5, borderColor: COLORS.border, alignItems: 'center',
  },
  catSummaryIconWrap: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(201, 169, 110, 0.1)',
    justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md,
  },
  catSummaryName: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '600', marginBottom: SPACING.xs },
  catSummaryCount: { color: COLORS.textMuted, fontSize: FONT_SIZES.xs },
  catSummaryPrice: { color: COLORS.gold, fontSize: FONT_SIZES.xs, fontWeight: '600', marginTop: SPACING.xs },
});
