import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Navigation, Clock, CheckCircle, MapPin } from 'lucide-react';
import Button from './common/Button';

const DriverNavigation = ({ booking, onComplete }) => {
    // Mock locations if not provided (should be in booking)
    const pickupCoords = [6.5244, 3.3792]; // Lagos fallback
    const dropoffCoords = [6.5500, 3.4000]; // Mock destination

    // Simulation State
    const [currentPos, setCurrentPos] = useState(pickupCoords);
    const [eta, setEta] = useState(25); // mins
    const [distance, setDistance] = useState(12.5); // km

    useEffect(() => {
        // Simulate movement and ETA reduction
        const interval = setInterval(() => {
            setEta(prev => Math.max(0, prev - 1));
            setDistance(prev => Math.max(0, (prev - 0.2).toFixed(1)));

            // Move marker slightly towards dropoff (linear interpolation mock)
            setCurrentPos(prev => [
                prev[0] + (dropoffCoords[0] - pickupCoords[0]) / 30,
                prev[1] + (dropoffCoords[1] - pickupCoords[1]) / 30
            ]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999, background: '#1e293b', display: 'flex', flexDirection: 'column'
        }}>
            {/* Top HUD Card */}
            <div style={{
                position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
                width: '90%', maxWidth: '500px',
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid rgba(255,255,255,0.1)',
                zIndex: 1000,
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)' }}>
                            <Navigation size={20} color="white" fill="white" />
                        </div>
                        <div>
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Destination</div>
                            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>{booking.dropoff || 'Gbagada Phase 2'}</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#10b981', lineHeight: 1 }}>{eta}<span style={{ fontSize: '0.9rem' }}>min</span></div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{distance} km</div>
                    </div>
                </div>

                <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${100 - (distance / 12.5) * 100}%`, background: '#38bdf8', transition: 'width 2s linear' }}></div>
                </div>
            </div>

            {/* Map Area */}
            <div style={{ flex: 1, position: 'relative' }}>
                <MapContainer center={currentPos} zoom={14} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    {/* Driver Marker */}
                    <Marker position={currentPos}>
                        <Popup>You</Popup>
                    </Marker>

                    {/* Dropoff Marker */}
                    <Marker position={dropoffCoords}>
                        <Popup>Destination</Popup>
                    </Marker>

                    {/* Route Line */}
                    <Polyline
                        positions={[currentPos, dropoffCoords]}
                        color="#38bdf8"
                        weight={6}
                        opacity={0.8}
                    />
                </MapContainer>
            </div>

            {/* Bottom Controls */}
            <div style={{
                position: 'absolute', bottom: 30, left: 0, right: 0,
                display: 'flex', justifyContent: 'center', gap: '1rem', padding: '0 20px',
                zIndex: 1000
            }}>
                <Button
                    onClick={() => {
                        if (confirm("Complete this trip?")) onComplete(booking.id);
                    }}
                    style={{
                        background: 'linear-gradient(to right, #10b981, #059669)',
                        color: 'white',
                        padding: '1.25rem 3rem',
                        fontSize: '1.2rem',
                        borderRadius: '99px',
                        border: 'none',
                        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                        fontWeight: '800',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        width: '100%', maxWidth: '400px', justifyContent: 'center'
                    }}
                >
                    <CheckCircle size={24} /> COMPLETE TRIP
                </Button>
            </div>
        </div>
    );
};

export default DriverNavigation;
