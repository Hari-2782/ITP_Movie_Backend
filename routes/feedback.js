// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const { createFeedback, getAllFeedback, getFeedbackById, updateFeedback, deleteFeedback } = require('../controller/feedbackcontroller');

// Create a new feedback
router.post('/', createFeedback);

// Get all feedback
router.get('/', getAllFeedback);

// Get a single feedback by ID
router.get('/:id', getFeedbackById);

// Update a feedback by ID
router.put('/:id', updateFeedback);

// Delete a feedback by ID
router.delete('/:id', deleteFeedback);

module.exports = router;
