import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const activeCities = [
    { name: 'Lagos', lat: 6.5244, lng: 3.3792, drivers: 142 },
    { name: 'Abuja', lat: 9.0765, lng: 7.3986, drivers: 85 },
    { name: 'Port Harcourt', lat: 4.8156, lng: 7.0498, drivers: 56 },
    { name: 'Kano', lat: 12.0022, lng: 8.5920, drivers: 45 },
    { name: 'Ibadan', lat: 7.3775, lng: 3.9470, drivers: 62 }
];

const NigeriaMap = () => {
    return (
        <div style={{
            height: '500px',
            width: '100%',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.1)',
            position: 'relative'
        }}>
            <MapContainer
                center={[9.0820, 8.6753]}
                zoom={6}
                style={{ height: '100%', width: '100%', background: '#0f172a' }}
                scrollWheelZoom={false}
                zoomControl={false}
                attributionControl={false}
            >
                {/* Dark Matter Tiles for Tech Look */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* City Markers */}
                {activeCities.map((city) => (
                    <CircleMarker
                        key={city.name}
                        center={[city.lat, city.lng]}
                        pathOptions={{
                            fillColor: '#10B981',
                            fillOpacity: 0.6,
                            color: '#34D399',
                            weight: 1,
                            opacity: 0.8
                        }}
                        radius={8}
                    >
                        <Popup>
                            <div style={{ color: '#0f172a', fontWeight: 'bold' }}>
                                {city.name}<br />
                                <span style={{ color: '#059669' }}>● {city.drivers} Active Drivers</span>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>

            {/* Overlay UI */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 1000,
                background: 'rgba(6, 78, 59, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '10px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: '#6ee7b7' }}>Live Coverage</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>Nigeria Operations</div>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                zIndex: 1000,
                display: 'flex',
                gap: '10px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '20px', color: 'white', fontSize: '0.8rem' }}>
                    <span style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', boxShadow: '0 0 8px #10B981' }} className="animate-pulse"></span>
                    High Demand
                </div>
            </div>
        </div>
    );
};

export default NigeriaMap;
