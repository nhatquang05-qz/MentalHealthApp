import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Share,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // <--- Thêm import này
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const quotes = [
  'Bạn không cần phải hoàn hảo để trở nên tuyệt vời.',
  'Mỗi ngày mới là một cơ hội để bắt đầu lại.',
  'Hãy đối xử nhẹ nhàng với chính mình, bạn đang làm tốt nhất có thể rồi.',
  'Bão tố giúp cây cối bám rễ sâu hơn.',
  'Hạnh phúc không phải là đích đến, mà là hành trình.',
  'Cảm xúc của bạn là hợp lệ, hãy cho phép mình cảm nhận chúng.',
  'Bạn mạnh mẽ hơn những gì bạn nghĩ rất nhiều.',
  'Nghỉ ngơi không phải là từ bỏ, mà là nạp năng lượng.',
  'Chỉ cần bước đi, con đường sẽ tự mở ra.',
  'Đừng để ngày hôm qua chiếm quá nhiều thời gian của ngày hôm nay.',
];

export default function QuoteScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  const handleNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `"${currentQuote}" - Chia sẻ từ SoulCare App`,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const gradientColors = isDark
    ? (['#2C3E50', '#000000'] as const)
    : (['#E0C3FC', '#8EC5FC'] as const);

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.background} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thông Điệp Hôm Nay</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Nội dung chính */}
        <View style={styles.contentContainer}>
          {/* Icon nền mờ (Đã sửa tên icon) */}
          <MaterialCommunityIcons
            name="format-quote-open"
            size={120}
            color="rgba(255,255,255,0.1)"
            style={styles.bgIcon}
          />

          <View style={styles.quoteBox}>
            {/* Dấu mở ngoặc */}
            <MaterialCommunityIcons
              name="format-quote-open"
              size={40}
              color="#fff"
              style={{ marginBottom: 10, alignSelf: 'flex-start', opacity: 0.8 }}
            />

            <Text style={styles.quoteText}>{currentQuote}</Text>

            {/* Dấu đóng ngoặc */}
            <MaterialCommunityIcons
              name="format-quote-close"
              size={40}
              color="#fff"
              style={{ marginTop: 10, alignSelf: 'flex-end', opacity: 0.8 }}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-social" size={24} color="#fff" />
            <Text style={styles.actionText}>Chia sẻ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.primaryBtn]}
            onPress={handleNewQuote}
          >
            <Ionicons name="sparkles" size={24} color={isDark ? '#fff' : colors.primary} />
            <Text
              style={[
                styles.actionText,
                { color: isDark ? '#fff' : colors.primary, fontWeight: 'bold' },
              ]}
            >
              Thông điệp khác
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    position: 'relative',
  },
  bgIcon: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    opacity: 0.1,
  },
  quoteBox: {
    width: '100%',
  },
  quoteText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 44, // Tăng khoảng cách dòng cho dễ đọc
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },

  footer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  actionButton: {
    flex: 1,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  primaryBtn: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    flex: 1.5,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
