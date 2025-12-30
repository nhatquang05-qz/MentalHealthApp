import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const { colors } = useTheme();
  const { login } = useAuth();
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    // Gọi API Login
    // AuthContext sẽ tự hiển thị Alert nếu lỗi hoặc cập nhật state user nếu thành công
    await login(email, password);
    
    // Tạm thời quay lại sau khi login. 
    // Nếu AppNavigator của bạn được setup để tự chuyển màn hình khi có `user`, 
    // dòng navigation.goBack() này có thể không cần thiết hoặc chỉ dùng khi Login là 1 màn hình popup.
    navigation.goBack(); 
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>Đăng Nhập</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Chào mừng bạn quay trở lại!
        </Text>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Nhập email của bạn"
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
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Nhập mật khẩu"
            placeholderTextColor={colors.subText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Đăng Nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkButton}>
          <Text style={[styles.linkText, { color: colors.subText }]}>
            Chưa có tài khoản?{' '}
            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Đăng ký ngay</Text>
          </Text>
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
  subtitle: { fontSize: 16, marginBottom: 40 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 8, fontWeight: '600' },
  input: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
  loginButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  linkButton: { marginTop: 20, alignItems: 'center' },
  linkText: { fontSize: 14 },
});