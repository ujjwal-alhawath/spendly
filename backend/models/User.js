const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 120,
    },
    password: {
      type: String,
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false, // Save storage by omitting __v
  }
);

module.exports = mongoose.model('User', userSchema);

