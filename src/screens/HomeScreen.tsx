import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

// Dữ liệu mock 
const emotions = [
  { name: 'Funny', img: require('../../assets/images/funny.png'), value: 5 },
  { name: 'Happy', img: require('../../assets/images/happy.png'), value: 4 },
  { name: 'Normal', img: require('../../assets/images/normal.png'), value: 3 },
  { name: 'Sad', img: require('../../assets/images/sad.png'), value: 2 },
  { name: 'Cry', img: require('../../assets/images/cry.png'), value: 1 },
];

const chartData = [
  { value: 4.5, label: '2' }, 
  { value: 3, label: '3' },   
  { value: 4, label: '4' },   
  { value: 3.5, label: '5' }, 
  { value: 4, label: '6' },   
  { value: 2.5, label: '7' }, 
  { value: 5, label: 'CN' },  
];

export default function HomeScreen() {
  const { colors, isDark } = useTheme(); 
  const navigation = useNavigation<any>();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  
  const currentStreak = 5; 
  const hasCheckedInToday = false;

  const handleEmotionSelect = (emotionName: string) => {
    setSelectedEmotion(emotionName);
    setTimeout(() => {
        navigation.navigate('DailyCheckIn');
    }, 300);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          
          <View style={styles.soulCareLogo}>
            <Text style={styles.soulCareText}>SoulCare</Text>
          </View>
          
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Check-in cảm xúc</Text>
                <Text style={[styles.cardSubtitle, { color: colors.subText }]}>
                    {hasCheckedInToday ? "Bạn đã check-in hôm nay rồi!" : "Ngày hôm nay của bạn thế nào?"}
                </Text>
            </View>
            {!hasCheckedInToday && (
                <View style={{backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8}}>
                    <Text style={{color: colors.primary, fontSize: 12, fontWeight: '600'}}>+1 Streak</Text>
                </View>
            )}
          </View>
          
          <View style={styles.emotionContainer}>
            {emotions.map((emotion) => (
              <TouchableOpacity
                key={emotion.name}
                style={[
                  styles.emotionButton,
                  selectedEmotion === emotion.name && { backgroundColor: isDark ? '#333' : '#f0f8ff', borderColor: colors.primary },
                ]}
                onPress={() => handleEmotionSelect(emotion.name)}
              >
                <Image source={emotion.img} style={styles.emotionIcon} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
              startOpacity={0.8}
              endOpacity={0.1}
              maxValue={5}
              noOfSections={4} 
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

        <View style={{flexDirection: 'row', gap: 15}}>
            <TouchableOpacity 
                style={[styles.shortcutCard, { backgroundColor: colors.card, flex: 1 }]}
                onPress={() => navigation.navigate('Survey')}
            >
                <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                    <Ionicons name="clipboard-outline" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.shortcutTitle, { color: colors.text }]}>Làm Khảo sát</Text>
                <Text style={{fontSize: 12, color: colors.subText}}>Đánh giá sức khỏe</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.shortcutCard, { backgroundColor: colors.card, flex: 1 }]}
                onPress={() => navigation.navigate('Music')}
            >
                <View style={[styles.iconBox, { backgroundColor: '#FFF0E6' }]}>
                    <Ionicons name="headset-outline" size={24} color="#FF8C42" />
                </View>
                <Text style={[styles.shortcutTitle, { color: colors.text }]}>Nghe nhạc</Text>
                <Text style={{fontSize: 12, color: colors.subText}}>Thư giãn tâm trí</Text>
            </TouchableOpacity>
        </View>
        
        <View style={{height: 30}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  
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

  card: { 
      borderRadius: 24, padding: 20, marginBottom: 20, 
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, marginBottom: 20 },
  
  emotionContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  emotionButton: { padding: 8, borderRadius: 20, borderWidth: 2, borderColor: 'transparent', alignItems: 'center' },
  emotionIcon: { width: 44, height: 44 },
  
  chartContainer: { paddingLeft: 0, paddingTop: 10, marginLeft: -10 },
  
  shortcutCard: {
      padding: 16, borderRadius: 24, 
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.03, elevation: 2
  },
  iconBox: {
      width: 48, height: 48, borderRadius: 16, 
      justifyContent: 'center', alignItems: 'center', marginBottom: 12
  },
  shortcutTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 4 }
});