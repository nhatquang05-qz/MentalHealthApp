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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';

import { useAuth, EmergencyContact } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();

  const { isGuest, user, logout, updateUser } = useAuth();
  const navigation = useNavigation<any>();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempEmail, setTempEmail] = useState('');

  const [tempContacts, setTempContacts] = useState<EmergencyContact[]>([]);

  const [reminderTime, setReminderTime] = useState('20:00');
  const [date, setDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [surveyFrequency, setSurveyFrequency] = useState('Hàng ngày');
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const frequencyOptions = ['Hàng ngày', 'Mỗi 2 ngày', 'Mỗi 3 ngày', 'Hàng tuần', 'Cuối tuần'];

  useEffect(() => {
    if (user) {
      setTempName(user.name);
      setTempEmail(user.email);

      setTempContacts(user.emergencyContacts || []);
    }
    const now = new Date();
    now.setHours(20);
    now.setMinutes(0);
    setDate(now);
  }, [user]);

  const handleToggleNotification = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleContactChange = (index: number, field: keyof EmergencyContact, value: string) => {
    const newContacts = [...tempContacts];
    newContacts[index][field] = value;
    setTempContacts(newContacts);
  };

  const addContactRow = () => {
    setTempContacts([...tempContacts, { name: '', phone: '' }]);
  };

  const removeContactRow = (index: number) => {
    const newContacts = tempContacts.filter((_, i) => i !== index);
    setTempContacts(newContacts);
  };

  const saveProfile = () => {
    if (user && updateUser) {
      const validContacts = tempContacts.filter(
        (c) => c.name.trim() !== '' && c.phone.trim() !== '',
      );

      updateUser({
        ...user,
        name: tempName,
        emergencyContacts: validContacts,
      });

      setEditModalVisible(false);
      Alert.alert('Thành công', 'Hồ sơ và danh bạ SOS đã được cập nhật!');
    } else {
      setEditModalVisible(false);
      Alert.alert('Thông báo', 'Hồ sơ đã lưu (Vui lòng kiểm tra lại AuthContext để lưu SOS)');
    }
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đồng ý', style: 'destructive', onPress: logout },
    ]);
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;
      setReminderTime(formattedTime);
    }
  };

  const renderProfileCard = () => {
    if (isGuest) {
      return (
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, alignItems: 'center', paddingVertical: 30 },
          ]}
        >
          <Ionicons name="person-circle-outline" size={60} color={colors.subText} />
          <Text style={[styles.guestTitle, { color: colors.text }]}>
            Bạn đang dùng chế độ Khách
          </Text>
          <Text style={[styles.guestSubtitle, { color: colors.subText }]}>
            Đăng nhập để đồng bộ dữ liệu của bạn
          </Text>

          <View style={{ flexDirection: 'row', marginTop: 20, gap: 10 }}>
            <TouchableOpacity
              style={[styles.authButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.authButtonText}>Đăng Nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.authButton,
                {
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: colors.primary,
                },
              ]}
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
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <View style={[styles.avatar, { backgroundColor: isDark ? '#333' : '#F3F4F6' }]}>
            <Text style={{ fontSize: 24 }}>👤</Text>
          </View>
          <View style={{ marginLeft: 16, flex: 1 }}>
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

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {}
          <View style={styles.settingItemRow}>
            <View style={[styles.settingIconBox, { backgroundColor: colors.iconBg }]}>
              <Ionicons name="notifications-outline" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Nhắc nhở hằng ngày</Text>
              <TouchableOpacity
                style={[
                  styles.settingInputBox,
                  {
                    backgroundColor: isDark ? '#333' : '#F3F4F6',
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={{ color: colors.text }}>{reminderTime}</Text>
                <Ionicons name="time-outline" size={20} color={colors.subText} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 16 }} />

          {}
          <View style={styles.settingItemRow}>
            <View style={[styles.settingIconBox, { backgroundColor: colors.iconBg }]}>
              <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Tần suất khảo sát</Text>
              <TouchableOpacity
                style={[
                  styles.settingInputBox,
                  {
                    backgroundColor: isDark ? '#333' : '#F3F4F6',
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setShowFrequencyModal(true)}
              >
                <Text style={{ color: colors.text }}>{surveyFrequency}</Text>
                <Ionicons name="chevron-down" size={20} color={colors.subText} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionHeader, { color: colors.text }]}>Tùy chỉnh</Text>

          <View style={[styles.row, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="notifications-circle-outline" size={22} color={colors.subText} />
              <Text style={[styles.rowLabel, { color: colors.text }]}>Nhận Thông Báo App</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotification}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={'#f4f3f4'}
            />
          </View>

          <View style={[styles.row, { paddingTop: 15 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name={isDark ? 'moon' : 'sunny-outline'} size={22} color={colors.subText} />
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

        <View style={[styles.card, { backgroundColor: isDark ? '#1F2937' : '#E3F2FD' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.primary} />
            <Text
              style={[
                styles.sectionHeader,
                { marginLeft: 10, color: colors.primary, marginBottom: 0 },
              ]}
            >
              Quyền Riêng Tư & Bảo Mật
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: isDark ? '#D1D5DB' : '#555', lineHeight: 18 }}>
            Dữ liệu của bạn được mã hóa và lưu trữ an toàn. Chúng tôi không bao giờ chia sẻ thông
            tin cá nhân.
          </Text>
        </View>

        {!isGuest && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={20}
              color={colors.danger}
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: colors.danger, fontSize: 16, fontWeight: '600' }}>Đăng Xuất</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {}
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
          <View style={[styles.modalContent, { backgroundColor: colors.card, maxHeight: '85%' }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Chỉnh Sửa Hồ Sơ</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
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
                  editable={false}
                  placeholderTextColor={colors.subText}
                />
              </View>

              {}
              <View style={{ marginTop: 10, marginBottom: 20 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name="call"
                      size={18}
                      color={colors.danger}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: colors.text,
                        fontSize: 16,
                      }}
                    >
                      Danh bạ SOS
                    </Text>
                  </View>
                  <TouchableOpacity onPress={addContactRow}>
                    <Text style={{ color: colors.primary, fontWeight: 'bold' }}>+ Thêm số</Text>
                  </TouchableOpacity>
                </View>

                {tempContacts.length === 0 && (
                  <Text
                    style={{
                      color: colors.subText,
                      fontStyle: 'italic',
                      fontSize: 13,
                      marginBottom: 10,
                    }}
                  >
                    Chưa có số liên hệ khẩn cấp nào.
                  </Text>
                )}

                {tempContacts.map((contact, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      gap: 8,
                      marginBottom: 10,
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: colors.inputBg,
                            color: colors.text,
                            height: 40,
                            marginBottom: 5,
                            fontSize: 14,
                          },
                        ]}
                        value={contact.name}
                        placeholder="Tên (VD: Mẹ)"
                        placeholderTextColor={colors.subText}
                        onChangeText={(t) => handleContactChange(index, 'name', t)}
                      />
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: colors.inputBg,
                            color: colors.text,
                            height: 40,
                            fontSize: 14,
                          },
                        ]}
                        value={contact.phone}
                        placeholder="Số điện thoại"
                        placeholderTextColor={colors.subText}
                        onChangeText={(t) => handleContactChange(index, 'phone', t)}
                        keyboardType="phone-pad"
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => removeContactRow(index)}
                      style={{ padding: 5 }}
                    >
                      <Ionicons name="trash-outline" size={22} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>

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

      {}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showFrequencyModal}
        onRequestClose={() => setShowFrequencyModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFrequencyModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card, paddingBottom: 20 }]}>
            <Text style={[styles.modalTitle, { color: colors.text, marginBottom: 10 }]}>
              Chọn Tần Suất
            </Text>
            {frequencyOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.frequencyOption,
                  { borderBottomColor: colors.border },
                  surveyFrequency === option && {
                    backgroundColor: isDark ? '#333' : '#F0F9FF',
                  },
                ]}
                onPress={() => {
                  setSurveyFrequency(option);
                  setShowFrequencyModal(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: surveyFrequency === option ? colors.primary : colors.text,
                    fontWeight: surveyFrequency === option ? '600' : '400',
                  }}
                >
                  {option}
                </Text>
                {surveyFrequency === option && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {}
      {showTimePicker &&
        (Platform.OS === 'ios' ? (
          <Modal transparent={true} animationType="fade">
            <View style={styles.modalOverlay}>
              <View
                style={[
                  styles.modalContent,
                  {
                    backgroundColor: isDark ? '#1E1E1E' : '#FFF',
                    paddingBottom: 30,
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 15,
                  }}
                >
                  <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                    <Text style={{ color: colors.subText, fontSize: 16 }}>Hủy</Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 16,
                      color: colors.text,
                    }}
                  >
                    Chọn giờ
                  </Text>
                  <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                    <Text
                      style={{
                        color: colors.primary,
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}
                    >
                      Xong
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={onTimeChange}
                  textColor={colors.text}
                />
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
          />
        ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20 },
  header: { marginBottom: 20, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: { fontSize: 18, fontWeight: 'bold' },
  userEmail: { fontSize: 14 },
  editButton: { borderWidth: 1, padding: 10, borderRadius: 12, alignItems: 'center' },
  editButtonText: { fontWeight: '600' },
  sectionHeader: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowLabel: { marginLeft: 12, fontSize: 16 },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 40,
  },

  settingItemRow: { flexDirection: 'row', alignItems: 'flex-start' },
  settingIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingLabel: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  settingInputBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },

  guestTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 4 },
  guestSubtitle: { fontSize: 14, marginBottom: 16 },
  authButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  authButtonText: { color: '#fff', fontWeight: '600' },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputGroup: { marginBottom: 15 },
  inputLabel: { marginBottom: 6, fontSize: 14 },
  input: { height: 50, borderRadius: 12, paddingHorizontal: 15, fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalBtn: {
    flex: 0.48,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  frequencyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
  },
});
