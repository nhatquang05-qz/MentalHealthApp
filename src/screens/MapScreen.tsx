import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import * as Location from 'expo-location';
import medicalData from '../data/medical_centers.json';

export default function MapScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();

  const paramContact = (route.params as any)?.contact;
  const [selectedLocation, setSelectedLocation] = useState<any>(paramContact || null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);

  const locationsToDisplay = paramContact ? [paramContact] : medicalData;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Thông báo', 'Cần cấp quyền vị trí để xem vị trí của bạn trên bản đồ.');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      setLoading(false);
    })();
  }, []);

  const getInitialRegion = () => {
    if (paramContact?.coordinate) {
      return {
        latitude: paramContact.coordinate.latitude,
        longitude: paramContact.coordinate.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    if (userLocation) {
      return {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }

    return {
      latitude: 21.0025,
      longitude: 105.8428,
      latitudeDelta: 5,
      longitudeDelta: 5,
    };
  };

  const handleDirections = (location: any) => {
    const lat = location.coordinate.latitude;
    const lng = location.coordinate.longitude;

    const scheme = Platform.select({
      ios: `maps:0,0?daddr=${lat},${lng}&dirflg=d&t=m`,
      android: `google.navigation:q=${lat},${lng}`,
    });

    const url = scheme || `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    Linking.openURL(url).catch((err) => {
      console.error('Không thể mở bản đồ:', err);
      Alert.alert('Lỗi', 'Không thể mở ứng dụng bản đồ.');
    });
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  if (loading && !paramContact) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={getInitialRegion()}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onPress={() => !paramContact && setSelectedLocation(null)}
      >
        {locationsToDisplay.map((center: any) => (
          <Marker
            key={center.id}
            coordinate={center.coordinate}
            onPress={(e) => {
              e.stopPropagation();
              setSelectedLocation(center);
            }}
          >
            <View style={styles.markerContainer}>
              <Ionicons name="medical" size={24} color="#FF3B30" />
            </View>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.card }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      {}
      {selectedLocation && (
        <View style={[styles.infoCard, { backgroundColor: colors.card || 'white' }]}>
          <Text style={[styles.name, { color: colors.text || 'black' }]}>
            {selectedLocation.name}
          </Text>
          <Text style={[styles.address, { color: colors.subText || '#555' }]}>
            {selectedLocation.address}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#34C759', marginRight: 8 }]}
              onPress={() => handleCall(selectedLocation.phone)}
            >
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.buttonText}>Gọi điện</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#007AFF', marginLeft: 8 }]}
              onPress={() => handleDirections(selectedLocation)}
            >
              <Ionicons name="navigate" size={20} color="#fff" />
              <Text style={styles.buttonText}>Chỉ đường</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },
  markerContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#FF3B30',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  infoCard: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 20,
    zIndex: 999,
  },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  address: { fontSize: 14, marginBottom: 15 },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
