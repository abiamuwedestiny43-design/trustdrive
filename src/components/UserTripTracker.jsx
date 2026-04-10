import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { ShieldCheck, Phone, MessageSquare, Star } from 'lucide-react';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import ChatInterface from './ChatInterface';
import { useAuth } from '../context/AuthContext';
import { socketService } from '../utils/socket';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const UserTripTracker = ({ booking, onReset, onCancel }) => {
    const [driverLocation, setDriverLocation] = useState(null);
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropoffCoords, setDropoffCoords] = useState(null);
    const [eta, setEta] = useState(5);
    const { user } = useAuth();
    const [showChat, setShowChat] = useState(false);
    const [showMatchPopup, setShowMatchPopup] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        let interval;
        if (booking.status === 'accepted' || booking.status === 'arrived') {
            interval = setInterval(() => {
                setIsFlipped(prev => !prev);
            }, 3000);
        } else {
            setIsFlipped(false);
        }
        return () => clearInterval(interval);
    }, [booking.status]);

    useEffect(() => {
        if (booking.status === 'accepted') {
            setShowMatchPopup(true);
        }
    }, [booking.status]);

    useEffect(() => {
        const getSimulatedCoords = (text, offsetMultiplier = 1) => {
            const baseLat = 6.5244;
            const baseLng = 3.3792;
            const offsetLat = (text.length % 10) * 0.01 * offsetMultiplier;
            const offsetLng = (text.length % 8) * 0.01 * offsetMultiplier;
            return [baseLat + offsetLat, baseLng + offsetLng];
        };

        const pCoords = getSimulatedCoords(booking.pickup);
        const dCoords = getSimulatedCoords(booking.dropoff, 2.5);

        setPickupCoords(pCoords);
        setDropoffCoords(dCoords);

        if (booking.status === 'in_progress') {
            setDriverLocation(pCoords);
        } else {
            setDriverLocation([pCoords[0] - 0.01, pCoords[1] - 0.01]);
        }
    }, [booking]);

    useEffect(() => {
        // Connect user to socket when tracking starts
        if (user) {
            socketService.connect(user.uid, user.role);
            
            // Listen for precise driver location updates
            socketService.onDriverLocation((data) => {
                if (data.bookingId === booking.id && data.location) {
                    setDriverLocation([data.location.lat, data.location.lng]);
                    // You could also calculate ETA from real location to target coords here
                }
            });
        }

        return () => {
            socketService.offDriverLocation();
            // Don't completely disconnect if other components need it, or we could handle it via context
        };
    }, [user, booking.id]);

    useEffect(() => {
        if (!driverLocation || !pickupCoords || !dropoffCoords) return;

        const target = booking.status === 'in_progress' ? dropoffCoords : pickupCoords;

        // Simulate falling back mapping if no real socket updates arrive
        // In a real app we might disable this if real socket data is active
        const interval = setInterval(() => {
            setDriverLocation(prev => {
                const latDiff = target[0] - prev[0];
                const lngDiff = target[1] - prev[1];

                if (Math.abs(latDiff) < 0.0001 && Math.abs(lngDiff) < 0.0001) {
                    setEta(0);
                    return prev;
                }

                const distRemaining = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) / 0.01;
                setEta(Math.ceil(distRemaining * 3));

                // Only move slightly to simulate if socket is dead, 
                // else let socket updates override this
                return prev; 
                // Removed the forced manual drift so the socket takes precedence. 
                // To restore simulation for demo, you've return [prev[0] + latDiff * 0.02, prev[1] + lngDiff * 0.02];
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [driverLocation, pickupCoords, dropoffCoords, booking.status]);

    if (!driverLocation || !pickupCoords) return <div>Loading Map...</div>;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background: '#0f172a',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <style>{`
                .flip-container {
                    perspective: 1000px;
                    width: 140px;
                    height: 50px;
                    display: inline-block;
                }
                .flipper {
                    transition: 0.6s;
                    transform-style: preserve-3d;
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                .flip-active .flipper {
                    transform: rotateX(180deg);
                }
                .flip-front, .flip-back {
                    backface-visibility: hidden;
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    border-radius: 12px;
                }
                .flip-front {
                    backface-visibility: hidden;
                    z-index: 2;
                    transform: rotateX(0deg);
                    background: rgba(255,255,255,0.9);
                    border: 1px solid rgba(0,0,0,0.1);
                    color: #000;
                }
                .flip-back {
                    transform: rotateX(180deg);
                    background: #10b981;
                    color: white;
                    box-shadow: 0 4px 6px rgba(16, 185, 129, 0.4);
                }
                .leaflet-container {
                    width: 100%;
                    height: 100%;
                }
            `}</style>

            {/* Top ETA Floating Bar */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '10px 24px',
                borderRadius: '50px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
                        {booking.status === 'in_progress' ? 'To Destination' : 'Driver Arrival'}
                    </span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a', lineHeight: 1 }}>
                        {eta === 0 ? 'NOW' : `${eta} min`}
                    </span>
                </div>
            </div>

            {/* OTP / PIN Badge - Shows when Driver Accepts */}
            {booking.otp && (booking.status === 'accepted' || booking.status === 'arrived') && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'white',
                    padding: '12px 20px',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: '2px solid #10b981',
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '2px' }}>Ride PIN</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0f172a', letterSpacing: '4px', lineHeight: 1 }}>
                        {booking.otp}
                    </span>
                </div>
            )}

            <MapContainer center={pickupCoords} zoom={15} style={{ flex: 1, width: '100%', zIndex: 1 }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <Marker position={pickupCoords}>
                    <Popup>Pickup: {booking.pickup}</Popup>
                </Marker>
                {booking.status === 'in_progress' && dropoffCoords && (
                    <Marker position={dropoffCoords}>
                        <Popup>Dropoff: {booking.dropoff}</Popup>
                    </Marker>
                )}
                <Marker position={driverLocation} opacity={1}>
                    <Popup>
                        <div style={{ textAlign: 'center' }}>
                            <b>{booking.driverName || 'Driver'}</b><br />
                            {booking.driverCar}
                        </div>
                    </Popup>
                </Marker>
                {(booking.status === 'accepted' || booking.status === 'arrived' || booking.status === 'in_progress') && (
                    <Polyline
                        positions={[driverLocation, booking.status === 'in_progress' && dropoffCoords ? dropoffCoords : pickupCoords]}
                        color="#10b981"
                        weight={5}
                        opacity={0.8}
                    />
                )}
            </MapContainer>

            {/* Floating Action Buttons */}
            <div style={{
                position: 'absolute',
                bottom: '40px',
                right: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                zIndex: 1000
            }}>
                <button
                    onClick={() => setShowChat(true)}
                    style={{
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: '#0f172a', color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <MessageSquare size={24} />
                </button>

                <button
                    style={{
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: 'white', color: '#0f172a',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Phone size={24} />
                </button>

                <button
                    onClick={() => {
                        if (window.confirm("Cancel ride?")) onCancel();
                    }}
                    style={{
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: '#ef4444', color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>×</div>
                </button>
            </div>

            {showChat && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 2000,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        width: '100%', maxWidth: '500px', height: '100%', maxHeight: '800px',
                        position: 'relative',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <ChatInterface
                            bookingId={booking.id}
                            currentUser={user}
                            isDriver={false}
                            onClose={() => setShowChat(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTripTracker;
