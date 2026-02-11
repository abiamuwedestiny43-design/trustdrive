import React from 'react';
import Card from '../common/Card';

const StatsCard = ({ title, value, icon: Icon, trend, trendUp }) => {
    return (
        <Card glass hover style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <h3 style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: '500' }}>{title}</h3>
                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white', marginTop: '0.25rem' }}>
                        {value}
                    </div>
                </div>
                <div style={{
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#38bdf8' // Accent blue
                }}>
                    <Icon size={24} />
                </div>
            </div>

            {trend && (
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    color: trendUp ? 'var(--success)' : 'var(--danger)',
                    background: trendUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '600'
                }}>
                    {trendUp ? '↑' : '↓'} {trend}
                </div>
            )}
        </Card>
    );
};

export default StatsCard;
