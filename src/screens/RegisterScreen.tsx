import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const { colors } = useTheme();
  const { register } = useAuth();
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!name || !email || !password) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    register(name, email);
    // Sau khi đăng ký, reset stack về Home (hoặc Settings) để cập nhật trạng thái đã đăng nhập
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
    Alert.alert('Thành công', 'Tạo tài khoản thành công!');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>Đăng Ký</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>Tạo tài khoản để lưu dữ liệu của bạn.</Text>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Họ và tên</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Nhập tên của bạn"
            placeholderTextColor={colors.subText}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Nhập email"
            placeholderTextColor={colors.subText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Mật khẩu</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Tạo mật khẩu"
            placeholderTextColor={colors.subText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={[styles.registerButton, { backgroundColor: colors.primary }]} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Tạo Tài Khoản</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 50, left: 20, padding: 10 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 30 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 8, fontWeight: '600' },
  input: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
  registerButton: { height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, elevation: 2 },
  registerButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});