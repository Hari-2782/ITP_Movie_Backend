const Slip = require('../models/slip');
const screen=require("../models/screen");
const nodemailer = require('nodemailer');
const sendEmailNotification = async (toEmail, status) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'balacinema235@gmail.com',
            pass: 'bzfv mdhl rgic rlhu' 
        }
    });

    // Email content
    const mailOptions = {
        from: 'balacinema235@gmail.com',
        to: toEmail, 
        subject: 'Payment Approve Notification',
        text: `Your Payment  status has been  ${status}`
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully');
    } catch (error) {
        console.error('Error sending email notification:', error);
    }
};
// Create a new slip
const createSlip = async (req, res) => {
    try {
        const { userId, email, PhotoFileName } = req.body;
        const newSlip = new Slip({
            userId,
            email,
            PhotoFileName
        });
        await newSlip.save();
        res.status(201).json({ message: 'Slip created successfully', slip: newSlip });
    } catch (err) {
        console.error('Error creating slip:', err.message);
        res.status(500).json({ message: 'An error occurred while creating slip' });
    }
};

// Get all slips
const getAllSlips = async (req, res) => {
    try {
        const slips = await Slip.find();
        res.json(slips);
    } catch (err) {
        console.error('Error fetching slips:', err.message);
        res.status(500).json({ message: 'An error occurred while fetching slips' });
    }
};

// Get a single slip by ID
const getSlipById = async (req, res) => {
    try {
        const slip = await Slip.findById(req.params.id);
        if (!slip) {
            return res.status(404).json({ message: 'Slip not found' });
        }
        res.json(slip);
    } catch (err) {
        console.error('Error fetching slip:', err.message);
        res.status(500).json({ message: 'An error occurred while fetching slip' });
    }
};

// Update a slip by ID
const updateSlipById = async (req, res) => {
    try {
       
        const slip = await Slip.findByIdAndUpdate(req.params.id,  req.body, { new: true });
        if (!slip) {
            return res.status(404).json({ message: 'Slip not found' });
        }
        res.json({ message: 'Slip updated successfully', slip });
        await sendEmailNotification(slip.email, slip.status);
    } catch (err) {
        console.error('Error updating slip:', err.message);
        res.status(500).json({ message: 'An error occurred while updating slip' });
    }
};

// Delete a slip by ID
const deleteSlipById = async (req, res) => {
    try {
        const slip = await Slip.findByIdAndDelete(req.params.id);
        
        if (!slip) {
            return res.status(404).json({ message: 'Slip not found' });
        }
       cancel=screen.findById(re)
        res.json({ message: 'Slip deleted successfully', slip });
    } catch (err) {
        console.error('Error deleting slip:', err.message);
        res.status(500).json({ message: 'An error occurred while deleting slip' });
    }
};

module.exports = {
    createSlip,
    getAllSlips,
    getSlipById,
    updateSlipById,
    deleteSlipById
};
