import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import Button from '../components/common/Button';
import { Power } from 'lucide-react';

import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import PinVerificationModal from '../components/PinVerificationModal';

import DriverNavigation from '../components/DriverNavigation';

const DriverDashboard = () => {
    const { bookings, updateBookingStatus } = useBooking();
    const { user } = useAuth();
    const [isOnline, setIsOnline] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    // PIN Verification State
    const [showPinModal, setShowPinModal] = useState(false);
    const [verifyTripId, setVerifyTripId] = useState(null);

    // Access Control
    useEffect(() => {
        if (!user) {
            navigate('/driver-login');
        } else if (user.role !== 'driver') {
            alert("Access Denied: Drivers Only.");
            navigate('/');
        }
    }, [user, navigate]);

    // Check for Active "In Progress" Ride
    const activeRide = bookings.find(b =>
        (b.status === 'in_progress') &&
        (b.driverId === user?.uid || b.driverName === user?.name)
    );

    // Filter Stats for THIS Driver
    const myCompletedRides = bookings.filter(b =>
        b.status === 'completed' &&
        (b.driverId === user?.uid || b.driverName === user?.name)
    );
    const totalEarnings = myCompletedRides.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
    const totalHours = (myCompletedRides.length * 0.5).toFixed(1); // Est. 30 mins per ride

    const handleAccept = async (id) => {
        const booking = bookings.find(b => b.id === id);
        updateBookingStatus(id, 'accepted', {
            driverId: user.uid,
            driverName: user?.name || 'TrustDrive Captain',
            driverCar: user?.carDetails || 'Premium Vehicle',
            driverRating: user?.rating || 4.9,
            driverPhone: user?.phone || '+1 555-0123'
        });

        // Auto-Send OTP Message Logic
        if (booking && booking.otp) {
            try {
                await addDoc(collection(db, `bookings/${id}/messages`), {
                    text: `Pickup confirmed! My code is ${booking.otp}`,
                    senderId: booking.userId, // Simulate user sending it
                    senderName: booking.userName || 'Passenger',
                    isDriver: false, // It's from the user
                    createdAt: serverTimestamp()
                });
                console.log("Auto-OTP sent");
            } catch (error) {
                console.error("Error sending auto-OTP:", error);
            }
        }
    };

    const handleReject = (id) => updateBookingStatus(id, 'rejected');

    const handleArrived = (id) => {
        updateBookingStatus(id, 'arrived');
        alert("Arrival Confirmed. Notification sent to passenger.");
    };

    const handleStart = (id) => {
        setVerifyTripId(id);
        setShowPinModal(true);
    };

    const onVerifyPin = () => {
        if (verifyTripId) {
            updateBookingStatus(verifyTripId, 'in_progress');
            setShowPinModal(false);
            setVerifyTripId(null);
        }
    };

    const handleEnd = (id) => updateBookingStatus(id, 'completed');
    const handleCancel = (id) => updateBookingStatus(id, 'cancelled');

    // If Navigation is Active, Show Full Screen GPS
    if (activeRide) {
        return <DriverNavigation booking={activeRide} onComplete={handleEnd} />;
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundImage: 'url(/trust-drive-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            position: 'relative',
            color: 'white'
        }}>
            {/* ... (Existing Overlays) ... */}
            {/* Solid Black Overlay for sleek driver aesthetic */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to right, #000000, #0f172a)', // Pure Black to Very Dark Slate
                zIndex: 0, opacity: 0.95
            }}></div>

            {/* AI / Tech Grid Overlay Effect */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px', zIndex: 1, pointerEvents: 'none'
            }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 2, padding: '2rem 1.5rem' }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderRadius: 'var(--radius-lg)',
                    color: 'white', border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>Driver Console</h1>
                        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Welcome back, {user?.name}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '8px' }}>
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: activeTab === 'dashboard' ? 'rgba(255,255,255,0.2)' : 'transparent',
                                    borderRadius: '6px',
                                    color: activeTab === 'dashboard' ? 'white' : 'rgba(255,255,255,0.6)',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: activeTab === 'history' ? 'rgba(255,255,255,0.2)' : 'transparent',
                                    borderRadius: '6px',
                                    color: activeTab === 'history' ? 'white' : 'rgba(255,255,255,0.6)',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                            >
                                History
                            </button>
                        </div>
                        <Button onClick={() => setIsOnline(!isOnline)} style={{ backgroundColor: isOnline ? 'var(--success)' : 'rgba(255,255,255,0.1)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                            <Power size={16} /> {isOnline ? 'ONLINE' : 'OFFLINE'}
                        </Button>
                    </div>
                </div>

                {activeTab === 'dashboard' ? (
                    /* Main Dashboard View */
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

                        {/* Column 1: My Active Rides (Priority) */}
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                My Active Rides
                            </h3>
                            {bookings.filter(b => ['accepted', 'arrived'].includes(b.status) && (b.driverId === user?.uid || b.driverName === user?.name)).length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(5px)', borderRadius: 'var(--radius-lg)', border: '2px dashed rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
                                    You have no rides in progress.
                                </div>
                            ) : (
                                bookings.filter(b => ['accepted', 'arrived'].includes(b.status) && (b.driverId === user?.uid || b.driverName === user?.name)).map(booking => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        onAccept={handleAccept}
                                        onReject={handleReject}
                                        onArrived={handleArrived}
                                        onStart={handleStart}
                                        onEnd={handleEnd}
                                        onCancel={handleCancel}
                                    />
                                ))
                            )}

                            {/* Column 2: Incoming Requests (Available Pool) */}
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', marginTop: '2rem', color: '#facc15', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Incoming Requests ({bookings.filter(b => b.status === 'pending').length})
                            </h3>
                            {bookings.filter(b => b.status === 'pending').length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(5px)', borderRadius: 'var(--radius-lg)', border: '2px dashed rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}>
                                    No new ride requests nearby.
                                </div>
                            ) : (
                                bookings.filter(b => b.status === 'pending').map(booking => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        onAccept={handleAccept}
                                        onReject={handleReject}
                                        onArrived={handleArrived}
                                        onStart={handleStart}
                                        onEnd={handleEnd}
                                        onCancel={handleCancel}
                                    />
                                ))
                            )}
                        </div>

                        {/* Stats/Summary Column */}
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Today's Stats
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <StatCard label="Earnings" value={`₦${totalEarnings.toLocaleString()}`} />
                                <StatCard label="Rides" value={myCompletedRides.length} />
                                <StatCard label="Hours" value={totalHours} />
                                <StatCard label="Rating" value={user?.rating || "5.0"} />
                            </div>

                        </div>
                    </div>
                ) : (
                    /* History View */
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Ride History <span style={{ fontSize: '0.9rem', opacity: 0.6, fontWeight: 'normal' }}>({myCompletedRides.length} Trips)</span>
                        </h3>

                        {myCompletedRides.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(5px)', borderRadius: 'var(--radius-lg)', border: '2px dashed rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}>
                                No completed rides yet. Start driving to build your history!
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {myCompletedRides.map(booking => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                    // No actions needed for history
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* OTP Verification Modal */}
            <PinVerificationModal
                isOpen={showPinModal}
                onClose={() => setShowPinModal(false)}
                onVerify={onVerifyPin}
                expectedPin={verifyTripId ? bookings.find(b => b.id === verifyTripId)?.otp : ''}
            />
        </div>
    );
};

const StatCard = ({ label, value }) => (
    <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>{label}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>{value}</div>
    </div>
);

export default DriverDashboard;

