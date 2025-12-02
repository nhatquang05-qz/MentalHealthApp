import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { testData } from '../data/testData';

export default function SpecificTestScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const scrollRef = useRef<ScrollView>(null);
  
  const { testType } = route.params; 
  const currentTest = testData[testType as keyof typeof testData];
  const questions = currentTest.questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: currentIndex * 50 - 150, animated: true });
    }
  }, [currentIndex]);

  const handleSelectOption = (optionIndex: number) => {
    const point = questions[currentIndex].points[optionIndex];
    const newAnswers = [...answers];
    newAnswers[currentIndex] = point;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishTest();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const jumpToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  const finishTest = () => {
    const unansweredCount = answers.filter(a => a === -1).length;
    if (unansweredCount > 0) {
      Alert.alert(
        "Chưa hoàn thành",
        `Bạn còn ${unansweredCount} câu chưa trả lời. Bạn có chắc muốn nộp bài không?`,
        [
          { text: "Làm tiếp", style: "cancel" },
          { text: "Nộp bài", onPress: calculateAndNavigate }
        ]
      );
    } else {
      calculateAndNavigate();
    }
  };

  const calculateAndNavigate = () => {
    // 1. Tính tổng điểm thực tế
    const totalScore = answers.reduce((a, b) => (b !== -1 ? a + b : a), 0);

    // 2. LOGIC CẢNH BÁO (RED FLAG)
    // Nếu là bài test trầm cảm và câu 10 (index 9) có điểm >= 2 (Hơn nửa số ngày/Gần như mọi ngày)
    let isCritical = false;
    if (testType === 'depression') {
      const question10Score = answers[9]; 
      if (question10Score >= 2) {
        isCritical = true;
      }
    }

    // 3. Chuyển trang, truyền thêm cờ isCritical
    navigation.replace('SpecificResult', { 
        testType: testType, 
        score: totalScore,
        title: currentTest.title,
        isCritical: isCritical // Truyền trạng thái nguy hiểm
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#FFF9E1' }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{currentTest.title}</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.paletteContainer}>
          <ScrollView 
            ref={scrollRef}
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.paletteContent}
          >
            {questions.map((_, index) => {
              const isAnswered = answers[index] !== -1;
              const isCurrent = index === currentIndex;
              
              let bgColor = isDark ? '#333' : '#E0E0E0';
              let textColor = colors.subText;

              if (isCurrent) {
                bgColor = colors.primary;
                textColor = '#fff';
              } else if (isAnswered) {
                bgColor = colors.success; 
                textColor = '#fff';
              }

              return (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.paletteItem, { backgroundColor: bgColor }]}
                  onPress={() => jumpToQuestion(index)}
                >
                  <Text style={{ color: textColor, fontWeight: '600', fontSize: 12 }}>
                    {index + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.contentContainer}>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.questionLabel, { color: colors.subText }]}>Câu hỏi {currentIndex + 1}</Text>
            <Text style={[styles.questionText, { color: colors.text }]}>
              {questions[currentIndex].text}
            </Text>

            <View style={styles.optionsContainer}>
              {questions[currentIndex].options.map((option, index) => {
                const optionPoint = questions[currentIndex].points[index];
                const isSelected = answers[currentIndex] === optionPoint;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      { 
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: isSelected ? (isDark ? '#1E3A5F' : '#E3F2FD') : 'transparent'
                      }
                    ]}
                    onPress={() => handleSelectOption(index)}
                  >
                    <View style={[
                      styles.radioCircle, 
                      { borderColor: isSelected ? colors.primary : colors.subText },
                      isSelected && { backgroundColor: colors.primary }
                    ]}>
                      {isSelected && <Ionicons name="checkmark" size={12} color="#fff" />}
                    </View>
                    <Text style={[
                      styles.optionText, 
                      { 
                        color: isSelected ? colors.primary : colors.subText,
                        fontWeight: isSelected ? '600' : '400'
                      }
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TouchableOpacity 
            style={[
              styles.navButton, 
              { backgroundColor: isDark ? '#333' : '#F3F4F6', opacity: currentIndex === 0 ? 0.5 : 1 }
            ]}
            onPress={handlePrev}
            disabled={currentIndex === 0}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
            <Text style={[styles.navButtonText, { color: colors.text }]}>Trước</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navButton, { backgroundColor: colors.primary, flex: 1.5 }]}
            onPress={handleNext}
          >
            <Text style={[styles.navButtonText, { color: '#fff' }]}>
              {currentIndex === questions.length - 1 ? "Kết thúc" : "Tiếp theo"}
            </Text>
            <Ionicons 
              name={currentIndex === questions.length - 1 ? "checkmark-circle" : "arrow-forward"} 
              size={20} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  paletteContainer: { height: 60, justifyContent: 'center' },
  paletteContent: { paddingHorizontal: 15, alignItems: 'center' },
  paletteItem: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginHorizontal: 6 },
  contentContainer: { flex: 1, padding: 20 },
  card: { borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 3, flex: 1 },
  questionLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase' },
  questionText: { fontSize: 20, fontWeight: 'bold', marginBottom: 30, lineHeight: 28 },
  optionsContainer: { width: '100%', gap: 12 },
  optionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  optionText: { fontSize: 16 },
  footer: { flexDirection: 'row', padding: 20, borderTopWidth: 1, gap: 15 },
  navButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 25, gap: 8 },
  navButtonText: { fontSize: 16, fontWeight: '600' }
});