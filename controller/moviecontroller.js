const Movie= require("../models/movie"); 
const createMovie = async (req, res, next) => {
    try {
        const { title, description, portraitImgUrl, landscapeImgUrl, rating, genre, duration } = req.body;

        const newMovie = new Movie({
            title,
            description,
            portraitImgUrl,
            landscapeImgUrl,
            rating,
            genre,
            duration
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
      const { title, description, portraitImgUrl, landscapeImgUrl, rating, genre, duration } = req.body;
  
      // Find the movie by ID
      const movie = await Movie.findById(id);
  
      // Update movie attributes
      movie.title = title;
      movie.description = description;
      movie.portraitImgUrl = portraitImgUrl;
      movie.landscapeImgUrl = landscapeImgUrl;
      movie.rating = rating;
      movie.genre = genre;
      movie.duration = duration;
  
      // Save the updated movie
      await movie.save();
  
      res.status(200).send({ status: "Movie updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
const addCeleb=async (req,res)=>{
    try {
        const { movieId, celebType, celebName, celebRole, celebImage } = req.body;
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({
                ok: false,
                message: "Movie not found"
            });
        }
       let name=celebName;
       let image=celebImage;
       let role=celebRole;
        const newCeleb = {
           
            name,
            image,
            role
        };
        if (celebType === "cast") {
            movie.cast.push(newCeleb);
        } else {
            movie.crew.push(newCeleb);
        }
        await movie.save();

        res.status(201).json({
            ok: true,
            message: "Celeb added successfully"
        });
    }
    catch (err) {
        res.status(500).json(err); // Pass any errors to the error handling middleware
    }
}
module.exports = {updateMovie,deleteMovie,getMovies,getMovieid,createMovie,addCeleb}
