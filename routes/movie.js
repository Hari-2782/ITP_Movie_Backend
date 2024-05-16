var  express = require("express");
var  movieController = require("../controller/moviecontroller");
var  router = express.Router();
const authTokenHandler = require('../MiddleWares/checkAuthToken');
const adminTokenHandler = require('../MiddleWares/checkAdminToken');
const errorHandler = require('../Middlewares/errorMiddleware');


router.post('/create', movieController.createMovie, errorHandler,adminTokenHandler);

router.get('/getall', movieController.getMovies, errorHandler);

router.post('/update/:movieid', movieController.updateMovie, errorHandler,adminTokenHandler);

router.delete('/delete/:id', movieController.deleteMovie, errorHandler,adminTokenHandler);

router.get('/get/:id', movieController.getMovieid, errorHandler,adminTokenHandler);
 router.post('/addcelb', movieController.addCeleb, errorHandler,adminTokenHandler)

router.use(errorHandler)
module.exports = router;