// Create a new feedback
const Feedback = require('../models/review');
const createFeedback = async (req, res) => {
    try {
        const { userId, name, email, rating, feedback, type } = req.body;
        const newFeedback = new Feedback({
            userId,
            name,
            email,
            rating,
            feedback,
            type // Include the type field
        });
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    } catch (err) {
        console.error('Error submitting feedback:', err.message);
        res.status(500).json({ message: 'An error occurred while submitting feedback' });
    }
};


// Get all feedback
const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find();
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Get a single feedback by ID
const getFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Update a feedback by ID
const updateFeedback = async (req, res) => {
    try {
        const { userId, name, email, rating, feedback } = req.body;
        const updatedFeedback = await Feedback.findByIdAndUpdate(req.params.id, {
            userId,
            name,
            email,
            rating,
            feedback
        }, { new: true });
        if (!updatedFeedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json({ message: 'Feedback updated successfully', feedback: updatedFeedback });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Delete a feedback by ID
const deleteFeedback = async (req, res) => {
    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!deletedFeedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json({ message: 'Feedback deleted successfully', feedback: deletedFeedback });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports ={ createFeedback, getAllFeedback, getFeedbackById, updateFeedback, deleteFeedback }