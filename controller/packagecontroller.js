const Package = require('../models/package');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const voucher = require('voucher-code-generator');
const cron = require('node-cron');

// Function to send payment confirmation email
const sendPaymentConfirmationEmail = (toEmail, userName, packageType, couponCode, expiresAt) => {
    return new Promise((resolve, reject) => {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'balacinema235@gmail.com',
                    pass: 'bzfv mdhl rgic rlhu'
                }
            });

            let validityText = '';
            if (packageType === 'package'|| 'premium') {
                validityText = 'Thank you for purchasing a package! Your package is valid for 1 year.';
            } else if (packageType === 'offer') {
                validityText = 'Thank you for your purchase! Your offer is valid for 24 hours.';
            }

            const mailOptions = {
                from: 'balacinema235@gmail.com',
                to: toEmail,
                subject: 'Payment Confirmation - Bala Cinema',
                text: `Dear ${userName},\n\n Thank you for your purchase! Your offer is valid for ${expiresAt}\n\n Your coupon code: ${couponCode}\n\nRegards,\nThe Bala Cinema Team`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending payment confirmation email:', error);
                    reject(error);
                } else {
                    console.log('Payment confirmation email sent successfully');
                    resolve(info);
                }
            });
        } catch (error) {
            console.error('Error sending payment confirmation email:', error);
            reject(error);
        }
    });
};

// Function to send offer expired email
const sendOfferExpiredEmail = (toEmail, userName, packageName) => {
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
                subject: 'Offer Expired - Bala Cinema',
                text: `Dear ${userName},\n\n Your offer for ${packageName} has expired.\n\nRegards,\nThe Bala Cinema Team`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending offer expired email:', error);
                    reject(error);
                } else {
                    console.log('Offer expired email sent successfully');
                    resolve(info);
                }
            });
        } catch (error) {
            console.error('Error sending offer expired email:', error);
            reject(error);
        }
    });
};

// Helper function to get current UTC time
const getCurrentUTCTime = () => {
    return new Date(new Date().toISOString());
};

const createPackage = async (req, res) => {
    try {
        const { image, name, discount, description, type, price, expiresAt } = req.body;
        const couponCode = voucher.generate({ length: 5 })[0];

        const newPackage = new Package({ image, name, discount, description, type, price, coupon: couponCode, expiresAt });

        await newPackage.save();
        res.status(201).json({ success: true, message: 'Package created successfully', package: newPackage });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const deleteExpiredCoupons = async () => {
    try {
        const currentDate = getCurrentUTCTime();
        console.log('Current UTC date:', currentDate);
        const expiredPackages = await Package.find({ expiresAt: { $lt: currentDate } });

        for (const expiredPackage of expiredPackages) {
            const users = await User.find({ offer: expiredPackage._id });

            for (const user of users) {
                await sendOfferExpiredEmail(user.email, user.name, expiredPackage.name);

                // Remove the package from the user's offers
                user.offer = user.offer.filter(offerId => offerId.toString() !== expiredPackage._id.toString());
                await user.save();
            }

            // Delete the expired package
            await Package.findByIdAndDelete(expiredPackage._id);
        }

        console.log('Expired coupons deleted successfully');
    } catch (error) {
        console.error('Error deleting expired coupons:', error);
    }
};

cron.schedule('* * * * *', () => {
    console.log('Cron job running at', getCurrentUTCTime());
    deleteExpiredCoupons();
});


// Other package-related functions
const getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find();
        res.json({ ok: true, data: packages, message: 'Package found' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getPackageById = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);
        if (!package) {
            return res.status(404).json({ success: false, message: 'Package not found' });
        }
        res.json({ success: true, data: package });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const updatePackage = async (req, res) => {
    try {
        const { image, name, discount, description, type, price } = req.body;
        const package = await Package.findByIdAndUpdate(req.params.id, { image, name, discount, description, type, price }, { new: true });
        if (!package) {
            return res.status(404).json({ success: false, message: 'Package not found' });
        }
        res.json({ success: true, message: 'Package updated successfully', package });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const deletePackage = async (req, res) => {
    try {
        const package = await Package.findByIdAndDelete(req.params.id);
        if (!package) {
            return res.status(404).json({ success: false, message: 'Package not found' });
        }
        res.json({ success: true, message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const userPackage = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: "User not found"
            });
        }

        package.user.push(req.userId);
        await package.save();
        user.offer.push(package._id);
        await user.save();

        const couponCode = voucher.generate({ length: 5 })[0];
        await sendPaymentConfirmationEmail(user.email, user.name, package.type, package.coupon, package.expiresAt);

        res.status(200).json({
            ok: true,
            message: "Package updated successfully",
            data: package
        });
    } catch (error) {
        console.error("Error updating package:", error);
        res.status(500).json({
            ok: false,
            message: "Internal server error"
        });
    }
};

const validate = async (req, res) => {
    console.log("Package updated successfully");
    try {
        // Extract couponCode from the request body
        const { couponCode } = req.body;

        // Find the package using the coupon code
        const package = await Package.findOne({ coupon: couponCode });

        if (package) {
            res.status(201).json({
                ok: true,
                message: "Package identified",
                data: package
            });
        } else {
            res.status(404).json({
                ok: false,
                message: "Package not found"
            });
        }
    } catch (error) {
        console.error("Error identifying package:", error);
        res.status(500).json({
            ok: false,
            message: "Internal server error"
        });
    }
};

module.exports = { validate, createPackage, getAllPackages, getPackageById, updatePackage, deletePackage, userPackage };
