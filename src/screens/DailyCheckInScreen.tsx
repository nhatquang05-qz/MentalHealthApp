import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const questions = [
  {
    id: 1,
    text: "Tôi thường cảm thấy lo lắng trong vài ngày gần đây.",
    options: ["Rất không đồng ý", "Không đồng ý", "Đồng ý", "Rất đồng ý"]
  },
  {
    id: 2,
    text: "Tôi cảm thấy khó ngủ hoặc ngủ không ngon giấc.",
    options: ["Rất không đồng ý", "Không đồng ý", "Đồng ý", "Rất đồng ý"]
  },
  {
    id: 3,
    text: "Tôi cảm thấy mệt mỏi hoặc thiếu năng lượng.",
    options: ["Rất không đồng ý", "Không đồng ý", "Đồng ý", "Rất đồng ý"]
  },
  {
    id: 4,
    text: "Tôi cảm thấy chán ăn hoặc ăn quá nhiều.",
    options: ["Rất không đồng ý", "Không đồng ý", "Đồng ý", "Rất đồng ý"]
  },
  {
    id: 5,
    text: "Tôi gặp khó khăn trong việc tập trung vào công việc.",
    options: ["Rất không đồng ý", "Không đồng ý", "Đồng ý", "Rất đồng ý"]
  }
];

export default function DailyCheckInScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleNext = (index: number) => {
    setSelectedOption(index);
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
      } else {
        navigation.replace('DailyResult');
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(null);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#FFF9E1' }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Kiểm tra hằng ngày</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: '#E0E0E0' }]}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: '#3995E9' }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.subText }]}>Câu hỏi {currentIndex + 1}/{questions.length}</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.questionText, { color: colors.text }]}>
              {questions[currentIndex].text}
            </Text>

            <View style={styles.optionsContainer}>
              {questions[currentIndex].options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    { 
                      borderColor: selectedOption === index ? '#3995E9' : colors.border,
                      backgroundColor: selectedOption === index ? (isDark ? '#1E3A5F' : '#E3F2FD') : 'transparent'
                    }
                  ]}
                  onPress={() => handleNext(index)}
                >
                  <Text style={[
                    styles.optionText, 
                    { 
                      color: selectedOption === index ? '#3995E9' : colors.subText,
                      fontWeight: selectedOption === index ? '600' : '400'
                    }
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {currentIndex > 0 && (
              <TouchableOpacity onPress={handleBack} style={styles.prevButton}>
                <Text style={styles.prevButtonText}>Trước</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  progressContainer: { marginBottom: 30 },
  progressBar: { height: 6, borderRadius: 3, width: '100%', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 12 },
  contentContainer: { flex: 1, justifyContent: 'center' },
  card: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    minHeight: 400,
    alignItems: 'center',
    justifyContent: 'center'
  },
  questionText: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 40, lineHeight: 26 },
  optionsContainer: { width: '100%', gap: 16 },
  optionButton: {
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    width: '100%'
  },
  optionText: { fontSize: 15 },
  prevButton: { marginTop: 30, padding: 10, backgroundColor: '#3995E9', borderRadius: 20, paddingHorizontal: 30 },
  prevButtonText: { color: '#fff', fontWeight: '600' }
});