import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function DailyResultScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#FFF9E1' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Kết quả khảo sát</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.iconContainer}>
            <Ionicons name="sparkles" size={40} color="#FFD700" />
          </View>
          
          <Text style={[styles.congratsText, { color: colors.text }]}>
            Bạn đã hoàn thành khảo sát hằng ngày
          </Text>
          
          <Text style={[styles.resultDesc, { color: colors.subText }]}>
            Mức độ căng thẳng của bạn ở mức trung bình{"\n"}— hãy thử nghỉ ngơi ngắn và các bài tập thở sâu.
          </Text>

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: '#3995E9' }]} onPress={() => navigation.navigate('MainTabs')}>
            <Text style={styles.primaryButtonText}>Lưu kết quả</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.secondaryButton, { borderColor: colors.border }]} 
            onPress={() => navigation.navigate('DailyCheckIn')}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Làm lại khảo sát</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.recommendTitle, { color: colors.text }]}>Đề xuất cho bạn</Text>

        <View style={[styles.recommendItem, { backgroundColor: isDark ? '#1E1E1E' : '#F0F0F0' }]}>
          <View style={[styles.recommendIcon, { backgroundColor: '#FFD1DC' }]}>
             <Ionicons name="body" size={24} color="#FF6B6B" />
          </View>
          <View style={styles.recommendContent}>
            <Text style={[styles.recommendName, { color: colors.text }]}>Bài tập thở</Text>
            <Text style={[styles.recommendTime, { color: colors.subText }]}>5 phút</Text>
          </View>
        </View>

        <View style={[styles.recommendItem, { backgroundColor: isDark ? '#1E1E1E' : '#F0F0F0' }]}>
          <View style={[styles.recommendIcon, { backgroundColor: '#E3F2FD' }]}>
             <Ionicons name="musical-notes" size={24} color="#3995E9" />
          </View>
          <View style={styles.recommendContent}>
            <Text style={[styles.recommendName, { color: colors.text }]}>Nhạc thư giãn</Text>
            <Text style={[styles.recommendTime, { color: colors.subText }]}>10 phút</Text>
          </View>
        </View>
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
  congratsText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  resultDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  primaryButton: { width: '100%', paddingVertical: 16, borderRadius: 30, alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryButton: { width: '100%', paddingVertical: 16, borderRadius: 30, alignItems: 'center', borderWidth: 1 },
  secondaryButtonText: { fontSize: 16, fontWeight: '600' },
  recommendTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  recommendItem: { flexDirection: 'row', padding: 16, borderRadius: 20, marginBottom: 12, alignItems: 'center' },
  recommendIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  recommendContent: { flex: 1 },
  recommendName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  recommendTime: { fontSize: 14 }
});