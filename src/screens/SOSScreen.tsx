import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Linking,
  Dimensions,
  AppState
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.6;

// Cấu hình chuẩn cho bài tập thở 4-7-8
const BREATHING_PHASES = [
  { label: 'Hít vào', duration: 4, targetScale: 1.5 }, // Hít vào 4s, vòng tròn to lên
  { label: 'Giữ hơi', duration: 7, targetScale: 1.5 }, // Giữ 7s, vòng tròn giữ nguyên
  { label: 'Thở ra', duration: 8, targetScale: 1.0 },  // Thở ra 8s, vòng tròn nhỏ lại
];

export default function SOSScreen() {
  const navigation = useNavigation();
  // Animated Value cho vòng tròn
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // State quản lý giai đoạn hiện tại (0: Hít, 1: Giữ, 2: Thở)
  const [phaseIndex, setPhaseIndex] = useState(0);
  // State hiển thị số đếm ngược
  const [timeLeft, setTimeLeft] = useState(4);
  const [instruction, setInstruction] = useState('Hít vào');

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;

    const currentPhase = BREATHING_PHASES[phaseIndex];

    // 1. Cập nhật thông tin hiển thị ngay lập tức khi chuyển pha
    setInstruction(currentPhase.label);
    setTimeLeft(currentPhase.duration);

    // 2. Xử lý Animation (Hình ảnh)
    // Dùng Animated.timing để đồng bộ chính xác với thời gian của pha
    if (phaseIndex === 0) {
        // Pha Hít vào: Phình ra trong 4s
        Animated.timing(scaleAnim, {
            toValue: currentPhase.targetScale,
            duration: currentPhase.duration * 1000,
            useNativeDriver: true,
        }).start();
    } else if (phaseIndex === 2) {
        // Pha Thở ra: Thu nhỏ trong 8s
        Animated.timing(scaleAnim, {
            toValue: currentPhase.targetScale,
            duration: currentPhase.duration * 1000,
            useNativeDriver: true,
        }).start();
    } 
    // Pha Giữ hơi (index 1): Không cần animation, giữ nguyên trạng thái cũ

    // 3. Xử lý Bộ đếm ngược (Con số)
    // Chạy mỗi 1 giây để giảm số hiển thị
    timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                clearInterval(timerInterval);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    // 4. Chuyển sang pha tiếp theo khi hết thời gian
    phaseTimeout = setTimeout(() => {
        setPhaseIndex((prevIndex) => (prevIndex + 1) % 3); // Vòng lặp 0 -> 1 -> 2 -> 0...
    }, currentPhase.duration * 1000);

    // Cleanup function: Dọn dẹp khi component unmount hoặc chuyển pha
    // Rất quan trọng để tránh memory leak và lỗi cập nhật state khi đã thoát màn hình
    return () => {
        clearInterval(timerInterval);
        clearTimeout(phaseTimeout);
        scaleAnim.stopAnimation();
    };
  }, [phaseIndex]); // useEffect sẽ chạy lại mỗi khi phaseIndex thay đổi

  const handleCallHelp = () => {
    // Gọi số khẩn cấp (115 hoặc số người thân)
    Linking.openURL('tel:115');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Ionicons name="close" size={32} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Đừng hoảng sợ</Text>
      <Text style={styles.subtitle}>Hãy hít thở cùng tôi theo nhịp 4-7-8</Text>

      <View style={styles.circleContainer}>
        {/* Vòng tròn hiệu ứng */}
        <Animated.View 
          style={[
            styles.breathingCircle, 
            { transform: [{ scale: scaleAnim }] }
          ]} 
        />
        
        {/* Nội dung chữ ở giữa */}
        <View style={styles.textContainer}>
            <Text style={styles.instructionText}>{instruction}</Text>
            <Text style={styles.timerText}>{timeLeft}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.helpText}>Nếu bạn cảm thấy không ổn, hãy gọi trợ giúp ngay</Text>
        <TouchableOpacity style={styles.callButton} onPress={handleCallHelp}>
            <Ionicons name="call" size={24} color="#FF3B30" style={{marginRight: 10}}/>
            <Text style={styles.callButtonText}>Gọi Cấp Cứu (115)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1C1C1E', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 40 },
  closeButton: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#A1A1AA', marginTop: 8 },
  
  circleContainer: { 
      width: CIRCLE_SIZE * 1.8, height: CIRCLE_SIZE * 1.8, // Tăng vùng chứa để không bị cắt khi scale lớn
      justifyContent: 'center', alignItems: 'center' 
  },
  breathingCircle: {
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
      borderRadius: CIRCLE_SIZE / 2,
      backgroundColor: '#3995E9',
      opacity: 0.3,
      position: 'absolute',
  },
  textContainer: { alignItems: 'center' },
  instructionText: { fontSize: 28, fontWeight: '600', color: '#fff', marginBottom: 10 },
  timerText: { fontSize: 60, fontWeight: 'bold', color: '#fff' },

  footer: { width: '100%', paddingHorizontal: 30, alignItems: 'center' },
  helpText: { color: '#A1A1AA', marginBottom: 15, textAlign: 'center' },
  callButton: { 
      flexDirection: 'row', backgroundColor: '#fff', 
      width: '100%', height: 56, borderRadius: 28, 
      justifyContent: 'center', alignItems: 'center',
      elevation: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 2}
  },
  callButtonText: { color: '#FF3B30', fontSize: 18, fontWeight: 'bold' }
});