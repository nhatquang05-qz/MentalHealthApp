import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

interface GratitudeItem {
  id: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export default function GratitudeScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();

  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [items, setItems] = useState<GratitudeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadGratitude();
      }
    }, [user]),
  );

  const loadGratitude = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/gratitude/${(user as any).id}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to load gratitude items', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Cần quyền truy cập',
        'Vui lòng cấp quyền truy cập thư viện ảnh để sử dụng tính năng này.',
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleAdd = async () => {
    if (!text.trim() && !selectedImage) {
      Alert.alert('Chưa có nội dung', 'Hãy viết điều gì đó hoặc chọn một bức ảnh.');
      return;
    }

    setIsPosting(true);

    try {
      const formData = new FormData();

      formData.append('userId', String((user as any).id));
      formData.append('content', text.trim());

      if (selectedImage) {
        const localUri = selectedImage;
        const filename = localUri.split('/').pop() || 'photo.jpg';

        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('image', {
          uri: localUri,
          name: filename,
          type: type,
        } as any);
      }

      const response = await fetch(`${API_URL}/gratitude`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setText('');
        setSelectedImage(null);
        Keyboard.dismiss();
        loadGratitude();
      } else {
        Alert.alert('Lỗi', result.message || 'Không thể lưu nhật ký');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Lỗi kết nối', 'Không thể kết nối đến server');
    } finally {
      setIsPosting(false);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Xóa nhật ký', 'Bạn có chắc muốn xóa kỷ niệm này không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await fetch(`${API_URL}/gratitude/${id}`, { method: 'DELETE' });

            setItems((prev) => prev.filter((item) => item.id !== id));
          } catch (error) {
            Alert.alert('Lỗi', 'Không thể xóa bài viết');
          }
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const renderItem = ({ item }: { item: GratitudeItem }) => (
    <View style={[styles.itemCard, { backgroundColor: colors.card }]}>
      <View style={styles.itemContent}>
        <Text style={[styles.itemDate, { color: colors.subText }]}>
          {formatDate(item.createdAt)}
        </Text>

        {}
        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.itemImage} resizeMode="cover" />
        )}

        {item.content ? (
          <Text style={[styles.itemText, { color: colors.text }]}>{item.content}</Text>
        ) : null}
      </View>

      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color={colors.subText} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Nhật Ký Biết Ơn</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.introContainer}>
        <Text style={[styles.introText, { color: colors.subText }]}>
          "Hạnh phúc không phải là có tất cả những gì bạn muốn, mà là trân trọng những gì bạn đang
          có."
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="leaf-outline" size={60} color={colors.border} />
              <Text style={{ color: colors.subText, marginTop: 10 }}>
                Chưa có nhật ký nào. Hãy viết điều đầu tiên nhé!
              </Text>
            </View>
          }
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        {}
        {selectedImage && (
          <View
            style={[
              styles.previewContainer,
              { backgroundColor: colors.card, borderTopColor: colors.border },
            ]}
          >
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close-circle" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={pickImage} style={styles.iconButton} disabled={isPosting}>
            <Ionicons
              name="image-outline"
              size={26}
              color={isPosting ? colors.subText : colors.primary}
            />
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            placeholder={isPosting ? 'Đang gửi...' : 'Hôm nay bạn biết ơn điều gì?'}
            placeholderTextColor={colors.subText}
            value={text}
            onChangeText={setText}
            editable={!isPosting}
          />

          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: isPosting ? colors.subText : colors.primary },
            ]}
            onPress={handleAdd}
            disabled={isPosting}
          >
            {isPosting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },

  introContainer: { paddingHorizontal: 20, marginBottom: 10 },
  introText: { fontStyle: 'italic', textAlign: 'center', fontSize: 14 },

  listContent: { padding: 20, paddingBottom: 100 },
  itemCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  itemContent: { flex: 1 },
  itemDate: { fontSize: 12, marginBottom: 6 },
  itemText: { fontSize: 16, lineHeight: 22 },
  itemImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  deleteButton: { padding: 8, marginLeft: 8 },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 50 },

  previewContainer: {
    padding: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  removeImageButton: {
    marginLeft: 10,
  },

  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    marginRight: 12,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
});
