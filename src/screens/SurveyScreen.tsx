import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const surveyCategories = [
  { id: "depression", icon: "heart-outline", title: "Test Trầm Cảm", desc: "Hiểu rõ tâm trạng và động lực hiện tại." },
  { id: "anxiety", icon: "happy-outline", title: "Test Lo Âu", desc: "Khám phá dấu hiệu của sự lo lắng." },
  { id: "stress", icon: "alert-circle-outline", title: "Test Căng Thẳng", desc: "Đo lường căng thẳng hàng ngày." },
];

const historyData = [
  { id: 1, type: "Test Trầm Cảm", date: "20/03/2024", score: "Nhẹ", severity: "low" },
  { id: 2, type: "Test Lo Âu", date: "18/03/2024", score: "Trung Bình", severity: "medium" },
];

export default function SurveyScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();

  // Hàm xử lý khi bấm nút Bắt đầu
  const handleStartTest = (testId: string) => {
    // Chuyển hướng sang màn hình SpecificTest và truyền loại test (id)
    navigation.navigate('SpecificTest', { testType: testId });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.card }]} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Khảo Sát Sức Khỏe</Text>
        </View>

        {/* Danh sách bài test */}
        <View style={styles.listContainer}>
          {surveyCategories.map((item) => (
            <View key={item.id} style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: isDark ? '#333' : colors.iconBg }]}>
                  {/* @ts-ignore */}
                  <Ionicons name={item.icon} size={24} color={colors.primary} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.cardDesc, { color: colors.subText }]}>{item.desc}</Text>
                </View>
              </View>
              
              {/* Cập nhật sự kiện onPress tại đây */}
              <TouchableOpacity 
                style={[styles.startButton, { backgroundColor: colors.primary }]}
                onPress={() => handleStartTest(item.id)}
              >
                <Text style={styles.startButtonText}>Bắt Đầu</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Lịch sử */}
        <View style={[styles.card, { marginTop: 10, backgroundColor: colors.card }]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Lịch Sử Kết Quả</Text>
            <Text style={{color: colors.primary}}>Xem tất cả</Text>
          </View>
          
          {historyData.map((item) => (
            <View key={item.id} style={[styles.historyItem, { backgroundColor: isDark ? '#2C2C2C' : '#F3F4F6' }]}>
              <View style={[styles.dot, { backgroundColor: item.severity === 'low' ? colors.success : '#eab308' }]} />
              <View style={{flex: 1, marginLeft: 12}}>
                <Text style={[styles.historyType, { color: colors.text }]}>{item.type}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons name="time-outline" size={12} color={colors.subText} />
                  <Text style={[styles.historyDate, { color: colors.subText }]}> {item.date}</Text>
                </View>
              </View>
              <Text style={[styles.historyScore, { color: colors.subText }]}>{item.score}</Text>
            </View>
          ))}
        </View>
        <View style={{height: 30}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, marginTop: 10 },
  backButton: { padding: 8, borderRadius: 20, marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  listContainer: { marginBottom: 20 },
  card: { borderRadius: 24, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  cardHeader: { flexDirection: 'row', marginBottom: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1, marginLeft: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardDesc: { fontSize: 13, lineHeight: 18 },
  startButton: { borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  startButtonText: { color: '#fff', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  historyItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  historyType: { fontWeight: '500', marginBottom: 2 },
  historyDate: { fontSize: 12 },
  historyScore: { fontSize: 13 }
});