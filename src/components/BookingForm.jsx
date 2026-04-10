import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Car, CreditCard, Plane, Train, Bike, Bus, ParkingSquare, Flag } from 'lucide-react';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import PaymentConfirmModal from './PaymentConfirmModal';
import UserTripTracker from './UserTripTracker';
import { sendSMS } from '../utils/twilio';
import AutocompleteInput from './common/AutocompleteInput';
import { allNigeriaCities } from '../utils/locations';

const BookingForm = () => {
    const { createBooking, updateBookingStatus, activeBooking, resetBooking } = useBooking();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [serviceType, setServiceType] = useState('ride'); // 'ride', 'flight', 'metro', 'bike', 'parking'
    const [carType, setCarType] = useState(null); // Step 2: Select Option
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
    }, [pickup, dropoff, serviceType]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!pickup || !dropoff) return;

        setIsSearching(true);
        // Simulate API delay for route calculation
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Calculate random distance
        const dist = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
        setDistance(dist);
        setHasSearched(true);
        setIsSearching(false);
    };

    const getPrice = () => {
        if (!distance || !carType) return 0;
        let baseFare = 2500;
        let ratePerKm = 3600;
        let mult = 1;

        if (serviceType === 'flight') {
            baseFare = 75000;
            ratePerKm = 12000;
        } else if (serviceType === 'metro') {
            baseFare = 500;
            ratePerKm = 150;
        } else if (serviceType === 'bike') {
            baseFare = 800;
            ratePerKm = 400;
        } else if (serviceType === 'parking') {
            baseFare = 1500;
            ratePerKm = 0; // Flat or duration based
        }

        // Mults for vehicle types
        if (['suv', 'business', 'premium_metro', 'bus'].includes(carType)) mult = 1.5;
        if (['van', 'first', 'executive_metro'].includes(carType)) mult = 2.5;
        if (['eco_parking'].includes(carType)) mult = 0.8;
        if (['secure_parking'].includes(carType)) mult = 1.2;

        return (baseFare + (distance * ratePerKm)) * mult;
    };

    const getEstimate = (type) => {
        if (!distance) return "Scanning...";
        let baseFare = 2500;
        let ratePerKm = 3600;
        let mult = 1;

        if (serviceType === 'flight') {
            baseFare = 75000;
            ratePerKm = 12000;
        } else if (serviceType === 'metro') {
            baseFare = 500;
            ratePerKm = 150;
        } else if (serviceType === 'bike') {
            baseFare = 800;
            ratePerKm = 400;
        } else if (serviceType === 'parking') {
            baseFare = 1500;
            ratePerKm = 0;
        }

        if ([ 'suv', 'business', 'premium_metro', 'bus'].includes(type)) mult = 1.5;
        if (['van', 'first', 'executive_metro'].includes(type)) mult = 2.5;
        if (['eco_parking'].includes(type)) mult = 0.8;
        if (['secure_parking'].includes(type)) mult = 1.2;
        
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

            // Send Twilio SMS Notification with OTP
            try {
                const msg = `Ahoy 👋 Your TrustDrive from ${pickup} is confirmed! Your ride OTP is: ${otp}. Fare: ₦${getPrice().toLocaleString()}`;
                await sendSMS('+18777804236', msg);
                console.log("SMS Notification dispatched successfully.");
            } catch (err) {
                console.error("Could not send SMS:", err);
            }

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

                    {/* TrustDrive Logo Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.4rem', background: '#1ECB73', borderRadius: '8px', color: 'white' }}>
                             <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '4px' }}></div>
                        </div>
                        <span style={{ fontWeight: '900', fontSize: '1.2rem', color: '#0f172a', letterSpacing: '0.5px' }}>TRUSTDRIVE</span>
                    </div>

                    {/* Service Type Tabs - Scrollable */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.75rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        <ServiceTab active={serviceType === 'ride'} onClick={() => setServiceType('ride')} icon={Car} label="Ride" />
                        <ServiceTab active={serviceType === 'bike'} onClick={() => setServiceType('bike')} icon={Bike} label="Bike" />
                        <ServiceTab active={serviceType === 'flight'} onClick={() => setServiceType('flight')} icon={Plane} label="Flight" />
                        <ServiceTab active={serviceType === 'metro'} onClick={() => setServiceType('metro')} icon={Train} label="Metro" />
                        <ServiceTab active={serviceType === 'parking'} onClick={() => setServiceType('parking')} icon={ParkingSquare} label="Parking" />
                    </div>

                    <h2 style={{
                        fontSize: '1.4rem',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        color: '#000000',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        {serviceType === 'ride' ? 'Book a Car/Bus' : serviceType === 'bike' ? 'Quick Bike' : serviceType === 'flight' ? 'Fly National' : serviceType === 'metro' ? 'Take the Metro' : 'Vehicle Parking'} 
                        <span style={{ width: '8px', height: '8px', background: '#34d399', borderRadius: '50%', boxShadow: '0 0 10px #34d399' }} className="animate-pulse"></span>
                    </h2>

                    <form onSubmit={hasSearched ? handleSubmit : handleSearch} style={{ position: 'relative', zIndex: 1 }}>
                        {/* Pickup Input - Nigeria Autocomplete */}
                        <AutocompleteInput
                            placeholder={serviceType === 'parking' ? "Parking Location" : "Start Location"}
                            value={pickup}
                            onChange={setPickup}
                            options={allNigeriaCities}
                            icon={serviceType === 'parking' ? ParkingSquare : MapPin}
                        />

                        {/* Connecting Line - Glowing */}
                        <div style={{
                            height: '30px',
                            borderLeft: '2px dashed rgba(30, 203, 115, 0.5)',
                            marginLeft: '21px',
                            margin: '-4px 0',
                            position: 'relative',
                            zIndex: 0
                        }}></div>

                        {/* Dropoff Input - Nigeria Autocomplete */}
                        <AutocompleteInput
                            placeholder={serviceType === 'parking' ? "Destination (Optional)" : "Where to?"}
                            value={dropoff}
                            onChange={setDropoff}
                            options={allNigeriaCities}
                            icon={serviceType === 'parking' ? MapPin : Flag}
                        />

                        {/* Step 2: Select Option */}
                        {hasSearched && (
                            <div style={{ margin: '1.5rem 0', animation: 'slideIn 0.3s ease-out' }}>
                                <label style={{
                                    display: 'block', marginBottom: '0.75rem', fontWeight: '700', fontSize: '0.85rem',
                                    color: '#334155', textTransform: 'uppercase', letterSpacing: '1px'
                                }}>
                                    {serviceType === 'ride' ? 'Ride Options' : serviceType === 'flight' ? 'Flight Classes' : serviceType === 'metro' ? 'Metro Carriage' : serviceType === 'bike' ? 'Bike Type' : 'Parking Type'}
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                    {serviceType === 'ride' && (
                                        <>
                                            <OptionCard selected={carType === 'premium'} onClick={() => setCarType('premium')} label="Premium" price={getEstimate('premium')} icon={Car} />
                                            <OptionCard selected={carType === 'suv'} onClick={() => setCarType('suv')} label="SUV" price={getEstimate('suv')} icon={Car} />
                                            <OptionCard selected={carType === 'bus'} onClick={() => setCarType('bus')} label="Bus" price={getEstimate('bus')} icon={Bus} />
                                        </>
                                    )}
                                    {serviceType === 'bike' && (
                                        <>
                                            <OptionCard selected={carType === 'moto'} onClick={() => setCarType('moto')} label="Motorbike" price={getEstimate('moto')} icon={Bike} />
                                            <OptionCard selected={carType === 'bicycle'} onClick={() => setCarType('bicycle')} label="Bicycle" price={getEstimate('bicycle')} icon={Bike} />
                                            <OptionCard selected={carType === 'delivery'} onClick={() => setCarType('delivery')} label="Delivery" price={getEstimate('delivery')} icon={Bike} />
                                        </>
                                    )}
                                    {serviceType === 'flight' && (
                                        <>
                                            <OptionCard selected={carType === 'economy'} onClick={() => setCarType('economy')} label="Economy" price={getEstimate('economy')} icon={Plane} />
                                            <OptionCard selected={carType === 'business'} onClick={() => setCarType('business')} label="Business" price={getEstimate('business')} icon={Plane} />
                                            <OptionCard selected={carType === 'first'} onClick={() => setCarType('first')} label="First Class" price={getEstimate('first')} icon={Plane} />
                                        </>
                                    )}
                                    {serviceType === 'metro' && (
                                        <>
                                            <OptionCard selected={carType === 'standard_metro'} onClick={() => setCarType('standard_metro')} label="Standard" price={getEstimate('standard_metro')} icon={Train} />
                                            <OptionCard selected={carType === 'premium_metro'} onClick={() => setCarType('premium_metro')} label="Premium" price={getEstimate('premium_metro')} icon={Train} />
                                            <OptionCard selected={carType === 'executive_metro'} onClick={() => setCarType('executive_metro')} label="Executive" price={getEstimate('executive_metro')} icon={Train} />
                                        </>
                                    )}
                                    {serviceType === 'parking' && (
                                        <>
                                            <OptionCard selected={carType === 'standard_park'} onClick={() => setCarType('standard_park')} label="Standard" price={getEstimate('standard_park')} icon={ParkingSquare} />
                                            <OptionCard selected={carType === 'secure_park'} onClick={() => setCarType('secure_park')} label="Secure" price={getEstimate('secure_park')} icon={Shield} />
                                            <OptionCard selected={carType === 'valet'} onClick={() => setCarType('valet')} label="Valet" price={getEstimate('valet')} icon={Settings} />
                                        </>
                                    )}
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
                                {loading ? 'Processing Request...' : !paymentMethod ? 'Select Details Above' : `Confirm ${serviceType === 'ride' ? 'Car/Bus' : serviceType === 'bike' ? 'Bike' : serviceType === 'flight' ? 'Flight' : serviceType === 'metro' ? 'Metro' : 'Parking'} • ${distance}km • ${paymentMethod === 'usdt' ? '₮' : '₦'}${getPrice().toLocaleString()}`}
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

const ServiceTab = ({ active, onClick, icon: Icon, label }) => (
    <button 
        onClick={onClick}
        style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            padding: '0.6rem 1rem', borderRadius: '12px',
            background: active ? '#1ECB73' : 'rgba(15, 23, 42, 0.05)',
            color: active ? 'white' : '#64748b',
            fontWeight: '700', border: 'none', transition: 'all 0.3s',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
        }}
    >
        <Icon size={18} /> {label}
    </button>
);

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

const OptionCard = ({ selected, onClick, label, price, icon: Icon }) => (
    <div
        onClick={onClick}
        style={{
            position: 'relative',
            background: selected ? '#10b981' : '#f8fafc',
            border: selected ? '1px solid #10b981' : '1px solid #e2e8f0',
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
        {selected && (
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
                pointerEvents: 'none'
            }}></div>
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
            <Icon size={22} style={{
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
                fontFamily: 'monospace',
                marginTop: '0.25rem',
                fontWeight: selected ? '600' : '400'
            }}>
                {price}
            </div>
        </div>
    </div>
);

export default BookingForm;
