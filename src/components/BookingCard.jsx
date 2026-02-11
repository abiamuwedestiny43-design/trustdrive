import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { MapPin, Clock, User, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import LocationMapModal from './LocationMapModal';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'; // Added
import L from 'leaflet'; // Added
import icon from 'leaflet/dist/images/marker-icon.png'; // Added
import iconShadow from 'leaflet/dist/images/marker-shadow.png'; // Added
import ChatInterface from './ChatInterface';
import { useAuth } from '../context/AuthContext';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const BookingCard = ({ booking, onAccept, onReject, onArrived, onStart, onEnd, onCancel }) => {
    const { user } = useAuth();
    const [showMap, setShowMap] = useState(false);
    const [showChat, setShowChat] = useState(false);

    // Driver Navigation Simulation State
    const [navEta, setNavEta] = useState(null);
    const [driverPos, setDriverPos] = useState(null);
    const [targetPos, setTargetPos] = useState(null);

    useEffect(() => {
        // Driver Navigation Simulation
        const getCoords = (text, offset = 1) => {
            const baseLat = 6.5244;
            const baseLng = 3.3792;
            const offsetLat = (text.length % 10) * 0.01 * offset;
            const offsetLng = (text.length % 8) * 0.01 * offset;
            return [baseLat + offsetLat, baseLng + offsetLng];
        };

        let startCoords, endCoords;
        let isPickup = false;

        if (booking.status === 'accepted' || booking.status === 'arrived') {
            // Heading to Pickup
            const pickupCoords = getCoords(booking.pickup);
            startCoords = [pickupCoords[0] - 0.02, pickupCoords[1] - 0.02]; // Start away
            endCoords = pickupCoords; // Target is Pickup
            isPickup = true;
        } else if (booking.status === 'in_progress') {
            // Heading to Dropoff
            startCoords = getCoords(booking.pickup);
            endCoords = getCoords(booking.dropoff, 2.5);
            isPickup = false;
        } else {
            return; // Pending or other states
        }

        setDriverPos(startCoords);
        setTargetPos(endCoords);

        // Animate
        const interval = setInterval(() => {
            setDriverPos(prev => {
                if (!prev) return startCoords;
                const latDiff = endCoords[0] - prev[0];
                const lngDiff = endCoords[1] - prev[1];

                if (Math.abs(latDiff) < 0.0001 && Math.abs(lngDiff) < 0.0001) {
                    setNavEta(0);
                    return prev;
                }
                const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) / 0.01;
                setNavEta(Math.ceil(dist * 3));
                return [prev[0] + latDiff * 0.02, prev[1] + lngDiff * 0.02];
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [booking.status, booking.pickup, booking.dropoff]);

    return (
        <>
            <Card glass className="animate-slide-in" style={{
                marginBottom: '1rem',
                borderLeft: '4px solid var(--accent)',
                background: booking.status === 'pending' ? '#064e3b' :
                    (booking.status === 'accepted' || booking.status === 'arrived' || booking.status === 'in_progress') ? '#022c22' :
                        'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'background 0.3s ease',
                position: 'relative', // Ensure ChatInterface is contained
                overflow: 'hidden'    // Ensure nice corners for chat overlay
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    {/* ... (Header content same as before) ... */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.8)' }}>
                            <User size={20} />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: '700', fontSize: '1rem', color: 'white' }}>
                                {booking.status === 'pending' ? 'Potential Rider' : (booking.userName || 'Passenger')}
                            </h4>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                                {new Date(booking.createdAt).toLocaleTimeString()} • {booking.carType.toUpperCase()}
                            </div>
                        </div>
                    </div>
                    <div style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '99px',
                        background: booking.status === 'pending' ? 'var(--warning)' : booking.status === 'arrived' ? '#eab308' : booking.status === 'accepted' ? 'var(--success)' : 'var(--danger)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                    }}>
                        {booking.status === 'arrived' ? 'WAITING FOR RIDER' : booking.status.toUpperCase()}
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem', paddingLeft: '0.5rem', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div style={{ marginTop: '3px', color: '#38bdf8' }}><MapPin size={16} /></div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>PICKUP</div>
                            <div style={{ fontWeight: '500', color: 'rgba(255,255,255,0.9)' }}>{booking.pickup}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ marginTop: '3px', color: '#ef4444' }}><MapPin size={16} /></div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>DROPOFF</div>
                            <div style={{ fontWeight: '500', color: 'rgba(255,255,255,0.9)' }}>{booking.dropoff}</div>
                        </div>
                    </div>

                    <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                            onClick={() => setShowMap(true)}
                            style={{
                                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%',
                                width: '40px', height: '40px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', transition: 'all 0.2s', backdropFilter: 'blur(4px)'
                            }}
                            title="View on Map"
                        >
                            <MapPin size={20} />
                        </button>

                        {/* Chat Button (Only if accepted/active) */}
                        {booking.status !== 'pending' && (
                            <button
                                onClick={() => setShowChat(true)}
                                style={{
                                    background: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '50%',
                                    width: '40px', height: '40px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#38bdf8', transition: 'all 0.2s', backdropFilter: 'blur(4px)'
                                }}
                                title="Chat with Passenger"
                            >
                                <MessageSquare size={20} />
                            </button>
                        )}
                    </div>
                </div>

                <div style={{
                    display: 'flex', justifyContent: 'space-between', padding: '0.75rem',
                    background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1rem',
                    fontSize: '0.85rem',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'rgba(255,255,255,0.5)' }}>Distance</div>
                        <div style={{ fontWeight: '700', color: 'white' }}>{booking.distance || 'N/A'}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'rgba(255,255,255,0.5)' }}>Price</div>
                        <div style={{ fontWeight: '700', color: '#4ade80' }}>₦{booking.amount?.toLocaleString() || '0'}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'rgba(255,255,255,0.5)' }}>Est. Time</div>
                        <div style={{ fontWeight: '700', color: 'white' }}>
                            {booking.distance ? `${Math.ceil(parseInt(booking.distance) * 2.5)} mins` : '15 mins'}
                        </div>
                    </div>
                </div>

                {/* Live Tracking Map for Active Trips */}
                {booking.status !== 'pending' && driverPos && targetPos && (
                    <div style={{ height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <MapContainer center={driverPos} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={driverPos}><Popup>You</Popup></Marker>
                            <Marker position={targetPos}><Popup>{booking.status === 'in_progress' ? 'Dropoff' : 'Pickup'}</Popup></Marker>
                            <Polyline positions={[driverPos, targetPos]} color="#3b82f6" weight={4} />
                        </MapContainer>

                        {/* Navigation Overlay */}
                        <div style={{
                            position: 'absolute', bottom: 10, left: 10, right: 10,
                            background: 'rgba(15, 23, 42, 0.9)',
                            padding: '10px 15px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            backdropFilter: 'blur(4px)'
                        }}>
                            <div>
                                <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                    {booking.status === 'in_progress' ? 'Est. Arrival' : 'Est. Pickup'}
                                </div>
                                <div style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>
                                    {navEta ? new Date(Date.now() + navEta * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: '#38bdf8', fontSize: '1.5rem', fontWeight: '800', lineHeight: 1 }}>
                                    {navEta || 0}<span style={{ fontSize: '0.9rem', fontWeight: '600' }}>min</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ... (Action Buttons Section - Same as before) ... */}
                {booking.status === 'pending' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Button variant="secondary" onClick={() => onReject(booking.id)} style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.5)', background: 'transparent' }}>
                            <XCircle size={18} /> Reject
                        </Button>
                        <Button variant="primary" onClick={() => onAccept(booking.id)} style={{ backgroundColor: '#22c55e', border: 'none' }}>
                            <CheckCircle size={18} /> Accept
                        </Button>
                    </div>
                )}

                {booking.status === 'accepted' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Button variant="primary" onClick={() => onArrived && onArrived(booking.id)} style={{ backgroundColor: '#0ea5e9', border: 'none', fontWeight: 'bold' }}>
                            <MapPin size={18} className="animate-bounce" /> I've Arrived at Pickup
                        </Button>
                        <Button variant="secondary" onClick={() => setShowChat(true)} style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                            <MessageSquare size={18} /> Chat with Passenger
                        </Button>
                        <Button variant="secondary" onClick={() => { if (window.confirm('Cancel this trip?')) onCancel(booking.id) }} style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.5)', background: 'transparent' }}>
                            Cancel Trip
                        </Button>
                    </div>
                )}

                {booking.status === 'arrived' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#4ade80' }} className="animate-pulse">
                            Wait for passenger to board & verify PIN
                        </div>
                        <Button variant="primary" onClick={() => onStart && onStart(booking.id)} style={{ backgroundColor: '#22c55e', border: 'none' }}>
                            Start Trip
                        </Button>
                        <Button variant="secondary" onClick={() => setShowChat(true)} style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                            <MessageSquare size={18} /> Chat with Passenger
                        </Button>
                        <Button variant="secondary" onClick={() => { if (window.confirm('Passenger no-show? Cancel trip?')) onCancel(booking.id) }} style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.5)', background: 'transparent' }}>
                            Cancel Trip
                        </Button>
                    </div>
                )}

                {booking.status === 'in_progress' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Button variant="primary" onClick={() => onEnd && onEnd(booking.id)} style={{ backgroundColor: '#22c55e', border: 'none' }}>
                            Complete Trip
                        </Button>
                        <Button variant="secondary" onClick={() => { if (window.confirm('Emergency Cancellation?')) onCancel(booking.id) }} style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.5)', background: 'transparent', fontSize: '0.8rem', padding: '0.5rem' }}>
                            Cancel Trip (Emergency)
                        </Button>
                        <Button variant="secondary" onClick={() => setShowChat(true)} style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                            <MessageSquare size={18} /> Chat with Passenger
                        </Button>
                    </div>
                )}

                {/* Embedded Chat Interface Modal */}
                {showChat && (
                    <ChatInterface
                        bookingId={booking.id}
                        currentUser={user}
                        isDriver={true}
                        onClose={() => setShowChat(false)}
                    />
                )}

            </Card>

            <LocationMapModal
                isOpen={showMap}
                onClose={() => setShowMap(false)}
                pickup={booking.pickup}
                dropoff={booking.dropoff}
            />
        </>
    );
};

export default BookingCard;
