const mongoose = require('mongoose');

const SlipSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    email: {
        type: String, // Store email as a string
        required: true
    },
    
    PhotoFileName: {
        type: String,
        required: true
    },status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
});

const Slip = mongoose.model('slip', SlipSchema);
module.exports = Slip;