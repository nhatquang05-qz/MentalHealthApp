import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function MoodHistoryScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);

  // Load dữ liệu mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem('mood_history');
      if (data) {
        setMarkedDates(JSON.parse(data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDayPress = (day: DateData) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);
    
    // @ts-ignore
    if (markedDates[dateString] && markedDates[dateString].data) {
      // @ts-ignore
      setSelectedData(markedDates[dateString].data);
    } else {
      setSelectedData(null);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Lịch Sử Cảm Xúc</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.calendarContainer, { backgroundColor: colors.card, shadowColor: isDark ? '#000' : '#ccc' }]}>
          <Calendar
            // Theme tùy chỉnh theo Dark/Light mode
            theme={{
              backgroundColor: colors.card,
              calendarBackground: colors.card,
              textSectionTitleColor: colors.subText,
              monthTextColor: colors.text,
              dayTextColor: colors.text,
              textDisabledColor: isDark ? '#444' : '#d9e1e8',
              arrowColor: colors.primary,
              todayTextColor: colors.primary,
            }}
            markingType={'custom'}
            markedDates={markedDates}
            onDayPress={onDayPress}
            enableSwipeMonths={true}
          />
        </View>

        {/* Phần hiển thị chi tiết khi chọn ngày */}
        <View style={styles.detailContainer}>
          <Text style={[styles.detailHeader, { color: colors.text }]}>
            {selectedDate ? `Chi tiết ngày ${selectedDate}` : 'Chọn một ngày để xem'}
          </Text>

          {selectedData ? (
            <View style={[styles.resultCard, { backgroundColor: colors.card }]}>
              <View style={[styles.moodIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="happy" size={32} color="#4CAF50" />
              </View>
              <View style={{flex: 1}}>
                <Text style={[styles.moodTitle, { color: colors.text }]}>Tâm trạng tốt</Text>
                <Text style={[styles.moodDesc, { color: colors.subText }]}>{selectedData.note}</Text>
              </View>
              <View>
                 <Text style={[styles.score, { color: colors.primary }]}>{selectedData.score}/100</Text>
              </View>
            </View>
          ) : (
            selectedDate && (
              <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
                <Text style={{ color: colors.subText }}>Không có dữ liệu cho ngày này.</Text>
              </View>
            )
          )}
        </View>

        {/* Chú thích màu sắc */}
        <View style={styles.legendContainer}>
            <Text style={[styles.legendTitle, { color: colors.text }]}>Chú thích:</Text>
            <View style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
                <Text style={{ color: colors.subText, marginRight: 15 }}>Vui vẻ</Text>
                
                <View style={[styles.dot, { backgroundColor: '#FFC107' }]} />
                <Text style={{ color: colors.subText, marginRight: 15 }}>Bình thường</Text>

                <View style={[styles.dot, { backgroundColor: '#FF5252' }]} />
                <Text style={{ color: colors.subText }}>Căng thẳng</Text>
            </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  container: { padding: 20 },
  
  calendarContainer: {
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5
  },
  
  detailContainer: { marginBottom: 20 },
  detailHeader: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  
  resultCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, borderRadius: 16,
    gap: 15
  },
  emptyCard: {
    padding: 20, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc'
  },
  moodIcon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  moodTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  moodDesc: { fontSize: 14 },
  score: { fontSize: 18, fontWeight: 'bold' },

  legendContainer: { marginTop: 10 },
  legendTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  legendRow: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 }
});