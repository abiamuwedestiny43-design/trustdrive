import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import StatsCard from '../components/admin/StatsCard';
import NigeriaMap from '../components/NigeriaMap';

import Table, { TableRow, TableCell } from '../components/common/Table';
import { DollarSign, Users, Car, Activity, MoreVertical } from 'lucide-react';
import Button from '../components/common/Button';

import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, where, doc, updateDoc } from 'firebase/firestore';

const AdminDashboard = () => {
    const { user } = useAuth();
    const { bookings } = useBooking(); // Still used for global stats (optional, could replace later)
    const navigate = useNavigate();
    const [recentBookings, setRecentBookings] = React.useState([]);
    const [pendingDrivers, setPendingDrivers] = React.useState([]);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/admin-login');
        }
    }, [user, navigate]);

    // Real-time listener for recent bookings
    useEffect(() => {
        const q = query(
            collection(db, 'bookings'),
            orderBy('createdAt', 'desc'),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRecentBookings(data);
        });

        // Query for pending driver approvals
        const driversQuery = query(
            collection(db, 'users'),
            where('role', '==', 'driver'),
            where('isApproved', '==', false)
        );

        const unsubscribeDrivers = onSnapshot(driversQuery, (snapshot) => {
            const drivers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPendingDrivers(drivers);
        });

        return () => {
            unsubscribe();
            unsubscribeDrivers();
        };
    }, []);

    const handleApproveDriver = async (driverId) => {
        try {
            await updateDoc(doc(db, 'users', driverId), {
                isApproved: true
            });
        } catch (error) {
            console.error("Error approving driver:", error);
        }
    };

    const handleRejectDriver = async (driverId) => {
        try {
            await updateDoc(doc(db, 'users', driverId), {
                isApproved: false,
                rejected: true
            });
        } catch (error) {
            console.error("Error rejecting driver:", error);
        }
    };

    // ... (Stats Logic remains same for now) ...
    const totalRevenue = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
    const activeRides = bookings.filter(b =>
        ['pending', 'accepted', 'arrived', 'in_progress'].includes(b.status)
    ).length;
    const totalDrivers = 124;

    return (
        <div className="animate-fade-in dashboard-bg" style={{
            // ... (Styles) ...
            minHeight: '100%', borderRadius: '16px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
            <style>{`
                /* ... (CSS styles same as before) ... */
                .dashboard-bg { padding: 2rem; background-image: url(/admin-bg.jpg); background-size: cover; background-position: center; background-attachment: fixed; }
                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 3rem; }
                .financial-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 1.5rem; margin-bottom: 3rem; }
                @media (max-width: 768px) {
                    .dashboard-bg { padding: 1rem !important; background-attachment: scroll !important; }
                    .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 1rem !important; }
                    .financial-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
                }
                @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr !important; } }
            `}</style>

            {/* ... (Overlays & Header same) ... */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(6, 78, 59, 0.9), rgba(15, 23, 42, 0.9))', zIndex: -1 }}></div>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: -1, pointerEvents: 'none' }}></div>

            <div style={{ marginBottom: '2rem', position: 'relative' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white' }}>Admin Overview</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back, Administrator.</p>
            </div>

            {/* Stats Grid - Unchanged */}
            <div className="stats-grid">
                <StatsCard title="Total Collection" value="₦4,73,050" icon={DollarSign} trend="12% vs last month" trendUp={true} />
                <StatsCard title="Active Rides" value={activeRides} icon={Activity} trend="5% this week" trendUp={true} />
                <StatsCard title="Total Drivers" value={totalDrivers} icon={Users} trend="2 new today" trendUp={true} />
                <StatsCard title="Total Fleet" value="156" icon={Car} />
            </div>

            {/* Financial Grid - Unchanged */}
            <div className="financial-grid">
                {/* ... (Calculator & Payments Stream same as before - assuming they stay static/mock for now per prompt focus) ... */}
                {/* Automatic Calculator */}
                <div className="animate-fade-in-up" style={{ background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.8), rgba(6, 95, 70, 0.6))', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(52, 211, 153, 0.3)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 10px 25px rgba(6, 78, 59, 0.3)' }}>
                    <div style={{ fontSize: '0.9rem', color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <DollarSign size={16} /> Total Collections Today
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: '800', color: 'white', lineHeight: 1 }}>
                        ₦{(() => { const base = 418850; const recentSum = 54200; return (base + recentSum).toLocaleString(); })()}
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#d1fae5', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>+24% vs Yesterday</div>
                        <div style={{ fontSize: '0.8rem', color: '#d1fae5', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>42 Transactions</div>
                    </div>
                </div>

                {/* Incoming Payments */}
                <div className="animate-fade-in-up" style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 0 15px rgba(16, 185, 129, 0.1)', backdropFilter: 'blur(10px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Incoming Payments <span className="animate-pulse" style={{ width: '6px', height: '6px', background: '#34D399', borderRadius: '50%' }}></span></h3>
                        <Button variant="ghost" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', height: 'auto' }}>View Report</Button>
                    </div>
                    <div className="hide-scrollbar" style={{ overflowY: 'auto', maxHeight: '180px' }}>
                        {[...Array(6)].map((_, i) => {
                            const amounts = [4500, 12000, 3200, 8500, 21000, 5000];
                            const methods = ['Card', 'Transfer', 'Wallet', 'Card', 'Card', 'Transfer'];
                            const users = ['Chidi Okonkwo', 'Sarah Adebayo', 'Musa Ibrahim', 'Funke Akindele', 'David Okafor', 'Grace Effiong'];
                            return (
                                <div key={i} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DollarSign size={18} /></div>
                                        <div><div style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600' }}>{users[i]}</div><div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Via {methods[i]} • {i * 2 + 1}m ago</div></div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}><div style={{ color: '#34D399', fontWeight: '700', fontSize: '1rem' }}>+ ₦{amounts[i].toLocaleString()}</div><div style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase' }}>Completed</div></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Pending Drivers Approvals */}
            {pendingDrivers.length > 0 && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: '1rem', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Driver Verification Queue</h2>
                        <div style={{ fontSize: '0.85rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="animate-pulse" style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></span>
                            Action Required
                        </div>
                    </div>
                    <div className="hide-scrollbar" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1.5rem', scrollSnapType: 'x mandatory', marginBottom: '2rem' }}>
                        {pendingDrivers.map((driver) => (
                            <div key={driver.id} style={{
                                minWidth: '320px', padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', backdropFilter: 'blur(10px)', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', gap: '1rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>{driver.name}</h3>
                                        <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{driver.email}</div>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: '700', background: 'rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>PENDING</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
                                    <strong>Phone:</strong> {driver.phone || 'N/A'}<br/>
                                    <strong>Vehicle:</strong> {driver.vehicleModel || 'N/A'}<br/>
                                    <strong>Plate:</strong> {driver.licensePlate || 'N/A'}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <Button onClick={() => handleApproveDriver(driver.id)} style={{ flex: 1, padding: '0.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Approve</Button>
                                    <Button onClick={() => handleRejectDriver(driver.id)} style={{ flex: 1, padding: '0.5rem', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Reject</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Live Booking Feed - REAL DATA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: '1rem', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Live User Requests</h2>
                <div style={{ fontSize: '0.85rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="animate-pulse" style={{ width: '8px', height: '8px', background: '#fbbf24', borderRadius: '50%' }}></span>
                    Incoming Stream
                </div>
            </div>

            <div className="hide-scrollbar" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1.5rem', scrollSnapType: 'x mandatory', marginBottom: '2rem' }}>
                {recentBookings.length === 0 ? (
                    <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.5)', width: '100%', textAlign: 'center' }}>No recent requests found</div>
                ) : (
                    recentBookings.map((booking, i) => {
                        const isPending = booking.status === 'pending';
                        const statusColor = isPending ? '#fbbf24' : '#34D399';
                        const statusBg = isPending ? 'rgba(251, 191, 36, 0.2)' : 'rgba(16, 185, 129, 0.2)';
                        const statusText = isPending ? 'NEW REQUEST' : booking.status.toUpperCase();
                        const glowColor = isPending ? 'rgba(251, 191, 36, 0.2)' : 'rgba(16, 185, 129, 0.2)';

                        return (
                            <div key={booking.id} className="animate-fade-in-up" style={{
                                minWidth: '280px', padding: '1.25rem', borderRadius: 'var(--radius-lg)', background: 'rgba(255, 255, 255, 0.05)', border: `1px solid ${isPending ? 'rgba(251, 191, 36, 0.2)' : 'rgba(52, 211, 153, 0.2)'}`, backdropFilter: 'blur(10px)', animationDelay: `${i * 0.1}s`, scrollSnapAlign: 'start', position: 'relative', overflow: 'hidden'
                            }}>
                                {/* Glow Effect */}
                                <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}></div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: '700', background: statusBg, color: statusColor, padding: '0.25rem 0.5rem', borderRadius: '4px', border: `1px solid ${statusBg}` }}>{statusText}</span>
                                    {booking.otp && (
                                        <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: '800', fontFamily: 'monospace', letterSpacing: '1px' }}>PIN: {booking.otp}</span>
                                    )}
                                </div>

                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                                    ₦{(parseFloat(booking.amount) || 0).toLocaleString()}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '1rem' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }}></div>
                                        {booking.pickup || 'Unknown Location'}
                                    </div>
                                    <div style={{ width: '1px', height: '10px', background: 'rgba(255,255,255,0.2)', marginLeft: '3px' }}></div>
                                    <div style={{ fontSize: '0.9rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fbbf24' }}></div>
                                        {booking.dropoff || 'Unknown Destination'}
                                    </div>
                                </div>

                                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', color: '#94a3b8' }}>
                                    {isPending ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24' }}>
                                            <span className="animate-spin" style={{ display: 'inline-block', width: '10px', height: '10px', border: '2px solid #fbbf24', borderTopColor: 'transparent', borderRadius: '50%' }}></span>
                                            Waiting for Driver...
                                        </span>
                                    ) : (
                                        booking.driverName || 'Driver Assigned'
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Map Section */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', marginTop: '1rem' }}>Live Fleet Network</h2>
            <NigeriaMap />

            {/* Live Fleet Monitor - Carousel & Earnings */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: '4rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Live Fleet Monitor</h2>
                <div style={{ fontSize: '0.85rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="animate-pulse" style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }}></span>
                    Real-time Data Feed
                </div>
            </div>

            <div className="hide-scrollbar" style={{
                display: 'flex',
                gap: '1.5rem',
                overflowX: 'auto',
                paddingBottom: '1.5rem',
                scrollSnapType: 'x mandatory'
            }}>
                {[...Array(12)].map((_, i) => {
                    const earnings = (Math.floor(Math.random() * 250000) + 50000).toLocaleString();
                    const isOnTrip = Math.random() > 0.4;

                    return (
                        <div key={i} className="animate-fade-in-up" style={{
                            minWidth: '340px',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-lg)',
                            background: 'rgba(15, 23, 42, 0.7)',
                            border: '1px solid rgba(16, 185, 129, 0.15)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            animationDelay: `${i * 0.1}s`,
                            scrollSnapAlign: 'start',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Card Header: Avatar & Info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontWeight: '700',
                                        boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
                                    }}>
                                        {200 + i}
                                    </div>
                                    <div style={{
                                        position: 'absolute', bottom: 0, right: 0,
                                        width: '12px', height: '12px',
                                        background: isOnTrip ? '#eab308' : '#34D399',
                                        borderRadius: '50%', border: '2px solid #0f172a'
                                    }}></div>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '700', fontSize: '1rem', color: 'white' }}>Driver #{200 + i}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Tesla Model 3 • Premium</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#34D399' }}>4.9★</div>
                                </div>
                            </div>

                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '100%' }}></div>

                            {/* Earnings & Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Today's Earnings</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white' }}>₦{earnings}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Current Status</div>
                                    <div style={{
                                        fontSize: '0.9rem', fontWeight: '600',
                                        color: isOnTrip ? '#fbbf24' : '#34D399',
                                        display: 'flex', alignItems: 'center', gap: '0.25rem'
                                    }}>
                                        {isOnTrip ? 'ON TRIP' : 'AVAILABLE'}
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button style={{
                                width: '100%',
                                padding: '0.75rem',
                                marginTop: '0.5rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                background: 'rgba(16, 185, 129, 0.1)',
                                color: '#34D399',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#10B981';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                                    e.currentTarget.style.color = '#34D399';
                                }}
                            >
                                Track Live
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        pending: { bg: 'var(--warning)', color: 'white' },
        accepted: { bg: 'var(--accent)', color: 'white' },
        rejected: { bg: 'var(--danger)', color: 'white' },
        completed: { bg: 'var(--success)', color: 'white' }
    };

    const style = styles[status] || styles.pending;

    return (
        <span style={{
            padding: '0.25rem 0.6rem',
            borderRadius: '99px',
            fontSize: '0.75rem',
            fontWeight: '700',
            background: style.bg,
            color: style.color,
            textTransform: 'uppercase'
        }}>
            {status}
        </span>
    );
};

export default AdminDashboard;
