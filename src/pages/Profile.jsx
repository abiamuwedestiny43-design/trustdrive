import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { User, Phone, Car, Save, ShieldCheck } from 'lucide-react';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        carDetails: user?.carDetails || '',
        plateNumber: user?.plateNumber || '' // Fixed: Ensure this property name aligns with what we expect to save
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile(user.uid, formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Profile update failed:", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="p-8 text-center">Please log in to view profile.</div>;

    return (
        <div style={{
            minHeight: '100vh',
            padding: '4rem 1rem',
            background: '#f8fafc' // Light slate bg
        }}>
            <div className="container" style={{ maxWidth: '600px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem', color: '#0f172a' }}>
                    Profile Settings
                </h1>

                <form onSubmit={handleSubmit}>
                    {/* Public Profile Card */}
                    <Card style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '50%',
                                background: '#10b981', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem', fontWeight: 'bold'
                            }}>
                                {user.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>{user.name}</h2>
                                <span style={{
                                    fontSize: '0.8rem', fontWeight: '600',
                                    padding: '0.25rem 0.75rem', borderRadius: '99px',
                                    background: user.role === 'driver' ? '#dcfce7' : '#e0f2fe',
                                    color: user.role === 'driver' ? '#166534' : '#0369a1',
                                    textTransform: 'uppercase'
                                }}>
                                    {user.role} Account
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                icon={User}
                            />
                            <Input
                                label="Email Address"
                                value={user.email}
                                disabled
                                placeholder="email@example.com"
                                style={{ opacity: 0.7, cursor: 'not-allowed' }}
                            />
                            <Input
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+234..."
                                icon={Phone}
                            />
                        </div>
                    </Card>

                    {/* Driver Specific Settings */}
                    {user.role === 'driver' && (
                        <Card style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '4px solid #10b981' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Car size={20} /> Vehicle Operations
                            </h3>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <Input
                                    label="Vehicle Model & Color"
                                    name="carDetails"
                                    value={formData.carDetails}
                                    onChange={handleChange}
                                    placeholder="e.g. Toyota Camry (Silver)"
                                />
                                <Input
                                    label="License Plate Number"
                                    name="plateNumber"
                                    value={formData.plateNumber}
                                    onChange={handleChange}
                                    placeholder="ABC-123-DE"
                                />
                            </div>
                        </Card>
                    )}

                    {/* Save Button Area */}
                    <div style={{ position: 'sticky', bottom: '2rem', zIndex: 10 }}>
                        <Button
                            type="submit"
                            variant="primary"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1.1rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : success ? (
                                <>
                                    <ShieldCheck size={20} /> Saved Automatically
                                </>
                            ) : (
                                <>
                                    <Save size={20} /> Save Changes
                                </>
                            )}
                        </Button>
                        {success && (
                            <div className="animate-fade-in-up" style={{
                                textAlign: 'center', marginTop: '1rem',
                                color: '#166534', fontWeight: '600',
                                background: '#dcfce7', padding: '0.5rem', borderRadius: '8px'
                            }}>
                                Profile updated successfully!
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
