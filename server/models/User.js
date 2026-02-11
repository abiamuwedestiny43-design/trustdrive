const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In real app, hash this!
    role: { type: String, enum: ['user', 'driver', 'admin'], default: 'user' },
    avatar: { type: String },
    isOnline: { type: Boolean, default: false }, // For drivers
    currentLocation: { // For drivers
        lat: Number,
        lng: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
