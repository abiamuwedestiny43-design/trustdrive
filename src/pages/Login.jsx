import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { User, ShieldCheck, Car } from 'lucide-react';

const Login = () => {
    const { login, signup, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // State
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Driver Specific State
    const [phone, setPhone] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehicleColor, setVehicleColor] = useState('');
    const [licensePlate, setLicensePlate] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isDriverLogin = location.pathname.includes('driver');
    const isAdminLogin = location.pathname.includes('admin');
    const isDriverSignup = isSignUp && isDriverLogin;

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'driver') navigate('/driver-dashboard');
            else navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                // Determine role based on current page context
                const role = isAdminLogin ? 'admin' : isDriverLogin ? 'driver' : 'user';

                const additionalData = {};
                if (role === 'driver') {
                    additionalData.phone = phone;
                    additionalData.vehicleModel = vehicleModel;
                    additionalData.vehicleColor = vehicleColor;
                    additionalData.licensePlate = licensePlate;
                    // Create a composite string for easy display
                    additionalData.carDetails = `${vehicleModel} (${vehicleColor}) - ${licensePlate}`;
                }

                await signup(email, password, name, role, additionalData);
            } else {
                await login(email, password);
            }
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/invalid-credential') {
                if (['admin@trustdrive.com', 'driver@trustdrive.com', 'user@trustdrive.com'].includes(email)) {
                    setError('demo_setup_needed');
                } else {
                    setError('Invalid email or password.');
                }
            } else if (err.code === 'auth/email-already-in-use') {
                setError('Email is already registered.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.');
            } else {
                setError('Failed to sign in. Please try again.');
            }
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'url(/trust-drive-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            position: 'relative',
        }}>
            {/* Dark Overlay */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.7))',
                zIndex: 0
            }}></div>

            {/* AI Grid Overlay */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                zIndex: 0,
                pointerEvents: 'none'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <Card glass style={{ width: '400px', padding: '2.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: isAdminLogin ? 'var(--danger)' : isDriverLogin ? 'var(--primary)' : 'var(--accent)',
                            borderRadius: '16px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            marginBottom: '1rem',
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            {isAdminLogin ? <ShieldCheck size={32} /> : isDriverLogin ? <Car size={32} /> : <User size={32} />}
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>
                            {isAdminLogin ? 'Admin Portal' : isDriverLogin ? 'Driver Portal' : 'User Login'}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {isSignUp
                                ? `Create your ${isAdminLogin ? 'Admin' : isDriverLogin ? 'Driver' : 'User'} account`
                                : (isAdminLogin ? 'System Management Access' : isDriverLogin ? 'Accept rides and earn.' : 'Welcome back to TrustDrive.')
                            }
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            background: error === 'demo_setup_needed' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: error === 'demo_setup_needed' ? 'var(--accent)' : 'var(--danger)',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1rem',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            border: error === 'demo_setup_needed' ? '1px solid var(--accent)' : 'none'
                        }}>
                            {error === 'demo_setup_needed' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ fontWeight: '600' }}>⚠️ Account Not Found</span>
                                    <span>Using a demo email? You must create the accounts first.</span>
                                    <Link to="/setup" style={{ width: '100%', textDecoration: 'none' }}>
                                        <Button variant="secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
                                            Run Setup Wizard
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                error
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {isSignUp && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <Input
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                                {isDriverSignup && (
                                    <>
                                        <Input
                                            type="tel"
                                            placeholder="Phone Number"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            required
                                        />
                                        <Input
                                            placeholder="Vehicle Model (e.g. Toyota Camry)"
                                            value={vehicleModel}
                                            onChange={e => setVehicleModel(e.target.value)}
                                            required
                                        />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                            <Input
                                                placeholder="Color"
                                                value={vehicleColor}
                                                onChange={e => setVehicleColor(e.target.value)}
                                                required
                                            />
                                            <Input
                                                placeholder="License Plate"
                                                value={licensePlate}
                                                onChange={e => setLicensePlate(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        <Input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            style={{ marginTop: isSignUp ? '0.5rem' : '0' }}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                                backgroundColor: isAdminLogin ? 'var(--danger)' : isDriverLogin ? 'var(--primary)' : 'var(--accent)'
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                        </Button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        <span
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError('');
                            }}
                            style={{
                                color: 'var(--primary)',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginLeft: '0.5rem'
                            }}
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </span>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
