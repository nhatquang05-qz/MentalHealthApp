import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

export default function BurnWorriesScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [worryText, setWorryText] = useState('');
  const [isBurning, setIsBurning] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);

  const burnProgress = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  const stopSound = async () => {
    try {
      if (soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        }
        soundRef.current = null;
      }
    } catch (error) {
      console.log('Lỗi khi tắt nhạc:', error);
    }
  };

  const playBurnSound = async () => {
    try {
      if (soundRef.current) {
        await stopSound();
      }

      const { sound } = await Audio.Sound.createAsync(require('../../assets/music/fire.mp3'));
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.log('Không tìm thấy file nhạc hoặc lỗi phát:', error);
    }
  };

  const startShake = () => {
    shakeAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 2, duration: 50, useNativeDriver: false }),
        Animated.timing(shakeAnim, { toValue: -2, duration: 50, useNativeDriver: false }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: false }),
      ]),
      { iterations: 10 },
    ).start();
  };

  const handleBurn = () => {
    if (!worryText.trim()) {
      Alert.alert('Chưa nhập nội dung', 'Hãy viết ra điều gì đang làm phiền bạn.');
      return;
    }

    Keyboard.dismiss();
    setIsBurning(true);

    playBurnSound();
    startShake();

    Animated.timing(burnProgress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      stopSound();

      Alert.alert(
        'Đã giải tỏa!',
        'Lo âu của bạn đã hóa thành tro bụi. Hãy hít thở sâu và cảm thấy nhẹ nhõm hơn nhé.',
        [
          {
            text: 'Quay về',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'Viết tiếp',
            onPress: resetScreen,
          },
        ],
      );
    });
  };

  const resetScreen = () => {
    setWorryText('');
    setIsBurning(false);
    burnProgress.setValue(0);
    shakeAnim.setValue(0);
    stopSound();
  };

  const paperColor = burnProgress.interpolate({
    inputRange: [0, 0.4, 0.8, 1],
    outputRange: ['#FFF9C4', '#FFCC80', '#4E342E', 'transparent'],
  });

  const paperScale = burnProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  const paperOpacity = burnProgress.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 1, 0],
  });

  const paperTranslateY = burnProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -150],
  });

  const paperRotate = shakeAnim.interpolate({
    inputRange: [-2, 2],
    outputRange: ['-2deg', '2deg'],
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#2C3E50' }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Gửi Lo Âu Đi</Text>
            <View style={{ width: 28 }} />
          </View>

          <Text style={styles.instruction}>
            Viết ra những điều đang làm bạn căng thẳng, sau đó nhấn nút để "đốt" chúng đi.
          </Text>

          <View style={styles.paperContainer}>
            {isBurning && <Animated.View style={[styles.fireGlow, { opacity: paperOpacity }]} />}

            <Animated.View
              style={[
                styles.paper,
                {
                  backgroundColor: paperColor,
                  opacity: paperOpacity,
                  transform: [
                    { scale: paperScale },
                    { translateY: paperTranslateY },
                    { rotate: paperRotate },
                  ],
                },
              ]}
            >
              <View style={styles.linesContainer} pointerEvents="none">
                {[...Array(8)].map((_, i) => (
                  <View key={i} style={styles.line} />
                ))}
              </View>

              <TextInput
                style={styles.input}
                multiline
                placeholder="Tôi đang lo lắng về..."
                placeholderTextColor="#A1887F"
                value={worryText}
                onChangeText={setWorryText}
                editable={!isBurning}
              />
            </Animated.View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.burnButton,
                {
                  backgroundColor: isBurning ? '#424242' : '#FF5722',
                  shadowColor: isBurning ? '#000' : '#FF5722',
                },
              ]}
              onPress={handleBurn}
              disabled={isBurning}
            >
              {isBurning ? (
                <Text style={styles.burnButtonText}>Đang hóa tro...</Text>
              ) : (
                <>
                  <Ionicons name="bonfire" size={24} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.burnButtonText}>Đốt Bỏ Lo Âu</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  instruction: { color: '#B0BEC5', textAlign: 'center', marginBottom: 30, fontSize: 16 },

  paperContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fireGlow: {
    position: 'absolute',
    width: '110%',
    height: '110%',
    backgroundColor: 'rgba(255, 87, 34, 0.4)',
    borderRadius: 20,
    zIndex: -1,
  },
  paper: {
    width: '100%',
    height: 340,
    borderRadius: 2,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  linesContainer: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 40,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  line: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 35,
    width: '100%',
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#3E2723',
    textAlignVertical: 'top',
    lineHeight: 36,
  },

  footer: { marginBottom: 20 },
  burnButton: {
    flexDirection: 'row',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  burnButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
});
