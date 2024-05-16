var  User = require("../models/user");
var  jwt = require("jsonwebtoken");
const randomstring = require('randomstring');
const sendEmail = require('../utils/sendEmails');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Generate OTP
function generateOTP() {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
}

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}
const register = async (req, res, next) => {
    const { name, email } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Email is not valid' });
    }

    try {
        let user = await User.findOne({ $or: [{ email }, { name }] });

        if (user) {
            if (user.email === email) {
                return res.status(400).json({ message: 'Email already in use' });
            } else if (user.name === name) {
                return res.status(400).json({ message: 'Username already in use' });
            }
        } else {
            const otp = generateOTP(); // Generate a 6-digit OTP
            const newOTP = new User({ name, email, otp, otpExpiration: Date.now() + 90 * 1000 });
            await newOTP.save();

            // Send OTP via email
            await sendEmail({
                to: email,
                subject: 'Your OTP',
                message: `<p>Your OTP is: <strong>${otp}</strong></p>`,
            });

            return res.status(201).json(createResponse(true, 'User registered successfully'));
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}


// Send OTP to the provided email
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = generateOTP(); // Generate a 6-digit OTP
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not  exists or invalid email' });
        } else {
            user.otp = otp;
            user.otpExpiration = Date.now() + 90 * 1000;
        }

        await user.save();

        // Send OTP via email
        await sendEmail({
            to: email,
            subject: 'Your OTP',
            message: `<p>Your OTP is: <strong>${otp}</strong></p>`,
        });

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Verify OTP provided by the user
const verifyOTP = async (req, res, next) => {
    const { email, otp } = req.body;
    try {
        
        const Otp = await User.findOne({ email });

        if (!Otp) {
            // user is not valid
            return res.status(400).json({ message: 'User not found' }); 
        } 
        if (Otp.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        } else if (Otp.otpExpiration < Date.now()) {
            return res.status(400).json({ message: 'Expired OTP' });
        }
          else(Otp)
          console.log('login');
          Otp.otp = null;
          Otp.otpExpiration = null;
          await Otp.save();
          const authToken = jwt.sign({ userId: Otp._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });
          const refreshToken = jwt.sign({ userId: Otp._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '30m' });
          res.cookie('authToken', authToken,  { httpOnly: true, secure: true, sameSite: 'None' });
          res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'None' });
          res.status(200).json(createResponse(true, 'Login successful', {
            authToken,
            refreshToken
        })) 
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

//test api
const test=(req, res) => {
    res.json({
        message: "Auth api is working"
    })
}
//
const logout= async (req, res) => {
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');
    res.json({
        ok: true,
        message: 'User logged out successfully'
    })
}

const getuser=async (req, res) => {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
        return res.status(400).json(createResponse(false, 'Invalid credentials'));
    }
    else{
        return res.status(200).json(createResponse(true, 'User found', user));
    }
}

module.exports = { sendOTP, verifyOTP,register ,test,logout, getuser}