import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { isGuest, user, logout } = useAuth();
  const navigation = useNavigation<any>();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempEmail, setTempEmail] = useState('');

  // Cập nhật state tạm thời khi user thay đổi
  useEffect(() => {
    if (user) {
      setTempName(user.name);
      setTempEmail(user.email);
    }
  }, [user]);

  const handleToggleNotification = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const saveProfile = () => {
    // Trong thực tế, gọi hàm updateProfile từ AuthContext
    setEditModalVisible(false);
    Alert.alert('Thành công', 'Hồ sơ đã được cập nhật!');
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đồng ý', style: 'destructive', onPress: logout }
    ]);
  };

  // --- COMPONENT CON: THẺ HỒ SƠ ---
  const renderProfileCard = () => {
    if (isGuest) {
      return (
        <View style={[styles.card, { backgroundColor: colors.card, alignItems: 'center', paddingVertical: 30 }]}>
          <Ionicons name="person-circle-outline" size={60} color={colors.subText} />
          <Text style={[styles.guestTitle, { color: colors.text }]}>Bạn đang dùng chế độ Khách</Text>
          <Text style={[styles.guestSubtitle, { color: colors.subText }]}>Đăng nhập để đồng bộ dữ liệu của bạn</Text>
          
          <View style={{ flexDirection: 'row', marginTop: 20, gap: 10 }}>
            <TouchableOpacity 
              style={[styles.authButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.authButtonText}>Đăng Nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.authButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary }]}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={[styles.authButtonText, { color: colors.primary }]}>Đăng Ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
            <View style={[styles.avatar, { backgroundColor: isDark ? '#333' : '#F3F4F6' }]}>
                <Text style={{fontSize: 24}}>👤</Text>
            </View>
            <View style={{marginLeft: 16, flex: 1}}>
                <Text style={[styles.userName, { color: colors.text }]}>{user?.name}</Text>
                <Text style={[styles.userEmail, { color: colors.subText }]}>{user?.email}</Text>
            </View>
        </View>
        <TouchableOpacity 
          style={[styles.editButton, { borderColor: colors.primary }]}
          onPress={() => setEditModalVisible(true)}
        >
            <Text style={[styles.editButtonText, { color: colors.primary }]}>Chỉnh Sửa Hồ Sơ</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Cài Đặt</Text>
        </View>

        {renderProfileCard()}

        {/* Settings Group */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionHeader, { color: colors.text }]}>Tùy chỉnh</Text>
            
            <View style={[styles.row, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name="notifications-outline" size={22} color={colors.subText} />
                    <Text style={[styles.rowLabel, { color: colors.text }]}>Thông Báo</Text>
                </View>
                <Switch 
                  value={notificationsEnabled}
                  onValueChange={handleToggleNotification}
                  trackColor={{ false: '#767577', true: colors.primary }}
                  thumbColor={'#f4f3f4'}
                />
            </View>

            <View style={[styles.row, { paddingTop: 15 }]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name={isDark ? "moon" : "sunny-outline"} size={22} color={colors.subText} />
                    <Text style={[styles.rowLabel, { color: colors.text }]}>Giao Diện Tối</Text>
                </View>
                <Switch 
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#767577', true: colors.primary }}
                  thumbColor={'#f4f3f4'}
                />
            </View>
        </View>

        {/* Privacy */}
        <View style={[styles.card, {backgroundColor: isDark ? '#1F2937' : '#E3F2FD'}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                <Ionicons name="shield-checkmark-outline" size={24} color={colors.primary} />
                <Text style={[styles.sectionHeader, {marginLeft: 10, color: colors.primary, marginBottom: 0}]}>
                    Quyền Riêng Tư & Bảo Mật
                </Text>
            </View>
            <Text style={{fontSize: 13, color: isDark ? '#D1D5DB' : '#555', lineHeight: 18}}>
                Dữ liệu của bạn được mã hóa và lưu trữ an toàn. Chúng tôi không bao giờ chia sẻ thông tin cá nhân.
            </Text>
        </View>

        {!isGuest && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={colors.danger} style={{marginRight: 8}}/>
              <Text style={{color: colors.danger, fontSize: 16, fontWeight: '600'}}>Đăng Xuất</Text>
          </TouchableOpacity>
        )}

      </ScrollView>

      {/* MODAL EDIT PROFILE (Chỉ hiện khi đã login) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Chỉnh Sửa Hồ Sơ</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.subText }]}>Họ và tên</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
                value={tempName}
                onChangeText={setTempName}
                placeholderTextColor={colors.subText}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.subText }]}>Email</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
                value={tempEmail}
                onChangeText={setTempEmail}
                keyboardType="email-address"
                editable={false} // Email thường không cho sửa
                placeholderTextColor={colors.subText}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: colors.inputBg }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={{ color: colors.text }}>Hủy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={saveProfile}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Lưu Thay Đổi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20 },
  header: { marginBottom: 20, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  card: {
    borderRadius: 24, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2
  },
  avatar: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  userName: { fontSize: 18, fontWeight: 'bold' },
  userEmail: { fontSize: 14 },
  editButton: { borderWidth: 1, padding: 10, borderRadius: 12, alignItems: 'center' },
  editButtonText: { fontWeight: '600' },
  sectionHeader: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  rowLabel: { marginLeft: 12, fontSize: 16 },
  logoutButton: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, alignItems: 'center', marginBottom: 40 },
  
  // Guest UI
  guestTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 4 },
  guestSubtitle: { fontSize: 14, marginBottom: 16 },
  authButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, minWidth: 100, alignItems: 'center' },
  authButtonText: { color: '#fff', fontWeight: '600' },

  // Modal Styles
  modalOverlay: {
    flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40,
    shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.25, elevation: 5
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputGroup: { marginBottom: 15 },
  inputLabel: { marginBottom: 6, fontSize: 14 },
  input: { height: 50, borderRadius: 12, paddingHorizontal: 15, fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalBtn: { flex: 0.48, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }
});