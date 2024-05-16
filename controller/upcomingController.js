const Movie= require("../models/upcoming"); 
const createMovie = async (req, res, next) => {
    try {
        const { title, description, portraitImgUrl } = req.body;

        const newMovie = new Movie({
            title,
            description,
            portraitImgUrl,
            
        });

        await newMovie.save();
        res.status(201).json({
            ok: true,
            message: "Movie added successfully"
        });
    } catch (err) {
        next(err); // Pass any errors to the error handling middleware
    }
};


const getMovies=async (req, res, next) => {
     
    try{
      
         const movie=await Movie.find();

         // Return the list of movies as JSON response
         res.status(200).json({
             ok: true,
             data: movie,
             message: 'Movies retrieved successfully'
         });
    }
    catch (err) {
        next(err); // Pass any errors to the error handling middleware
    }
};
const getMovieid=async(req,res,next)=>{
    try {
        const movieId = req.params.id;
        const movie = await Movie.findById(movieId);
        if (!movie) {
            // If the movie is not found, return a 404 Not Found response
            return res.status(404).json({
                ok: false,
                message: 'Movie not found'
            });
        }

        res.status(200).json({
            ok: true,
            data: movie,
            message: 'Movie retrieved successfully'
        });
    }
    catch (err) {
        next(err); // Pass any errors to the error handling middleware
    }
//     let id=req.params.movieid;
//     await Movie.findById(id).then((movie)=>{
//         res.status(200).send({ status: "movie Details fetched", movie});
// }).
// catch((err) => {
//     res.status(500).json("error"); //send error message to the frontend
//   });
};
const deleteMovie=async(req,res,next)=>{
    let movieid=req.params.id;
    await Movie.findByIdAndDelete(movieid).then(()=>{
        res.status(200).send({ status: "movie deleted"});
}).catch((err) => {
    res.status(500).json("error"); //send error message to the frontend
  });
}

const updateMovie = async (req, res) => {
    try {
      let id = req.params.movieid;
      const { title, description, portraitImgUrl } = req.body;
  
      // Find the movie by ID
      const movie = await Movie.findById(id);
  
      // Update movie attributes
      movie.title = title;
      movie.description = description;
      movie.portraitImgUrl = portraitImgUrl;
  
      // Save the updated movie
      await movie.save();
  
      res.status(200).send({ status: "Movie updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  };

module.exports = {getMovies, deleteMovie, getMovieid,createMovie, updateMovie}
