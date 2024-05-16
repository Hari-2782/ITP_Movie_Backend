const screen=require("../models/screen");
const movie=require("../models/movie");

const createResponse = (success, message, data) => {
  return { success, message, data };
};

const createScreen = async (req, res) => {
    try {
      const { name, type, numRows, numSeatsPerRow, price, screenType } = req.body;
      const seats = [];
      const rows = [];
      for (let i = 0; i < numRows; i++) {
        
        const rowname = `${String.fromCharCode(70 + i)}`; // Generate rowname like "silver-A", "silver-B", etc.

        const cols = [];
        // Loop to create columns
        for (let j = 0; j < 2; j++) {
            const colSeats = [];
            // Loop to create seats in a column
            for (let k = 0; k < numSeatsPerRow; k++) {
                const seat_id = (k + 1);
                colSeats.push({ seat_id }); // Push seat_id as an object into colSeats array
            }
            cols.push({ seats: colSeats }); // Push colSeats array into cols array as object
        }
        rows.push({ rowname, cols }); // Push rowname and cols array into rows array
    }
    
    seats.push({ type, rows, price }); // Push type, rows, and price into seats array
       
        const newScreen = new screen({ name, seats, screenType });
        await newScreen.save();
        res.status(201).json({
            ok: true,
            message: "Movie screen added successfully"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = createScreen;

const getScreen = async (req, res) => {
  try {
      const screens = await screen.find(); // Use a different variable name, e.g., screens
      res.status(200).json({
          ok: true,
          screens // Return the screens variable
      });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

const getscreenid=async (req, res) => {
    try {
      const movieSeatLayout = await screen.findById(req.params.id);
      if (!movieSeatLayout) {
        return res.status(404).json({ message: 'Movie screen and seat layout not found' });
      }
      res.json(movieSeatLayout);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  const updateMovieSeatLayout = async (req, res) => {
    try {
        const { type, numRows, numSeatsPerRow, price  } = req.body;
        const rows = [];
        let startingCharCode;
        if (type.toLowerCase() === 'gold') {
            startingCharCode = 67; // ASCII code for 'C'
        } else if (type.toLowerCase() === 'silver') {
            startingCharCode = 65; // ASCII code for 'A'
        } else {
            startingCharCode = 65; // Default to 'A' if type is unknown or not provided
        }
        for (let i = 0; i < numRows; i++) {
        
          const rowname = `${String.fromCharCode(startingCharCode + i)}`; // Generate rowname like "silver-A", "silver-B", etc.
  
          const cols = [];
          // Loop to create columns
          for (let j = 0; j < 2; j++) {
              const colSeats = [];
              // Loop to create seats in a column
              for (let k = 0; k < numSeatsPerRow; k++) {
                  const seat_id = (k + 1);
                  colSeats.push({ seat_id }); // Push seat_id as an object into colSeats array
              }
              cols.push({ seats: colSeats }); // Push colSeats array into cols array as object
          }
          rows.push({ rowname, cols }); // Push rowname and cols array into rows array
        }
        const existingScreen = await screen.findOne({ _id: req.params.id });
        if (!existingScreen) {
            return res.status(404).json({ message: 'Screen not found' });
        }
        const existingSeatTypeIndex = existingScreen.seats.findIndex(seat => seat.type === type);
        if (existingSeatTypeIndex !== -1) {
            // If the seat type already exists, update its rows and price
            existingScreen.seats[existingSeatTypeIndex].rows = rows;
            existingScreen.seats[existingSeatTypeIndex].price = price;
        } else {
            // If the seat type does not exist, push a new seat type object into the seats array
            existingScreen.seats.push({ type, rows, price });
        }

        const updatedMovieSeatLayout = await screen.findByIdAndUpdate(
            req.params.id,
            { seats: existingScreen.seats }, // Update the seats array with the modified seat type object
            { new: true }
        );
        if (!updatedMovieSeatLayout) {
            return res.status(404).json({ message: 'Movie seat layout not found' });
        }
        res.json(updatedMovieSeatLayout);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
  const deleteMovieSeatLayout = async (req, res) => {
    try {
      const deletedMovieSeatLayout = await screen.findByIdAndDelete(req.params.id);
      if (!deletedMovieSeatLayout) {
        return res.status(404).json({ message: 'Movie screen' });
      }
      res.json({ message: 'Movie seat and screen deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const addScheduleLayout = async (req, res) => {
    try {
         const{screenId,movieId,showTime,showDate}=req.body;
         const schedule = await screen.findById(screenId);
         if(!schedule) {
           return res.status(404).json({ message: 'screen not found' });
         }
         const Movie=await  movie.findById(movieId);
         if(!Movie) {
           return res.status(404).json({ message: 'Movie  not found' });
         }
         schedule.movieSchedules.push({ movieId, showTime, showDate,notAvailableSeats: [] });
       await schedule.save();
       res.status(201).json({
         ok: true,
         message: 'Movie schedule added successfully'
       });
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
}
const schedulebyMovie = async (req, res) => {
  const screenId = req.params.screenid;
  const date = req.params.date;
  const movieId = req.params.movieid;

  const Screen = await screen.findById(screenId);

  if (!Screen) {
      console.log("no screen")
      return res.status(404).json(createResponse(false, 'Screen not found', null));
  }

  const movieSchedules = [];
  Screen.movieSchedules.forEach(schedule => {
      let showDate = new Date(schedule.showDate);
      let bodyDate = new Date(date);
      if (showDate.getDay() === bodyDate.getDay() &&
          showDate.getMonth() === bodyDate.getMonth() &&
          showDate.getFullYear() === bodyDate.getFullYear() &&
          schedule.movieId == movieId) {
          console.log("pushing schedule")
          movieSchedules.push(schedule);
      }
  });

  console.log(movieSchedules);

  if (movieSchedules.length === 0) {
      return res.status(404).json(createResponse(false, 'Movie schedule not found', null));
  }

  return res.status(200).json(createResponse(true, 'Movie schedule retrieved successfully', {
      Screen,
      movieSchedulesforDate: movieSchedules
  }));
};

const schedule = async (req, res) => {
  try {
      console.log("im in schedule");
      const date = req.params.date;
      const showTime = req.params.time;
      const movieId = req.params.movieid;
    console.log("im in schedule date",showTime,date,movieId);
    const Screens = await screen.find({ 'movieSchedules.showTime': showTime });

      if (!Screens || Screens.length === 0) {
        console.log("im in schedule no screen",Screens);
          console.log("im in schedule no time");
          return res.status(404).json({ success: false, message: 'No movie found in the specified time', data: null });
      }

      let temp = [];
      const filtesc=Screens.forEach(screens => {
          screens.movieSchedules.forEach(schedule => {
              let showDate = new Date(schedule.showDate);
              let bodyDate = new Date(date);
              if (showDate.getDay() === bodyDate.getDay() &&
                  showDate.getMonth() === bodyDate.getMonth() &&
                  showDate.getFullYear() === bodyDate.getFullYear() &&
                  schedule.movieId == movieId&&
                schedule.showTime ==showTime ) {
                  temp.push(screens);
              }
          });
      });

      console.log(temp);
      console.log("im in schedule fetch all");
      res.status(200).json({ success: true, message: 'Screens retrieved successfully', data: temp });
  } catch (err) {
      console.log("im in schedule error");
      res.status(500).json({ message: err.message });
  }
};


  
  module.exports ={schedule,schedulebyMovie,addScheduleLayout,createScreen, deleteMovieSeatLayout, updateMovieSeatLayout,getscreenid, getScreen}