import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    Switch, Alert, ScrollView, ActivityIndicator
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { locationSocket } from '../services/socket';

const API = 'http://localhost:5000/api';

export default function DashboardScreen() {
    const { driver }                        = useAuth();
    const mapRef                            = useRef(null);
    const [isOnline, setIsOnline]           = useState(false);
    const [location,  setLocation]          = useState(null);
    const [activeRide, setActiveRide]       = useState(null);
    const [pendingRides, setPendingRides]   = useState([]);
    const [loading,    setLoading]          = useState(false);
    const locationWatcher                   = useRef(null);

    // ── Request location permission on mount ──
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Location permission is needed to drive.');
                return;
            }
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLocation(loc.coords);
        })();

        // Connect socket
        locationSocket.connect(driver.id);

        return () => {
            locationWatcher.current?.remove();
            locationSocket.disconnect();
        };
    }, []);

    // ── Start/stop sending live location ──
    useEffect(() => {
        if (isOnline) {
            startWatchingLocation();
            updateOnlineStatus(true);
            fetchPendingRides();
        } else {
            locationWatcher.current?.remove();
            updateOnlineStatus(false);
            setPendingRides([]);
        }
    }, [isOnline]);

    const startWatchingLocation = async () => {
        locationWatcher.current = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 10 },
            (loc) => {
                const { latitude: lat, longitude: lng } = loc.coords;
                setLocation({ latitude: lat, longitude: lng });

                // ── SEND LIVE LOCATION TO SERVER (Uber pattern) ──
                locationSocket.sendLocation({
                    lat, lng,
                    bookingId: activeRide?.id,
                });

                // Also update server REST endpoint
                axios.patch(`${API}/drivers/location`, { lat, lng }).catch(() => {});
            }
        );
    };

    const updateOnlineStatus = async (online) => {
        try {
            await axios.patch(`${API}/drivers/status`, { isOnline: online });
        } catch (e) { /* offline mode */ }
    };

    const fetchPendingRides = async () => {
        try {
            const res = await axios.get(`${API}/bookings/pending`);
            setPendingRides(res.data.bookings || []);
        } catch (e) { /* offline */ }
    };

    const acceptRide = async (booking) => {
        setLoading(true);
        try {
            await axios.patch(`${API}/bookings/${booking._id}/status`, { status: 'accepted' });
            locationSocket.updateBookingStatus({ bookingId: booking._id, status: 'accepted' });
            setActiveRide(booking);
            setPendingRides([]);
        } catch (e) {
            Alert.alert('Error', 'Could not accept ride');
        } finally {
            setLoading(false);
        }
    };

    const completeRide = async () => {
        if (!activeRide) return;
        setLoading(true);
        try {
            await axios.patch(`${API}/bookings/${activeRide._id}/status`, { status: 'completed' });
            locationSocket.updateBookingStatus({ bookingId: activeRide._id, status: 'completed' });
            setActiveRide(null);
            Alert.alert('✅ Ride Completed', 'Great job! Earnings updated.');
        } catch (e) {
            Alert.alert('Error', 'Could not complete ride');
        } finally {
            setLoading(false);
        }
    };

    const defaultRegion = {
        latitude:      location?.latitude  || 6.5244,
        longitude:     location?.longitude || 3.3792,
        latitudeDelta:  0.01,
        longitudeDelta: 0.01,
    };

    return (
        <View style={s.root}>
            {/* ── MAP ── */}
            <MapView ref={mapRef} style={s.map} region={defaultRegion} showsUserLocation showsMyLocationButton>
                {location && (
                    <>
                        <Marker
                            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                            title="You"
                        >
                            <View style={s.driverMarker}>
                                <Text style={{ fontSize: 20 }}>🚗</Text>
                            </View>
                        </Marker>
                        <Circle
                            center={{ latitude: location.latitude, longitude: location.longitude }}
                            radius={200}
                            fillColor="rgba(30,203,115,0.08)"
                            strokeColor="rgba(30,203,115,0.4)"
                            strokeWidth={1.5}
                        />
                    </>
                )}
            </MapView>

            {/* ── STATUS HEADER ── */}
            <View style={s.header}>
                <View>
                    <Text style={s.greeting}>Hey, {driver?.name?.split(' ')[0] || 'Driver'} 👋</Text>
                    <Text style={[s.statusText, { color: isOnline ? '#1ECB73' : '#ef4444' }]}>
                        {isOnline ? '● Online – You are visible to riders' : '○ Offline – Go online to get rides'}
                    </Text>
                </View>
                <Switch
                    value={isOnline}
                    onValueChange={setIsOnline}
                    trackColor={{ false: '#334155', true: '#1ECB73' }}
                    thumbColor="white"
                />
            </View>

            {/* ── ACTIVE RIDE CARD ── */}
            {activeRide && (
                <View style={s.activeCard}>
                    <Text style={s.cardLabel}>🟢 ACTIVE RIDE</Text>
                    <Text style={s.rideName}>{activeRide.rider?.name || 'Rider'}</Text>
                    <Text style={s.rideRoute}>📍 {activeRide.pickup}</Text>
                    <Text style={s.rideRoute}>🏁 {activeRide.dropoff}</Text>
                    <Text style={s.rideAmount}>₦{activeRide.amount?.toLocaleString()}</Text>
                    <TouchableOpacity style={s.completeBtn} onPress={completeRide} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.completeBtnText}>Mark as Completed ✓</Text>}
                    </TouchableOpacity>
                </View>
            )}

            {/* ── PENDING RIDES ── */}
            {isOnline && !activeRide && pendingRides.length > 0 && (
                <View style={s.pendingContainer}>
                    <Text style={s.pendingTitle}>🚗 Available Rides ({pendingRides.length})</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {pendingRides.map(ride => (
                            <View key={ride._id} style={s.rideCard}>
                                <Text style={s.rideCardRoute}>{ride.pickup}</Text>
                                <Text style={s.rideCardArrow}>↓</Text>
                                <Text style={s.rideCardRoute}>{ride.dropoff}</Text>
                                <Text style={s.rideCardAmount}>₦{ride.amount?.toLocaleString()}</Text>
                                <Text style={s.rideCardDist}>{ride.distance}</Text>
                                <TouchableOpacity style={s.acceptBtn} onPress={() => acceptRide(ride)} disabled={loading}>
                                    <Text style={s.acceptBtnText}>Accept</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* ── OFFLINE MESSAGE ── */}
            {!isOnline && (
                <View style={s.offlineMsg}>
                    <Text style={s.offlineMsgText}>Toggle Online above to start receiving ride requests</Text>
                </View>
            )}
        </View>
    );
}

const s = StyleSheet.create({
    root:            { flex: 1, backgroundColor: '#0f172a' },
    map:             { flex: 1 },
    header:          { position: 'absolute', top: 56, left: 16, right: 16, backgroundColor: 'rgba(15,23,42,0.92)', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#1e293b' },
    greeting:        { color: 'white', fontWeight: '800', fontSize: 16 },
    statusText:      { fontSize: 12, fontWeight: '600', marginTop: 2 },
    driverMarker:    { backgroundColor: '#1ECB73', borderRadius: 20, padding: 6, borderWidth: 2, borderColor: 'white' },
    activeCard:      { position: 'absolute', bottom: 24, left: 16, right: 16, backgroundColor: '#0f172a', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#1ECB73' },
    cardLabel:       { color: '#1ECB73', fontWeight: '700', fontSize: 11, letterSpacing: 1, marginBottom: 8 },
    rideName:        { color: 'white', fontWeight: '800', fontSize: 20, marginBottom: 8 },
    rideRoute:       { color: '#94a3b8', fontSize: 14, marginBottom: 4 },
    rideAmount:      { color: '#1ECB73', fontWeight: '900', fontSize: 22, marginVertical: 12 },
    completeBtn:     { backgroundColor: '#1ECB73', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
    completeBtnText: { color: 'white', fontWeight: '800', fontSize: 16 },
    pendingContainer:{ position: 'absolute', bottom: 24, left: 0, right: 0, paddingHorizontal: 16 },
    pendingTitle:    { color: 'white', fontWeight: '700', marginBottom: 10, fontSize: 14 },
    rideCard:        { backgroundColor: '#1e293b', borderRadius: 20, padding: 16, marginRight: 12, width: 200, borderWidth: 1, borderColor: '#334155' },
    rideCardRoute:   { color: 'white', fontWeight: '600', fontSize: 13 },
    rideCardArrow:   { color: '#1ECB73', fontSize: 18, textAlign: 'center', marginVertical: 4 },
    rideCardAmount:  { color: '#1ECB73', fontWeight: '900', fontSize: 20, marginTop: 8 },
    rideCardDist:    { color: '#64748b', fontSize: 12, marginBottom: 12 },
    acceptBtn:       { backgroundColor: '#1ECB73', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
    acceptBtnText:   { color: 'white', fontWeight: '800' },
    offlineMsg:      { position: 'absolute', bottom: 32, left: 24, right: 24, backgroundColor: 'rgba(15,23,42,0.85)', borderRadius: 16, padding: 16, alignItems: 'center' },
    offlineMsgText:  { color: '#64748b', textAlign: 'center', fontWeight: '500' },
});
