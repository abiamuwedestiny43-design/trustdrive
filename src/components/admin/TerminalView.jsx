import React from 'react';
import image from '../../assets/airport-terminal.jpg';
import { Video, MapPin, CarFront } from 'lucide-react';

const TerminalView = () => {
    return (
        <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            height: '300px',
            boxShadow: 'var(--shadow-lg)',
            marginTop: '2rem'
        }}>
            {/* Background Image */}
            <img
                src={image}
                alt="Airport Terminal Taxi Stand"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.8)'
                }}
            />

            {/* Overlay: Live Badge */}
            <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                background: 'rgba(220, 38, 38, 0.9)',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
                <div className="animate-pulse" style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }}></div>
                LIVE FEED • TERMINAL 1
            </div>

            {/* Overlay: Stats Stats */}
            <div className="glass-dark" style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                right: '1rem',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '0.5rem',
                        borderRadius: '50%'
                    }}>
                        <MapPin size={24} color="var(--accent)" />
                    </div>
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '1rem', color: 'white' }}>Airport Taxi Queue</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Sector 4 • International Wing</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent)' }}>24</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Queued</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--success)' }}>12</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Dispatched</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--warning)' }}>5 min</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Avg Wait</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminalView;
