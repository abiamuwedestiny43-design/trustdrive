const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:      { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    phone:     { type: String },
    role:      { type: String, enum: ['user', 'driver', 'admin'], default: 'user' },
    password:  { type: String, required: true },
    isActive:  { type: Boolean, default: true },
    rating:    { type: Number, default: 5.0 },
    // Driver-specific
    vehicleInfo: {
        make:  String,
        model: String,
        plate: String,
        color: String,
    },
    currentLocation: {
        lat: Number,
        lng: Number,
    },
    isOnline:  { type: Boolean, default: false },
    kycStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
