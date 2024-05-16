const mongoose = require('mongoose');
const validator = require('validator');


const employeeSchema = new mongoose.Schema({
  EmployeeId: {
    type: String,
    required: true,
    unique: true
  },
  EmployeeName: {
    type: String,
    required: true
  },
  Department: {
    type: String,
    required: true
  },
  Date_of_Joining: {
    type: Date,
    required: true
  },
  PhotoFileName: {
    type: String,
    required: true
  },
  email:{
    type:String,
    required:false,
    unique:true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: 'Invalid email address',
    },
   },
   password:{
    type:String,
    required:false,
    minlength: 4,
   },
   facialDescriptor: {
    type: [Number],
    required: false
  },
  facialEmbedding: {
    type: Buffer,
    required: false
  },

  attendance: [{
    date: {
      type: Date,
      default: Date.now
    },
    Attendancestatus: {
      type: String,
      enum: ['present', 'absent'],
      default: 'absent'
    }
  }]
  
}, { collection: 'Employee' });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
