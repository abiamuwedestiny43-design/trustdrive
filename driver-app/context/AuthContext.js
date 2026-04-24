import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API = 'http://localhost:5000/api'; // Change to your server IP for physical device

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [driver, setDriver]   = useState(null);
    const [token,  setToken]    = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restore session
        (async () => {
            const saved = await AsyncStorage.getItem('driver_token');
            const savedUser = await AsyncStorage.getItem('driver_user');
            if (saved && savedUser) {
                setToken(saved);
                setDriver(JSON.parse(savedUser));
                axios.defaults.headers.common['Authorization'] = `Bearer ${saved}`;
            }
            setLoading(false);
        })();
    }, []);

    const sendOtp = async (phone) => {
        const res = await axios.post(`${API}/auth/send-otp`, { phone });
        return res.data;
    };

    const verifyOtp = async (phone, otp) => {
        const res = await axios.post(`${API}/auth/verify-otp`, { phone, otp });
        const { token: t, user } = res.data;
        setToken(t);
        setDriver(user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
        await AsyncStorage.setItem('driver_token', t);
        await AsyncStorage.setItem('driver_user', JSON.stringify(user));
        return res.data;
    };

    const logout = async () => {
        setDriver(null);
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
        await AsyncStorage.multiRemove(['driver_token', 'driver_user']);
    };

    return (
        <AuthContext.Provider value={{ driver, token, loading, sendOtp, verifyOtp, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
