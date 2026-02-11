import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, X } from 'lucide-react';
import Button from './common/Button';

const SecureCodeModal = ({ isOpen, onClose, code }) => {
    const [displayCode, setDisplayCode] = useState('0000');
    const [isGenerating, setIsGenerating] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setIsGenerating(true);
            let interval = setInterval(() => {
                setDisplayCode(Math.floor(1000 + Math.random() * 9000).toString());
            }, 50); // Fast rotation

            // Stop after 1.5 seconds and show real code
            const timeout = setTimeout(() => {
                clearInterval(interval);
                setDisplayCode(code);
                setIsGenerating(false);
            }, 1500);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [isOpen, code]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1100
        }}>
            <div className="glass" style={{
                background: 'rgba(30, 41, 59, 0.8)', // Darker glass background
                width: '90%', maxWidth: '400px',
                borderRadius: 'var(--radius-lg)', padding: '2rem',
                textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transform: 'scale(1)', animation: 'scaleIn 0.2s ease-out',
                color: 'white'
            }}>
                <div style={{
                    width: '60px', height: '60px', background: isGenerating ? 'rgba(56, 189, 248, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                    borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s'
                }}>
                    {isGenerating ?
                        <Lock size={30} className="animate-pulse" style={{ color: '#38bdf8' }} /> :
                        <ShieldCheck size={30} style={{ color: '#4ade80' }} />
                    }
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: 'white' }}>
                    {isGenerating ? 'Generating Secure Code...' : 'Ride Confirmed'}
                </h3>

                <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                    {isGenerating ? 'AI is creating a unique verification pin for your trip.' : 'Provide this code to your driver to start the journey.'}
                </p>

                <div style={{
                    fontSize: '3rem', fontWeight: '900', letterSpacing: '0.5rem',
                    color: isGenerating ? 'rgba(255, 255, 255, 0.3)' : '#4ade80',
                    fontFamily: 'monospace', margin: '1rem 0 2rem',
                    textShadow: isGenerating ? 'none' : '0 0 20px rgba(74, 222, 128, 0.5)'
                }}>
                    {displayCode}
                </div>

                {!isGenerating && (
                    <Button variant="primary" onClick={onClose} style={{ width: '100%', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold' }}>
                        I Understand
                    </Button>
                )}
            </div>
        </div>
    );
};

export default SecureCodeModal;
