// screens/HomeScreen.tsx
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
// 1. Import LineChart từ thư viện mới
import { LineChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';

// Dữ liệu mock cho các icon cảm xúc
const emotions = [
  { name: 'Funny', img: require('../../assets/images/funny.png'), value: 5 },
  { name: 'Happy', img: require('../../assets/images/happy.png'), value: 4 },
  { name: 'Normal', img: require('../../assets/images/normal.png'), value: 3 },
  { name: 'Sad', img: require('../../assets/images/sad.png'), value: 2 },
  { name: 'Cry', img: require('../../assets/images/cry.png'), value: 1 },
];

// Dữ liệu mock cho biểu đồ (5 = Vui nhất, 1 = Tệ nhất)
// Chúng ta sẽ ánh xạ tên thứ cho label và giá trị cảm xúc cho value
const chartData = [
  { value: 4.5, label: '2' }, // T2
  { value: 3, label: '3' },   // T3
  { value: 4, label: '4' },   // T4
  { value: 3.5, label: '5' }, // T5
  { value: 4, label: '6' },   // T6
  { value: 2.5, label: '7' }, // T7
  { value: 5, label: 'CN' },  // CN
];

export default function HomeScreen() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  // Hàm này tạo ra các nhãn Y (cột dọc) tương ứng với 5 icon cảm xúc
  const getYAxisLabels = () => {
    return [
      { value: 1, label: 'Tệ' },
      { value: 2, label: 'Buồn' },
      { value: 3, label: 'Bình thường' },
      { value: 4, label: 'Vui' },
      { value: 5, label: 'Rất vui' },
    ];
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandName}>SoulCare</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={28} color="#4A4A4A" />
          </TouchableOpacity>
        </View>

        {/* Thẻ Cảm xúc */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Xin chào!</Text>
          <Text style={styles.cardSubtitle}>Ngày hôm nay của bạn như thế nào?</Text>
          <View style={styles.emotionContainer}>
            {emotions.map((emotion) => (
              <TouchableOpacity
                key={emotion.name}
                style={[
                  styles.emotionButton,
                  selectedEmotion === emotion.name && styles.emotionSelected,
                ]}
                onPress={() => setSelectedEmotion(emotion.name)}
              >
                <Image source={emotion.img} style={styles.emotionIcon} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Thẻ Biểu đồ (đã cập nhật) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Biểu đồ cảm xúc</Text>
          <Text style={styles.cardSubtitle}>Tuần trước</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              height={220}
              isAnimated
              curved // Làm mượt đường line
              color1="#007AFF" // Màu đường line
              dataPointsColor1="#007AFF" // Màu dấu chấm
              startFillColor1="#007AFF" // Màu gradient bắt đầu
              endFillColor1="#e6f2ff" // Màu gradient kết thúc
              startOpacity={0.8}
              endOpacity={0.1}
              // Tùy chỉnh cột Y (cảm xúc)
              yAxisLabelTexts={['Tệ', 'Buồn', 'BT', 'Vui', 'Rất vui']}
              yAxisLabelContainerStyle={{ width: 45 }}
              yAxisLabelSuffix=""
              noOfSections={4} // Số lượng đường kẻ ngang (5 mức cảm xúc - 1)
              maxValue={5}
              // Tùy chỉnh cột X (ngày)
              xAxisLabelTextStyle={styles.chartLabel}
              // Tùy chỉnh dấu chấm
              dataPointsRadius={5}
              dataPointsHeight={5}
              dataPointsWidth={5}
              // Tắt các đường không cần thiết
              rulesType="solid"
              rulesColor="#f0f0f0"
              xAxisColor="#f0f0f0"
              yAxisColor="#f0f0f0"
              hideYAxisText
            />
          </View>
        </View>

        {/* Thẻ Lối tắt */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lối tắt</Text>
          <TouchableOpacity style={styles.surveyButton}>
            <Ionicons name="document-text-outline" size={20} color="#ffffff" />
            <Text style={styles.surveyButtonText}>Khảo sát</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// StyleSheet (giữ nguyên)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f7ff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffb347',
    backgroundColor: '#fff7e6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 20,
  },
  emotionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  emotionButton: {
    padding: 8,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emotionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  emotionIcon: {
    width: 48,
    height: 48,
  },
  chartContainer: {
    paddingLeft: 0, // Điều chỉnh nếu biểu đồ bị lệch
    paddingTop: 10,
  },
  chartLabel: {
    color: '#666',
    fontSize: 12,
  },
  surveyButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surveyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});