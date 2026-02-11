import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Car, CreditCard } from 'lucide-react';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import PaymentConfirmModal from './PaymentConfirmModal';
import UserTripTracker from './UserTripTracker';

const BookingForm = () => {
    const { createBooking, updateBookingStatus, activeBooking, resetBooking } = useBooking();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [carType, setCarType] = useState(null); // Step 2: Select Ride
    const [paymentMethod, setPaymentMethod] = useState(null); // Step 3: Select Payment
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Flow State
    const [hasSearched, setHasSearched] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const [loading, setLoading] = useState(false);
    const [distance, setDistance] = useState(null);

    // Reset flow if inputs change significantl
    React.useEffect(() => {
        if (!pickup || !dropoff) {
            setHasSearched(false);
            setDistance(null);
            setCarType(null);
            setPaymentMethod(null);
        }
    }, [pickup, dropoff]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!pickup || !dropoff) return;

        setIsSearching(true);
        // Simulate API delay for route calculation
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Calculate random distance
        const dist = Math.floor(Math.random() * (25 - 5 + 1)) + 5;
        setDistance(dist);
        setHasSearched(true);
        setIsSearching(false);
    };

    const getPrice = () => {
        if (!distance || !carType) return 0; // Price depends on car type now
        const baseFare = 2500;
        const ratePerKm = 3600;
        let carMultiplier = 1;

        if (carType === 'suv') carMultiplier = 1.5;
        if (carType === 'van') carMultiplier = 2;

        return (baseFare + (distance * ratePerKm)) * carMultiplier; // Simplified for display
    };

    // Helper to get estimated price range or specific price
    const getEstimate = (type) => {
        if (!distance) return "Checking...";
        const baseFare = 2500;
        const ratePerKm = 3600;
        let mult = 1;
        if (type === 'suv') mult = 1.5;
        if (type === 'van') mult = 2;
        return `₦${((baseFare + (distance * ratePerKm)) * mult).toLocaleString()}`;
    };

    const handleBookingCreation = async () => {
        if (!user) { navigate('/login'); return; }

        setLoading(true);
        try {
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            const bookingData = {
                pickup,
                dropoff,
                carType,
                paymentMethod,
                distance: `${distance} km`,
                amount: getPrice(),
                userId: user.uid,
                userName: user.name || user.email,
                otp: otp,
                userLocation: {
                    lat: 6.5244 + (Math.random() * 0.05),
                    lng: 3.3792 + (Math.random() * 0.05)
                }
            };

            const createdBooking = await createBooking(bookingData);

            // Context automatically sets activeBooking

            // Reset Form Fields in background
            setPickup('');
            setDropoff('');
            setDistance(null);
            setHasSearched(false);
            setCarType(null);
            setPaymentMethod(null);
        } catch (error) {
            console.error(error);
            alert('Booking failed.');
        } finally {
            setLoading(false);
            setIsPaymentModalOpen(false);
        }
    };

    const handleCancelRide = async () => {
        if (activeBooking && activeBooking.id) {
            await updateBookingStatus(activeBooking.id, 'cancelled');
            resetBooking();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        if (paymentMethod === 'cash') {
            await handleBookingCreation();
        } else {
            setIsPaymentModalOpen(true);
        }
    };

    return (
        <>
            {activeBooking ? (
                <UserTripTracker
                    booking={activeBooking}
                    onCancel={handleCancelRide} // Pass cancellation handler
                    onReset={resetBooking}
                />
            ) : (
                /* Premium AI Cab Design Card */
                <Card glass style={{
                    maxWidth: '450px',
                    padding: '2rem',
                    background: 'rgba(255, 255, 255, 0.9)', // White/Glass background
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(12px)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* AI Grid Pattern Overlay - Subtle on black */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        opacity: 0.1,
                        pointerEvents: 'none'
                    }}></div>

                    <h2 style={{
                        fontSize: '1.75rem',
                        fontWeight: '800',
                        marginBottom: '1.5rem',
                        color: '#000000', // Black text
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        Where to? <span style={{ width: '8px', height: '8px', background: '#34d399', borderRadius: '50%', boxShadow: '0 0 10px #34d399' }} className="animate-pulse"></span>
                    </h2>

                    <form onSubmit={hasSearched ? handleSubmit : handleSearch} style={{ position: 'relative', zIndex: 1 }}>
                        {/* Pickup Input - AI Verified Style */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                                zIndex: 10, color: '#34d399'
                            }}>
                                <div style={{
                                    width: '12px', height: '12px', borderRadius: '50%', border: '3px solid #34d399',
                                    boxShadow: '0 0 5px rgba(52, 211, 153, 0.5)'
                                }}></div>
                            </div>
                            <input
                                type="text"
                                placeholder="Pickup Location"
                                value={pickup}
                                onChange={e => setPickup(e.target.value)}
                                style={{
                                    width: '100%', padding: '1rem 1rem 1rem 3rem',
                                    background: '#0f172a', /* Dark input on black card */
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.3s'
                                }}
                                onFocus={e => {
                                    e.target.style.borderColor = '#34d399';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(52, 211, 153, 0.2)';
                                }}
                                onBlur={e => {
                                    e.target.style.borderColor = 'rgba(52, 211, 153, 0.3)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        {/* Connecting Line - Glowing */}
                        <div style={{
                            height: '30px',
                            borderLeft: '2px dashed rgba(52, 211, 153, 0.5)',
                            marginLeft: '21px',
                            margin: '-4px 0',
                            position: 'relative',
                            zIndex: 0
                        }}></div>

                        {/* Dropoff Input */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                                zIndex: 10, color: '#34d399'
                            }}>
                                <MapPin size={20} fill="#34d399" color="#064e3b" />
                            </div>
                            <input
                                type="text"
                                placeholder="Dropoff Destination"
                                value={dropoff}
                                onChange={e => setDropoff(e.target.value)}
                                style={{
                                    width: '100%', padding: '1rem 1rem 1rem 3rem',
                                    background: '#0f172a', /* Dark input on black card */
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.3s'
                                }}
                                onFocus={e => {
                                    e.target.style.borderColor = '#34d399';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(52, 211, 153, 0.2)';
                                }}
                                onBlur={e => {
                                    e.target.style.borderColor = 'rgba(52, 211, 153, 0.3)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        {/* Step 2: Select Ride */}
                        {hasSearched && (
                            <div style={{ margin: '1.5rem 0', animation: 'slideIn 0.3s ease-out' }}>
                                <label style={{
                                    display: 'block', marginBottom: '0.75rem', fontWeight: '700', fontSize: '0.85rem',
                                    color: '#334155', textTransform: 'uppercase', letterSpacing: '1px'
                                }}>
                                    Available Rides
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                    <CarOption selected={carType === 'premium'} onClick={() => setCarType('premium')} label="Premium" price={getEstimate('premium')} />
                                    <CarOption selected={carType === 'suv'} onClick={() => setCarType('suv')} label="SUV" price={getEstimate('suv')} />
                                    <CarOption selected={carType === 'van'} onClick={() => setCarType('van')} label="Van" price={getEstimate('van')} />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment Method */}
                        {hasSearched && carType && (
                            <div style={{ margin: '1.5rem 0', animation: 'slideIn 0.3s ease-out' }}>
                                <label style={{
                                    display: 'block', marginBottom: '0.75rem', fontWeight: '700', fontSize: '0.85rem',
                                    color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '1px'
                                }}>
                                    Payment
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                    <PaymentOption selected={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')} label="Card" />
                                    <PaymentOption selected={paymentMethod === 'transfer'} onClick={() => setPaymentMethod('transfer')} label="Transfer" />
                                    <PaymentOption selected={paymentMethod === 'ussd'} onClick={() => setPaymentMethod('ussd')} label="USSD" />
                                    <PaymentOption selected={paymentMethod === 'usdt'} onClick={() => setPaymentMethod('usdt')} label="USDT" />
                                    <PaymentOption selected={paymentMethod === 'cash'} onClick={() => setPaymentMethod('cash')} label="Cash" />
                                </div>
                            </div>
                        )}

                        {!hasSearched ? (
                            <Button
                                type="submit"
                                variant="primary"
                                style={{
                                    width: '100%', padding: '1rem', marginTop: '1rem',
                                    background: 'linear-gradient(to right, #10b981, #059669)', // Gradient Green
                                    color: '#ffffff', fontWeight: '800',
                                    border: 'none',
                                    borderRadius: '12px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                                    transition: 'all 0.2s',
                                    fontSize: '1.1rem'
                                }}
                                disabled={isSearching || !pickup || !dropoff}
                                onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                            >
                                {isSearching ? 'Scanning Routes...' : 'Find Your Ride'}
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                variant="primary"
                                className="animate-pulse"
                                style={{
                                    width: '100%', padding: '1rem', marginTop: '1rem',
                                    background: paymentMethod ? 'linear-gradient(to right, #10b981, #059669)' : 'rgba(6, 78, 59, 0.5)',
                                    color: paymentMethod ? 'white' : 'rgba(255,255,255,0.5)',
                                    fontWeight: '800',
                                    borderRadius: '12px',
                                    transition: 'all 0.3s',
                                    boxShadow: paymentMethod ? '0 4px 15px rgba(16, 185, 129, 0.4)' : 'none'
                                }}
                                disabled={loading || !paymentMethod}
                            >
                                {loading ? 'Processing Request...' : !paymentMethod ? 'Select Details Above' : `Confirm Ride • ${distance}km • ${paymentMethod === 'usdt' ? '₮' : '₦'}${getPrice().toLocaleString()}`}
                            </Button>
                        )}
                    </form>
                </Card>
            )}

            <PaymentConfirmModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onConfirm={handleBookingCreation}
                amount={getPrice()}
                method={paymentMethod}
            />
        </>
    );
};

const PaymentOption = ({ selected, onClick, label }) => (
    <div
        onClick={onClick}
        style={{
            border: `1px solid ${selected ? '#10b981' : '#e2e8f0'}`,
            background: selected ? 'rgba(16, 185, 129, 0.15)' : '#f8fafc',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.2s',
            fontWeight: '600',
            fontSize: '0.9rem',
            color: selected ? '#10b981' : '#64748b'
        }}
    >
        {label}
    </div>
);

const CarOption = ({ selected, onClick, label, price }) => (
    <div
        onClick={onClick}
        style={{
            position: 'relative',
            background: selected ? '#10b981' : '#f8fafc', // Solid Block: Emerald vs Light Slate
            border: selected ? '1px solid #10b981' : '1px solid #e2e8f0', // Seamless border for active
            padding: '1rem 0.5rem',
            borderRadius: '12px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: selected ? '0 10px 25px -5px rgba(16, 185, 129, 0.5)' : 'none',
            transform: selected ? 'translateY(-4px)' : 'none',
            overflow: 'hidden'
        }}
    >
        {/* AI Scanline Effect for Active State */}
        {selected && (
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
                pointerEvents: 'none'
            }}></div>
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
            <Car size={22} style={{
                color: selected ? 'white' : '#64748b',
                marginBottom: '0.5rem',
                display: 'inline-block'
            }} />
            <div style={{
                fontSize: '0.9rem',
                fontWeight: '700',
                color: selected ? 'white' : '#334155',
                letterSpacing: '0.5px'
            }}>
                {label}
            </div>
            <div style={{
                fontSize: '0.75rem',
                color: selected ? 'rgba(255,255,255,0.9)' : '#64748b',
                fontFamily: 'monospace', // Tech feel
                marginTop: '0.25rem',
                fontWeight: selected ? '600' : '400'
            }}>
                {price}
            </div>
        </div>
    </div>
);

export default BookingForm;
