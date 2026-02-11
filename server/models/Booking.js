const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pickup: { type: String, required: true },
    dropoff: { type: String, required: true },
    carType: { type: String, enum: ['premium', 'suv', 'van'], default: 'premium' },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    distance: { type: String },
    price: { type: Number },
    paymentMethod: { type: String, enum: ['naira', 'usdt', 'cash'], default: 'cash' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
