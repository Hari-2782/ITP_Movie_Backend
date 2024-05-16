const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    Totalamount: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking', // Reference to the Booking model
        required: true
    },
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food', // Reference to the Food model
        required: true
        },
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package', // Reference to the package model
        
       
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
