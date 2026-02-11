const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Create Booking
router.post('/', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get User Bookings
router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Pending Bookings (For Drivers/Admin)
router.get('/pending', async (req, res) => {
    try {
        const bookings = await Booking.find({ status: { $in: ['pending', 'accepted'] } })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Status (Accept/Reject)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, driverId } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status, driverId },
            { new: true }
        );
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
