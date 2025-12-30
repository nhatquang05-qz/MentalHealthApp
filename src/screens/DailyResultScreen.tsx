import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';

import { API_URL } from '../config';

export default function DailyResultScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const score = route.params?.score || 0;
  const [resultText, setResultText] = useState('');
  const [description, setDescription] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const processedRef = useRef(false);

  useEffect(() => {
    if (score <= 5) {
      setResultText('Trạng thái Tốt');
      setDescription('Tâm trạng của bạn khá ổn định. Hãy duy trì thói quen tốt này nhé!');
    } else if (score <= 10) {
      setResultText('Căng thẳng Nhẹ');
      setDescription('Bạn có chút lo âu. Hãy thử nghỉ ngơi ngắn và các bài tập thở sâu.');
    } else {
      setResultText('Cần Chú Ý');
      setDescription('Mức độ căng thẳng khá cao. Bạn nên trò chuyện với ai đó hoặc thư giãn ngay.');
    }
  }, [score]);

  useEffect(() => {
    if (user && resultText && !processedRef.current) {
      saveDailyResult();
    }
  }, [user, resultText]);

  const saveDailyResult = async () => {
    if (processedRef.current) return;
    processedRef.current = true;
    setIsSaving(true);

    try {
      const userIdToSave = (user as any).id;

      if (!userIdToSave) {
        console.error('Thiếu User ID, không thể lưu!');
        setIsSaving(false);
        return;
      }

      const response = await fetch(`${API_URL}/data/test-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userIdToSave,
          testType: 'Daily Check-In',
          score: score,
          result: resultText,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setHasSaved(true);
        console.log('Đã tự động lưu kết quả thành công!');
      } else {
        Alert.alert('Lỗi lưu trữ', data.message || 'Không lưu được dữ liệu.');
        processedRef.current = false;
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi mạng', 'Không thể kết nối đến server backend.');
      processedRef.current = false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#FFF9E1' }]}>
      <View style={styles.header}>
        {}
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={styles.backButton}>
          <Ionicons name="close" size={28} color={colors.text} />
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
            {resultText} (Điểm: {score}/15)
          </Text>

          <Text style={[styles.resultDesc, { color: colors.subText }]}>{description}</Text>

          {}
          <View style={styles.saveStatusContainer}>
            {isSaving ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator size="small" color="#3995E9" />
                <Text style={{ color: colors.subText }}>Đang lưu kết quả...</Text>
              </View>
            ) : hasSaved ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>Đã lưu vào nhật ký</Text>
              </View>
            ) : (
              <Text style={{ color: '#FF5252' }}>Chưa lưu được kết quả</Text>
            )}
          </View>

          {}
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: '#3995E9', marginTop: 15 }]}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Text style={styles.primaryButtonText}>Hoàn tất</Text>
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
  congratsText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  resultDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  saveStatusContainer: { marginBottom: 10, height: 30, justifyContent: 'center' },
  primaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
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
  recommendTime: { fontSize: 14 },
});
