import React, { useState } from 'react';
import { X, Car, Hash, Info, Activity } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';

const AddVehicleModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState('');
    const [plate, setPlate] = useState('');
    const [type, setType] = useState('Premium');
    const [status, setStatus] = useState('Active');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate a random location near Lagos for mapping demo
            const baseLat = 6.5244;
            const baseLng = 3.3792;
            const randomLat = baseLat + (Math.random() - 0.5) * 0.1;
            const randomLng = baseLng + (Math.random() - 0.5) * 0.1;

            await addDoc(collection(db, "vehicles"), {
                model,
                plate,
                type,
                status,
                driver: 'Unassigned',
                location: { lat: randomLat, lng: randomLng },
                createdAt: new Date().toISOString()
            });
            onSuccess();
            onClose();
            // Reset form
            setModel(''); setPlate(''); setType('Premium'); setStatus('Active');
        } catch (error) {
            console.error("Error adding vehicle: ", error);
            alert("Failed to add vehicle");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="glass" style={{
                background: 'white', width: '90%', maxWidth: '500px',
                borderRadius: 'var(--radius-lg)', padding: '2rem',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: 'none', border: 'none', cursor: 'pointer'
                    }}
                >
                    <X size={20} color="var(--text-secondary)" />
                </button>

                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                    Add New Vehicle
                </h2>

                <form onSubmit={handleSubmit}>
                    <Input
                        placeholder="Vehicle Model (e.g. Toyota Camry)"
                        icon={Car}
                        value={model}
                        onChange={e => setModel(e.target.value)}
                        required
                    />

                    <Input
                        placeholder="License Plate (e.g. LAG-123-XY)"
                        icon={Hash}
                        value={plate}
                        onChange={e => setPlate(e.target.value)}
                        required
                    />

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Vehicle Type</label>
                        <select
                            value={type} onChange={e => setType(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}
                        >
                            <option value="Premium">Premium</option>
                            <option value="SUV">SUV</option>
                            <option value="Van">Van</option>
                            <option value="Standard">Standard</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Status</label>
                        <select
                            value={status} onChange={e => setStatus(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}
                        >
                            <option value="Active">Active</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        style={{ width: '100%', padding: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Vehicle'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AddVehicleModal;
