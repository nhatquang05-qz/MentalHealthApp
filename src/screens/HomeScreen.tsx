import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Thêm useFocusEffect
import AsyncStorage from '@react-native-async-storage/async-storage'; // Thêm AsyncStorage

const screenWidth = Dimensions.get('window').width;

const emotions = [
  { name: 'Funny', img: require('../../assets/images/funny.png'), value: 5 },
  { name: 'Happy', img: require('../../assets/images/happy.png'), value: 4 },
  { name: 'Normal', img: require('../../assets/images/normal.png'), value: 3 },
  { name: 'Sad', img: require('../../assets/images/sad.png'), value: 2 },
  { name: 'Cry', img: require('../../assets/images/cry.png'), value: 1 },
];

// Dữ liệu biểu đồ mẫu (Bạn có thể nâng cấp để lấy từ AsyncStorage sau này)
const chartData = [
  { value: 4, label: '2' },
  { value: 3, label: '3' },
  { value: 2, label: '4' },
  { value: 5, label: '5' },
  { value: 3, label: '6' },
  { value: 2, label: '7' },
  { value: 5, label: 'CN' },
];

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();

  // State quản lý trạng thái
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  // useFocusEffect sẽ chạy mỗi khi màn hình này được hiển thị
  useFocusEffect(
    useCallback(() => {
      checkStatusAndStreak();
    }, []),
  );

  const checkStatusAndStreak = async () => {
    try {
      const dataJson = await AsyncStorage.getItem('mood_history');
      const data = dataJson ? JSON.parse(dataJson) : {};

      // 1. Kiểm tra đã check-in hôm nay chưa
      // Lưu ý: Phải dùng cùng format ngày với bên DailyResultScreen
      const today = new Date().toISOString().split('T')[0];

      if (data[today]) {
        setHasCheckedInToday(true);
      } else {
        setHasCheckedInToday(false);
      }

      // 2. Tính toán Streak (Chuỗi ngày liên tiếp)
      let streak = 0;
      let checkDate = new Date();

      // Nếu hôm nay đã check-in, bắt đầu đếm từ hôm nay.
      // Nếu chưa, bắt đầu đếm từ hôm qua.
      // Tuy nhiên logic đơn giản nhất là cứ đếm lùi từ hôm nay,
      // nếu hôm nay có thì +1, sau đó lùi về hôm qua kiểm tiếp.

      // Bước A: Kiểm tra hôm nay
      const todayStr = checkDate.toISOString().split('T')[0];
      if (data[todayStr]) {
        streak++;
      }

      // Bước B: Kiểm tra các ngày quá khứ
      // Lùi về 1 ngày
      checkDate.setDate(checkDate.getDate() - 1);

      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (data[dateStr]) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1); // Lùi tiếp
        } else {
          break; // Ngắt chuỗi nếu gặp ngày không check-in
        }
      }

      setCurrentStreak(streak);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const handleEmotionSelect = (emotionName: string) => {
    setSelectedEmotion(emotionName);
    setTimeout(() => {
      navigation.navigate('DailyCheckIn');
      setSelectedEmotion(null); // Reset sau khi navigate
    }, 300);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.soulCareLogo}>
            <Text style={styles.soulCareText}>SoulCare</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* Nút SOS */}
            <TouchableOpacity style={styles.sosButton} onPress={() => navigation.navigate('SOS')}>
              <Text style={{ fontWeight: '900', color: '#fff', fontSize: 12 }}>SOS</Text>
            </TouchableOpacity>

            {/* Streak hiển thị số thực tế */}
            <View
              style={[styles.streakContainer, { backgroundColor: isDark ? '#333' : '#FFF0E6' }]}
            >
              <Ionicons name="flame" size={18} color="#FF6B6B" />
              <Text style={[styles.streakText, { color: '#FF6B6B' }]}>{currentStreak}</Text>
            </View>

            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Thẻ Cảm xúc / Check-in */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Check-in cảm xúc</Text>
              <Text style={[styles.cardSubtitle, { color: colors.subText }]}>
                {hasCheckedInToday ? 'Bạn thật tuyệt vời!' : 'Ngày hôm nay của bạn thế nào?'}
              </Text>
            </View>

            {/* Ẩn huy hiệu +1 Streak nếu đã check-in */}
            {!hasCheckedInToday && (
              <View
                style={{
                  backgroundColor: '#E3F2FD',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  +1 Streak
                </Text>
              </View>
            )}
          </View>

          {/* Logic hiển thị: Nếu chưa check-in -> Hiện Icon. Nếu rồi -> Hiện thông báo */}
          {!hasCheckedInToday ? (
            <View style={styles.emotionContainer}>
              {emotions.map((emotion) => (
                <TouchableOpacity
                  key={emotion.name}
                  style={[
                    styles.emotionButton,
                    selectedEmotion === emotion.name && {
                      backgroundColor: isDark ? '#333' : '#f0f8ff',
                      borderColor: colors.primary,
                    },
                  ]}
                  onPress={() => handleEmotionSelect(emotion.name)}
                >
                  <Image source={emotion.img} style={styles.emotionIcon} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.checkedInContainer}>
              <Ionicons name="checkmark-circle" size={48} color={colors.success} />
              <Text style={[styles.checkedInText, { color: colors.text }]}>
                Bạn đã check-in hôm nay rồi.
              </Text>
              <Text style={{ color: colors.subText, fontSize: 13, marginTop: 4 }}>
                Hãy quay lại vào ngày mai để duy trì chuỗi nhé!
              </Text>
            </View>
          )}
        </View>

        {/* Thẻ Biểu đồ */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Biểu đồ tâm trạng</Text>
          <Text style={[styles.cardSubtitle, { color: colors.subText }]}>Tuần trước</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              height={220}
              isAnimated
              curved
              color1={colors.primary}
              dataPointsColor1={colors.primary}
              startFillColor1={colors.primary}
              endFillColor1={colors.card}
              startOpacity={1}
              endOpacity={1}
              maxValue={5}
              noOfSections={5}
              yAxisLabelContainerStyle={{ width: 30 }}
              yAxisLabelSuffix=""
              yAxisTextStyle={{ color: colors.subText, fontSize: 12 }}
              xAxisLabelTextStyle={{ color: colors.subText, fontSize: 12 }}
              dataPointsRadius={5}
              dataPointsHeight={5}
              dataPointsWidth={5}
              rulesType="solid"
              rulesColor={colors.border}
              xAxisColor={colors.border}
              yAxisColor={colors.border}
              hideYAxisText={false}
            />
          </View>
        </View>

        {/* Khu vực Tiện ích */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tiện ích</Text>

        <View style={{ flexDirection: 'row', gap: 15, flexWrap: 'wrap' }}>
          <TouchableOpacity
            style={[styles.shortcutCard, { backgroundColor: colors.card, width: '47%' }]}
            onPress={() => navigation.navigate('Survey')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="clipboard-outline" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.shortcutTitle, { color: colors.text }]}>Làm Khảo sát</Text>
            <Text style={{ fontSize: 12, color: colors.subText }}>Đánh giá sức khỏe</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shortcutCard, { backgroundColor: colors.card, width: '47%' }]}
            onPress={() => navigation.navigate('Music')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#FFF0E6' }]}>
              <Ionicons name="headset-outline" size={24} color="#FF8C42" />
            </View>
            <Text style={[styles.shortcutTitle, { color: colors.text }]}>Nghe nhạc</Text>
            <Text style={{ fontSize: 12, color: colors.subText }}>Thư giãn tâm trí</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shortcutCard, { backgroundColor: colors.card, width: '47%' }]}
            onPress={() => navigation.navigate('MoodHistory')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="calendar" size={24} color="#FF9800" />
            </View>
            <Text style={[styles.shortcutTitle, { color: colors.text }]}>Lịch Cảm Xúc</Text>
            <Text style={{ fontSize: 12, color: colors.subText }}>Theo dõi hành trình</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shortcutCard, { backgroundColor: colors.card, width: '47%' }]}
            onPress={() => navigation.navigate('Quote')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="sparkles" size={24} color="#9C27B0" />
            </View>
            <Text style={[styles.shortcutTitle, { color: colors.text }]}>Thông Điệp</Text>
            <Text style={{ fontSize: 12, color: colors.subText }}>Lời khuyên mỗi ngày</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.shortcutCard,
              {
                backgroundColor: colors.card,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}
            onPress={() => navigation.navigate('BurnWorries')}
          >
            <View
              style={[
                styles.iconBox,
                { backgroundColor: '#FFEBEE', marginBottom: 0, marginRight: 15 },
              ]}
            >
              <Ionicons name="bonfire-outline" size={24} color="#FF5252" />
            </View>
            <View>
              <Text style={[styles.shortcutTitle, { color: colors.text, marginBottom: 2 }]}>
                Gửi Lo Âu Đi
              </Text>
              <Text style={{ fontSize: 12, color: colors.subText }}>
                Viết ra và giải tỏa căng thẳng ngay
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.subText}
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.shortcutCard,
              {
                backgroundColor: colors.card,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}
            onPress={() => navigation.navigate('Gratitude')}
          >
            <View
              style={[
                styles.iconBox,
                { backgroundColor: '#E8F5E9', marginBottom: 0, marginRight: 15 },
              ]}
            >
              <Ionicons name="leaf" size={24} color="#4CAF50" />
            </View>
            <View>
              <Text style={[styles.shortcutTitle, { color: colors.text, marginBottom: 2 }]}>
                Nhật Ký Biết Ơn
              </Text>
              <Text style={{ fontSize: 12, color: colors.subText }}>
                Lưu giữ những điều tích cực
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.subText}
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },

  soulCareLogo: {
    backgroundColor: '#FFB962',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  soulCareText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  notificationButton: {
    backgroundColor: '#FFB962',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sosButton: {
    backgroundColor: '#FF3B30',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 3,
  },

  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  streakText: { fontWeight: '700', fontSize: 14 },

  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, marginBottom: 20 },

  emotionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  emotionButton: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  emotionIcon: { width: 44, height: 44 },

  // Style cho trạng thái đã check-in
  checkedInContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 5,
  },
  checkedInText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },

  chartContainer: { paddingLeft: 0, paddingTop: 10, marginLeft: -10 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 5,
  },

  shortcutCard: {
    padding: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    elevation: 2,
    marginBottom: 5,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  shortcutTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
});
