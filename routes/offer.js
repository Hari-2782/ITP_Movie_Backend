var  express = require("express");
var  packageController = require("../controller/packagecontroller");
var  router = express.Router();
const authTokenHandler = require('../MiddleWares/checkAuthToken');
router.post('/pack', packageController.createPackage);
router.get('/getall', packageController.getAllPackages);
router.get('/get/:id', packageController.getPackageById);
router.put('/pack/:id', packageController.updatePackage);
router.delete('/delete/:id', packageController.deletePackage);
router.post('/active/:id', authTokenHandler,packageController.userPackage);
router.post('/op',packageController.validate);

module.exports = router;