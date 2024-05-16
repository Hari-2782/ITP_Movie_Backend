var  express = require("express");
var  router = express.Router();
const scrreencontroller = require('../controller/seatcontroller')
const adminhandler = require('../MiddleWares/checkAdminToken')

router.post('/create', scrreencontroller.createScreen,adminhandler);

router.get('/getall', scrreencontroller.getScreen)

router.put('/update/:id', scrreencontroller.updateMovieSeatLayout,adminhandler);

router.delete('/delete/:id',scrreencontroller.deleteMovieSeatLayout,adminhandler);
router.post('/addschedule',scrreencontroller.addScheduleLayout,adminhandler);
router.get('/schedulebymovie/:screenid/:date/:movieid',scrreencontroller.schedulebyMovie);
router.get('/schedule/:date/:time/:movieid',scrreencontroller.schedule);

router.get('/get/:id', scrreencontroller.getscreenid);
module.exports = router;