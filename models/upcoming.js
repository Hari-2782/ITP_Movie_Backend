const mongoose = require('mongoose');

const upSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    portraitImgUrl: {
        type: String,
        required: true
    },

    
});

const UpMovie = mongoose.model('UpMovie', upSchema);

module.exports = UpMovie;
