import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { allMapLocations } from '../utils/locations';

const NigeriaMap = () => {
    // Enrich with random driver counts for visual effect
    const mappedLocations = allMapLocations.map(loc => ({
        ...loc,
        drivers: Math.floor(Math.random() * 150) + 10
    }));

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
                {mappedLocations.map((loc) => (
                    <CircleMarker
                        key={`${loc.name}-${loc.state}`}
                        center={[loc.lat, loc.lng]}
                        pathOptions={{
                            fillColor: loc.type === 'capital' ? '#10B981' : '#34D399',
                            fillOpacity: 0.6,
                            color: '#34D399',
                            weight: 1,
                            opacity: 0.8
                        }}
                        radius={loc.type === 'capital' ? 6 : 4}
                    >
                        <Popup>
                            <div style={{ color: '#0f172a', fontWeight: 'bold' }}>
                                {loc.name}, {loc.state}<br />
                                <span style={{ color: '#059669' }}>● {loc.drivers} Active Drivers</span>
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
