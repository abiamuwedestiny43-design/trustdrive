const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// ── POST /api/bookings ── Create booking
router.post('/', auth, async (req, res) => {
    try {
        const { pickup, dropoff, carType, paymentMethod, amount, distance, otp } = req.body;
        const booking = await Booking.create({
            rider: req.user.id,
            pickup, dropoff, carType,
            payment: { method: paymentMethod },
            amount, distance, otp,
            status: 'pending'
        });
        res.status(201).json({ success: true, booking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── GET /api/bookings/my ── Rider's bookings
router.get('/my', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ rider: req.user.id })
            .populate('driver', 'name phone vehicleInfo rating')
            .sort({ createdAt: -1 });
        res.json({ bookings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── GET /api/bookings/pending ── Available jobs for drivers
router.get('/pending', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ status: 'pending' })
            .populate('rider', 'name phone rating')
            .sort({ createdAt: -1 });
        res.json({ bookings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── GET /api/bookings/:id ── Single booking
router.get('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('rider',  'name phone rating')
            .populate('driver', 'name phone vehicleInfo rating');
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        res.json({ booking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── PATCH /api/bookings/:id/status ── Update status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Not found' });

        booking.status = status;
        // Assign driver when accepted
        if (status === 'accepted' && !booking.driver) booking.driver = req.user.id;
        await booking.save();

        res.json({ success: true, booking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── PATCH /api/bookings/:id/rate ── Rate the trip
router.patch('/:id/rate', auth, async (req, res) => {
    try {
        const { rating, asRole } = req.body; // asRole: 'rider' | 'driver'
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Not found' });

        if (asRole === 'rider') booking.driverRating = rating;
        else booking.riderRating = rating;
        await booking.save();

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── GET /api/bookings ── Admin: all bookings
router.get('/', auth, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('rider',  'name phone')
            .populate('driver', 'name phone')
            .sort({ createdAt: -1 })
            .limit(100);
        res.json({ bookings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
