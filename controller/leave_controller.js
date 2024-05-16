const Leave = require('../models/Leave_model');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const sendEmailNotification = async (toEmail, leaveType) => {

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
    subject: 'Leave Application Notification',
    text: `Your ${leaveType} leave application has been submitted successfully. status is`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};

exports.getAllLeaveForEmployee = async (req, res) => {
  try {
    const email = req.user.email;
    const leaves = await Leave.find({ email: email });
    res.json(leaves);
  } catch (err) {
    res.status(500).send({ message: err.message || 'Error while retrieving leave information' });
  }
};

exports.createLeave = async (req, res) => {
  const { leaveType, startDate, endDate, PhotoFileName } = req.body;
  const email = req.user.email; 

  if (!leaveType || !startDate || !endDate) {
    return res.status(400).json({ message: 'Leave type, start date, and end date are required' });
  }

  try {
    const leaveId = uuidv4().slice(0, 4); 
    const leave = new Leave({
      LeaveId: leaveId,
      email: email,
      leaveType,
      startDate,
      endDate,
      status: 'pending',
      adminComment: 'pending',
      PhotoFileName
    });

    const savedLeave = await leave.save();
    
    await sendEmailNotification(email, leaveType);
    
    res.status(201).json(savedLeave);
  } catch (err) {
    res.status(500).json({ message: 'Error adding leave to database' });
  }
};

exports.updateLeave = async (req, res) => {
  if (!req.body) {
    return res.status(404).send({ message: err.message || `Error while updating the data cannot be empty` });
  }
  try {
    const id = req.params.id;
    const data = await Leave.findByIdAndUpdate(id, req.body);
    if (data) {
      res.json(data);
    } else {
      res.status(404).send({ message: err.message || `cannot update LEAVE with identified id ${id} or maybe user not found!` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message || `error updating LEAVE information` });
  }
};

exports.deleteLeave = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedLeave = await Leave.findByIdAndDelete(id);
    if (!deletedLeave) {
      return res.status(404).json({ message: `Leave not found or you don't have permission to delete` });
    }
    res.json({ message: 'Leave deleted successfully' });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: `Error deleting leave with id ${id}` });
  }
};
