import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { testData } from '../data/testData';

import { API_URL } from '../config';

const filters = [
  { id: 'all', label: 'Tất cả' },
  { id: 'depression', label: 'Trầm cảm' },
  { id: 'anxiety', label: 'Lo âu' },
  { id: 'stress', label: 'Căng thẳng' },
];

export default function AllHistoryScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const [fullData, setFullData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (user) fetchHistory();
    }, [user]),
  );

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/data/test-result/${(user as any).id}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        const tests = data.filter((item: any) => item.testType !== 'Daily Check-In');
        setFullData(tests);
        applyFilter(selectedFilter, tests);
      }
    } catch (error) {
      console.error('Lỗi lấy lịch sử:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (filterId: string, dataSrc = fullData) => {
    setSelectedFilter(filterId);
    if (filterId === 'all') {
      setFilteredData(dataSrc);
    } else {
      const filtered = dataSrc.filter((item: any) => item.testType === filterId);
      setFilteredData(filtered);
    }
  };

  const handlePressItem = (item: any) => {
    let parsedAnswers = [];
    try {
      parsedAnswers = typeof item.details === 'string' ? JSON.parse(item.details) : item.details;
    } catch (e) {
      console.log('Không có chi tiết câu trả lời');
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
  };

  const getSeverityColor = (result: string) => {
    if (!result) return colors.subText;
    const lower = result.toLowerCase();
    if (lower.includes('cao') || lower.includes('nặng') || lower.includes('chú ý'))
      return '#FF5252';
    if (lower.includes('trung bình') || lower.includes('vừa')) return '#FFC107';
    return '#4CAF50';
  };

  const renderItem = ({ item }: { item: any }) => {
    const color = getSeverityColor(item.result);
    return (
      <TouchableOpacity
        style={[styles.itemCard, { backgroundColor: isDark ? '#2C2C2C' : '#fff' }]}
        onPress={() => handlePressItem(item)}
      >
        <View style={[styles.colorBar, { backgroundColor: color }]} />
        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, { color: colors.text }]}>
            {item.testType === 'depression'
              ? 'Test Trầm Cảm'
              : item.testType === 'anxiety'
              ? 'Test Lo Âu'
              : 'Test Căng Thẳng'}
          </Text>
          <Text style={[styles.itemResult, { color: color }]}>{item.result}</Text>
          <Text style={[styles.itemDate, { color: colors.subText }]}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.subText} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Tất Cả Lịch Sử</Text>
        <View style={{ width: 40 }} />
      </View>

      {}
      <View style={styles.filterContainer}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[
              styles.filterTab,
              selectedFilter === f.id && { backgroundColor: colors.primary },
              { borderColor: colors.border },
            ]}
            onPress={() => applyFilter(f.id)}
          >
            <Text
              style={[
                styles.filterText,
                { color: selectedFilter === f.id ? '#fff' : colors.subText },
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: colors.subText }}>
              Không có dữ liệu.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: { fontSize: 13, fontWeight: '600' },
  listContent: { padding: 15 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    paddingRight: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  colorBar: {
    width: 6,
    height: '100%',
  },
  itemContent: {
    flex: 1,
    padding: 12,
  },
  itemTitle: { fontWeight: 'bold', fontSize: 16 },
  itemResult: { fontSize: 14, fontWeight: '600', marginVertical: 4 },
  itemDate: { fontSize: 12 },
});
