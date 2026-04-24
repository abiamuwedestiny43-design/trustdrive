import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const STATUS_COLORS = {
    completed: '#1ECB73', pending: '#f59e0b',
    cancelled: '#ef4444', accepted: '#6366f1', in_progress: '#3b82f6'
};

export default function RidesScreen() {
    const [rides, setRides]           = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRides = async () => {
        try {
            const res = await axios.get(`${API}/bookings/my`);
            setRides(res.data.bookings || []);
        } catch (e) {}
    };

    useEffect(() => { fetchRides(); }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchRides();
        setRefreshing(false);
    };

    const renderRide = ({ item }) => (
        <View style={s.card}>
            <View style={s.cardHeader}>
                <Text style={s.date}>
                    {new Date(item.createdAt).toLocaleDateString('en-NG', { day:'numeric', month:'short' })}
                </Text>
                <View style={[s.badge, { backgroundColor: `${STATUS_COLORS[item.status]}22` }]}>
                    <Text style={[s.badgeText, { color: STATUS_COLORS[item.status] }]}>
                        {item.status?.replace('_',' ').toUpperCase()}
                    </Text>
                </View>
            </View>
            <Text style={s.route}>📍 {item.pickup}</Text>
            <Text style={s.arrow}>  ↓</Text>
            <Text style={s.route}>🏁 {item.dropoff}</Text>
            <View style={s.footer}>
                <Text style={s.dist}>{item.distance}</Text>
                <Text style={s.amount}>₦{item.amount?.toLocaleString()}</Text>
            </View>
        </View>
    );

    return (
        <View style={s.root}>
            <Text style={s.title}>My Rides</Text>
            <FlatList
                data={rides}
                keyExtractor={i => i._id}
                renderItem={renderRide}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1ECB73" />}
                ListEmptyComponent={<Text style={s.empty}>No rides yet. Go online to start!</Text>}
                contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
            />
        </View>
    );
}

const s = StyleSheet.create({
    root: { flex:1, backgroundColor:'#0f172a' },
    title: { color:'white', fontWeight:'900', fontSize:24, padding:20, paddingBottom:8 },
    card: { backgroundColor:'#1e293b', borderRadius:20, padding:18, marginBottom:12, borderWidth:1, borderColor:'#334155' },
    cardHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
    date: { color:'#94a3b8', fontSize:13, fontWeight:'600' },
    badge: { paddingHorizontal:10, paddingVertical:4, borderRadius:99 },
    badgeText: { fontSize:11, fontWeight:'800', letterSpacing:0.5 },
    route: { color:'white', fontSize:14, fontWeight:'600', marginBottom:2 },
    arrow: { color:'#1ECB73', fontSize:16, marginVertical:2 },
    footer: { flexDirection:'row', justifyContent:'space-between', marginTop:12, paddingTop:12, borderTopWidth:1, borderTopColor:'#334155' },
    dist: { color:'#64748b', fontSize:13 },
    amount: { color:'#1ECB73', fontWeight:'900', fontSize:18 },
    empty: { color:'#64748b', textAlign:'center', marginTop:60, fontSize:15 },
});
