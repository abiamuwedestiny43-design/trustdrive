import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './common/Button';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isHome = location.pathname === '/';

    return (
        <div className="full-screen">
            <nav style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
                <div className="container" style={{
                    height: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '8px' }}></div>
                        TrustDrive
                    </Link>

                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        {!user ? (
                            <>
                                <Link to="/login" style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Log In</Link>
                                <Link to="/driver-login" style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>For Drivers</Link>
                            </>
                        ) : (
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Link to="/profile" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600', textDecoration: 'none' }}>
                                    Hello, {user.name}
                                </Link>
                                {user.role === 'driver' && (
                                    <Link to="/driver-dashboard">
                                        <Button variant="secondary" style={{ padding: '0.5rem 1rem' }}>Dashboard</Button>
                                    </Link>
                                )}
                                <Button variant="ghost" onClick={handleLogout}>Log Out</Button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            <footer style={{ padding: '2rem 0', borderTop: '1px solid #f1f5f9', marginTop: 'auto' }}>
                <div className="container" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} TrustDrive Management. Premium Cab Service.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
