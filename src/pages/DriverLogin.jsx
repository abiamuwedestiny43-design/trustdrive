import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, ShieldCheck, ArrowRight, Smartphone, Mail, Lock, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';

const DriverLogin = () => {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.role === 'driver') navigate('/driver-dashboard');
            else if (user.role === 'admin') navigate('/admin');
            else navigate('/');
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/driver-dashboard');
        } catch (err) {
            setError('Invalid credentials. Please check your email/password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f172a',
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(30, 203, 115, 0.05) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{ maxWidth: '900px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
                
                {/* Branding / Value Prop Side */}
                <div style={{ color: 'white', padding: '2rem' }} className="hidden-mobile">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ background: '#1ECB73', padding: '0.75rem', borderRadius: '12px' }}>
                            <Car size={32} color="white" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '1px' }}>TRUSTDRIVE <span style={{ color: '#1ECB73' }}>PRO</span></h2>
                    </div>
                    
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '1.5rem' }}>
                        Empowering <br /> 
                        <span style={{ color: '#1ECB73' }}>Nigeria's Elite</span> <br />
                        Captains.
                    </h1>
                    
                    <p style={{ fontSize: '1.1rem', opacity: 0.7, marginBottom: '2rem', maxWidth: '400px' }}>
                        Access your professional dashboard to manage rides, track earnings, and navigate the city with ease.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Feature icon={ShieldCheck} text="Verified Professional Network" />
                        <Feature icon={Sparkles} text="Premium Commission Rates" />
                        <Feature icon={Smartphone} text="Real-time Route Optimization" />
                    </div>
                </div>

                {/* Login Form Side */}
                <Card glass style={{ 
                    padding: '3rem', 
                    borderRadius: '32px', 
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)'
                }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ color: 'white', fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Captain Login</h3>
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Welcome back to your workspace.</p>
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div style={{ textAlign: 'right', marginBottom: '0.5rem' }}>
                            <Link to="#" style={{ color: '#1ECB73', fontSize: '0.85rem', textDecoration: 'none', fontWeight: '600' }}>Forgot Password?</Link>
                        </div>

                        <Button type="submit" disabled={loading} style={{ 
                            padding: '1.1rem', borderRadius: '16px', background: '#1ECB73', color: 'white', fontWeight: '800', fontSize: '1rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 10px 20px -5px rgba(30,203,115,0.4)'
                        }}>
                            {loading ? 'Authenticating...' : 'Access Console'} <ArrowRight size={20} />
                        </Button>
                    </form>

                    <div style={{ marginTop: '2.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                        Not a captain yet? <Link to="/setup" style={{ color: 'white', fontWeight: '700', textDecoration: 'none' }}>Apply to Drive</Link>
                    </div>
                </Card>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .hidden-mobile { display: none; }
                    div[style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

const Feature = ({ icon: Icon, text }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'rgba(255,255,255,0.8)' }}>
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(30, 203, 115, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={14} color="#1ECB73" />
        </div>
        <span style={{ fontSize: '0.95rem' }}>{text}</span>
    </div>
);

const inputStyle = {
    width: '100%',
    padding: '1.1rem 1.1rem 1.1rem 3.25rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box'
};

export default DriverLogin;
