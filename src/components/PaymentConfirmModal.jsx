import React, { useState } from 'react';
import { X, CreditCard, Wallet, CheckCircle, Smartphone } from 'lucide-react';
import Button from './common/Button';
import Input from './common/Input';

const PaymentConfirmModal = ({ isOpen, onClose, onConfirm, amount, method }) => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('input'); // input, processing, success

    if (!isOpen) return null;

    const handlePay = async () => {
        setLoading(true);
        setStep('processing');

        // Simulate Payment Gateway Delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        setStep('success');

        // Wait a moment to show success checkmark before closing/confirming
        setTimeout(() => {
            onConfirm();
            // Reset implementation detail if component is kept alive, but here it will likely unmount or close
        }, 1500);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="glass animate-slide-in" style={{
                background: 'rgba(30, 41, 59, 0.9)', width: '90%', maxWidth: '400px',
                borderRadius: 'var(--radius-lg)', padding: '2rem',
                position: 'relative', textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: 'none', border: 'none', cursor: 'pointer'
                    }}
                >
                    <X size={20} color="rgba(255,255,255,0.5)" />
                </button>

                {step === 'success' ? (
                    <div style={{ padding: '2rem 0' }}>
                        <div style={{ color: '#4ade80', marginBottom: '1rem' }}>
                            <CheckCircle size={64} style={{ margin: '0 auto' }} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Payment Successful!</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)' }}>Your ride is being confirmed.</p>
                    </div>
                ) : step === 'processing' ? (
                    <div style={{ padding: '3rem 0' }}>
                        <div className="animate-spin" style={{
                            width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)',
                            borderTopColor: '#38bdf8', borderRadius: '50%', margin: '0 auto 1.5rem'
                        }}></div>
                        <h3 style={{ color: 'white' }}>Processing Payment...</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)' }}>Please do not close this window.</p>
                    </div>
                ) : (
                    <>
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '50%',
                            background: method === 'usdt' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem', color: method === 'usdt' ? '#4ade80' : '#38bdf8'
                        }}>
                            {method === 'card' ? <CreditCard size={30} /> :
                                method === 'transfer' ? <Wallet size={30} /> :
                                    method === 'ussd' ? <Smartphone size={30} /> : <Wallet size={30} />}
                        </div>

                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: 'white' }}>
                            {method === 'card' ? 'Secure Card Payment' :
                                method === 'transfer' ? 'Bank Transfer' :
                                    method === 'ussd' ? 'USSD Payment' : 'Crypto Transfer'}
                        </h2>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: '#38bdf8', marginBottom: '2rem' }}>
                            {method === 'usdt' ? `₮${amount}` : `₦${amount}`}
                        </p>

                        {method === 'card' && (
                            <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                                <Input placeholder="Card Number" icon={CreditCard} defaultValue="4242 4242 4242 4242" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                    <Input placeholder="MM/YY" defaultValue="12/28" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                    <Input placeholder="CVV" defaultValue="123" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                </div>
                            </div>
                        )}

                        {method === 'transfer' && (
                            <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>Transfer exactly ₦{amount} to:</div>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.25rem', color: 'white' }}>Zenith Bank</div>
                                <div style={{
                                    fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '0.75rem',
                                    border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '4px',
                                    fontWeight: 'bold', color: '#38bdf8', fontSize: '1.25rem', letterSpacing: '1px'
                                }}>
                                    2008912345
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
                                    Account Name: TrustDrive Logistics
                                </div>
                            </div>
                        )}

                        {method === 'ussd' && (
                            <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>Dial the code below to pay:</div>
                                <div style={{
                                    fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '0.75rem',
                                    border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '4px',
                                    fontWeight: 'bold', color: '#38bdf8', fontSize: '1.25rem'
                                }}>
                                    *737*2*{amount}*123#
                                </div>
                            </div>
                        )}

                        {method === 'usdt' && (
                            <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>Send USDT (TRC20) to:</div>
                                <div style={{
                                    fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '0.75rem',
                                    border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '4px', wordBreak: 'break-all',
                                    fontWeight: 'bold', color: '#38bdf8'
                                }}>
                                    T9yD14Nj9...j8H7a
                                </div>
                            </div>
                        )}

                        <Button
                            variant="primary"
                            onClick={handlePay}
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold' }}
                        >
                            {method === 'transfer' ? 'I have sent the money' :
                                method === 'ussd' ? 'I have completed the transaction' :
                                    method === 'usdt' ? 'I have sent the funds' :
                                        `Pay ₦${amount}`}
                        </Button>

                        <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Smartphone size={14} /> Secured by Paystack / TrustDrive
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentConfirmModal;
