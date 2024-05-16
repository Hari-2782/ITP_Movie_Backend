const express = require('express');
const router = express.Router();
const slipController = require('../controller/paymentsliptcontroller');
const Photo = require('../controller/paymentfilecontroller');

// Create a new slip
router.post('/slips', slipController.createSlip);

// Get all slips
router.get('/slips', slipController.getAllSlips);

// Get a single slip by ID
router.get('/slips/:id', slipController.getSlipById);

// Update a slip by ID
router.put('/slips/:id', slipController.updateSlipById);

// Delete a slip by ID
router.delete('/slips/:id', slipController.deleteSlipById);
router.post('/upload',Photo.FileUpload)
module.exports = router;
