import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { testData, MedicalContact } from '../data/testData';

import { API_URL } from '../config';

export default function SpecificResultScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { title, score, testType, isCritical, answers, fromHistory } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const processedRef = useRef(false);

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

  useEffect(() => {
    if (user && !processedRef.current && !fromHistory) {
      saveResultToDB();
    }
  }, [user, fromHistory]);

  const saveResultToDB = async () => {
    if (processedRef.current) return;
    processedRef.current = true;
    setIsSaving(true);

    try {
      const response = await fetch(`${API_URL}/data/test-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: (user as any).id,
          testType: testType,
          score: score,
          result: analysis.level,
          details: answers,
        }),
      });

      if (response.ok) {
        setHasSaved(true);
      } else {
        console.error('Lỗi lưu kết quả');
      }
    } catch (error) {
      console.error('Lỗi mạng:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const getAnswerColor = (point: number) => {
    if (point === 0) return '#4CAF50';
    if (point === 1) return '#FFC107';
    if (point === 2) return '#FF9800';
    if (point >= 3) return '#FF5252';
    return colors.subText;
  };

  const renderReviewModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={reviewModalVisible}
      onRequestClose={() => setReviewModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colors.card, height: '90%' }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Chi tiết bài làm</Text>
            <TouchableOpacity
              onPress={() => setReviewModalVisible(false)}
              style={styles.closeModalButton}
            >
              <Ionicons name="close-circle" size={30} color={colors.subText} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {currentTestData.questions.map((q, index) => {
              const userPoint = answers ? answers[index] : -1;
              const pointColor = getAnswerColor(userPoint);

              const selectedOptionIndex = q.points.findIndex((p) => p === userPoint);
              const selectedText =
                selectedOptionIndex !== -1 ? q.options[selectedOptionIndex] : 'Không có dữ liệu';

              return (
                <View key={q.id} style={[styles.reviewItem, { borderColor: colors.border }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.reviewQuestionNum, { color: colors.subText }]}>
                      Câu {index + 1}
                    </Text>
                    <View style={[styles.pointBadge, { backgroundColor: pointColor }]}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                        {userPoint} điểm
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.reviewQuestionText, { color: colors.text }]}>{q.text}</Text>

                  <View
                    style={[
                      styles.reviewAnswerBox,
                      {
                        backgroundColor: isDark ? '#333' : '#F5F5F5',
                        borderLeftColor: pointColor,
                        borderLeftWidth: 4,
                      },
                    ]}
                  >
                    <Text style={{ color: colors.text, fontStyle: 'italic' }}>
                      Bạn chọn: <Text style={{ fontWeight: 'bold' }}>{selectedText}</Text>
                    </Text>
                  </View>
                </View>
              );
            })}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
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
          <Text style={[styles.scoreNum, { color: colors.text }]}>Điểm số: {score}/30</Text>

          <Text style={[styles.resultDesc, { color: colors.text }]}>{analysis.description}</Text>

          {}
          {!fromHistory && (
            <View style={{ marginVertical: 10, alignItems: 'center' }}>
              {isSaving ? (
                <Text style={{ color: colors.subText, fontSize: 12 }}>Đang lưu kết quả...</Text>
              ) : hasSaved ? (
                <Text style={{ color: '#4CAF50', fontSize: 12, fontWeight: 'bold' }}>
                  ✓ Đã lưu vào hồ sơ
                </Text>
              ) : (
                <Text style={{ color: '#FF5252', fontSize: 12 }}>Lưu thất bại</Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.detailButton,
              { borderColor: colors.primary, backgroundColor: isDark ? '#333' : '#E3F2FD' },
            ]}
            onPress={() => setReviewModalVisible(true)}
          >
            <Text style={[styles.detailButtonText, { color: colors.primary }]}>
              👁️ Xem lại câu trả lời chi tiết
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.detailButton, { borderColor: analysis.color }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={[styles.detailButtonText, { color: analysis.color }]}>
              📖 Xem lời khuyên & Hỗ trợ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Survey' })}
          >
            <Text style={styles.primaryButtonText}>{fromHistory ? 'Quay lại' : 'Hoàn tất'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {}
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
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={30} color={colors.subText} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={[styles.modalText, { color: colors.text }]}>{analysis.details}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {}
      {renderReviewModal()}
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
  resultDesc: { fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 10 },
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
  reviewItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    paddingBottom: 15,
  },
  reviewQuestionNum: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  reviewQuestionText: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  reviewAnswerBox: {
    padding: 10,
    borderRadius: 8,
  },
  pointBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    justifyContent: 'center',
  },
});
