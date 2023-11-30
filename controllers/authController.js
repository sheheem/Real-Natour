/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const catchAsync = require('../utlils/catchAsync');
const AppError = require('../utlils/app-error');

const jwtSign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });

exports.signUp = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  const token = jwtSign(newUser._id);
  res.status(200).json({
    status: 'Success',
    token,
    data: {
      newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Email or password is missing', 400));
  }

  const user = await User.findOne({ email }).select(+password);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Unauthorized', 401));
  }

  const token = jwtSign(user._id);
  res.status(200).json({
    status: 'Success',
    token,
  });
});
