const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide activity title'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select activity category'],
    enum: ['grocery', 'walk', 'carpool', 'errands', 'shopping', 'gym', 'dining', 'other']
  },
  description: {
    type: String,
    maxlength: 500
  },
  location: {
    type: String,
    required: [true, 'Please provide location']
  },
  scheduledTime: {
    type: Date,
    required: [true, 'Please provide scheduled time']
  },
  isImmediate: {
    type: Boolean,
    default: false
  },
  companionsNeeded: {
    type: Number,
    default: 1,
    min: 1
  },
  preferences: {
    gender: {
      type: String,
      enum: ['any', 'male', 'female', 'other']
    },
    ageRange: {
      min: Number,
      max: Number
    }
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'completed'],
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema);

