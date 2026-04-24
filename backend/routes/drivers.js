const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// ── GET /api/drivers/online ── Nearby online drivers
router.get('/online', async (req, res) => {
    try {
        const drivers = await User.find({ role: 'driver', isOnline: true, kycStatus: 'approved' })
            .select('name phone vehicleInfo currentLocation rating isOnline');
        res.json({ drivers });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── PATCH /api/drivers/location ── Driver updates their location
router.patch('/location', auth, async (req, res) => {
    try {
        const { lat, lng } = req.body;
        await User.findByIdAndUpdate(req.user.id, { currentLocation: { lat, lng }, isOnline: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── PATCH /api/drivers/status ── Toggle online/offline
router.patch('/status', auth, async (req, res) => {
    try {
        const { isOnline } = req.body;
        await User.findByIdAndUpdate(req.user.id, { isOnline });
        res.json({ success: true, isOnline });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── GET /api/drivers ── Admin: all drivers
router.get('/', auth, async (req, res) => {
    try {
        const drivers = await User.find({ role: 'driver' })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json({ drivers });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── PATCH /api/drivers/:id/kyc ── Admin: update KYC status
router.patch('/:id/kyc', auth, async (req, res) => {
    try {
        const { kycStatus } = req.body;
        const driver = await User.findByIdAndUpdate(
            req.params.id,
            { kycStatus },
            { new: true }
        ).select('-password');
        res.json({ success: true, driver });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
