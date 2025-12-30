import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth, EmergencyContact } from '../context/AuthContext';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [newAvatarUri, setNewAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);

      setContacts(user.emergencyContacts || []);
    }
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập bị từ chối', 'Cần cấp quyền truy cập thư viện ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setNewAvatarUri(result.assets[0].uri);
    }
  };

  const handleContactChange = (index: number, field: keyof EmergencyContact, value: string) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };

  const addContact = () => {
    setContacts([...contacts, { name: '', phone: '' }]);
  };

  const removeContact = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    setContacts(newContacts);
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('id', String(user.id));
      formData.append('username', name);

      const validContacts = contacts.filter((c) => c.name.trim() !== '' && c.phone.trim() !== '');

      formData.append('contacts', JSON.stringify(validContacts));

      if (newAvatarUri) {
        const localUri = newAvatarUri;
        const filename = localUri.split('/').pop() || 'avatar.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('avatar', {
          uri: localUri,
          name: filename,
          type: type,
        } as any);
      }

      const success = await updateUser(formData);

      if (success) {
        Alert.alert('Thành công', 'Cập nhật thông tin thành công.');
        setNewAvatarUri(null);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Thông tin cá nhân</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>Lưu</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {}
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
              {newAvatarUri ? (
                <Image source={{ uri: newAvatarUri }} style={styles.avatar} />
              ) : user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: isDark ? '#333' : '#E5E7EB',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}
                >
                  <Ionicons name="person" size={60} color={colors.subText} />
                </View>
              )}

              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={[styles.changePhotoText, { color: colors.primary }]}>Chạm để đổi ảnh</Text>
          </View>

          <View style={styles.formContainer}>
            {}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.subText }]}>Họ và tên</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                value={name}
                onChangeText={setName}
              />
            </View>

            {}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.subText }]}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.text, opacity: 0.7 },
                ]}
                value={user.email}
                editable={false}
              />
            </View>

            {}
            <View style={[styles.sectionHeaderContainer, { marginTop: 10 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="call" size={20} color={colors.danger} style={{ marginRight: 8 }} />
                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  Danh bạ khẩn cấp (SOS)
                </Text>
              </View>
              <TouchableOpacity onPress={addContact}>
                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>+ Thêm</Text>
              </TouchableOpacity>
            </View>

            {contacts.length === 0 && (
              <Text
                style={{
                  color: colors.subText,
                  fontStyle: 'italic',
                  fontSize: 13,
                  marginBottom: 10,
                }}
              >
                Chưa có liên hệ nào. Thêm số người thân để gọi nhanh khi cần gấp.
              </Text>
            )}

            {contacts.map((contact, index) => (
              <View key={index} style={[styles.contactRow, { backgroundColor: colors.card }]}>
                <View style={{ flex: 1, gap: 8 }}>
                  <TextInput
                    style={[
                      styles.smallInput,
                      { color: colors.text, borderBottomColor: colors.border },
                    ]}
                    placeholder="Tên (VD: Mẹ)"
                    placeholderTextColor={colors.subText}
                    value={contact.name}
                    onChangeText={(text) => handleContactChange(index, 'name', text)}
                  />
                  <TextInput
                    style={[
                      styles.smallInput,
                      { color: colors.text, borderBottomColor: 'transparent' },
                    ]}
                    placeholder="Số điện thoại"
                    placeholderTextColor={colors.subText}
                    value={contact.phone}
                    keyboardType="phone-pad"
                    onChangeText={(text) => handleContactChange(index, 'phone', text)}
                  />
                </View>
                <TouchableOpacity onPress={() => removeContact(index)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={20} color={colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  avatarContainer: { alignItems: 'center', marginBottom: 30 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  changePhotoText: { marginTop: 10, fontSize: 16, fontWeight: '600' },
  formContainer: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '500' },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
  },

  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeader: { fontSize: 16, fontWeight: 'bold' },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  smallInput: {
    height: 40,
    paddingHorizontal: 5,
    fontSize: 15,
    borderBottomWidth: 1,
  },
  deleteBtn: {
    padding: 10,
    marginLeft: 5,
  },
});
