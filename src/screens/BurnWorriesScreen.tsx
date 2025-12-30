import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function BurnWorriesScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [worryText, setWorryText] = useState('');

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const [isBurning, setIsBurning] = useState(false);

  const handleBurn = () => {
    if (!worryText.trim()) {
      Alert.alert('Chưa nhập nội dung', 'Hãy viết ra điều gì đang làm phiền bạn.');
      return;
    }

    Keyboard.dismiss();
    setIsBurning(true);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: -200,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Alert.alert(
        'Đã giải tỏa!',
        'Lo âu của bạn đã được gửi đi. Hãy hít thở sâu và cảm thấy nhẹ nhõm hơn nhé.',
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
    fadeAnim.setValue(1);
    scaleAnim.setValue(1);
    translateYAnim.setValue(0);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#2C3E50' }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {}
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

          {}
          <View style={styles.paperContainer}>
            <Animated.View
              style={[
                styles.paper,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
                },
              ]}
            >
              <TextInput
                style={styles.input}
                multiline
                placeholder="Tôi đang lo lắng về..."
                placeholderTextColor="#999"
                value={worryText}
                onChangeText={setWorryText}
                editable={!isBurning}
              />
            </Animated.View>
          </View>

          {}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.burnButton, { backgroundColor: isBurning ? '#555' : '#FF6B6B' }]}
              onPress={handleBurn}
              disabled={isBurning}
            >
              {isBurning ? (
                <Text style={styles.burnButtonText}>Đang đốt...</Text>
              ) : (
                <>
                  <Ionicons name="flame" size={24} color="#fff" style={{ marginRight: 8 }} />
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
  instruction: { color: '#ccc', textAlign: 'center', marginBottom: 30, fontSize: 16 },

  paperContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  paper: {
    width: '100%',
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    textAlignVertical: 'top',
    lineHeight: 28,
  },

  footer: { marginBottom: 20 },
  burnButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  burnButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
