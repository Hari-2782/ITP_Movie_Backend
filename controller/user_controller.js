const jwt = require('jsonwebtoken');
// const { compare } = require('bcrypt');
const Userdb = require('../models/Employee_model');

exports.UserLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await Userdb.findOne({ email: email });
    if (!foundUser) {
      return res.status(401).json('Invalid credentials.');
    }
    const token = jwt.sign({ email: foundUser.email,EmployeeId:foundUser.EmployeeId,imei:foundUser.imei },'123456');
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal server error.');
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await Userdb.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal server error.');
  }
};
