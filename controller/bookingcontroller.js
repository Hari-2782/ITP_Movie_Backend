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

const bookTicket = async (req, res) => {
    try {
        console.log("I'm in");
        const { showTime, showDate, movieId, screenId, seats, totalPrice } = req.body;
        console.log('Received request body:', req.body);
        console.log('Received showDate:', showDate);

        const screen = await Screen.findById(screenId);

        if (!screen) {
            return res.status(404).json({
                ok: false,
                message: "Movie screen not found"
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
                schedule.movieId.toString() === movieId.toString()) {
                    console.log('Match found');
                return true;
            }
            console.log('No match');
            return false;
        });

        if (!movieSchedule) {
            console.log('No matching movie schedule found');
            return res.status(404).json({
                ok: false,
                message: "Movie schedule not found"
            });
        }

        const User = await user.findById(req.userId);
        console.log('User ID:', req.userId);

        if (!User) {
            console.log('User not found');
            return res.status(404).json({
                ok: false,
                message: "User not found"
            });
        }
        console.log('Before creating new booking');
        // Parse the showDate string to a Date object
let showDateObj = new Date(showDate);

// Set the time zone offset to zero
showDateObj.setMinutes(showDateObj.getMinutes() - showDateObj.getTimezoneOffset());

// Create a new booking with the adjusted showDate
const newBooking = new book({ userId: req.userId, showTime, showDate: showDateObj, movieId, screenId, seats, totalPrice });

        await newBooking.save();
        console.log('New booking created',newBooking);

        movieSchedule.notAvailableSeats.push(...seats);
        await screen.save();
        console.log('Screen updated with new seats');

        User.bookings.push(newBooking._id);
        await User.save();
        console.log('User updated with new booking');

        res.status(201).json({
            ok: true,
            message: "Booking successful",
            bookingId: newBooking._id
        });

    } catch (err) {
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
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the booking
        const booking = await book.findById(id);
        if (!booking) {
            return res.status(404).json(createResponse(false, 'Booking not found', null));
        }

        // Find the user
        const User = await user.findById(booking.userId);
        if (!User) {
            return res.status(404).json(createResponse(false, 'User not found', null));
        }

        // Find the screen
        const screen = await Screen.findById(booking.screenId);
        if (!screen) {
            return res.status(404).json(createResponse(false, 'Screen not found', null));
        }

        // Log the booking details
        console.log('Booking details:', booking);

        // Find the movie schedule and update the not available seats
        const movieSchedule = screen.movieSchedules.find(schedule => {
            const scheduleDate = new Date(schedule.showDate).toISOString().split('T')[0];
            const bookingDate = new Date(booking.showDate).toISOString().split('T')[0];
            return (
                schedule.movieId.toString() === booking.movieId.toString() &&
                scheduleDate === bookingDate &&
                schedule.showTime === booking.showTime
            );
        });

        if (movieSchedule) {
            console.log('Movie Schedule Found:', movieSchedule);

            // Log notAvailableSeats before removal
            console.log('Not Available Seats Before:', JSON.stringify(movieSchedule.notAvailableSeats, null, 2));

            // Remove the booked seats from notAvailableSeats
            movieSchedule.notAvailableSeats = movieSchedule.notAvailableSeats.filter(seat => 
                !booking.seats.some(bookingSeat => 
                    bookingSeat.row === seat.row && 
                    bookingSeat.col === seat.col&&
                    bookingSeat.seat_id === seat.seat_id
                )
            );

            // Log notAvailableSeats after removal
            console.log('Not Available Seats After:', JSON.stringify(movieSchedule.notAvailableSeats, null, 2));

            await screen.save();
        } else {
            console.log('Movie Schedule not found for booking:', booking);
        }

        // Remove the booking from the user
        User.bookings = User.bookings.filter(bookingId => bookingId.toString() !== id);
        await User.save();

        // Delete the booking
        await booking.deleteOne();

        res.status(200).json(createResponse(true, 'Booking deleted successfully', null));

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports = { deleteBooking, bookTicket, getBooking, userBooking, getAllBookings };






