const mongoose = require('mongoose');

const foodBeverageSchema = new mongoose.Schema({
    items: [
        {
            type: {
                type: String,
                enum: ['food', 'beverage', 'drink', 'snack'],
                required: true
            },
            name: {
                type: String,
                required: true
            },
            imageurl: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }
    ],
    totalprice: {
        type: Number,
        default:0
      
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
       
    }
});

const FoodBeverage = mongoose.model('Food', foodBeverageSchema);

module.exports = FoodBeverage;

 
