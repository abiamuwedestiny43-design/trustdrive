import React from 'react';

const Card = ({ children, className = '', hover = false, glass = false }) => {
    return (
        <div
            className={glass ? 'glass' : `card ${className}`}
            style={{
                backgroundColor: glass ? undefined : 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-md)',
                boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-md)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: glass ? undefined : '1px solid rgba(0,0,0,0.05)',
            }}
            onMouseEnter={(e) => {
                if (hover) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-premium)';
                }
            }}
            onMouseLeave={(e) => {
                if (hover) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }
            }}
        >
            {children}
        </div>
    );
};

export default Card;
