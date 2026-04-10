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
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', margin: '1.5rem 0' }}>
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
                        width: '3.5rem',
                        height: '4rem',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        textAlign: 'center',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'white',
                        outline: 'none',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: value[index] ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none',
                        borderColor: value[index] ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.transform = 'scale(1.05)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = value[index] ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.target.style.transform = 'scale(1)';
                    }}
                />
            ))}
        </div>
    );
};

export default OtpInput;
