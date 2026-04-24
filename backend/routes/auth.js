const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'trustdrive_secret_key';

// ── POST /api/auth/send-otp ──
// Generates a 4-digit OTP and sends via Twilio (server-side)
router.post('/send-otp', async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number required' });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // In production: store OTP in Redis with 5min TTL
    // For now store in memory (use Redis in prod)
    global.otpStore = global.otpStore || {};
    global.otpStore[phone] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    // Send via Twilio
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken  = process.env.TWILIO_AUTH_TOKEN;
        const from       = process.env.TWILIO_MESSAGING_SERVICE_SID;

        if (accountSid && authToken) {
            const client = require('twilio')(accountSid, authToken);
            await client.messages.create({
                body: `Your TrustDrive verification code is: ${otp}. Valid for 5 minutes.`,
                messagingServiceSid: from,
                to: phone,
            });
        } else {
            console.log(`[DEV] OTP for ${phone}: ${otp}`);
        }

        res.json({ success: true, message: 'OTP sent', dev_otp: process.env.NODE_ENV !== 'production' ? otp : undefined });
    } catch (err) {
        console.error('Twilio error:', err.message);
        res.status(500).json({ error: 'Failed to send OTP', dev_otp: otp });
    }
});

// ── POST /api/auth/verify-otp ──
router.post('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' });

    const stored = global.otpStore?.[phone];

    // Accept dev bypass code '1234'
    const isValid = otp === '1234' || (stored && stored.otp === otp && Date.now() < stored.expires);
    if (!isValid) return res.status(401).json({ error: 'Invalid or expired OTP' });

    // Clear OTP
    if (global.otpStore?.[phone]) delete global.otpStore[phone];

    // Find or create user
    let user = await User.findOne({ phone });
    const isNewUser = !user;

    if (!user) {
        // Create minimal user profile
        const dummyEmail    = `phone_${phone.replace(/\D/g, '')}@trustdrive.com`;
        const dummyPassword = await bcrypt.hash(`pass_${phone.slice(-4)}`, 10);
        user = await User.create({ name: 'TrustDrive User', email: dummyEmail, phone, password: dummyPassword, role: 'user' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }, isNewUser });
});

// ── POST /api/auth/register ──
router.post('/register', async (req, res) => {
    const { name, email, phone, password, role = 'user' } = req.body;
    try {
        const exists = await User.findOne({ $or: [{ email }, { phone }] });
        if (exists) return res.status(400).json({ error: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user   = await User.create({ name, email, phone, password: hashed, role });
        const token  = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({ success: true, token, user: { id: user._id, name, email, role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── POST /api/auth/login ──
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ success: true, token, user: { id: user._id, name: user.name, email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── GET /api/auth/me ──
router.get('/me', require('../middleware/auth'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
