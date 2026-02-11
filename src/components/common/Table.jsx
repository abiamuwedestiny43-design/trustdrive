import React from 'react';

const Table = ({ headers, children, className = '' }) => {
    return (
        <div className={`glass ${className}`} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
                            {headers.map((header, index) => (
                                <th key={index} style={{
                                    padding: '1rem 1.5rem',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    color: 'var(--text-secondary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {children}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const TableRow = ({ children, onClick }) => (
    <tr
        onClick={onClick}
        style={{
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            transition: 'background 0.2s',
            cursor: onClick ? 'pointer' : 'default'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
        {children}
    </tr>
);

export const TableCell = ({ children, className = '' }) => (
    <td className={className} style={{ padding: '1rem 1.5rem', fontSize: '0.95rem', color: 'white' }}>
        {children}
    </td>
);

export default Table;
