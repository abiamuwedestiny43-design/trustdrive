import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Change to server IP for physical device

class LocationSocket {
    constructor() {
        this.socket = null;
        this.driverId = null;
    }

    connect(driverId) {
        this.driverId = driverId;
        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
        });

        this.socket.on('connect', () => {
            console.log('🔌 Socket connected:', this.socket.id);
            // Register this driver
            this.socket.emit('driver:register', { driverId });
        });

        this.socket.on('disconnect', () => {
            console.log('🔴 Socket disconnected');
        });

        this.socket.on('connect_error', (err) => {
            console.warn('Socket error:', err.message);
        });
    }

    // ── DRIVER SENDS LIVE LOCATION (Uber pattern) ──
    sendLocation({ lat, lng, bookingId }) {
        if (!this.socket?.connected) return;
        this.socket.emit('driverLocation', {
            driverId: this.driverId,
            bookingId,
            lat,
            lng,
        });
    }

    // ── DRIVER UPDATES BOOKING STATUS ──
    updateBookingStatus({ bookingId, status }) {
        if (!this.socket?.connected) return;
        this.socket.emit('booking:statusUpdate', {
            bookingId,
            status,
            driverId: this.driverId,
        });
    }

    // ── RIDER LISTENS FOR DRIVER LOCATION ──
    onDriverLocationUpdate(callback) {
        this.socket?.on('driverLocationUpdate', callback);
    }

    // ── RIDER LISTENS FOR STATUS CHANGE ──
    onBookingStatusChange(bookingId, callback) {
        this.socket?.on(`booking:${bookingId}:status`, callback);
    }

    disconnect() {
        this.socket?.disconnect();
    }
}

export const locationSocket = new LocationSocket();
export default locationSocket;
