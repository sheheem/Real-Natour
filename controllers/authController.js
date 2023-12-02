/* eslint-disable import/no-extraneous-dependencies */
const { promisify } = require('util');
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

exports.protectRoute = catchAsync(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    return next(new AppError('Please login', 401));
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return next(new AppError('Invalid Token', 401));
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  if (!decode) {
    return next(new AppError('Invalid Token', 401));
  }

  const currentUser = await User.findById(decode.id);

  if (!currentUser) {
    return next(new AppError('User no longer exist', 401));
  }

  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have access', 403));
    }
  };
