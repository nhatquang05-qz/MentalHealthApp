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
  Alert,
  RefreshControl,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

import { API_URL } from '../config';

const screenWidth = Dimensions.get('window').width;

const emotions = [
  { name: 'Funny', img: require('../../assets/images/funny.png'), value: 5 },
  { name: 'Happy', img: require('../../assets/images/happy.png'), value: 4 },
  { name: 'Normal', img: require('../../assets/images/normal.png'), value: 3 },
  { name: 'Sad', img: require('../../assets/images/sad.png'), value: 2 },
  { name: 'Cry', img: require('../../assets/images/cry.png'), value: 1 },
];

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
  const { user } = useAuth();

  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        checkStatusAndStreak();
        fetchUnreadCount();
      } else {
        setHasCheckedInToday(false);
        setCurrentStreak(0);
        setUnreadCount(0);
      }
    }, [user]),
  );

  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_URL}/notifications?userId=${(user as any).id}`);
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        const count = data.filter((n: any) => !n.isRead).length;
        setUnreadCount(count);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkStatusAndStreak = async () => {
    try {
      const response = await fetch(`${API_URL}/data/test-result/${(user as any).id}`);
      const data = await response.json();

      if (!Array.isArray(data)) return;

      const dailyCheckIns = data.filter((item: any) => item.testType === 'Daily Check-In');

      const checkInDates = new Set(dailyCheckIns.map((item: any) => item.createdAt.split('T')[0]));

      const today = new Date().toISOString().split('T')[0];
      if (checkInDates.has(today)) {
        setHasCheckedInToday(true);
      } else {
        setHasCheckedInToday(false);
      }

      let streak = 0;
      let checkDate = new Date();

      const todayStr = checkDate.toISOString().split('T')[0];
      if (checkInDates.has(todayStr)) {
        streak++;
      }

      checkDate.setDate(checkDate.getDate() - 1);

      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (checkInDates.has(dateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      setCurrentStreak(streak);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu từ API:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    Promise.all([checkStatusAndStreak(), fetchUnreadCount()]).finally(() => setRefreshing(false));
  }, []);

  const handleEmotionSelect = (emotionName: string) => {
    setSelectedEmotion(emotionName);
    setTimeout(() => {
      navigation.navigate('DailyCheckIn');
      setSelectedEmotion(null);
    }, 300);
  };

  const handleReCheckIn = () => {
    Alert.alert(
      'Làm lại khảo sát?',
      'Bạn đã check-in hôm nay. Bạn có muốn thực hiện lại để cập nhật cảm xúc mới không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Làm lại', onPress: () => navigation.navigate('DailyCheckIn') },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {}
        <View style={styles.header}>
          <View style={styles.soulCareLogo}>
            <Text style={styles.soulCareText}>SoulCare</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {}
            <TouchableOpacity style={styles.sosButton} onPress={() => navigation.navigate('SOS')}>
              <Text style={{ fontWeight: '900', color: '#fff', fontSize: 12 }}>SOS</Text>
            </TouchableOpacity>

            {}
            <View
              style={[styles.streakContainer, { backgroundColor: isDark ? '#333' : '#FFF0E6' }]}
            >
              <Ionicons name="flame" size={18} color="#FF6B6B" />
              <Text style={[styles.streakText, { color: '#FF6B6B' }]}>{currentStreak}</Text>
            </View>

            {}
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color="#fff" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {}
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
              <Text style={{ color: colors.subText, fontSize: 13, marginTop: 4, marginBottom: 15 }}>
                Hãy quay lại vào ngày mai để duy trì chuỗi nhé!
              </Text>

              <TouchableOpacity
                style={[styles.reCheckInButton, { borderColor: colors.primary }]}
                onPress={handleReCheckIn}
              >
                <Text style={{ color: colors.primary, fontWeight: '600' }}>Làm lại khảo sát</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {}
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

        {}
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

          {}
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
            onPress={() => navigation.navigate('Map')}
          >
            <View
              style={[
                styles.iconBox,
                { backgroundColor: '#E1F5FE', marginBottom: 0, marginRight: 15 },
              ]}
            >
              <Ionicons name="map-outline" size={24} color="#0288D1" />
            </View>
            <View>
              <Text style={[styles.shortcutTitle, { color: colors.text, marginBottom: 2 }]}>
                Bản Đồ Y Tế
              </Text>
              <Text style={{ fontSize: 12, color: colors.subText }}>
                Tìm bệnh viện & cơ sở tâm lý gần bạn
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
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: '#FF5252',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
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
  reCheckInButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 5,
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
