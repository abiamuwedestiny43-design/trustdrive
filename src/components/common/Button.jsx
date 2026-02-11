import React from 'react';
import '../../styles/index.css';

const Button = ({ children, variant = 'primary', onClick, className = '', disabled = false, type = 'button' }) => {
    const baseStyle = {
        padding: '0.75rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        fontWeight: '600',
        fontSize: '0.95rem',
        transition: 'var(--transition-fast)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--accent)',
            color: 'white',
            boxShadow: 'var(--shadow-md)',
        },
        secondary: {
            backgroundColor: 'var(--surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--text-secondary)',
        },
        danger: {
            backgroundColor: 'var(--danger)',
            color: 'white',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
        }
    };

    return (
        <button
            type={type}
            className={`${className}`}
            style={{ ...baseStyle, ...variants[variant] }}
            onClick={!disabled ? onClick : undefined}
            onMouseOver={(e) => !disabled && (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseOut={(e) => !disabled && (e.currentTarget.style.transform = 'translateY(0)')}
        >
            {children}
        </button>
    );
};

export default Button;
