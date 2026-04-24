import React, { useRef, useEffect } from 'react';

const OtpInput = ({ value, onChange, length = 4 }) => {
    const inputs = useRef([]);

    useEffect(() => {
        // Focus first input on mount
        if (inputs.current[0]) {
            inputs.current[0].focus();
        }
    }, []);

    const handleChange = (e, index) => {
        const val = e.target.value;
        if (isNaN(Number(val))) return;

        const newValue = value.split('');
        newValue[index] = val.substring(val.length - 1);
        const joinedValue = newValue.join('');
        onChange(joinedValue);

        // Move to next input if value is entered
        if (val && index < length - 1) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const data = e.clipboardData.getData('text').slice(0, length);
        if (isNaN(Number(data))) return;
        onChange(data);
    };

    return (
        <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', margin: '1.5rem 0' }}>
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => (inputs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={value[index] || ''}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    style={{
                        width: '3.75rem',
                        height: '4.5rem',
                        fontSize: '2rem',
                        fontWeight: '800',
                        textAlign: 'center',
                        borderRadius: '14px',
                        border: `2.5px solid ${value[index] ? '#1ECB73' : '#e2e8f0'}`,
                        background: value[index] ? '#f0fdf4' : '#f8fafc',
                        color: '#0f172a',
                        caretColor: '#1ECB73',
                        outline: 'none',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: value[index] ? '0 0 0 4px rgba(30,203,115,0.15)' : 'none',
                        letterSpacing: '0',
                        lineHeight: 1,
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#1ECB73';
                        e.target.style.boxShadow = '0 0 0 4px rgba(30,203,115,0.2)';
                        e.target.style.background = '#f0fdf4';
                        e.target.style.transform = 'scale(1.07)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = value[index] ? '#1ECB73' : '#e2e8f0';
                        e.target.style.boxShadow = value[index] ? '0 0 0 4px rgba(30,203,115,0.15)' : 'none';
                        e.target.style.background = value[index] ? '#f0fdf4' : '#f8fafc';
                        e.target.style.transform = 'scale(1)';
                    }}
                />
            ))}
        </div>
    );
};

export default OtpInput;
