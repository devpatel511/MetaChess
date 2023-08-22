const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  compWins: {
    type: Number,
    default: 0
  },
  elo: {
    type: Number,
    default: 400
  }
});

// Create the user model
const User = mongoose.model('User', userSchema);

module.exports = User;
