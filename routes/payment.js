const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentcontroller');
const authTokenHandler = require('../MiddleWares/checkAuthToken');
router.post('/create', authTokenHandler, paymentController.createPayment);
router.get('/payments', paymentController.getAllPayments);
router.get('/payment/:id', paymentController.getPaymentById);
// router.put('/payment/:id', paymentController.updatePayment);
router.delete('/payment/:id', paymentController.deletePayment);

module.exports = router;
