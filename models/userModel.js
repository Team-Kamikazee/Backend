import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';

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
  dob: {
    type: String,
    required: [true, 'Please tell your date of birth'],
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
  sponsorship: {
    type: String,
    enum: ['SCHOLARSHIP', 'SELF', 'GOVERNMENT'],
  },
  familyAnnualIncome: {
    type: String,
  },
  disability: {
    type: Boolean,
  },
  siblings: {
    type: Number,
  },
  distance: {
    type: Number,
  },
  transportFacility: {
    type: String,
  },
  toiletFacility: {
    type: String,
  },
  drinkingWater: {
    type: String,
  },
  pregnancy: {
    type: String,
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
