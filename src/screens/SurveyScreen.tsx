import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { testData } from '../data/testData';

import { API_URL } from '../config';

const surveyCategories = [
  {
    id: 'depression',
    icon: 'heart-outline',
    title: 'Test Trầm Cảm',
    desc: 'Hiểu rõ tâm trạng và động lực hiện tại.',
  },
  {
    id: 'anxiety',
    icon: 'happy-outline',
    title: 'Test Lo Âu',
    desc: 'Khám phá dấu hiệu của sự lo lắng.',
  },
  {
    id: 'stress',
    icon: 'alert-circle-outline',
    title: 'Test Căng Thẳng',
    desc: 'Đo lường căng thẳng hàng ngày.',
  },
];

const getTestName = (type: string) => {
  switch (type) {
    case 'depression':
      return 'Test Trầm Cảm';
    case 'anxiety':
      return 'Test Lo âu';
    case 'stress':
      return 'Test Căng Thẳng';
    default:
      return type;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const getSeverityColor = (result: string, colors: any) => {
  if (!result) return colors.subText;
  const lowerRes = result.toLowerCase();

  if (lowerRes.includes('cao') || lowerRes.includes('nặng') || lowerRes.includes('chú ý')) {
    return '#FF5252';
  }
  if (lowerRes.includes('trung bình') || lowerRes.includes('vừa')) {
    return '#FFC107';
  }
  return '#4CAF50';
};

export default function SurveyScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const [historyList, setHistoryList] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchTestHistory();
      } else {
        setHistoryList([]);
      }
    }, [user]),
  );

  const fetchTestHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/data/test-result/${(user as any).id}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        const filteredData = data
          .filter((item: any) => item.testType !== 'Daily Check-In')
          .slice(0, 5);

        setHistoryList(filteredData);
      }
    } catch (error) {
      console.error('Lỗi lấy lịch sử test:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTestHistory();
    setRefreshing(false);
  };

  const handleStartTest = (testId: string) => {
    navigation.navigate('SpecificTest', { testType: testId });
  };

  const handlePressHistoryItem = (item: any) => {
    let parsedAnswers = [];
    try {
      parsedAnswers = typeof item.details === 'string' ? JSON.parse(item.details) : item.details;
    } catch (e) {
      console.log('Lỗi parse details:', e);
    }

    const testInfo = testData[item.testType as keyof typeof testData];

    let isCritical = false;
    if (item.testType === 'depression' && Array.isArray(parsedAnswers) && parsedAnswers[9] >= 2) {
      isCritical = true;
    }

    navigation.navigate('SpecificResult', {
      testType: item.testType,
      score: item.score,
      title: testInfo ? testInfo.title : item.testType,
      isCritical: isCritical,
      answers: parsedAnswers,
      fromHistory: true,
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Khảo Sát Sức Khỏe</Text>
        </View>

        <View style={styles.listContainer}>
          {surveyCategories.map((item) => (
            <View key={item.id} style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.cardHeader}>
                <View
                  style={[styles.iconBox, { backgroundColor: isDark ? '#333' : colors.iconBg }]}
                >
                  {/* @ts-ignore */}
                  <Ionicons name={item.icon} size={24} color={colors.primary} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.cardDesc, { color: colors.subText }]}>{item.desc}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.startButton, { backgroundColor: colors.primary }]}
                onPress={() => handleStartTest(item.id)}
              >
                <Text style={styles.startButtonText}>Bắt Đầu</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={[styles.card, { marginTop: 10, backgroundColor: colors.card }]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 15,
              alignItems: 'center',
            }}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Lịch Sử Kết Quả</Text>

            {}
            <TouchableOpacity onPress={() => navigation.navigate('AllHistory')}>
              <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 14 }}>
                Xem tất cả
              </Text>
            </TouchableOpacity>
          </View>

          {historyList.length > 0 ? (
            historyList.map((item) => {
              const severityColor = getSeverityColor(item.result, colors);
              const testName = getTestName(item.testType);

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.historyItem, { backgroundColor: isDark ? '#2C2C2C' : '#F3F4F6' }]}
                  onPress={() => handlePressHistoryItem(item)}
                >
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: severityColor,
                      },
                    ]}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.historyType, { color: colors.text }]}>{testName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="time-outline" size={12} color={colors.subText} />
                      <Text style={[styles.historyDate, { color: colors.subText }]}>
                        {' '}
                        {formatDate(item.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.historyScore, { color: severityColor, fontWeight: '600' }]}>
                    {item.result} ({item.score})
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.subText}
                    style={{ marginLeft: 8 }}
                  />
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: colors.subText }}>Chưa có bài kiểm tra nào.</Text>
            </View>
          )}
        </View>
        <View style={{ height: 30 }} />
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
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', marginBottom: 16 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: { flex: 1, marginLeft: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardDesc: { fontSize: 13, lineHeight: 18 },
  startButton: { borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  startButtonText: { color: '#fff', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  historyType: { fontWeight: '500', marginBottom: 2 },
  historyDate: { fontSize: 12 },
  historyScore: { fontSize: 13 },
});
