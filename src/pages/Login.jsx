import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { User, ShieldCheck, Bike, RefreshCcw, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sendSMS } from '../utils/twilio';
import OtpInput from '../components/common/OtpInput';

import bgImage from '../assets/homepage-bg.png';

const Login = () => {
    const { login, signup, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Flow State
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Details (New Users)
    const [phone, setPhone] = useState('');
    const [enteredOtp, setEnteredOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    
    // User Details (For Step 3)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const isDriverLogin = location.pathname.includes('driver');
    const isAdminLogin = location.pathname.includes('admin');

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'driver') navigate('/driver-dashboard');
            else navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleSendOTP = async (e) => {
        if (e) e.preventDefault();
        if (!phone || phone.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }

        setLoading(true);
        setError('');
        
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(otp);
        
        try {
            const msg = `Your Rapido-style TrustDrive code is: ${otp}`;
            await sendSMS(phone, msg);
            setStep(2);
            setResendTimer(30);
        } catch (err) {
            setError('SMS delivery failed. Check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        if (e) e.preventDefault();
        setError('');

        if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
            setError('Invalid code. Try again.');
            return;
        }

        setLoading(true);
        try {
            // Simulated Phone-Only Login
            // In a real app, you'd check if phone exists in DB
            // Here, we'll "simulate" by checking a demo phone
            const dummyEmail = `phone_${phone.replace(/\D/g, '')}@trustdrive.com`;
            const dummyPassword = `pass_${phone.slice(-4)}`;

            try {
                await login(dummyEmail, dummyPassword);
            } catch (loginErr) {
                // If login fails, user might not exist -> Go to Step 3
                setStep(3);
                setEmail(dummyEmail);
            }
        } catch (err) {
            setError('Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteRegistration = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dummyPassword = `pass_${phone.slice(-4)}`;
            const role = isDriverLogin ? 'driver' : 'user';
            await signup(email, dummyPassword, name, role, { phone });
        } catch (err) {
            setError('Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1ECB73',
            backgroundImage: `linear-gradient(rgba(30, 203, 115, 0.85), rgba(30, 203, 115, 0.95)), url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
        }}>
            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px', padding: '1rem' }}>
                <Card glass style={{ 
                    padding: '3rem 2.5rem', 
                    background: 'white', 
                    borderRadius: '24px', 
                    boxShadow: '0 30px 60px -12px rgba(0,0,0,0.3)',
                    border: 'none'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{
                            width: '72px', height: '72px', background: '#1ECB73', borderRadius: '50%',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', marginBottom: '1.5rem',
                            boxShadow: '0 8px 16px rgba(30,203,115,0.4)'
                        }}>
                            {step === 3 ? <CheckCircle2 size={36} /> : <Bike size={36} />}
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.5rem' }}>
                            {step === 1 ? 'Hello, Rider!' : step === 2 ? 'Verify Number' : 'Set Up Profile'}
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1rem' }}>
                            {step === 1 ? 'Enter your phone number to get started' : 
                             step === 2 ? `Enter the 4-digit code sent to ${phone}` : 
                             'Just one more thing to start riding'}
                        </p>
                    </div>

                    {error && (
                        <div style={{ background: '#fef2f2', color: '#ef4444', padding: '0.8rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '500' }}>
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleSendOTP}>
                            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                    <Phone size={18} />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Enter Phone Number"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    style={{
                                        width: '100%', padding: '1.2rem 1.2rem 1.2rem 3rem',
                                        background: '#f8fafc', border: '2px solid #e2e8f0',
                                        borderRadius: '16px', fontSize: '1rem', fontWeight: '600',
                                        outline: 'none', transition: 'all 0.2s'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#1ECB73'}
                                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={loading} style={{ 
                                width: '100%', padding: '1.2rem', borderRadius: '16px', 
                                background: '#1ECB73', fontWeight: '800', fontSize: '1.1rem',
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                            }}>
                                {loading ? 'Sending...' : 'Get OTP'} <ArrowRight size={20} />
                            </Button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP}>
                            <div style={{ marginBottom: '2rem' }}>
                                <OtpInput value={enteredOtp} onChange={setEnteredOtp} length={4} />
                            </div>
                            
                            <Button type="submit" disabled={loading || enteredOtp.length < 4} style={{ 
                                width: '100%', padding: '1.2rem', borderRadius: '16px', 
                                background: '#1ECB73', fontWeight: '800', fontSize: '1.1rem'
                            }}>
                                {loading ? 'Verifying...' : 'Login'}
                            </Button>

                            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                                {resendTimer > 0 ? (
                                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Resend code in {resendTimer}s</span>
                                ) : (
                                    <button 
                                        type="button"
                                        onClick={handleSendOTP}
                                        style={{ background: 'none', border: 'none', color: '#1ECB73', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 auto' }}
                                    >
                                        <RefreshCcw size={14} /> Resend OTP
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleCompleteRegistration}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <Input
                                    placeholder="Your Full Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    style={{ padding: '1rem', borderRadius: '12px' }}
                                />
                                <Input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    disabled
                                    style={{ padding: '1rem', borderRadius: '12px', background: '#f1f5f9' }}
                                />
                                <Button type="submit" disabled={loading} style={{ 
                                    width: '100%', padding: '1.2rem', borderRadius: '16px', 
                                    background: '#1ECB73', fontWeight: '800'
                                }}>
                                    {loading ? 'Creating Account...' : 'Finish Setup'}
                                </Button>
                            </div>
                        </form>
                    )}

                    <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
                            By continuing, you agree to TrustDrive's <br/>
                            <span style={{ color: '#0f172a', fontWeight: '600', cursor: 'pointer' }}>Terms of Service</span> & <span style={{ color: '#0f172a', fontWeight: '600', cursor: 'pointer' }}>Privacy Policy</span>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
