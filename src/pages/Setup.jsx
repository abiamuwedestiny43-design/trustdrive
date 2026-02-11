import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Database, Check, AlertTriangle } from 'lucide-react';

const Setup = () => {
    const { signup, logout } = useAuth();
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [msg, setMsg] = useState('');

    const runSetup = async () => {
        setStatus('processing');
        setMsg('Initializing...');

        try {
            // 1. Create Driver
            try {
                setMsg('Creating Driver Account...');
                await signup('driver@trustdrive.com', 'DriverPass123!', 'John Driver', 'driver');
                // Note: In a real app, we would use setDoc to add bank details to the user profile here
                // For this demo, we assume the signup function handles profile creation or we update it later.
                // But wait, the Setup file allows us to modify the signup logic or add extra calls.
                // Let's rely on the fact that signup creates the doc, and we can update it if needed, 
                // BUT simply adding the fields to the 'signup' call won't work unless we modify AuthContext.
                // However, since we can't easily modify AuthContext efficiently in this specific flow without more context,
                // we will skip modifying the 'signup' function signature and just proceed.
                // Wait! The user asked to "install it in the firestore".
                // Let's actually UPDATE the document immediately after creation.

                // We need to import db and setDoc here to do it properly? 
                // Actually, let's keep it simple. The user asked for the *Database Design*. 
                // I will modify the implementation to simulated "Bank Details" in the Driver Dashboard View 
                // or just accept that future drivers will have this. 
                // BETTER PLAN: Modify AuthContext signup to accept additional data? 
                // OR: Just manually update it here if I imported db.
                // I'll stick to the plan: The requirement was to "install it in the firestore".
                // I'll modify the `signup` call in AuthContext to accept `additionalData`? 
                // No, I will just update the logic here if I can.
                // Since I cannot easily import db here without adding imports, I will leave the Setup.jsx changes 
                // to just be the text updates related to what we are doing, and maybe
                // I will add a separate tool call to update AuthContext if needed.

                // actually, let's just update the implementation plan to say we did it in AuthContext?
                // No, I'll update AuthContext.jsx to spread `...otherData` into the user document.

                // For this specific replacement, I will revert to just the standard call, 
                // and then I will perform a separate update on AuthContext.jsx to support adding extra fields.
                await signup('driver@trustdrive.com', 'DriverPass123!', 'John Driver', 'driver', {
                    bankDetails: {
                        bankName: 'Zenith Bank',
                        accountNumber: '2008912345',
                        accountName: 'John Driver'
                    },
                    walletBalance: 12500
                });
                await logout();
            } catch (e) { console.log('Driver exists or error:', e.code); }

            // 2. Create Admin
            try {
                setMsg('Creating Admin Account...');
                await signup('admin@trustdrive.com', 'AdminPass123!', 'System Admin', 'admin');
                await logout();
            } catch (e) { console.log('Admin exists or error:', e.code); }

            // 3. Create User (Passenger)
            try {
                setMsg('Creating User Account...');
                await signup('user@trustdrive.com', 'UserPass123!', 'Alice User', 'user');
                await logout();
            } catch (e) { console.log('User exists or error:', e.code); }

            setStatus('success');
            setMsg('Setup complete! Existing accounts were skipped, new ones created.');
        } catch (err) {
            console.error(err);
            setStatus('error');
            if (err.code === 'auth/email-already-in-use') {
                setMsg('Accounts already exist. You can login now.');
                setStatus('success'); // Treat as success
            } else {
                setMsg(`Error: ${err.message}`);
            }
        }
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
            color: 'white'
        }}>
            {/* Dark Overlay */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.8))',
                zIndex: 0
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <Card glass style={{ maxWidth: '500px', textAlign: 'center', padding: '3rem' }}>
                    <div style={{
                        width: '80px', height: '80px', margin: '0 auto 1.5rem',
                        background: status === 'success' ? 'var(--success)' : status === 'error' ? 'var(--danger)' : 'var(--primary)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {status === 'success' ? <Check size={40} color="white" /> :
                            status === 'error' ? <AlertTriangle size={40} color="white" /> :
                                <Database size={40} color="white" />}
                    </div>

                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>
                        {status === 'success' ? 'Setup Complete' : 'Database Setup'}
                    </h1>

                    <p style={{ color: '#94a3b8', marginBottom: '2rem', lineHeight: '1.6' }}>
                        {status === 'success'
                            ? msg
                            : "Click below to automatically create the default Admin and Driver accounts in your Firebase Database."}
                    </p>

                    {status === 'processing' && (
                        <div style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>
                            {msg}
                        </div>
                    )}
                    {status === 'error' && (
                        <div style={{ marginBottom: '1.5rem', color: 'var(--danger)' }}>
                            {msg}
                        </div>
                    )}

                    {status !== 'success' && (
                        <Button
                            onClick={runSetup}
                            variant="primary"
                            disabled={status === 'processing'}
                            style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                        >
                            {status === 'processing' ? 'Creating...' : 'Upload Credentials'}
                        </Button>
                    )}

                    {status === 'success' && (
                        <Button
                            onClick={() => window.location.href = '/admin-login'}
                            variant="primary"
                            style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                        >
                            Go to Admin Login
                        </Button>
                    )}

                </Card>
            </div>
        </div>
    );
};

export default Setup;
