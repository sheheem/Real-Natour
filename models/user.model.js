/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validator: [validator.isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Password does not match'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
    message: "Password doesn't match",
  },
  photo: {
    type: String,
    // required: true,
  },
  role: {
    enum: ['admin', 'lead-guide', 'staff', 'user'],
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
