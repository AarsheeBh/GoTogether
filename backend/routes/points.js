const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Activity = require('../models/Activity');
const ActivityCompletion = require('../models/ActivityCompletion');
const { POINTS, awardPoints, getDiscountTier, getPointsToNextLevel } = require('../utils/points');

// @route   POST /api/points/complete-activity
// @desc    Complete activity with proof (photo/video)
// @access  Private
router.post('/complete-activity', protect, async (req, res) => {
  try {
    const { activityId, proofMedia, proofType, participantIds } = req.body;

    // Validate input
    if (!activityId || !proofMedia || !proofType) {
      return res.status(400).json({ message: 'Activity ID, proof media, and proof type are required' });
    }

    // Get activity
    const activity = await Activity.findById(activityId).populate('user');
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Create completion record
    const participants = [
      { user: activity.user._id, pointsAwarded: POINTS.ACTIVITY_COMPLETED },
      { user: req.user._id, pointsAwarded: POINTS.ACTIVITY_COMPLETED }
    ];

    // Add additional participants if provided
    if (participantIds && Array.isArray(participantIds)) {
      participantIds.forEach(id => {
        if (id !== activity.user._id.toString() && id !== req.user._id.toString()) {
          participants.push({ user: id, pointsAwarded: POINTS.ACTIVITY_COMPLETED });
        }
      });
    }

    const completion = await ActivityCompletion.create({
      activity: activityId,
      participants,
      proofMedia,
      proofType,
      submittedBy: req.user._id
    });

    // Award points to all participants
    const pointsResults = [];
    for (const participant of participants) {
      const result = await awardPoints(
        participant.user,
        participant.pointsAwarded,
        `Completed: ${activity.title}`
      );
      pointsResults.push({ userId: participant.user, ...result });
    }

    // Update completed activities count
    await User.updateMany(
      { _id: { $in: participants.map(p => p.user) } },
      { $inc: { completedActivities: 1 } }
    );

    res.json({
      message: 'Activity completed successfully!',
      completion,
      pointsAwarded: pointsResults,
      totalPoints: pointsResults.reduce((sum, r) => sum + r.pointsAdded, 0)
    });
  } catch (error) {
    console.error('Complete activity error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/points/accept-request
// @desc    Award points when request is accepted
// @access  Private
router.post('/accept-request', protect, async (req, res) => {
  try {
    const { activityId, requesterId } = req.body;

    if (!activityId || !requesterId) {
      return res.status(400).json({ message: 'Activity ID and requester ID are required' });
    }

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Award points to both users
    const creatorResult = await awardPoints(
      req.user._id,
      POINTS.REQUEST_ACCEPTED,
      'Connection accepted'
    );

    const requesterResult = await awardPoints(
      requesterId,
      POINTS.REQUEST_ACCEPTED,
      'Connection accepted'
    );

    res.json({
      message: 'Points awarded for connection!',
      creator: creatorResult,
      requester: requesterResult
    });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/points/my-stats
// @desc    Get current user's points and stats
// @access  Private
router.get('/my-stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const discountTier = getDiscountTier(user.points);
    const nextLevel = getPointsToNextLevel(user.points);

    res.json({
      points: user.points,
      level: user.level,
      completedActivities: user.completedActivities,
      discountTier,
      nextLevel
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/points/leaderboard
// @desc    Get top users by points
// @access  Private
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const topUsers = await User.find()
      .select('name points level completedActivities')
      .sort({ points: -1 })
      .limit(limit);

    res.json(topUsers);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


