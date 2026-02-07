const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

// @route   POST /api/activities
// @desc    Create a new activity
// @access  Private
router.post('/', protect, [
  body('title').notEmpty().withMessage('Title is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('scheduledTime').notEmpty().withMessage('Scheduled time is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const activity = await Activity.create({
      user: req.user._id,
      ...req.body
    });

    const populatedActivity = await Activity.findById(activity._id).populate('user', 'name email age gender');

    res.status(201).json(populatedActivity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/activities
// @desc    Get all activities (with filters)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { category, status } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    else query.status = 'open'; // Default to open activities

    const activities = await Activity.find(query)
      .populate('user', 'name email age gender')
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/activities/:id
// @desc    Get single activity
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('user', 'name email age gender');
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/activities/:id
// @desc    Update activity
// @access  Private (only activity creator)
router.put('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Check if user is activity creator
    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this activity' });
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email age gender');

    res.json(updatedActivity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/activities/:id
// @desc    Delete activity
// @access  Private (only activity creator)
router.delete('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Check if user is activity creator
    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this activity' });
    }

    await Activity.findByIdAndDelete(req.params.id);

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

