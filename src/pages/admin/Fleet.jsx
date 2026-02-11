import React, { useState, useEffect } from 'react';
import Table, { TableRow, TableCell } from '../../components/common/Table';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import FleetMap from '../../components/admin/FleetMap';
import AddVehicleModal from '../../components/admin/AddVehicleModal';
import { Car, MoreVertical, MapPin } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

const Fleet = () => {
    const [vehicles, setVehicles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "vehicles"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const vehicleData = [];
            snapshot.forEach((doc) => {
                vehicleData.push({ id: doc.id, ...doc.data() });
            });
            setVehicles(vehicleData);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                        Fleet Management
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Track vehicle status and assignments.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button variant="secondary" onClick={() => setShowMap(!showMap)}>
                        <MapPin size={18} /> {showMap ? 'Hide Map' : 'Track Fleet'}
                    </Button>
                    <Button variant="primary" onClick={() => setIsModalOpen(true)}>Add Vehicle</Button>
                </div>
            </div>

            {showMap && (
                <div style={{ marginBottom: '2rem' }}>
                    <FleetMap vehicles={vehicles} />
                </div>
            )}

            <Card glass>
                {vehicles.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No vehicles found. Add one to get started.
                    </div>
                ) : (
                    <Table headers={['Vehicle Info', 'License Plate', 'Type', 'Assigned Driver', 'Status', 'Actions']}>
                        {vehicles.map(car => (
                            <TableRow key={car.id}>
                                <TableCell>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Car size={16} />
                                        </div>
                                        <span style={{ fontWeight: '600' }}>{car.model}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{car.plate}</TableCell>
                                <TableCell>{car.type}</TableCell>
                                <TableCell>{car.driver}</TableCell>
                                <TableCell>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        background: car.status === 'Active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                                        color: car.status === 'Active' ? 'var(--success)' : 'var(--warning)'
                                    }}>
                                        {car.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                        <MoreVertical size={18} />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                )}
            </Card>

            <AddVehicleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => { /* Handled by sync, maybe show toast */ }}
            />
        </div>
    );
};

export default Fleet;
