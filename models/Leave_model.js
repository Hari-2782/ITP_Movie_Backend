const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    LeaveId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String, // Store email as a string
        required: true
    },
    leaveType: {
        type: String,
        enum: ['sick', 'casual'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    adminComment: {
        type: String
    },
    PhotoFileName: {
        type: String,
        required: true
      },
      percentage:{
        type:String
      }
    
}, { collection: 'Leave' });

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;
