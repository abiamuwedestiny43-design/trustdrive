import { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
    const [bookings, setBookings] = useState([]);
    const [activeBooking, setActiveBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    // Real-time listener for bookings
    useEffect(() => {
        const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const bookingsData = [];
            querySnapshot.forEach((doc) => {
                bookingsData.push({ id: doc.id, ...doc.data() });
            });
            setBookings(bookingsData);

            // Update active booking if it exists in the new data
            if (activeBooking) {
                const updatedActive = bookingsData.find(b => b.id === activeBooking.id);
                if (updatedActive) setActiveBooking(updatedActive);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [activeBooking]);

    const createBooking = async (bookingData) => {
        try {
            const newBookingData = {
                status: 'pending', // pending, accepted, rejected, completed
                createdAt: new Date().toISOString(),
                ...bookingData
            };

            const docRef = await addDoc(collection(db, "bookings"), newBookingData);
            const newBooking = { id: docRef.id, ...newBookingData };

            setActiveBooking(newBooking);
            return newBooking;
        } catch (error) {
            console.error("Error creating booking:", error);
            throw error;
        }
    };

    const updateBookingStatus = async (bookingId, status, additionalData = {}) => {
        try {
            const bookingRef = doc(db, "bookings", bookingId);
            await updateDoc(bookingRef, { status, ...additionalData });
        } catch (error) {
            console.error("Error updating booking:", error);
        }
    };

    const resetBooking = () => setActiveBooking(null);

    return (
        <BookingContext.Provider value={{ bookings, activeBooking, createBooking, updateBookingStatus, loading, resetBooking }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);
