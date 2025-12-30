import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth, EmergencyContact } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const { colors } = useTheme();
  const { register } = useAuth();
  const navigation = useNavigation<any>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [contacts, setContacts] = useState<EmergencyContact[]>([{ name: '', phone: '' }]);

  const handleContactChange = (index: number, field: keyof EmergencyContact, value: string) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };

  const addContactRow = () => {
    setContacts([...contacts, { name: '', phone: '' }]);
  };

  const removeContactRow = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    setContacts(newContacts);
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin cá nhân');
      return;
    }

    const validContacts = contacts.filter((c) => c.name.trim() !== '' && c.phone.trim() !== '');

    await register(name, email, password, validContacts);

    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>Đăng Ký</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Tạo tài khoản và thiết lập SOS.
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Thông tin cá nhân</Text>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Họ và tên</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Nhập tên của bạn"
              placeholderTextColor={colors.subText}
              value={name}
              onChangeText={setName}
            />
          </View>

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
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Tạo mật khẩu"
              placeholderTextColor={colors.subText}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        {}
        <View style={styles.section}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Text style={[styles.sectionTitle, { color: colors.danger, marginBottom: 0 }]}>
              Liên hệ khẩn cấp (SOS)
            </Text>
            <TouchableOpacity
              onPress={addContactRow}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Ionicons name="add-circle" size={24} color={colors.primary} />
              <Text style={{ color: colors.primary, fontWeight: 'bold', marginLeft: 4 }}>Thêm</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ color: colors.subText, fontSize: 13, marginBottom: 15 }}>
            Nhập số người thân để gọi nhanh khi gặp sự cố.
          </Text>

          {contacts.map((contact, index) => (
            <View key={index} style={[styles.contactRow, { borderColor: colors.border }]}>
              <View style={{ flex: 1, gap: 10 }}>
                <TextInput
                  style={[
                    styles.smallInput,
                    {
                      backgroundColor: colors.inputBg,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Tên (VD: Mẹ, Anh trai)"
                  placeholderTextColor={colors.subText}
                  value={contact.name}
                  onChangeText={(text) => handleContactChange(index, 'name', text)}
                />
                <TextInput
                  style={[
                    styles.smallInput,
                    {
                      backgroundColor: colors.inputBg,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Số điện thoại"
                  placeholderTextColor={colors.subText}
                  value={contact.phone}
                  onChangeText={(text) => handleContactChange(index, 'phone', text)}
                  keyboardType="phone-pad"
                />
              </View>
              {contacts.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeContactRow(index)}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.registerButton, { backgroundColor: colors.primary }]}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>Hoàn Tất Đăng Ký</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: { padding: 24, paddingTop: 40 },
  backButton: { marginBottom: 20, alignSelf: 'flex-start' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 30 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 8, fontWeight: '600' },
  input: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  smallInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  removeButton: { padding: 10, marginLeft: 5 },

  registerButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  registerButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
