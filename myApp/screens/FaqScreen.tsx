import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/Header';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/constants/theme';

const FAQ_DATA = [
  {
    title: 'Làm thế nào để đặt hàng?',
    content:
      'Bạn có thể duyệt qua các sản phẩm của chúng tôi, thêm các mặt hàng mong muốn vào giỏ hàng và tiến hành thanh toán. Chỉ cần làm theo các bước trên màn hình để hoàn tất đơn đặt hàng của bạn.',
  },
  {
    title: 'Chính sách vận chuyển của bạn là gì?',
    content:
      'Chúng tôi cung cấp dịch vụ vận chuyển miễn phí cho tất cả các đơn hàng trong nước. Các đơn hàng quốc tế có thể phải chịu phí vận chuyển. Thời gian giao hàng khác nhau tùy thuộc vào vị trí của bạn.',
  },
  {
    title: 'Tôi có thể trả lại một mặt hàng không?',
    content:
      'Có, chúng tôi có chính sách hoàn trả trong 30 ngày. Nếu bạn không hài lòng với giao dịch mua hàng của mình, bạn có thể trả lại trong vòng 30 ngày để được hoàn lại tiền đầy đủ hoặc đổi hàng. Vui lòng đảm bảo mặt hàng ở trong tình trạng ban đầu.',
  },
  {
    title: 'Trang sức của bạn có được làm từ vật liệu thật không?',
    content:
      'Tất cả đồ trang sức của chúng tôi được chế tác từ các vật liệu chất lượng cao, bao gồm vàng 18K, bạc sterling và đá quý chính hãng. Mỗi sản phẩm đều đi kèm với giấy chứng nhận tính xác thực.',
  },
  {
    title: 'Làm cách nào để chăm sóc đồ trang sức của tôi?',
    content:
      'Để giữ cho đồ trang sức của bạn trông đẹp nhất, hãy tránh tiếp xúc với các hóa chất mạnh, cởi ra trước khi bơi hoặc tắm và cất giữ ở nơi khô ráo, an toàn. Thường xuyên làm sạch bằng vải mềm để duy trì độ bóng.',
  },
  {
    title: 'Bạn có cung cấp trang sức tùy chỉnh không?',
    content:
      'Có, chúng tôi cung cấp các dịch vụ thiết kế trang sức tùy chỉnh. Vui lòng liên hệ với nhóm dịch vụ khách hàng của chúng tôi để thảo luận về ý tưởng của bạn và nhận báo giá.',
  },
];

export default function FaqScreen() {
  const [activeSections, setActiveSections] = useState<number[]>([]);

  const renderHeader = (section: { title: string }, _: number, isActive: boolean) => {
    return (
      <Animatable.View
        duration={300}
        transition="backgroundColor"
        style={[styles.header, isActive ? styles.headerActive : {}]}>
        <Text style={styles.headerText}>{section.title}</Text>
        <Ionicons name={isActive ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.gold} />
      </Animatable.View>
    );
  };

  const renderContent = (section: { title: string; content: string }) => {
    return (
      <Animatable.View duration={300} transition="backgroundColor" style={styles.content}>
        <Text style={styles.contentText}>{section.content}</Text>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="Câu Hỏi Thường Gặp" />
      </SafeAreaView>



      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Accordion
          sections={FAQ_DATA}
          activeSections={activeSections}
          touchableComponent={TouchableOpacity}
          renderHeader={renderHeader}
          renderContent={renderContent}
          onChange={setActiveSections}
          underlayColor="transparent"
          sectionContainerStyle={styles.accordionSection}
        />

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Bạn cần thêm trợ giúp?</Text>
          <Text style={styles.helpSubtitle}>
            Nếu bạn không tìm thấy câu trả lời, vui lòng liên hệ với chúng tôi.
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="chatbubble-ellipses-outline" size={16} color={COLORS.black} />
            <Text style={styles.contactButtonText}>Liên Hệ Tư Vấn</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  safeArea: {
    backgroundColor: COLORS.bgDark,
  },
  scrollContainer: {
    padding: SPACING.lg,
  },
  accordionSection: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  headerActive: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    flex: 1,
    marginRight: SPACING.md,
  },
  content: {
    padding: SPACING.xl,
    paddingTop: SPACING.md,
  },
  contentText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
  },
  helpSection: {
    marginTop: SPACING.xxxl,
    padding: SPACING.xl,
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  helpTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  helpSubtitle: {
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gold,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  contactButtonText: {
    color: COLORS.black,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
});
