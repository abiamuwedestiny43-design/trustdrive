import React from 'react';
import { Phone, MessageCircle, AlertTriangle } from 'lucide-react';

const FloatingActions = ({ userType = 'user', style = {} }) => {
    const handleSOS = () => {
        if (confirm("EMERGENCY: Call 112 immediately?")) {
            window.location.href = 'tel:112';
        }
    };

    const handleSupport = () => {
        // WhatsApp Support Link (Placeholder)
        window.open('https://wa.me/2348000000000?text=I%20need%20support%20with%20TrustDrive', '_blank');
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 9999,
            ...style
        }}>
            {/* Chat Support */}
            <button
                onClick={handleSupport}
                style={{
                    width: '50px', height: '50px', borderRadius: '50%',
                    background: '#2563eb', color: 'white', border: 'none',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'transform 0.2s',
                    position: 'relative'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                title="Support Chat"
            >
                <MessageCircle size={22} />
            </button>

            {/* SOS Button - Highly Visible (Red) */}
            <button
                onClick={handleSOS}
                style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: '#dc2626', color: 'white',
                    border: '3px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 4px 15px rgba(220, 38, 38, 0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    animation: 'pulseSOS 2s infinite'
                }}
                title="Emergency SOS"
            >
                <Phone size={24} fill="white" />
            </button>
            <style>{`
                @keyframes pulseSOS {
                    0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); transform: scale(1); }
                    50% { transform: scale(1.05); }
                    70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default FloatingActions;
