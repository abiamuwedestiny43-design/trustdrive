import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Settings as SettingsIcon, Bell, DollarSign, Shield } from 'lucide-react';

const Settings = () => {
    const [baseFare, setBaseFare] = useState('5000');
    const [pricePerKm, setPricePerKm] = useState('500');
    const [adminEmail, setAdminEmail] = useState('admin@trustdrive.com');

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                    System Settings
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>Configure global application parameters.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Navigation / Sidebar for settings can go here if complex */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Card glass hover style={{ cursor: 'pointer', borderLeft: '4px solid var(--accent)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <SettingsIcon size={20} color="var(--accent)" />
                            <span style={{ fontWeight: '600' }}>General</span>
                        </div>
                    </Card>
                    <Card glass hover style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <DollarSign size={20} color="var(--text-secondary)" />
                            <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Pricing</span>
                        </div>
                    </Card>
                    <Card glass hover style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Bell size={20} color="var(--text-secondary)" />
                            <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Notifications</span>
                        </div>
                    </Card>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Card glass>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <DollarSign size={20} /> Pricing Configuration
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Base Fare (₦)</label>
                                <Input value={baseFare} onChange={(e) => setBaseFare(e.target.value)} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Price per KM (₦)</label>
                                <Input value={pricePerKm} onChange={(e) => setPricePerKm(e.target.value)} />
                            </div>
                        </div>
                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="primary">Save Changes</Button>
                        </div>
                    </Card>

                    <Card glass>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={20} /> Admin Access
                        </h2>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Admin Email</label>
                            <Input value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
                        </div>
                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="primary">Update Email</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
