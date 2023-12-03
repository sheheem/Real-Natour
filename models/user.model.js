/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const crypto = require('crypto');
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
    type: String,
    enum: ['admin', 'lead-guide', 'staff', 'user'],
    default: 'user',
  },
  passwordReset: String,
  passwordExpires: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordReset = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordReset = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
