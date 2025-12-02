import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { testData } from '../data/testData'; // Import dữ liệu

export default function SpecificResultScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const { title, score, testType } = route.params;

  // Lấy cấu hình kết quả từ testData dựa trên testType
  const currentTestData = testData[testType as keyof typeof testData];
  
  // Hàm tìm kết quả phù hợp dựa trên điểm số
  const getResultAnalysis = (currentScore: number) => {
    const results = currentTestData.results;
    // Tìm level phù hợp với range điểm
    const result = results.find(r => currentScore >= r.min && currentScore <= r.max);
    // Fallback nếu không tìm thấy (mặc định lấy mức cao nhất)
    return result || results[results.length - 1];
  };

  const analysis = getResultAnalysis(score);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#FFF9E1' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Survey' })} style={styles.backButton}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Kết quả</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={testType === 'stress' ? "flash" : testType === 'anxiety' ? "pulse" : "cloudy-night"} 
              size={50} 
              color={analysis.color} 
            />
          </View>
          
          <Text style={[styles.testTitle, { color: colors.subText }]}>{title}</Text>
          <Text style={[styles.scoreText, { color: analysis.color }]}>{analysis.level}</Text>
          <Text style={[styles.scoreNum, { color: colors.text }]}>Điểm số: {score}/30</Text>
          
          <Text style={[styles.resultDesc, { color: colors.text }]}>
            {analysis.description}
          </Text>

          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary }]} 
            onPress={() => navigation.navigate('MainTabs', { screen: 'Survey' })}
          >
            <Text style={styles.primaryButtonText}>Hoàn tất</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.recommendTitle, { color: colors.text }]}>Lời khuyên cho bạn</Text>

        {/* Render danh sách lời khuyên động */}
        {analysis.advice.map((item, index) => (
            <View key={index} style={[styles.recommendItem, { backgroundColor: isDark ? '#1E1E1E' : '#F0F0F0' }]}>
            <View style={[styles.recommendIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="bulb" size={24} color={colors.primary} />
            </View>
            <View style={styles.recommendContent}>
                <Text style={[styles.recommendName, { color: colors.text }]}>Phương pháp {index + 1}</Text>
                <Text style={[styles.recommendTime, { color: colors.subText }]}>{item}</Text>
            </View>
            </View>
        ))}
        
        <Text style={{textAlign: 'center', color: colors.subText, fontSize: 12, marginTop: 20, fontStyle: 'italic'}}>
            Nguồn: {currentTestData.source}
        </Text>
        <Text style={{textAlign: 'center', color: colors.subText, fontSize: 11, marginBottom: 20}}>
            *Kết quả chỉ mang tính chất tham khảo, không thay thế chẩn đoán y khoa.*
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
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
    marginBottom: 30
  },
  iconContainer: { marginBottom: 20 },
  testTitle: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  scoreText: { fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
  scoreNum: { fontSize: 14, fontWeight: '600', marginBottom: 16, opacity: 0.7 },
  resultDesc: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  primaryButton: { width: '100%', paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  recommendTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  recommendItem: { flexDirection: 'row', padding: 16, borderRadius: 20, marginBottom: 12, alignItems: 'center' },
  recommendIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  recommendContent: { flex: 1 },
  recommendName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  recommendTime: { fontSize: 14, lineHeight: 20 }
});