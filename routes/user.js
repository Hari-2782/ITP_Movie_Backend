var  express = require("express");
var  userController = require("../controller/usercontroller");
var  router = express.Router();
const authTokenHandler = require('../MiddleWares/checkAuthToken');
const errorHandler = require('../MiddleWares/errorMiddleware');

router.get('/test',userController.test );
//logout
router.get('/logout', authTokenHandler, userController.logout);
//getuser
router.get('/getuser', authTokenHandler, userController.getuser);
router.post('/sendOTP/',userController.sendOTP);
router.post('/login', userController.verifyOTP);
router.post('/register', userController.register);

router.get('/checklogin', authTokenHandler, async (req, res) => {
    res.json({
        userId: req.userId,
        ok: true,
        message: 'User authenticated successfully'
    })
})
router.use(errorHandler)
module.exports = router;