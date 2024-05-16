const Payment = require('../models/payment');
const book=require('../models/booking')
const user=require('../models/user')
const food=require('../models/food')
const package=require('../models/package')
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');
 
const generatePDF = async (payment) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Generating PDF for payment:", payment);

            const doc = new PDFDocument();

            // Buffer to store PDF data
            let buffers = [];

            // Generate QR code
            const url = await QRCode.toDataURL(`${payment._id}`, { errorCorrectionLevel: 'H' });

            // Add QR code image to PDF
            doc.image(url, 50, 50, { width: 100, height: 100 });

            // Add payment details
            doc.text(`BALA CINEMA PAYMENT CONFIRMATION`, 170, 20);
            doc.text(`Payment ID: ${payment._id}`, 170, 50);
            doc.text(`Total Amount: ${payment.Totalamount}`, 170, 70);
            doc.text(`Payment Type: ${payment.paymentType}`, 170, 90);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 170, 110);
            doc.text("Your vechicle parking space in A section");

            // Finalize PDF generation
            doc.on('data', buffers.push.bind(buffers));
            doc.end();

            // Handle PDF generation completion
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

        } catch (error) {
            console.error('Error generating PDF:', error);
            reject(error);
        }
    });
};

const sendPaymentConfirmationEmail = (toEmail, userName, pdfData) => {
    return new Promise((resolve, reject) => {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'balacinema235@gmail.com',
                    pass: 'bzfv mdhl rgic rlhu'
                }
            });

            const mailOptions = {
                from: 'balacinema235@gmail.com',
                to: toEmail,
                subject: 'Payment Confirmation - Bala Cinema',
                text: `Dear ${userName},\n\nThank you for your payment! Please find attached the payment confirmation document.\n\nRegards,\nThe Bala Cinema Team`,
                attachments: [
                    {
                        filename: `Payment_Confirmation.pdf`,
                        content: pdfData // PDF data
                    }
                ]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending payment confirmation email:', error);
                    reject(error);
                } else {
                    console.log('Payment confirmation email sent successfully ');
                    resolve(info);
                }
            });
        } catch (error) {
            console.error('Error sending payment confirmation email:', error);
            reject(error);
        }
    });
};

const createPayment = async (req, res) => {
    try {
        let { Totalamount, paymentType, bookingId, foodId, loyaltyPoints, packageId } = req.body;
        const User = await user.findById(req.userId);
        console.log('User ID:', req.userId);

        if (!User) {
            console.log('no user found')
            return res.status(404).json({
                ok: false,
                message: "User not found"
            });
        }
        loyaltyPoints += Number((Totalamount / 1000).toFixed(2));
        User.loyaltyPoints = loyaltyPoints;
        await User.save();
        console.log(loyaltyPoints);
        const newPayment = new Payment({ Totalamount, paymentType, userId: req.userId, bookingId, foodId, packageId });
        await newPayment.save();
        const booking = await book.findById(bookingId);
        const Pack=await package.findById(packageId);
        const pdfData = await generatePDF(newPayment);
        await sendPaymentConfirmationEmail(User.email, User.name, pdfData);
        
        res.status(201).json({ success: true, message: 'Payment successful', payment: newPayment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Get all payments
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }
        res.json({ success: true, payment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// // Update payment by ID
// const updatePayment = async (req, res) => {
//     try {
//         const { amount, paymentType, userId, bookingId, loyaltyPointsUsed, packageConsumed } = req.body;
//         const payment = await Payment.findByIdAndUpdate(req.params.id, { amount, paymentType, userId, bookingId, loyaltyPointsUsed, packageConsumed }, { new: true });
//         if (!payment) {
//             return res.status(404).json({ success: false, message: 'Payment not found' });
//         }
//         res.json({ success: true, message: 'Payment updated successfully', payment });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// Delete payment by ID
const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }
        res.json({ success: true, message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { createPayment, getAllPayments, getPaymentById,  deletePayment };//updatePayment,
