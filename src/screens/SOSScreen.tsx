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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.6;

const BREATHING_PHASES = [
  { label: 'Hít vào', duration: 4, targetScale: 1.5 },
  { label: 'Giữ hơi', duration: 7, targetScale: 1.5 },
  { label: 'Thở ra', duration: 8, targetScale: 1.0 },
];

export default function SOSScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);
  const [instruction, setInstruction] = useState('Hít vào');

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;
    const currentPhase = BREATHING_PHASES[phaseIndex];

    setInstruction(currentPhase.label);
    setTimeLeft(currentPhase.duration);

    if (phaseIndex === 0) {
      Animated.timing(scaleAnim, {
        toValue: currentPhase.targetScale,
        duration: currentPhase.duration * 1000,
        useNativeDriver: true,
      }).start();
    } else if (phaseIndex === 2) {
      Animated.timing(scaleAnim, {
        toValue: currentPhase.targetScale,
        duration: currentPhase.duration * 1000,
        useNativeDriver: true,
      }).start();
    }

    timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    phaseTimeout = setTimeout(() => {
      setPhaseIndex((prevIndex) => (prevIndex + 1) % 3);
    }, currentPhase.duration * 1000);

    return () => {
      clearInterval(timerInterval);
      clearTimeout(phaseTimeout);
      scaleAnim.stopAnimation();
    };
  }, [phaseIndex]);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Ionicons name="close" size={32} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Đừng hoảng sợ</Text>
      <Text style={styles.subtitle}>Hãy hít thở cùng tôi theo nhịp 4-7-8</Text>

      <View style={styles.circleContainer}>
        <Animated.View style={[styles.breathingCircle, { transform: [{ scale: scaleAnim }] }]} />
        <View style={styles.textContainer}>
          <Text style={styles.instructionText}>{instruction}</Text>
          <Text style={styles.timerText}>{timeLeft}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.helpText}>Liên hệ khẩn cấp</Text>

        {}
        <TouchableOpacity style={styles.callButton} onPress={() => handleCall('115')}>
          <Ionicons name="medical" size={24} color="#FF3B30" style={{ marginRight: 10 }} />
          <Text style={styles.callButtonText}>Cấp Cứu (115)</Text>
        </TouchableOpacity>

        {}
        {user?.emergencyContacts && user.emergencyContacts.length > 0 && (
          <View style={{ width: '100%', marginTop: 10, gap: 10 }}>
            {user.emergencyContacts.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.callButton,
                  {
                    backgroundColor: '#333',
                    borderWidth: 1,
                    borderColor: '#555',
                  },
                ]}
                onPress={() => handleCall(contact.phone)}
              >
                <Ionicons name="call" size={20} color="#4CD964" style={{ marginRight: 10 }} />
                <Text style={[styles.callButtonText, { color: '#fff', fontSize: 16 }]}>
                  Gọi {contact.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 40,
  },
  closeButton: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#A1A1AA', marginTop: 8 },
  circleContainer: {
    width: CIRCLE_SIZE * 1.8,
    height: CIRCLE_SIZE * 1.8,
    justifyContent: 'center',
    alignItems: 'center',
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
  footer: { width: '100%', paddingHorizontal: 30, alignItems: 'center', paddingBottom: 20 },
  helpText: { color: '#A1A1AA', marginBottom: 10, textAlign: 'center', fontWeight: 'bold' },
  callButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  callButtonText: { color: '#FF3B30', fontSize: 18, fontWeight: 'bold' },
});
