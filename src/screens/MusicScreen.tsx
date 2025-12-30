import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const musicCategories: any = {
  meditation: [
    { id: 1, title: 'Sóng Biển', artist: 'Âm Thanh Thiên Nhiên', duration: '15:00' },
    { id: 2, title: 'Mưa Nhẹ Nhàng', artist: 'Bình Yên', duration: '20:00' },
    { id: 3, title: 'Sáng Trong Rừng', artist: 'Liệu Pháp Thiên Nhiên', duration: '18:30' },
    { id: 4, title: 'Chuông Gió', artist: 'Vườn Thiền', duration: '12:00' },
  ],
  sleep: [
    { id: 5, title: 'Ánh Trăng', artist: 'Giấc Mơ Cổ Điển', duration: '14:20' },
    { id: 6, title: 'Sóng Delta', artist: 'Giấc Ngủ Sâu', duration: '30:00' },
    { id: 7, title: 'Bầu Trời Đêm', artist: 'Đêm Yên Bình', duration: '25:00' },
    { id: 8, title: 'Ru Ngủ Nhẹ Nhàng', artist: 'Câu Chuyện Ngủ', duration: '10:00' },
  ],
  focus: [
    { id: 9, title: 'Lo-fi Học Tập', artist: 'Nhịp Điệu Êm Dịu', duration: '45:00' },
    { id: 10, title: 'Piano Tập Trung', artist: 'Nồng Độ Cao', duration: '30:00' },
    { id: 11, title: 'Ambient Làm Việc', artist: 'Dòng Chảy Năng Suất', duration: '40:00' },
  ],
  relax: [
    { id: 13, title: 'Hoàng Hôn', artist: 'Không Gian Thư Giãn', duration: '22:00' },
    { id: 14, title: 'Hòa Âm Spa', artist: 'Thư Giãn Tâm Hồn', duration: '28:00' },
    { id: 15, title: 'Bình Yên Vườn Hoa', artist: 'Phút Giây Thanh Thản', duration: '16:00' },
  ],
};

const tabs = [
  { key: 'meditation', label: 'Thiền' },
  { key: 'sleep', label: 'Ngủ' },
  { key: 'focus', label: 'Tập Trung' },
  { key: 'relax', label: 'Thư Giãn' },
];

export default function MusicScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('meditation');
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = (song: any) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Thư Viện Nhạc</Text>
        </View>

        {}
        {currentSong ? (
          <View style={[styles.playerCard, { backgroundColor: colors.card }]}>
            <View style={[styles.diskIcon, { backgroundColor: colors.iconBg }]}>
              <Ionicons name="musical-note" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginHorizontal: 12 }}>
              <Text style={[styles.playerTitle, { color: colors.text }]}>{currentSong.title}</Text>
              <Text style={[styles.playerArtist, { color: colors.subText }]}>
                {currentSong.artist}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
              <Ionicons
                name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={48}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.introCard, { backgroundColor: isDark ? '#333' : '#E3F2FD' }]}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>🎵</Text>
            <Text style={[styles.introTitle, { color: colors.text }]}>Tìm Sự Bình Yên</Text>
            <Text style={[styles.introDesc, { color: colors.subText }]}>
              Chọn nhạc để thư giãn, tập trung hoặc ngủ ngon hơn.
            </Text>
          </View>
        )}

        {}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  {
                    backgroundColor: activeTab === tab.key ? colors.primary : colors.card,
                  },
                ]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: activeTab === tab.key ? '#fff' : colors.subText },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {}
        <ScrollView showsVerticalScrollIndicator={false}>
          {musicCategories[activeTab]?.map((song: any) => (
            <TouchableOpacity
              key={song.id}
              style={[
                styles.songItem,
                { backgroundColor: colors.card },
                currentSong?.id === song.id && {
                  borderWidth: 1,
                  borderColor: colors.primary,
                  backgroundColor: isDark ? '#333' : '#F0F9FF',
                },
              ]}
              onPress={() => togglePlay(song)}
            >
              <View
                style={[styles.playIconBox, { backgroundColor: isDark ? '#333' : colors.iconBg }]}
              >
                <Ionicons
                  name={currentSong?.id === song.id && isPlaying ? 'pause' : 'play'}
                  size={16}
                  color={colors.primary}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.songTitle, { color: colors.text }]}>{song.title}</Text>
                <Text style={[styles.songArtist, { color: colors.subText }]}>{song.artist}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={colors.subText}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.duration, { color: colors.subText }]}>{song.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  backButton: { padding: 8, borderRadius: 20, marginRight: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },

  playerCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 4,
  },
  diskIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerTitle: { fontSize: 16, fontWeight: 'bold' },
  playerArtist: { fontSize: 14 },

  introCard: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  introTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  introDesc: { textAlign: 'center', fontSize: 14 },

  tabContainer: { marginBottom: 20, height: 40 },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
  },
  tabText: { fontWeight: '600' },

  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  playIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songTitle: { fontSize: 15, fontWeight: '600' },
  songArtist: { fontSize: 13 },
  duration: { fontSize: 12 },
});
