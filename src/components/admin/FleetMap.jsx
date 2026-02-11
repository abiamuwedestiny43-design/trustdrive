import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon path issues with Webpack/Vite
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const locations = {
    lagos: { lat: 6.5244, lng: 3.3792, title: 'Lagos HQ' },
    abuja: { lat: 9.0765, lng: 7.3986, title: 'Abuja Hub' },
    warri: { lat: 5.5544, lng: 5.7932, title: 'Warri Station' },
    asaba: { lat: 6.2059, lng: 6.6959, title: 'Asaba Terminal' },
    agbor: { lat: 6.2535, lng: 6.1951, title: 'Agbor Stop' }
};

const route = [
    [locations.asaba.lat, locations.asaba.lng],
    [locations.agbor.lat, locations.agbor.lng]
];

const FleetMap = ({ vehicles = [] }) => {
    return (
        <div className="glass" style={{ height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
            <MapContainer
                center={[6.5244, 3.3792]} // Default center Lagos
                zoom={10}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {vehicles.map((car) => {
                    if (!car.location) return null;
                    return (
                        <Marker key={car.id} position={[car.location.lat, car.location.lng]}>
                            <Popup>
                                <strong>{car.model}</strong><br />
                                Plate: {car.plate}<br />
                                Status: {car.status}
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default FleetMap;
