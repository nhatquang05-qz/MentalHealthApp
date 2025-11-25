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
  const { colors, isDark } = useTheme(); // Lấy theme
  const navigation = useNavigation<any>();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
              <Text style={styles.logoText}>V</Text>
            </View>
            <Text style={[styles.brandName, { color: colors.text }]}>VHealth</Text>
          </View>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: isDark ? '#333' : 'transparent' }]}>
            <Ionicons name="notifications-outline" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Thẻ Cảm xúc */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Xin chào!</Text>
          <Text style={[styles.cardSubtitle, { color: colors.subText }]}>Ngày hôm nay của bạn như thế nào?</Text>
          <View style={styles.emotionContainer}>
            {emotions.map((emotion) => (
              <TouchableOpacity
                key={emotion.name}
                style={[
                  styles.emotionButton,
                  selectedEmotion === emotion.name && { backgroundColor: isDark ? '#333' : '#f0f8ff', borderColor: colors.primary },
                ]}
                onPress={() => setSelectedEmotion(emotion.name)}
              >
                <Image source={emotion.img} style={styles.emotionIcon} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Thẻ Biểu đồ */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Biểu đồ cảm xúc</Text>
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
              yAxisLabelContainerStyle={{ width: 45 }}
              yAxisLabelSuffix=""
              yAxisTextStyle={{ color: colors.subText }}

              xAxisLabelTextStyle={{ color: colors.subText, fontSize: 12 }}
              
              dataPointsRadius={5}
              dataPointsHeight={5}
              dataPointsWidth={5}

              rulesType="solid"
              rulesColor={colors.border}
              xAxisColor={colors.border}
              yAxisColor={colors.border}
              hideYAxisText
            />
          </View>
        </View>

        {/* Thẻ Lối tắt */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Lối tắt</Text>
          <TouchableOpacity 
            style={[styles.surveyButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Survey')}
          >
            <Ionicons name="document-text-outline" size={20} color="#ffffff" />
            <Text style={styles.surveyButtonText}>Khảo sát</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  logoText: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  brandName: { fontSize: 24, fontWeight: 'bold' },
  iconButton: { padding: 8, borderRadius: 20 },
  
  card: { borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, marginBottom: 20 },
  
  emotionContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  emotionButton: { padding: 8, borderRadius: 30, borderWidth: 2, borderColor: 'transparent' },
  emotionIcon: { width: 48, height: 48 },
  
  chartContainer: { paddingLeft: 0, paddingTop: 10 },
  
  surveyButton: { flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  surveyButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});