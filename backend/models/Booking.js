const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    rider:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driver:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pickup:   { type: String, required: true },
    dropoff:  { type: String, required: true },
    pickupCoords:  { lat: Number, lng: Number },
    dropoffCoords: { lat: Number, lng: Number },
    carType:  { type: String, default: 'premium' },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    amount:    { type: Number, required: true },
    distance:  { type: String },
    otp:       { type: String },
    payment: {
        method: { type: String, enum: ['cash', 'card', 'transfer', 'ussd', 'usdt'] },
        paid:   { type: Boolean, default: false },
    },
    riderRating: Number,
    driverRating: Number,
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
