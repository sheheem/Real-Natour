/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const catchAsync = require('../utlils/catchAsync');

exports.signUp = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
  res.status(200).json({
    status: 'Success',
    token,
    data: {
      newUser,
    },
  });
});
