import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    // unique: true,
    required: [true, 'Please tell your username'],
  },
  uuid: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['SCHOOL_ADMIN', 'STUDENT', 'TEACHER', 'ADMIN'],
    default: 'STUDENT',
  },
  age: {
    type: Number,
    required: [true, 'Please tell your username'],
  },
  gender: {
    type: String,
    required: [true, 'Please enter your gender'],
    enum: ['MALE', 'FEMALE'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    select: false,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const User = mongoose.model('User', UserSchema);

export default User;
