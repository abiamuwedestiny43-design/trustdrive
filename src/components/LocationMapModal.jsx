import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { X, Navigation, LocateFixed } from 'lucide-react';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMapModal = ({ isOpen, onClose, pickup, dropoff }) => {
    if (!isOpen) return null;

    // Simulate Coordinates based on text (Deterministic random for demo)
    const getSimulatedCoords = (text) => {
        // Base: Lagos
        const baseLat = 6.5244;
        const baseLng = 3.3792;
        // Pseudo-random offset based on string length
        const offsetLat = (text.length % 10) * 0.01;
        const offsetLng = (text.length % 8) * 0.01;
        return [baseLat + offsetLat, baseLng + offsetLng];
    };

    const pickupCoords = getSimulatedCoords(pickup || 'Pickup');
    const dropoffCoords = getSimulatedCoords(dropoff || 'Dropoff');

    // State for ETAs
    const [etaPickup, setEtaPickup] = React.useState(null);
    const [etaDropoff, setEtaDropoff] = React.useState(null);

    // Helper: Estimate time in minutes
    const calculateTime = (p1, p2) => {
        const dx = p1[0] - p2[0];
        const dy = p1[1] - p2[1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        return Math.ceil((dist / 0.01) * 3);
    };

    // Simulate Driver Location (AI Tracking)
    const [driverLocation, setDriverLocation] = React.useState([pickupCoords[0] - 0.01, pickupCoords[1] - 0.01]); // Start nearby

    React.useEffect(() => {
        if (!isOpen) return;

        setEtaDropoff(calculateTime(pickupCoords, dropoffCoords));

        const interval = setInterval(() => {
            setDriverLocation(prev => {
                const latDiff = pickupCoords[0] - prev[0];
                const lngDiff = pickupCoords[1] - prev[1];

                setEtaPickup(calculateTime(prev, pickupCoords));

                if (Math.abs(latDiff) < 0.0001 && Math.abs(lngDiff) < 0.0001) {
                    setEtaPickup(0);
                    return prev;
                }

                return [
                    prev[0] + (latDiff * 0.05),
                    prev[1] + (lngDiff * 0.05)
                ];
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen]);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="glass" style={{
                background: '#0f172a', width: '95%', maxWidth: '800px',
                borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8' }}>
                        <Navigation size={20} className="animate-pulse" />
                        <span style={{ fontWeight: '700', fontSize: '1.1rem', letterSpacing: '0.5px' }}>LIVE NAVIGATION</span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'white', transition: 'all 0.2s'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div style={{ height: '500px', position: 'relative' }}>
                    <MapContainer center={pickupCoords} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                        <TileLayer
                            attribution='&copy; OpenStreetMap'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // In a real Dark Mode app, we'd use a dark map tile provider (e.g. CartoDB Dark Matter)
                        />
                        <Marker position={pickupCoords}>
                            <Popup><strong>Pickup:</strong> {pickup}<br />Driver Arriving in {etaPickup} min</Popup>
                        </Marker>
                        <Marker position={dropoffCoords}>
                            <Popup><strong>Dropoff:</strong> {dropoff}<br />Trip Time: {etaDropoff} min</Popup>
                        </Marker>
                        <Marker position={driverLocation} opacity={0.9} >
                            <Popup><strong>Driver (You)</strong><br />ETA: {etaPickup} min</Popup>
                        </Marker>
                        <Polyline positions={[pickupCoords, dropoffCoords]} color="#ef4444" dashArray="10, 10" opacity={0.5} />
                        <Polyline positions={[driverLocation, pickupCoords]} color="#22c55e" weight={5} />
                    </MapContainer>

                    {/* Dark Overlay on Map for Theme Consistency if tile is light */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.2)', pointerEvents: 'none', zIndex: 2 }}></div>

                    {/* HUD Overlay */}
                    <div style={{
                        position: 'absolute', bottom: '20px', left: '20px', right: '20px',
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
                        zIndex: 10
                    }}>
                        <div style={{
                            background: 'rgba(15, 23, 42, 0.9)',
                            backdropFilter: 'blur(10px)',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 'bold', textTransform: 'uppercase' }}>Arrival Time</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>
                                    {etaPickup === 0 ? 'ARRIVED' : `${etaPickup} min`}
                                </div>
                            </div>
                            <LocateFixed size={24} color="#4ade80" />
                        </div>

                        <div style={{
                            background: 'rgba(15, 23, 42, 0.9)',
                            backdropFilter: 'blur(10px)',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase' }}>Trip Duration</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>
                                    {etaDropoff} min
                                </div>
                            </div>
                            <Navigation size={24} color="#38bdf8" />
                        </div>
                    </div>
                </div>

                <div style={{ padding: '1rem', background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontWeight: '700', marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                        <span>Live Tracking Active</span>
                        <span style={{ color: '#4ade80', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span className="animate-pulse" style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%' }}></span>
                            Signal Optimized
                        </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                        Navigating to pickup point: <span style={{ color: '#fff' }}>{pickup}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationMapModal;
