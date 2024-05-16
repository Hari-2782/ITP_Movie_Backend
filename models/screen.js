const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    seats:[
        {  type: {
            type:String, 
            required: true
        },
            rows: [{
                rowname: String,
                cols: [{
                  seats: [{
                    seat_id: Number
                  }]
                }]
              }],
            price: {
                type: Number,
                required: true
            }
        }
    ],
    screenType: {
        type: String,
        required: true
    },
    movieSchedules: [
        {
            movieId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Movie',
                required: true
            },
            showTime: String,
            notAvailableSeats: [{
                row : String,
                col : String,
                seat_id : String,
                price : Number
                
            }],
            showDate: Date
        }
    ]
});

const Screen = mongoose.model('Screen', screenSchema);

module.exports = Screen;
