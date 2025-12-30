import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { PieChart } from 'react-native-gifted-charts';
import { API_URL } from '../config';

export default function MoodHistoryScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [markedDates, setMarkedDates] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchHistory();
      } else {
        setMarkedDates({});
        setSelectedDate(null);
        setSelectedData(null);
      }
    }, [user]),
  );

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/data/test-result/${(user as any).id}`);
      const data = await response.json();
      if (!Array.isArray(data)) return;
      const dailyCheckIns = data.filter((item: any) => item.testType === 'Daily Check-In');
      const newMarkedDates: any = {};

      dailyCheckIns.forEach((item: any) => {
        const dateStr = item.createdAt.split('T')[0];

        let moodType = 'stress';
        let color = '#FF5252';
        let displayNote = 'Căng thẳng cao. Hãy nghỉ ngơi ngay.';

        if (item.score >= 10) {
          moodType = 'happy';
          color = '#4CAF50';
          displayNote = 'Tâm trạng tích cực. Hãy duy trì nhé!';
        } else if (item.score >= 5) {
          moodType = 'normal';
          color = '#FFC107';
          displayNote = 'Tâm trạng bình thường. Thư giãn chút nhé.';
        }

        newMarkedDates[dateStr] = {
          marked: true,
          customStyles: {
            container: {
              backgroundColor: color,
              borderRadius: 8,
            },
            text: {
              color: 'white',
              fontWeight: 'bold',
            },
          },
          data: {
            mood: moodType,
            score: item.score,

            note: displayNote,
            id: item.id,
          },
        };
      });

      setMarkedDates(newMarkedDates);
    } catch (error) {
      console.error('Lỗi lấy lịch sử:', error);
    }
  };

  const finalMarkedDates = useMemo(() => {
    const marked = { ...markedDates };

    if (selectedDate) {
      const currentStyle = marked[selectedDate] ? marked[selectedDate].customStyles : {};
      const currentContainer = currentStyle.container ? currentStyle.container : {};
      const currentText = currentStyle.text ? currentStyle.text : {};

      marked[selectedDate] = {
        ...marked[selectedDate],
        customStyles: {
          container: {
            ...currentContainer,
            borderWidth: 2,
            borderColor: colors.text,
            borderRadius: 8,
          },
          text: {
            ...currentText,
            color: marked[selectedDate] ? 'white' : colors.text,
          },
        },
      };
    }
    return marked;
  }, [markedDates, selectedDate, colors.text]);

  const pieData = useMemo(() => {
    const counts = { happy: 0, normal: 0, stress: 0 };
    let total = 0;

    Object.values(markedDates).forEach((item: any) => {
      if (item.data && item.data.mood) {
        const mood = item.data.mood;
        if (mood === 'happy') counts.happy++;
        else if (mood === 'normal') counts.normal++;
        else if (mood === 'stress') counts.stress++;

        total++;
      }
    });

    if (total === 0) return [];

    return [
      {
        value: counts.happy,
        color: '#4CAF50',
        text: `${Math.round((counts.happy / total) * 100)}%`,
        label: 'Tốt',
      },
      {
        value: counts.normal,
        color: '#FFC107',
        text: `${Math.round((counts.normal / total) * 100)}%`,
        label: 'Bình thường',
      },
      {
        value: counts.stress,
        color: '#FF5252',
        text: `${Math.round((counts.stress / total) * 100)}%`,
        label: 'Cần chú ý',
      },
    ].filter((item) => item.value > 0);
  }, [markedDates]);

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

    if (markedDates[dateString] && markedDates[dateString].data) {
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
        {}
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
            markedDates={finalMarkedDates}
            onDayPress={onDayPress}
            enableSwipeMonths={true}
          />
        </View>

        {}
        {selectedDate && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Chi tiết ngày {selectedDate}
            </Text>
            {selectedData ? (
              <View style={[styles.resultCard, { backgroundColor: colors.card }]}>
                <View
                  style={[
                    styles.moodIcon,
                    {
                      backgroundColor:
                        selectedData.mood === 'happy'
                          ? '#E8F5E9'
                          : selectedData.mood === 'stress'
                          ? '#FFEBEE'
                          : '#FFF8E1',
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      selectedData.mood === 'happy'
                        ? 'happy'
                        : selectedData.mood === 'stress'
                        ? 'sad'
                        : 'remove-circle'
                    }
                    size={32}
                    color={
                      selectedData.mood === 'happy'
                        ? '#4CAF50'
                        : selectedData.mood === 'stress'
                        ? '#FF5252'
                        : '#FFC107'
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.moodTitle, { color: colors.text }]}>
                    {selectedData.mood === 'happy'
                      ? 'Trạng thái Tốt'
                      : selectedData.mood === 'stress'
                      ? 'Cần Chú Ý'
                      : 'Bình thường'}
                  </Text>
                  <Text style={[styles.moodDesc, { color: colors.subText }]}>
                    {selectedData.note}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.score, { color: colors.primary }]}>
                    {selectedData.score}/15
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={{ color: colors.subText }}>Chưa có dữ liệu.</Text>
              </View>
            )}
          </View>
        )}

        {}
        {pieData.length > 0 && (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                marginTop: 20,
                alignItems: 'center',
                paddingVertical: 20,
              },
            ]}
          >
            <Text style={[styles.chartTitle, { color: colors.text }]}>Tổng quan tháng</Text>

            <View style={{ alignItems: 'center', marginVertical: 10 }}>
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
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: 22, color: colors.text, fontWeight: 'bold' }}>
                        {Object.keys(markedDates).length}
                      </Text>
                      <Text style={{ fontSize: 12, color: colors.subText }}>Ngày</Text>
                    </View>
                  );
                }}
              />
            </View>

            {renderLegendComponent()}
          </View>
        )}

        <View style={{ height: 40 }} />
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
    paddingTop: 10,
    paddingBottom: 10,
  },
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
    elevation: 3,
  },

  sectionContainer: { marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },

  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  emptyCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  moodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  moodDesc: { fontSize: 14 },
  score: { fontSize: 18, fontWeight: 'bold' },

  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    width: '100%',
    textAlign: 'left',
    paddingLeft: 10,
  },
  legendWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginTop: 10,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
});
