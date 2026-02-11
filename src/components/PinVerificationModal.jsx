import React, { useState } from 'react';
import { X, ShieldCheck, Lock } from 'lucide-react';
import Button from './common/Button';
import Input from './common/Input';

const PinVerificationModal = ({ isOpen, onClose, onVerify, expectedPin }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pin === expectedPin) {
            setSuccess(true);
            setTimeout(() => {
                onVerify();
                setPin('');
                setSuccess(false);
            }, 1000); // Wait for success animation
        } else {
            setError(true);
            setTimeout(() => setError(false), 500); // Reset shake
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className={`glass ${error ? 'animate-shake' : 'animate-slide-in'}`} style={{
                background: 'rgba(15, 23, 42, 0.95)', width: '90%', maxWidth: '380px',
                borderRadius: '24px', padding: '2rem',
                position: 'relative', textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                color: 'white'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1.25rem', right: '1.25rem',
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '5px'
                    }}
                >
                    <X size={24} color="rgba(255,255,255,0.4)" />
                </button>

                {success ? (
                    <div style={{ padding: '2rem 0' }} className="animate-fade-in-up">
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)'
                        }}>
                            <ShieldCheck size={40} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>Verified!</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>Trip Started Successfully</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '50%',
                            background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem', border: '1px solid rgba(56, 189, 248, 0.2)'
                        }}>
                            <Lock size={28} />
                        </div>

                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: 'white' }}>
                            Security Check
                        </h2>
                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
                            Ask the passenger for their 4-digit PIN to start the trip.
                        </p>

                        <div style={{ position: 'relative', marginBottom: '2rem' }}>
                            <input
                                autoFocus
                                type="text" // numeric input for PIN
                                pattern="\d*"
                                maxLength="4"
                                placeholder="0  0  0  0"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: error ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '16px',
                                    padding: '1rem',
                                    fontSize: '2rem',
                                    fontWeight: '800',
                                    color: 'white',
                                    textAlign: 'center',
                                    letterSpacing: '0.5rem',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)'
                                }}
                            />
                            {error && (
                                <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: '600' }} className="animate-pulse">
                                    Incorrect PIN. Try again.
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            style={{
                                width: '100%', padding: '1rem', fontSize: '1.1rem',
                                background: 'linear-gradient(to right, #38bdf8, #0ea5e9)',
                                color: 'white', fontWeight: 'bold', border: 'none',
                                boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)'
                            }}
                            disabled={pin.length < 4}
                        >
                            Verify & Start Trip
                        </Button>
                    </form>
                )}
            </div>
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
            `}</style>
        </div>
    );
};

export default PinVerificationModal;
