import React from 'react';
import { Link } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { Sparkles, Shield, Clock, ChevronDown, User, Bell, Settings, MapPin, CreditCard, HelpCircle, History, Car, ArrowRight } from 'lucide-react';
import LiveRiderMap from '../components/LiveRiderMap';

const Home = () => {
    const scrollToDriverView = () => {
        const element = document.getElementById('driver-view');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="animate-fade-in" style={{
            backgroundColor: '#0f172a',
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Live Map Background System */}
            <LiveRiderMap />


            {/* Responsive Styles */}
            <style>{`
                .hero-section {
                    padding: 8rem 0 6rem;
                }
                .hero-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2rem;
                    align-items: center;
                    width: 100%;
                    text-align: center;
                }
                @media (max-width: 1024px) {
                    .hero-section {
                        padding: 6rem 0 4rem;
                    }
                }
            `}</style>

            {/* Hero Section */}
            <section className="hero-section" style={{ position: 'relative', zIndex: 10 }}>
                <div className="container">
                    <div className="hero-grid" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                        {/* Content wrapped in modern glass card */}
                        <div className="hero-content-wrapper" style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(300px, 1fr)', 
                            gap: '4rem', 
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: '1200px',
                            background: 'rgba(15, 23, 42, 0.4)',
                            backdropFilter: 'blur(8px)',
                            padding: '3rem',
                            borderRadius: '32px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}>
                            <div className="left-text-content" style={{ color: 'white', textAlign: 'left' }}>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    background: '#1ECB73',
                                    color: 'white',
                                    borderRadius: 'var(--radius-full)',
                                    marginBottom: '1rem',
                                    fontWeight: '700',
                                    fontSize: '0.8rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    <Sparkles size={16} /> Live in Nigeria
                                </div>
                                <h1 style={{
                                    fontSize: 'clamp(3rem, 6vw, 4rem)',
                                    lineHeight: '1.1',
                                    fontWeight: '900',
                                    marginBottom: '1.5rem',
                                    letterSpacing: '-0.04em',
                                    color: 'white'
                                }}>
                                    Your Premium <br/> <span style={{ color: '#1ECB73' }}>Ride is Ready.</span>
                                </h1>
                                <p style={{ fontSize: '1.2rem', opacity: 0.8, lineHeight: '1.6', maxWidth: '450px', fontWeight: '400' }}>
                                    Experience the future of mobility. Real-time tracking, elite drivers, and instant bookings at your fingertips.
                                </p>
                            </div>

                            <div className="right-form-container">
                                <BookingForm />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Logos / Partners Section */}
            <div style={{ 
                position: 'relative', 
                zIndex: 10, 
                background: 'rgba(15, 23, 42, 0.6)', 
                backdropFilter: 'blur(12px)',
                padding: '2rem 0',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                <div className="container">
                    <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '4rem',
                        opacity: 0.6
                    }}>
                        <LogoItem name="NIGERIA TECH" />
                        <LogoItem name="LAGOS METRO" />
                        <LogoItem name="AIR NIGERIA" />
                        <LogoItem name="SAFE TRIP" />
                        <LogoItem name="CITY LINK" />
                    </div>
                </div>
            </div>

            {/* Down Arrow Indicator */}
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 10, margin: '2rem 0' }}>
                <button
                    onClick={scrollToDriverView}
                    className="animate-bounce"
                    style={{
                        background: 'white',
                        color: '#0CC05A',
                        padding: '1rem',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                >
                    <ChevronDown size={24} />
                </button>
            </div>

            {/* Features Section */}
            <section id="driver-view" style={{
                padding: '6rem 0',
                background: 'white',
                position: 'relative',
                zIndex: 2,
                marginTop: '4rem'
            }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>Advanced Navigation Tech</h2>
                        <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>Every ride is powered by state-of-the-art GPS and route optimization, ensuring you get there fast and safe.</p>
                    </div>
                    <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <FeatureCard icon={Shield} title="Secure Rides" desc="Verified drivers and real-time tracking for your peace of mind." />
                        <FeatureCard icon={Sparkles} title="Premium Comfort" desc="Clean, high-end vehicles ensuring a relaxing journey." />
                        <FeatureCard icon={Clock} title="Always On Time" desc="Punctuality is our promise. We value your time." />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div style={{
        padding: '2.5rem',
        borderRadius: '1.5rem',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer'
    }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.05)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
        <div style={{ width: '60px', height: '60px', borderRadius: '1rem', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
           <Icon size={32} color="#0CC05A" />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: '#0f172a' }}>{title}</h3>
        <p style={{ color: '#64748b', lineHeight: '1.6' }}>{desc}</p>
    </div>
);

const LogoItem = ({ name }) => (
    <div style={{ 
        color: 'white', 
        fontWeight: '900', 
        fontSize: '1rem', 
        letterSpacing: '2px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
     }}>
        <div style={{ width: '12px', height: '12px', background: '#1ECB73', borderRadius: '2px' }}></div>
        {name}
    </div>
);

export default Home;

