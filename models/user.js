const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Manager', 'Sales Agent', 'Director'] 
  },
  branch: {
    type: String,
    required: true,
    enum: ['Maganjo', 'Matugga', 'N/A'] 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);