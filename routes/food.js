const express = require('express');
const router = express.Router();
const foodController = require('../controller/fooodcontroller');
const authTokenHandler = require('../MiddleWares/checkAuthToken');
// Routes for food items
router.get('/getall', foodController.getAllFoodItems);
router.post('/create', foodController.addFoodItem);
router.put('/update/:id', foodController.updateFoodItem);
router.delete('/delete/:id', foodController.deleteFoodItem);
router.get('/get/:id', foodController.getFoodItem);
router.post('/order',authTokenHandler,foodController.bookFood)
router.get('/getitems/:type',foodController.getItemsByType)


module.exports = router;
