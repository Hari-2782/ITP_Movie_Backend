const book=require('../models/booking')
const Screen=require('../models/screen')
const movie=require('../models/movie')
const user=require('../models/user')
const createResponse = (success, message, data) => {
    return {
        success: success,
        message: message,
        data: data
    };
};

const bookTicket=async (req, res) =>{
    try{
        console.log("im in")
    const { showTime, showDate, movieId, screenId, seats,totalPrice } = req.body;
    console.log(req.body);

    // You can create a function to verify payment id

    const screen = await Screen.findById(screenId);

    if (!screen) {
        return res.status(404).json({
            ok: false,
            message: "movie screen not found"
        });
    }



    const movieSchedule = screen.movieSchedules.find(schedule => {
        console.log(schedule);
        let showDate1 = new Date(schedule.showDate);
        let showDate2 = new Date(showDate);
        if (showDate1.getDay() === showDate2.getDay() &&
            showDate1.getMonth() === showDate2.getMonth() &&
            showDate1.getFullYear() === showDate2.getFullYear() &&
            schedule.showTime === showTime &&
            schedule.movieId == movieId) {
                console.log('im check')
            return true;
            
        }
        console.log('im not check')
        return false;
    });

    if (!movieSchedule) {
        console.log('im check not movie schedule')
        return res.status(404).json({
            ok: false,
            message: "Movie schedule not found"
        });
    }

    const User = await user.findById(req.userId);
    console.log('User ID:', req.userId);

    if (!User) {
        console.log('no user found')
        return res.status(404).json({
            ok: false,
            message: "User not found"
        });
    }
    console.log('before newBooking done');
    const newBooking = new book({ userId: req.userId, showTime, showDate, movieId, screenId, seats,totalPrice})
    await newBooking.save();
    console.log('newBooking done');



    movieSchedule.notAvailableSeats.push(...seats);
    await screen.save();
    console.log('screen saved');

    User.bookings.push(newBooking._id);
    await User.save();
    console.log('user saved');
    res.status(201).json({
        ok: true,
        message: "Booking successful",
        bookingId: newBooking._id
    });

}catch (err) {
    res.status(500).json({ message: err.message });
}

}
//get paticular booking 
const getBooking=async(req,res)=>{

    try {
        console.log('im in booking');
        const {id} = req.params;
        console.log('im in booking',id);
        const booking = await book.findById(id);

        if(!booking){
            return res.status(404).json(createResponse(false, 'Booking not found', null));
        }

        res.status(200).json(createResponse(true, 'Booking retrieved successfully', booking));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//get users booking
const userBooking=async(req,res)=>{
    try {
        const User = await user.findById(req.userId).populate('bookings');
        if(!User){
            return res.status(404).json(createResponse(false, 'User not found', null));
        }
        let bookings = [];
        for(let i = 0 ; i < User.bookings.length ; i++){
            let bookingobj = await book.findById(User.bookings[i]._id);
            bookings.push(bookingobj);
        }

        res.status(200).json(createResponse(true, 'User bookings retrieved successfully', bookings));
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getAllBookings = async (req, res) => {
    try {
        const bookings = await book.find();
        res.status(200).json(createResponse(true, 'Bookings retrieved successfully', bookings));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = {bookTicket,getBooking,userBooking,getAllBookings};

