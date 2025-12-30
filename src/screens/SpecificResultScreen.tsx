import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Linking,
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_DEFAULT, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { testData } from '../data/testData';
import { API_URL } from '../config';

const { width } = Dimensions.get('window');

export default function SpecificResultScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { title, score, testType, isCritical, answers, fromHistory } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<any>(null);

  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [nearbyCenters, setNearbyCenters] = useState<any[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const processedRef = useRef(false);

  const currentTestData = testData[testType as keyof typeof testData];

  const getResultAnalysis = () => {
    const normalResult =
      currentTestData.results.find((r) => score >= r.min && score <= r.max) ||
      currentTestData.results[currentTestData.results.length - 1];
    const severeResult = currentTestData.results[currentTestData.results.length - 1];

    if (isCritical) {
      if (normalResult.min === severeResult.min) {
        return {
          ...normalResult,
          description:
            normalResult.description +
            '\n\n(Lưu ý: Câu trả lời về ý định làm hại bản thân của bạn là một dấu hiệu rất nghiêm trọng, hãy ưu tiên tìm sự trợ giúp y tế.)',
        };
      } else {
        return {
          ...severeResult,
          description:
            'Mặc dù tổng điểm đánh giá của bạn chưa ở mức cao nhất, nhưng câu trả lời về ý định làm hại bản thân là một dấu hiệu nghiêm trọng cần được chú ý đặc biệt.\n\nHãy tìm kiếm sự hỗ trợ ngay lập tức.',
          level: 'Cần Chú Ý Đặc Biệt',
        };
      }
    }
    return normalResult;
  };

  const analysis = getResultAnalysis();

  const shouldShowMedicalSupport = () => {
    const levelLower = analysis.level.toLowerCase();
    const riskKeywords = ['trung bình', 'cao', 'nặng', 'đặc biệt', 'nghiêm trọng'];
    return riskKeywords.some((keyword) => levelLower.includes(keyword)) || isCritical;
  };

  const showHospitals = shouldShowMedicalSupport();

  useEffect(() => {
    if (showHospitals) {
      getUserLocationAndSearch();
    }
  }, [showHospitals]);

  const getUserLocationAndSearch = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Không có quyền truy cập vị trí.');
        setIsLoadingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation(location.coords);
      await fetchNearbyHospitals(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error(error);
      setLocationError('Lỗi xác định vị trí. Kiểm tra GPS.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const fetchNearbyHospitals = async (lat: number, lon: number) => {
    const servers = [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
      'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    ];

    let success = false;

    for (const server of servers) {
      if (success) break;

      try {
        console.log(`Đang thử kết nối server: ${server}`);

        const query = `
          [out:json][timeout:25];
          (
            node["amenity"="hospital"](around:5000,${lat},${lon});
            node["amenity"="clinic"](around:5000,${lat},${lon});
          );
          out body;
          >;
          out skel qt;
        `;

        const response = await fetch(server, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'data=' + encodeURIComponent(query),
        });

        const textResponse = await response.text();

        try {
          const data = JSON.parse(textResponse);

          const realCenters = data.elements
            .map((item: any) => ({
              id: item.id,
              name: item.tags.name || item.tags['name:en'] || 'Cơ sở y tế',
              address: formatOSMAddress(item.tags),
              phone: item.tags.phone || item.tags['contact:phone'] || 'Đang cập nhật',
              latitude: item.lat,
              longitude: item.lon,
            }))
            .filter((item: any) => item.name !== 'Cơ sở y tế');

          if (realCenters.length === 0) {
            setLocationError('Không tìm thấy cơ sở y tế trong 5km.');
          } else {
            setNearbyCenters(realCenters.slice(0, 10));
            setLocationError(null);
          }

          success = true;
        } catch (jsonError) {
          console.warn(`Server ${server} trả về lỗi HTML hoặc dữ liệu hỏng.`);
          continue;
        }
      } catch (networkError) {
        console.warn(`Lỗi kết nối tới ${server}`, networkError);
        continue;
      }
    }

    if (!success) {
      setLocationError('Hệ thống bản đồ đang quá tải. Vui lòng thử lại sau ít phút.');
    }
  };

  const formatOSMAddress = (tags: any) => {
    let parts = [];
    if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
    if (tags['addr:street']) parts.push(tags['addr:street']);
    if (tags['addr:city']) parts.push(tags['addr:city']);

    if (parts.length === 0) {
      if (tags['addr:full']) return tags['addr:full'];
      return 'Chạm bản đồ để xem vị trí';
    }
    return parts.join(', ');
  };

  useEffect(() => {
    if (user && !processedRef.current && !fromHistory) {
      saveResultToDB();
    }
  }, [user, fromHistory]);

  const saveResultToDB = async () => {
    if (processedRef.current) return;
    processedRef.current = true;
    setIsSaving(true);
    try {
      await fetch(`${API_URL}/data/test-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: (user as any).id,
          testType: testType,
          score: score,
          result: analysis.level,
          details: answers,
        }),
      });
      setHasSaved(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCall = (phone: string) => {
    if (phone === 'Đang cập nhật') {
      Alert.alert('Thông báo', 'Số điện thoại chưa có sẵn.');
      return;
    }
    Linking.openURL(`tel:${phone}`);
  };

  const handleOpenGoogleMap = () => {
    if (!selectedCenter) return;
    const { latitude, longitude, name } = selectedCenter;
    const label = encodeURIComponent(name);
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
    });
    if (url) Linking.openURL(url);
  };

  const getAnswerColor = (point: number) => {
    if (point === 0) return '#4CAF50';
    if (point === 1) return '#FFC107';
    if (point >= 2) return '#FF5252';
    return colors.subText;
  };

  const renderFormattedAdvice = () => {
    if (!analysis.description) return null;
    const advicePoints = analysis.description
      .split('\n')
      .filter((text: string) => text.trim().length > 0);
    return (
      <View style={{ marginTop: 5 }}>
        {advicePoints.map((point: string, index: number) => (
          <View
            key={index}
            style={[
              styles.adviceItemCard,
              { backgroundColor: isDark ? '#374151' : '#FFFFFF', borderColor: colors.border },
            ]}
          >
            <Ionicons name="checkmark-circle" size={20} color="#10B981" style={{ marginTop: 2 }} />
            <Text style={[styles.adviceItemText, { color: colors.text }]}>{point.trim()}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderReviewModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={reviewModalVisible}
      onRequestClose={() => setReviewModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colors.card, height: '90%' }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Chi tiết bài làm</Text>
            <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
              <Ionicons name="close-circle" size={30} color={colors.subText} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {currentTestData.questions.map((q, index) => {
              const userPoint = answers ? answers[index] : -1;
              const pointColor = getAnswerColor(userPoint);
              const selectedText = q.points.includes(userPoint)
                ? q.options[q.points.indexOf(userPoint)]
                : '...';
              return (
                <View key={q.id} style={[styles.reviewItem, { borderColor: colors.border }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.reviewQuestionNum, { color: colors.subText }]}>
                      Câu {index + 1}
                    </Text>
                    <View style={[styles.pointBadge, { backgroundColor: pointColor }]}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                        {userPoint} điểm
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.reviewQuestionText, { color: colors.text }]}>{q.text}</Text>
                  <Text style={{ color: colors.text, fontStyle: 'italic', marginTop: 5 }}>
                    Chọn: <Text style={{ fontWeight: 'bold' }}>{selectedText}</Text>
                  </Text>
                </View>
              );
            })}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#FFF9E1' }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs', { screen: 'Survey' })}
          style={styles.backButton}
        >
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Kết quả</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Ionicons
            name={isCritical ? 'warning' : 'pulse'}
            size={50}
            color={analysis.color}
            style={{ marginBottom: 15 }}
          />

          <Text style={[styles.testTitle, { color: colors.subText }]}>{title}</Text>
          <Text style={[styles.scoreText, { color: analysis.color }]}>{analysis.level}</Text>
          <Text style={[styles.scoreNum, { color: colors.text }]}>Điểm số: {score}/30</Text>

          <Text style={[styles.resultDesc, { color: colors.text, fontWeight: '500' }]}>
            Dưới đây là lời khuyên chi tiết dành cho bạn:
          </Text>

          {!fromHistory && (
            <View style={{ marginBottom: 15 }}>
              {isSaving ? (
                <Text style={{ color: colors.subText }}>Đang lưu...</Text>
              ) : hasSaved ? (
                <Text style={{ color: 'green' }}>✓ Đã lưu kết quả</Text>
              ) : null}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.detailButton,
              { borderColor: colors.primary, backgroundColor: isDark ? '#333' : '#E3F2FD' },
            ]}
            onPress={() => setReviewModalVisible(true)}
          >
            <Text style={[styles.detailButtonText, { color: colors.primary }]}>
              👁️ Xem lại câu trả lời
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.detailButton, { borderColor: analysis.color }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={[styles.detailButtonText, { color: analysis.color }]}>
              📖 Xem lời khuyên & Hỗ trợ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Survey' })}
          >
            <Text style={styles.primaryButtonText}>{fromHistory ? 'Quay lại' : 'Hoàn tất'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          if (selectedCenter) setSelectedCenter(null);
          else setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {!selectedCenter ? (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Góc Lời Khuyên</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close-circle" size={30} color={colors.subText} />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <View
                    style={[styles.adviceBox, { backgroundColor: isDark ? '#1F2937' : '#F0F9FF' }]}
                  >
                    <View style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'center' }}>
                      <Ionicons name="bulb" size={24} color="#F59E0B" />
                      <Text
                        style={{
                          marginLeft: 8,
                          fontWeight: 'bold',
                          fontSize: 18,
                          color: colors.text,
                        }}
                      >
                        Gợi ý hành động
                      </Text>
                    </View>
                    {renderFormattedAdvice()}
                  </View>

                  {showHospitals ? (
                    <>
                      <View style={styles.divider} />
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={[styles.sectionHeader, { color: colors.text }]}>
                          Cơ sở y tế gần bạn (5km)
                        </Text>
                        <TouchableOpacity
                          onPress={getUserLocationAndSearch}
                          disabled={isLoadingLocation}
                        >
                          <Ionicons name="refresh" size={20} color={colors.primary} />
                        </TouchableOpacity>
                      </View>

                      {isLoadingLocation && (
                        <ActivityIndicator
                          size="small"
                          color={colors.primary}
                          style={{ margin: 20 }}
                        />
                      )}
                      {locationError && !isLoadingLocation && (
                        <Text style={{ color: '#FF5252', textAlign: 'center' }}>
                          {locationError}
                        </Text>
                      )}

                      {!isLoadingLocation &&
                        nearbyCenters.map((center, index) => (
                          <View
                            key={index}
                            style={[styles.hospitalCard, { borderColor: colors.border }]}
                          >
                            <View style={{ flex: 1 }}>
                              <Text style={[styles.hospitalName, { color: colors.primary }]}>
                                {center.name}
                              </Text>
                              <Text style={[styles.hospitalAddress, { color: colors.subText }]}>
                                <Ionicons name="location-outline" size={14} /> {center.address}
                              </Text>
                            </View>
                            <View style={styles.actionButtons}>
                              <TouchableOpacity
                                style={[styles.iconBtn, { backgroundColor: '#E8F5E9' }]}
                                onPress={() => handleCall(center.phone)}
                              >
                                <Ionicons name="call" size={20} color="#2E7D32" />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[styles.iconBtn, { backgroundColor: '#E3F2FD' }]}
                                onPress={() => setSelectedCenter(center)}
                              >
                                <Ionicons name="map" size={20} color="#1976D2" />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                    </>
                  ) : (
                    <View style={{ marginTop: 20, alignItems: 'center', padding: 20 }}>
                      <Ionicons name="happy-outline" size={40} color="#10B981" />
                      <Text style={{ color: colors.subText, textAlign: 'center', marginTop: 10 }}>
                        Tình trạng của bạn đang ở mức ổn định. Hãy duy trì thói quen tích cực nhé!
                      </Text>
                    </View>
                  )}
                  <View style={{ height: 20 }} />
                </ScrollView>
              </>
            ) : (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    onPress={() => setSelectedCenter(null)}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                    <Text style={{ color: colors.text, fontSize: 16, marginLeft: 5 }}>
                      Quay lại
                    </Text>
                  </TouchableOpacity>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontWeight: 'bold',
                      fontSize: 16,
                      color: colors.text,
                      flex: 1,
                      textAlign: 'right',
                      marginLeft: 10,
                    }}
                  >
                    {selectedCenter.name}
                  </Text>
                </View>

                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    provider={PROVIDER_DEFAULT}
                    showsUserLocation={true}
                    initialRegion={{
                      latitude: selectedCenter.latitude,
                      longitude: selectedCenter.longitude,
                      latitudeDelta: 0.02,
                      longitudeDelta: 0.02,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: selectedCenter.latitude,
                        longitude: selectedCenter.longitude,
                      }}
                      title={selectedCenter.name}
                      description={selectedCenter.address}
                    />
                    {userLocation && (
                      <Circle
                        center={userLocation}
                        radius={5000}
                        fillColor="rgba(63, 193, 201, 0.1)"
                        strokeColor="rgba(63, 193, 201, 0.3)"
                      />
                    )}
                  </MapView>
                </View>

                <TouchableOpacity
                  style={[styles.directionsButton, { backgroundColor: '#1976D2' }]}
                  onPress={handleOpenGoogleMap}
                >
                  <Ionicons
                    name="navigate-circle"
                    size={24}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                    Mở Google Maps chỉ đường
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {renderReviewModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  card: { borderRadius: 24, padding: 30, elevation: 5, alignItems: 'center', marginBottom: 30 },
  testTitle: { fontSize: 16, marginBottom: 8 },
  scoreText: { fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
  scoreNum: { fontSize: 14, marginBottom: 16, opacity: 0.7 },
  resultDesc: { fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 10 },
  primaryButton: { width: '100%', paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  detailButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 12,
  },
  detailButtonText: { fontSize: 15, fontWeight: '600' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { height: '85%', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  adviceBox: { padding: 15, borderRadius: 16, marginBottom: 20 },
  adviceItemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  adviceItemText: { marginLeft: 10, fontSize: 15, lineHeight: 22, flex: 1 },
  divider: { height: 1, backgroundColor: '#ddd', marginVertical: 15 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  hospitalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  hospitalName: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  hospitalAddress: { fontSize: 13 },
  actionButtons: { flexDirection: 'row', marginLeft: 10, gap: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: { flex: 1, borderRadius: 12, overflow: 'hidden', marginBottom: 15 },
  map: { width: '100%', height: '100%' },
  directionsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  reviewItem: { marginBottom: 15, borderBottomWidth: 1, paddingBottom: 15 },
  reviewQuestionNum: { fontSize: 12, fontWeight: 'bold' },
  reviewQuestionText: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  pointBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
});
