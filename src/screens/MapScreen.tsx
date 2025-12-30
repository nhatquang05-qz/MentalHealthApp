import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function MapScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { contact } = route.params as { contact: any };
  const { colors } = useTheme();

  const initialRegion = {
    latitude: contact.coordinate?.latitude || 21.0285,
    longitude: contact.coordinate?.longitude || 105.8542,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={initialRegion}>
        {contact.coordinate && (
          <Marker
            coordinate={contact.coordinate}
            title={contact.name}
            description={contact.address}
          >
            <View style={styles.markerContainer}>
              <Ionicons name="location" size={40} color="#FF3B30" />
            </View>
          </Marker>
        )}
      </MapView>

      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.card }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.name, { color: colors.text }]}>{contact.name}</Text>
        <Text style={[styles.address, { color: colors.subText }]}>{contact.address}</Text>
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call" size={20} color="#fff" />
          <Text style={styles.callText}>Gọi điện: {contact.phone}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  },
  markerContainer: { alignItems: 'center' },
  infoCard: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  address: { fontSize: 14, marginBottom: 15 },
  callButton: {
    flexDirection: 'row',
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  callText: { color: '#fff', fontWeight: 'bold' },
});
