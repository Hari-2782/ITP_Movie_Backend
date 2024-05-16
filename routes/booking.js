const express = require('express');
const router = express.Router();
const bookingController=require('../controller/bookingcontroller');
const authTokenHandler = require('../MiddleWares/checkAuthToken');

router.post('/create', authTokenHandler, bookingController.bookTicket);

router.get('/getbooking/:id' ,bookingController.getBooking);
router.get('/userboooking', authTokenHandler ,bookingController.userBooking);
router.get('/getall',bookingController.getAllBookings);
router.delete('/:id',bookingController.deleteBooking);
module.exports = router;