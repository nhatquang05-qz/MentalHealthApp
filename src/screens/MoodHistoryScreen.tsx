import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
// Import PieChart
import { PieChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

export default function MoodHistoryScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);

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

  // --- LOGIC TÍNH TOÁN THỐNG KÊ ---
  const pieData = useMemo(() => {
    const counts = { happy: 0, normal: 0, sad: 0, stress: 0 };
    let total = 0;

    Object.values(markedDates).forEach((item: any) => {
      if (item.data && item.data.mood) {
        // @ts-ignore
        if (counts[item.data.mood] !== undefined) {
           // @ts-ignore
           counts[item.data.mood]++;
           total++;
        }
      }
    });

    if (total === 0) return [];

    // Tạo dữ liệu cho PieChart
    return [
      { value: counts.happy, color: '#4CAF50', text: `${Math.round(counts.happy/total*100)}%`, label: 'Vui vẻ' },
      { value: counts.normal, color: '#FFC107', text: `${Math.round(counts.normal/total*100)}%`, label: 'Bình thường' },
      { value: counts.sad, color: '#2196F3', text: `${Math.round(counts.sad/total*100)}%`, label: 'Buồn' },
      { value: counts.stress, color: '#FF5252', text: `${Math.round(counts.stress/total*100)}%`, label: 'Căng thẳng' },
    ].filter(item => item.value > 0); // Chỉ hiện những cảm xúc có dữ liệu
  }, [markedDates]);

  // Render chú thích cho biểu đồ
  const renderLegendComponent = () => {
    return (
      <View style={styles.legendWrapper}>
        {pieData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={{ color: colors.subText, fontSize: 12 }}>{item.label}</Text>
          </View>
        ))}
      </View>
    );
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Lịch Sử & Thống Kê</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* 1. PHẦN LỊCH */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Calendar
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

        {/* 2. PHẦN CHI TIẾT NGÀY */}
        {selectedDate && (
            <View style={styles.sectionContainer}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Chi tiết ngày {selectedDate}</Text>
                {selectedData ? (
                    <View style={[styles.resultCard, { backgroundColor: colors.card }]}>
                    <View style={[styles.moodIcon, { backgroundColor: '#E8F5E9' }]}>
                        <Ionicons name="happy" size={32} color="#4CAF50" />
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={[styles.moodTitle, { color: colors.text }]}>
                            {selectedData.mood === 'happy' ? 'Vui vẻ' : selectedData.mood === 'stress' ? 'Căng thẳng' : 'Bình thường'}
                        </Text>
                        <Text style={[styles.moodDesc, { color: colors.subText }]}>{selectedData.note}</Text>
                    </View>
                    <View>
                        <Text style={[styles.score, { color: colors.primary }]}>{selectedData.score}đ</Text>
                    </View>
                    </View>
                ) : (
                    <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Text style={{ color: colors.subText }}>Chưa có dữ liệu.</Text>
                    </View>
                )}
            </View>
        )}

        {/* 3. PHẦN BIỂU ĐỒ THỐNG KÊ (MỚI) */}
        {pieData.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.card, marginTop: 20, alignItems: 'center', paddingVertical: 20 }]}>
                <Text style={[styles.chartTitle, { color: colors.text }]}>Tổng quan cảm xúc</Text>
                
                <View style={{alignItems: 'center', marginVertical: 10}}>
                    <PieChart
                        data={pieData}
                        donut
                        showText
                        textColor="white"
                        radius={100}
                        innerRadius={60}
                        textSize={12}
                        fontWeight="bold"
                        centerLabelComponent={() => {
                            return (
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontSize: 22, color: colors.text, fontWeight: 'bold'}}>{pieData.length}</Text>
                                    <Text style={{fontSize: 12, color: colors.subText}}>Ngày</Text>
                                </View>
                            );
                        }}
                    />
                </View>
                
                {renderLegendComponent()}
            </View>
        )}

        <View style={{height: 40}} />
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
  
  card: {
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
  },
  
  sectionContainer: { marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  
  resultCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, borderRadius: 16,
    gap: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2
  },
  emptyCard: {
    padding: 20, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 1
  },
  moodIcon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  moodTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  moodDesc: { fontSize: 14 },
  score: { fontSize: 18, fontWeight: 'bold' },

  // Styles cho biểu đồ
  chartTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, width: '100%', textAlign: 'left', paddingLeft: 10 },
  legendWrapper: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 }
});