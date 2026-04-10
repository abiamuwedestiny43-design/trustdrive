import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

const AutocompleteInput = ({ value, onChange, placeholder, options, icon: Icon }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const val = e.target.value;
        onChange(val);

        if (val.length > 1) {
            const filtered = options.filter(opt => 
                opt.toLowerCase().includes(val.toLowerCase())
            ).slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelect = (opt) => {
        onChange(opt);
        setShowSuggestions(false);
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
            <div style={{
                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                zIndex: 10, color: '#1ECB73'
            }}>
                {Icon ? <Icon size={18} /> : <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '3px solid #1ECB73' }}></div>}
            </div>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onFocus={() => value.length > 1 && setShowSuggestions(true)}
                style={{
                    width: '100%', padding: '1rem 1rem 1rem 3.2rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s'
                }}
            />
            {showSuggestions && suggestions.length > 0 && (
                <div style={{
                    position: 'absolute', top: '105%', left: 0, right: 0,
                    background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px', zIndex: 100, overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    {suggestions.map((opt, i) => (
                        <div
                            key={i}
                            onClick={() => handleSelect(opt)}
                            style={{
                                padding: '1rem', color: 'white', cursor: 'pointer',
                                borderBottom: i === suggestions.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                                fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={e => e.target.style.background = 'rgba(30, 203, 115, 0.2)'}
                            onMouseLeave={e => e.target.style.background = 'transparent'}
                        >
                            <MapPin size={14} color="#1ECB73" /> {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AutocompleteInput;
