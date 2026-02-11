import React, { useState, useEffect } from 'react';
import Table, { TableRow, TableCell } from '../../components/common/Table';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { User, CheckCircle, XCircle, MoreVertical, Star, Search, Filter } from 'lucide-react';

const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Mock data loading
        const mockDrivers = [
            { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Online', totalTrips: 145, rating: 4.8 },
            { id: 2, name: 'Jane Smith', email: 'jane@driver.com', status: 'Busy', totalTrips: 89, rating: 4.9 },
            { id: 3, name: 'Mike Johnson', email: 'mike@ride.com', status: 'Offline', totalTrips: 320, rating: 4.7 },
            { id: 4, name: 'Sarah Wilson', email: 'sarah@trustdrive.com', status: 'Online', totalTrips: 56, rating: 5.0 },
            { id: 5, name: 'David Brown', email: 'david@cars.com', status: 'Offline', totalTrips: 210, rating: 4.6 },
        ];

        // Simulate API call
        setTimeout(() => {
            setDrivers(mockDrivers);
            setLoading(false);
        }, 800);
    }, []);

    const filteredDrivers = drivers.filter(driver =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Online': return 'var(--success)';
            case 'Busy': return 'var(--warning)';
            default: return 'var(--text-secondary)';
        }
    };

    const getStatusBg = (status) => {
        switch (status) {
            case 'Online': return 'rgba(34, 197, 94, 0.1)';
            case 'Busy': return 'rgba(234, 179, 8, 0.1)';
            default: return 'rgba(148, 163, 184, 0.1)';
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            {/* Header Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end',
                marginBottom: '2rem'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.02em'
                    }}>
                        Driver Management
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Monitor driver performance, status, and account details.
                    </p>
                </div>
                <Button variant="primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Add New Driver</span>
                </Button>
            </div>

            {/* Controls Bar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                gap: '1rem'
            }}>
                <div style={{
                    position: 'relative',
                    width: '300px'
                }}>
                    <Search
                        size={18}
                        style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-secondary)'
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Search drivers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.75rem',
                            background: 'rgba(30, 41, 59, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                    }}>
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* Content Table */}
            <Card glass className="animate-fade-in">
                <Table headers={['Driver Name', 'Status', 'Rides', 'Rating', 'Actions']}>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                Loading drivers...
                            </TableCell>
                        </TableRow>
                    ) : filteredDrivers.length > 0 ? (
                        filteredDrivers.map(driver => (
                            <TableRow key={driver.id}>
                                <TableCell>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--surface), var(--background))',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--primary)'
                                        }}>
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{driver.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{driver.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        background: getStatusBg(driver.status),
                                        color: getStatusColor(driver.status),
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        <span style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: 'currentColor'
                                        }} />
                                        {driver.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                                        {driver.totalTrips.toLocaleString()}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Star size={16} fill="#fbbf24" color="#fbbf24" style={{ filter: 'drop-shadow(0 0 2px rgba(251, 191, 36, 0.5))' }} />
                                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{driver.rating.toFixed(1)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <button style={{
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        color: 'var(--text-secondary)',
                                        padding: '0.5rem',
                                        borderRadius: '50%',
                                        transition: 'background 0.2s, color 0.2s'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                            e.currentTarget.style.color = 'var(--text-primary)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = 'var(--text-secondary)';
                                        }}
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>
                                <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                    <Search size={32} style={{ opacity: 0.5 }} />
                                    <p>No drivers found matching "{searchTerm}"</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </Table>
            </Card>
        </div>
    );
};

export default Drivers;
