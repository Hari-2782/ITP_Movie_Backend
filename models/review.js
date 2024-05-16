// models/feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Theatre', 'Movie', 'Food'] // Possible values for the type field
    }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
