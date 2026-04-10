import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Custom Driver Icon
const driverIcon = L.divIcon({
    className: 'custom-driver-icon',
    html: `<div style="width: 12px; height: 12px; background: #1ECB73; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(30, 203, 115, 0.8);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

const LiveRiderMap = () => {
    // Lagos Center
    const center = [6.5244, 3.3792];
    const [drivers, setDrivers] = useState([
        { id: 1, pos: [6.5300, 3.3850] },
        { id: 2, pos: [6.5200, 3.3700] },
        { id: 3, pos: [6.5400, 3.3900] },
        { id: 4, pos: [6.5100, 3.3600] },
        { id: 5, pos: [6.5244, 3.3950] },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDrivers(prev => prev.map(d => ({
                ...d,
                pos: [
                    d.pos[0] + (Math.random() - 0.5) * 0.002,
                    d.pos[1] + (Math.random() - 0.5) * 0.002
                ]
            })));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
            <MapContainer
                center={center}
                zoom={14}
                style={{ height: '100%', width: '100%', background: '#0f172a' }}
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                
                {drivers.map(driver => (
                    <Marker 
                        key={driver.id} 
                        position={driver.pos} 
                        icon={driverIcon}
                    />
                ))}

                {/* Accuracy/Range circle for simulation */}
                <Circle 
                    center={center} 
                    radius={1500} 
                    pathOptions={{ 
                        fillColor: '#1ECB73', 
                        fillOpacity: 0.05, 
                        color: '#1ECB73', 
                        weight: 1, 
                        dashArray: '5, 10' 
                    }} 
                />
            </MapContainer>

            {/* Subtle Gradient Overlays for Readability */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to right, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.2) 50%, rgba(15, 23, 42, 0) 100%)',
                pointerEvents: 'none',
                zIndex: 1
            }}></div>
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4) 0%, transparent 20%, transparent 80%, rgba(15, 23, 42, 0.4) 100%)',
                pointerEvents: 'none',
                zIndex: 1
            }}></div>
        </div>
    );
};

export default LiveRiderMap;
