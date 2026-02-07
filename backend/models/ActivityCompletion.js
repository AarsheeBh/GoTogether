const mongoose = require('mongoose');

const activityCompletionSchema = new mongoose.Schema({
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    pointsAwarded: {
      type: Number,
      default: 0
    }
  }],
  proofMedia: {
    type: String, // URL to uploaded photo/video
    required: true
  },
  proofType: {
    type: String,
    enum: ['photo', 'video'],
    required: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: true // Auto-verify for now, can add manual verification later
  }
});

module.exports = mongoose.model('ActivityCompletion', activityCompletionSchema);


