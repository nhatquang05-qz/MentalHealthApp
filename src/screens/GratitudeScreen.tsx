import React, { useState, useEffect } from 'react';
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
  Image // Import Image component
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; // Import thư viện ảnh
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

interface GratitudeItem {
  id: string;
  text: string;
  imageUri?: string; // Thêm trường lưu đường dẫn ảnh (tùy chọn)
  date: string;
}

export default function GratitudeScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State lưu ảnh đang chọn tạm thời
  const [items, setItems] = useState<GratitudeItem[]>([]);

  useEffect(() => {
    loadGratitude();
  }, []);

  const loadGratitude = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('gratitude_list');
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error('Failed to load gratitude items', error);
    }
  };

  const saveGratitude = async (newItems: GratitudeItem[]) => {
    try {
      await AsyncStorage.setItem('gratitude_list', JSON.stringify(newItems));
    } catch (error) {
      console.error('Failed to save gratitude item', error);
    }
  };

  // Hàm mở thư viện ảnh
  const pickImage = async () => {
    // Yêu cầu quyền truy cập (quan trọng cho iOS)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Cần quyền truy cập', 'Vui lòng cấp quyền truy cập thư viện ảnh để sử dụng tính năng này.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Chỉ lấy ảnh
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8, // Giảm chất lượng một chút để tối ưu lưu trữ
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleAdd = () => {
    // Cho phép đăng nếu có chữ HOẶC có ảnh
    if (!text.trim() && !selectedImage) {
        Alert.alert("Chưa có nội dung", "Hãy viết điều gì đó hoặc chọn một bức ảnh.");
        return;
    }

    const newItem: GratitudeItem = {
      id: Date.now().toString(),
      text: text.trim(),
      imageUri: selectedImage || undefined, // Lưu URI ảnh nếu có
      date: new Date().toLocaleDateString('vi-VN'),
    };

    const updatedItems = [newItem, ...items];
    setItems(updatedItems);
    saveGratitude(updatedItems);
    
    // Reset form
    setText('');
    setSelectedImage(null);
    Keyboard.dismiss();
  };

  const handleDelete = (id: string) => {
    Alert.alert(
        "Xóa nhật ký",
        "Bạn có chắc muốn xóa kỷ niệm này không?",
        [
            { text: "Hủy", style: "cancel" },
            { 
                text: "Xóa", 
                style: "destructive", 
                onPress: () => {
                    const updatedItems = items.filter(item => item.id !== id);
                    setItems(updatedItems);
                    saveGratitude(updatedItems);
                }
            }
        ]
    );
  };

  const renderItem = ({ item }: { item: GratitudeItem }) => (
    <View style={[styles.itemCard, { backgroundColor: colors.card }]}>
      <View style={styles.itemContent}>
        <Text style={[styles.itemDate, { color: colors.subText }]}>{item.date}</Text>
        
        {/* Hiển thị ảnh nếu có */}
        {item.imageUri && (
          <Image 
            source={{ uri: item.imageUri }} 
            style={styles.itemImage} 
            resizeMode="cover"
          />
        )}
        
        {/* Hiển thị text nếu có */}
        {item.text ? <Text style={[styles.itemText, { color: colors.text }]}>{item.text}</Text> : null}
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
              "Hạnh phúc không phải là có tất cả những gì bạn muốn, mà là trân trọng những gì bạn đang có."
          </Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Ionicons name="leaf-outline" size={60} color={colors.border} />
                <Text style={{ color: colors.subText, marginTop: 10 }}>Chưa có nhật ký nào. Hãy viết điều đầu tiên nhé!</Text>
            </View>
        }
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        {/* Khu vực hiển thị Preview ảnh đang chọn */}
        {selectedImage && (
            <View style={[styles.previewContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
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
            {/* Nút chọn ảnh */}
            <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
                <Ionicons name="image-outline" size={26} color={colors.primary} />
            </TouchableOpacity>

            <TextInput
                style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
                placeholder="Hôm nay bạn biết ơn điều gì?"
                placeholderTextColor={colors.subText}
                value={text}
                onChangeText={setText}
            />
            <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: colors.primary }]} 
                onPress={handleAdd}
            >
                <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
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
    alignItems: 'flex-start', // Căn chỉnh lên trên để đẹp hơn khi có ảnh
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2
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

  // Styles cho phần Input và Preview
  previewContainer: {
      padding: 10,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: 'rgba(0,0,0,0.05)'
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
    alignItems: 'center'
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
    marginRight: 12
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 3
  }
});