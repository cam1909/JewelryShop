import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Linking,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/constants/theme';

const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    icon: 'logo-facebook' as const,
    link: 'https://www.facebook.com/profile.php?id=61584859067174',
    color: '#1877F2',
  },
  {
    name: 'Instagram',
    icon: 'logo-instagram' as const,
    link: 'https://www.instagram.com/cmcm.1909/?hl=vi',
    color: '#E4405F',
  },
  {
    name: 'Zalo',
    icon: 'chatbubble-ellipses-outline' as const, // Zalo doesn't have a direct logo in Ionicons
    link: 'https://zalo.me/0962977820',
    color: '#0068FF',
  },
];

const OTHER_CONTACTS = [
  {
    name: 'Email',
    icon: 'mail-outline' as const,
    value: 'contact@velmora.vn',
    action: 'mailto:contact@velmora.vn',
  },
  {
    name: 'Hotline',
    icon: 'call-outline' as const,
    value: '0962 977 820',
    action: 'tel:0962977820',
  },
  {
    name: 'Website',
    icon: 'globe-outline' as const,
    value: 'velmora.vn',
    action: 'https://velmora.vn',
  },
];

export default function ContactScreen() {
  const router = useRouter();

  const handlePress = (url: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log(`Don't know how to open this URL: ${url}`);
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Liên Hệ & Hỗ Trợ</Text>
          <View style={{ width: 22 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.heroSection}>
          <View style={styles.heroOverlay} />
          <Text style={styles.heroTitle}>Chúng tôi luôn sẵn sàng lắng nghe</Text>
          <Text style={styles.heroSubtitle}>
            Kết nối với VELMORA qua các kênh dưới đây để được tư vấn và giải đáp mọi thắc mắc.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mạng xã hội</Text>
          <View style={styles.socialGrid}>
            {SOCIAL_LINKS.map(item => (
              <TouchableOpacity
                key={item.name}
                style={styles.socialButton}
                onPress={() => handlePress(item.link)}>
                <View style={[styles.socialIconWrapper, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={28} color={COLORS.white} />
                </View>
                <Text style={styles.socialButtonText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Các kênh khác</Text>
          {OTHER_CONTACTS.map(item => (
            <TouchableOpacity
              key={item.name}
              style={styles.contactItem}
              onPress={() => handlePress(item.action)}>
              <View style={styles.contactIconWrapper}>
                <Ionicons name={item.icon} size={24} color={COLORS.gold} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactValue}>{item.value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.mapSection}>
          <Text style={styles.sectionTitle}>Showroom</Text>
          <TouchableOpacity style={styles.mapPreview} onPress={() => handlePress('https://maps.app.goo.gl/your-location')}>
            <View style={styles.mapOverlay} />
            <View style={styles.mapPin}>
              <Ionicons name="location-sharp" size={32} color={COLORS.red} />
            </View>
            <View style={styles.mapAddressBox}>
              <Text style={styles.mapAddress}>235 Hoàng Quốc Việt, Cầu Giấy, Hà Nội</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  safeArea: { backgroundColor: COLORS.bgDark },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '500' },
  scrollContainer: { paddingBottom: SPACING.xxl },

  // Hero
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
    position: 'relative',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  heroSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    maxWidth: '85%',
  },

  // Section
  section: {
    marginTop: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },

  // Social
  socialGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    alignItems: 'center',
    width: '30%',
  },
  socialIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  socialButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },

  // Other Contacts
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },
  contactIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(201, 169, 110, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
  contactValue: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },

  // Map
  mapSection: {
    marginTop: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  mapPreview: {
    height: 180,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  mapPin: {},
  mapAddressBox: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  mapAddress: {
    color: COLORS.white,
    textAlign: 'center',
  },
});
