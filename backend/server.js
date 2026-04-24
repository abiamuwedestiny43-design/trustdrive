const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── Routes ──
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/drivers',  require('./routes/drivers'));

app.get('/', (req, res) => res.json({ status: 'TrustDrive API Running ✅', version: '1.0.0' }));

// ── Socket.io: Real-time driver location ──
const connectedDrivers = {}; // { driverId: socketId }

io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Driver registers
    socket.on('driver:register', ({ driverId }) => {
        connectedDrivers[driverId] = socket.id;
        console.log(`🚗 Driver registered: ${driverId}`);
    });

    // Driver sends live location
    socket.on('driver:location', ({ driverId, bookingId, location }) => {
        // Broadcast to all riders listening for this booking
        io.emit(`booking:${bookingId}:location`, { driverId, location });
    });

    // Rider accepts / status changes
    socket.on('booking:statusUpdate', ({ bookingId, status, driverId }) => {
        io.emit(`booking:${bookingId}:status`, { status, driverId });
    });

    socket.on('disconnect', () => {
        // Remove driver from connected map
        for (const [id, sid] of Object.entries(connectedDrivers)) {
            if (sid === socket.id) {
                delete connectedDrivers[id];
                console.log(`🔴 Driver disconnected: ${id}`);
            }
        }
    });
});

// ── MongoDB ──
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/trustdrive';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.warn('⚠️  MongoDB not connected (running in offline mode):', err.message));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
