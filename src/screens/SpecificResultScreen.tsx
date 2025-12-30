import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { testData, MedicalContact } from '../data/testData';

export default function SpecificResultScreen() {
  const { colors, isDark } = useTheme();

  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { title, score, testType, isCritical } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  const currentTestData = testData[testType as keyof typeof testData];

  const getResultAnalysis = () => {
    const normalResult =
      currentTestData.results.find((r) => score >= r.min && score <= r.max) ||
      currentTestData.results[currentTestData.results.length - 1];

    if (isCritical) {
      const severeResult = currentTestData.results[currentTestData.results.length - 1];

      return {
        ...severeResult,
        description:
          'Mặc dù tổng điểm đánh giá của bạn không cao, nhưng câu trả lời về ý định làm hại bản thân là một dấu hiệu nghiêm trọng cần được chú ý đặc biệt.\n\nHãy tìm kiếm sự hỗ trợ ngay lập tức.',
        level: 'Cần Chú Ý Đặc Biệt',
      };
    }

    return normalResult;
  };

  const analysis = getResultAnalysis();

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderMedicalContact = ({ item }: { item: MedicalContact }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        { backgroundColor: isDark ? '#333' : '#FFF5F5', borderColor: colors.danger },
      ]}
      onPress={() => navigation.navigate('Map', { contact: item })}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.contactName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.contactAddress, { color: colors.subText }]}>{item.address}</Text>

        {}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Ionicons name="location-sharp" size={14} color={colors.primary} />
          <Text
            style={{
              color: colors.primary,
              fontSize: 12,
              fontWeight: '600',
              marginLeft: 4,
            }}
          >
            Xem vị trí trên bản đồ
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={(e) => {
          handleCall(item.phone);
        }}
        style={styles.callButton}
      >
        <Ionicons name="call" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#FFF9E1' }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs', { screen: 'Survey' })}
          style={styles.backButton}
        >
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Kết quả</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={isCritical ? 'warning' : testType === 'stress' ? 'flash' : 'pulse'}
              size={50}
              color={analysis.color}
            />
          </View>

          <Text style={[styles.testTitle, { color: colors.subText }]}>{title}</Text>

          <Text style={[styles.scoreText, { color: analysis.color }]}>{analysis.level}</Text>

          <Text style={[styles.scoreNum, { color: colors.text }]}>Điểm số thực tế: {score}/30</Text>

          <Text
            style={[
              styles.resultDesc,
              { color: colors.text, fontWeight: isCritical ? '600' : '400' },
            ]}
          >
            {analysis.description}
          </Text>

          <TouchableOpacity
            style={[styles.detailButton, { borderColor: analysis.color }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={[styles.detailButtonText, { color: analysis.color }]}>
              📖 Xem lời khuyên chi tiết & Hỗ trợ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Survey' })}
          >
            <Text style={styles.primaryButtonText}>Hoàn tất</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.recommendTitle, { color: colors.text }]}>Lời khuyên nhanh</Text>

        {analysis.advice.map((item, index) => (
          <View
            key={index}
            style={[styles.recommendItem, { backgroundColor: isDark ? '#1E1E1E' : '#F0F0F0' }]}
          >
            <View style={[styles.recommendIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="bulb" size={24} color={colors.primary} />
            </View>
            <View style={styles.recommendContent}>
              <Text style={[styles.recommendName, { color: colors.text }]}>
                Phương pháp {index + 1}
              </Text>
              <Text style={[styles.recommendTime, { color: colors.subText }]}>{item}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sourceText}>Nguồn: {currentTestData.source}</Text>
        <Text style={styles.disclaimerText}>
          *Kết quả chỉ mang tính chất tham khảo, không thay thế chẩn đoán y khoa.*
        </Text>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Lời khuyên chuyên sâu</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeModalButton}
              >
                <Ionicons name="close-circle" size={30} color={colors.subText} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalText, { color: colors.text }]}>{analysis.details}</Text>

              {(isCritical ||
                (analysis.medicalContacts && analysis.medicalContacts.length > 0)) && (
                <View style={styles.contactSection}>
                  <View style={styles.divider} />
                  <Text style={[styles.contactSectionTitle, { color: colors.danger }]}>
                    ⚠️ Địa chỉ hỗ trợ y tế uy tín
                  </Text>
                  <Text
                    style={{
                      color: colors.subText,
                      marginBottom: 10,
                      fontSize: 13,
                    }}
                  >
                    Dựa trên tình trạng hiện tại, chúng tôi khuyến nghị bạn liên hệ chuyên gia:
                  </Text>

                  {analysis.medicalContacts?.map((contact, index) => (
                    <View key={index} style={{ marginBottom: 10 }}>
                      {renderMedicalContact({ item: contact })}
                    </View>
                  ))}
                </View>
              )}
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  card: {
    borderRadius: 24,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: { marginBottom: 20 },
  testTitle: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  scoreText: { fontSize: 28, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  scoreNum: { fontSize: 14, fontWeight: '600', marginBottom: 16, opacity: 0.7 },
  resultDesc: { fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 20 },
  primaryButton: { width: '100%', paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  detailButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  detailButtonText: { fontSize: 15, fontWeight: '600' },
  recommendTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  recommendItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  recommendIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recommendContent: { flex: 1 },
  recommendName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  recommendTime: { fontSize: 14, lineHeight: 20 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { height: '80%', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  closeModalButton: { padding: 5 },
  modalText: { fontSize: 16, lineHeight: 26, textAlign: 'justify' },
  contactSection: { marginTop: 20 },
  divider: { height: 1, backgroundColor: '#ccc', marginVertical: 15, opacity: 0.5 },
  contactSectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 5,
  },
  contactName: { fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  contactAddress: { fontSize: 12 },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sourceText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 20,
    fontStyle: 'italic',
    opacity: 0.6,
  },
  disclaimerText: { textAlign: 'center', fontSize: 11, marginBottom: 20, opacity: 0.6 },
});
