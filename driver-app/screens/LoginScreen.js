import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, KeyboardAvoidingView,
    Platform, Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
    const { sendOtp, verifyOtp } = useAuth();
    const [step, setStep]       = useState(1); // 1=phone, 2=otp
    const [phone, setPhone]     = useState('');
    const [otp,   setOtp]       = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        if (phone.length < 10) return Alert.alert('Error', 'Enter a valid phone number');
        setLoading(true);
        try {
            const res = await sendOtp(phone);
            console.log('OTP sent:', res.dev_otp); // visible in dev
            setStep(2);
            Alert.alert('OTP Sent', `Code sent to ${phone}${res.dev_otp ? `\n\n[DEV] Code: ${res.dev_otp}` : ''}`);
        } catch (e) {
            Alert.alert('Error', e?.response?.data?.error || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length < 4) return Alert.alert('Error', 'Enter the 4-digit code');
        setLoading(true);
        try {
            await verifyOtp(phone, otp);
            // AuthContext sets driver → App.jsx auto-navigates to Dashboard
        } catch (e) {
            Alert.alert('Error', e?.response?.data?.error || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={s.card}>
                {/* Logo */}
                <View style={s.logoCircle}>
                    <Text style={s.logoText}>TD</Text>
                </View>
                <Text style={s.title}>TrustDrive Driver</Text>
                <Text style={s.subtitle}>
                    {step === 1 ? 'Enter your phone number to continue' : `Enter the code sent to ${phone}`}
                </Text>

                {step === 1 ? (
                    <>
                        <View style={s.inputWrap}>
                            <Text style={s.inputIcon}>📞</Text>
                            <TextInput
                                style={s.input}
                                placeholder="+234 801 234 5678"
                                placeholderTextColor="#94a3b8"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                                autoFocus
                            />
                        </View>
                        <TouchableOpacity style={s.btn} onPress={handleSendOtp} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Get OTP →</Text>}
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        {/* 4 OTP Boxes */}
                        <View style={s.otpRow}>
                            {[0,1,2,3].map(i => (
                                <View key={i} style={[s.otpBox, otp[i] && s.otpBoxFilled]}>
                                    <Text style={s.otpDigit}>{otp[i] || ''}</Text>
                                </View>
                            ))}
                        </View>
                        {/* Hidden real input behind OTP boxes */}
                        <TextInput
                            style={s.hiddenInput}
                            keyboardType="number-pad"
                            maxLength={4}
                            value={otp}
                            onChangeText={setOtp}
                            autoFocus
                        />
                        <TouchableOpacity style={s.btn} onPress={handleVerifyOtp} disabled={loading || otp.length < 4}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Verify & Login</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setStep(1); setOtp(''); }} style={s.backBtn}>
                            <Text style={s.backBtnText}>← Change Number</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 24 },
    card: { width: '100%', maxWidth: 380, backgroundColor: '#1e293b', borderRadius: 28, padding: 32, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
    logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1ECB73', justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: '#1ECB73', shadowOpacity: 0.5, shadowRadius: 15, elevation: 8 },
    logoText: { color: 'white', fontWeight: '900', fontSize: 26, letterSpacing: 1 },
    title: { fontSize: 24, fontWeight: '900', color: 'white', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 32, lineHeight: 20 },
    inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', borderRadius: 16, borderWidth: 2, borderColor: '#334155', paddingHorizontal: 16, marginBottom: 20, width: '100%' },
    inputIcon: { fontSize: 18, marginRight: 10 },
    input: { flex: 1, height: 56, fontSize: 17, fontWeight: '600', color: 'white' },
    btn: { width: '100%', backgroundColor: '#1ECB73', borderRadius: 16, paddingVertical: 16, alignItems: 'center', shadowColor: '#1ECB73', shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
    btnText: { color: 'white', fontWeight: '800', fontSize: 17 },
    otpRow: { flexDirection: 'row', gap: 12, marginBottom: 8, justifyContent: 'center' },
    otpBox: { width: 64, height: 72, borderRadius: 16, backgroundColor: '#0f172a', borderWidth: 2, borderColor: '#334155', justifyContent: 'center', alignItems: 'center' },
    otpBoxFilled: { borderColor: '#1ECB73', backgroundColor: '#022c22' },
    otpDigit: { fontSize: 28, fontWeight: '900', color: 'white' },
    hiddenInput: { position: 'absolute', opacity: 0, height: 0 },
    backBtn: { marginTop: 20 },
    backBtnText: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },
});
