const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    coupon:{
        type: String,
        required: true
     },
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    user:{
        type: Array,
    default: [],
  },
  expiresAt: {
    type: Date,
    required: true
}
  
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
