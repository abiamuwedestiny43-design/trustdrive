import React from 'react';
import { ShieldCheck } from 'lucide-react';

const AdminLogo = ({ collapsed = false }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            borderRadius: 'var(--radius-md)',
            color: 'white',
            boxShadow: 'var(--shadow-md)',
            width: collapsed ? 'auto' : '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'all 0.3s ease'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '6px',
                flexShrink: 0
            }}>
                <ShieldCheck size={24} color="var(--accent)" />
            </div>

            {!collapsed && (
                <div className="animate-fade-in" style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: '800', fontSize: '1rem', lineHeight: '1.2' }}>TrustDrive</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px' }}>Admin System</div>
                </div>
            )}
        </div>
    );
};

export default AdminLogo;
