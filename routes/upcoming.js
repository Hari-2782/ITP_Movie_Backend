var  express = require("express");
var  movieController = require("../controller/upcomingController");
var  router = express.Router();



router.post('/create', movieController.createMovie);

router.get('/getall', movieController.getMovies);

router.delete('/delete/:id', movieController.deleteMovie);
router.post('/update/:movieid', movieController.updateMovie);
router.get('/get/:id', movieController.getMovieid);
module.exports = router;