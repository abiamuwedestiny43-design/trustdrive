import React from 'react';
import BookingForm from '../components/BookingForm';
import { Sparkles, Shield, Clock, ChevronDown } from 'lucide-react';


const Home = () => {
    const scrollToDriverView = () => {
        const element = document.getElementById('driver-view');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="animate-fade-in" style={{
            backgroundImage: 'url(/hero-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            position: 'relative'
        }}>


            {/* Responsive Styles */}
            <style>{`
                .hero-section {
                    padding: 6rem 0 8rem;
                }
                .hero-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    align-items: center;
                    width: 100%;
                }
                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                }
                .hero-h1 {
                    font-size: 4.5rem;
                }
                
                @media (max-width: 768px) {
                    .hero-section {
                        padding: 4rem 0 6rem;
                    }
                    .hero-grid {
                        grid-template-columns: 1fr; /* Stack vertically */
                        gap: 3rem;
                    }
                    .features-grid {
                        grid-template-columns: 1fr; /* Stack vertically */
                    }
                    .hero-h1 {
                        font-size: 3rem; /* Smaller font for mobile */
                    }
                    /* Re-order hero content on mobile so image/text is first */
                    .hero-content {
                        order: 1;
                    }
                    .booking-form-container {
                        order: 2;
                        width: 100%;
                    }
                }
            `}</style>
            {/* Hero Section */}
            <section className="hero-section" style={{
                position: 'relative',
                minHeight: '100vh',
                overflow: 'hidden',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                zIndex: 2
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', width: '100%' }}>

                        {/* Left Content */}
                        <div style={{ maxWidth: '600px' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#34D399',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                borderRadius: 'var(--radius-full)',
                                marginBottom: '1.5rem',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                backdropFilter: 'blur(4px)'
                            }}>
                                <Sparkles size={16} /> Premium Mobility
                            </div>
                            <h1 style={{
                                fontSize: '4.5rem',
                                lineHeight: '1.1',
                                fontWeight: '800',
                                color: '#000000',
                                marginBottom: '1.5rem',
                                letterSpacing: '-0.02em',
                            }}>
                                Trust the <span style={{ color: '#059669' }}>Drive.</span><br />
                                Arrive in Style.
                            </h1>
                            <p style={{ fontSize: '1.25rem', color: '#334155', lineHeight: '1.6', maxWidth: '90%', fontWeight: '600' }}>
                                Experience the future of mobility with our safe and comfortable fleet. Secure, reliable, and always on time.
                            </p>

                            <button
                                onClick={scrollToDriverView}
                                className="animate-bounce"
                                style={{
                                    marginTop: '3rem',
                                    background: 'transparent',
                                    border: '2px solid #0f172a', /* Dark border */
                                    color: '#0f172a', /* Dark icon */
                                    padding: '1rem',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#059669';
                                    e.currentTarget.style.color = '#059669';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#0f172a';
                                    e.currentTarget.style.color = '#0f172a';
                                }}
                            >
                                <ChevronDown size={24} />
                            </button>
                        </div>

                        {/* Right Content (Booking Form) */}
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <BookingForm />
                        </div>
                    </div>
                </div>
            </section>



            {/* New Driver View Section */}
            <section id="driver-view" style={{
                minHeight: '60vh',
                position: 'relative',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0f172a', /* Dark text */
                zIndex: 2,
                paddingBottom: '4rem'
            }}>
                {/* Gradient Overlay for separation if needed, but keeping it clean for now as requested */}

                <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        color: '#000000'
                    }}>
                        Advanced Navigation Tech
                    </h2>
                    <p style={{
                        fontSize: '1.5rem',
                        maxWidth: '700px',
                        margin: '0 auto',
                        color: '#334155',
                        fontWeight: '500'
                    }}>
                        Every ride is powered by state-of-the-art GPS and route optimization, ensuring you get there fast and safe.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section style={{
                padding: '6rem 0',
                /* Keep this one dark solid/gradient as it might separate the footer better */
                background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 1))',
                position: 'relative',
                zIndex: 2
            }}>
                <div className="container">
                    <div className="features-grid">
                        <FeatureCard
                            icon={Shield}
                            title="Secure Rides"
                            desc="Verified drivers and real-time tracking for your peace of mind."
                        />
                        <FeatureCard
                            icon={Sparkles}
                            title="Premium Comfort"
                            desc="Clean, high-end vehicles ensuring a relaxing journey."
                        />
                        <FeatureCard
                            icon={Clock}
                            title="Always On Time"
                            desc="Punctuality is our promise. We value your time."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div style={{
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        transition: 'var(--transition-normal)'
    }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
        <Icon size={32} color="#34D399" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: 'white' }}>{title}</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{desc}</p>
    </div>
);

export default Home;
