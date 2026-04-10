import { io } from 'socket.io-client';

// Configure this to match your backend Socket.io server URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
    socket;

    connect(userId, role) {
        if (!this.socket) {
            this.socket = io(SOCKET_URL, {
                query: { userId, role },
                transports: ['websocket']
            });

            this.socket.on('connect', () => {
                console.log('Connected to TrustDrive Socket API', this.socket.id);
            });

            this.socket.on('disconnect', () => {
                console.log('Disconnected from Socket API');
            });
        }
        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Driver: Stream their location
    streamLocation(bookingId, location) {
        if (this.socket) {
            this.socket.emit('driverLocationUpdate', { bookingId, location });
        }
    }

    // Rider: Listen for driver location
    onDriverLocation(callback) {
        if (this.socket) {
            this.socket.on('locationUpdate', callback);
        }
    }

    // Unsubscribe from location updates
    offDriverLocation() {
        if (this.socket) {
            this.socket.off('locationUpdate');
        }
    }
}

export const socketService = new SocketService();
