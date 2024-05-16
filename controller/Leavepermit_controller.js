const Leave = require('../models/Leave_model');
const nodemailer = require('nodemailer');
const Employee=require("../models/Employee_model")


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
        subject: 'Leave Application Notification',
        text: `Your leave application status has been  ${status}`
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully');
    } catch (error) {
        console.error('Error sending email notification:', error);
    }
};


const calculateAttendancePercentage = (attendance) => {
    let totalDays = 0;
    let presentDays = 0;

    for (let i = 0; i < attendance.length; i++) {
        totalDays++;
        if (attendance[i].Attendancestatus === 'present') {
            presentDays++;
        }
    }

    const percentage = (presentDays / totalDays) * 100;

    return percentage.toFixed(2); 
};


exports.getAllLeave = async (req, res) => {
    try {
        const leaves = await Leave.find();

        const leavesWithPercentage = await Promise.all(leaves.map(async (leave) => {
            const employee = await Employee.findOne({ email: leave.email });
            if (employee) {
                const attendancePercentage = calculateAttendancePercentage(employee.attendance);
                leave.percentage = attendancePercentage;
            }
            return leave;
        }));

        res.json(leavesWithPercentage);
    } catch (err) {
        res.status(500).send({ message: err.message || 'Error while retrieving leave information' });
    }
};


exports.UpdateEmployee = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Leave.findByIdAndUpdate(id, req.body, { new: true }); // Set { new: true } to return the updated document
        if (data) {
            await sendEmailNotification(data.email, data.status);
            res.json(data);
        } else {
            res.status(404).send({ message: `Cannot update Employee with identified id ${id} or maybe user not found!` });
        }
    } catch (err) {
        res.status(500).send({ message: `Error updating Employee information: ${err.message}` });
    }
};


