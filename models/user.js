var  mongoose = require("mongoose");
var  Schema = mongoose.Schema;

var  userSchema = new  Schema(
    {
        name: {
            type:  String
        },
        email: {
            type: String,
            unique:  true,
            required:  true
        },
        otp: { type: String
         },
       otpExpiration: { type: Date
     },
        bookings:{
            type: Array,
            default: [],
        },
        offer:{
            type: Array,
            default: [],
        },
        
        loyaltyPoints: {
            type: Number,
            default: 0
        }

    },
    { timestamps:  true }
);
const User=mongoose.model("User", userSchema);
module.exports = User;