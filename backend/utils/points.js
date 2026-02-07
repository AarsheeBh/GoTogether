// Points System Configuration
const POINTS = {
  REQUEST_ACCEPTED: 10,      // When connection/join request is accepted
  ACTIVITY_COMPLETED: 50,    // When activity is completed with proof
  ACTIVITY_CREATED: 5,       // Small bonus for creating activities
  FIRST_CONNECTION: 20       // Bonus for first successful connection
};

// Level thresholds
const LEVEL_THRESHOLDS = [
  { level: 1, points: 0 },
  { level: 2, points: 100 },
  { level: 3, points: 250 },
  { level: 4, points: 500 },
  { level: 5, points: 1000 },
  { level: 6, points: 2000 },
  { level: 7, points: 3500 },
  { level: 8, points: 5000 },
  { level: 9, points: 7500 },
  { level: 10, points: 10000 }
];

// Discount tiers based on points
const DISCOUNT_TIERS = [
  { minPoints: 0, discount: 0, name: 'Newcomer' },
  { minPoints: 100, discount: 5, name: 'Explorer' },
  { minPoints: 250, discount: 10, name: 'Adventurer' },
  { minPoints: 500, discount: 15, name: 'Voyager' },
  { minPoints: 1000, discount: 20, name: 'Pathfinder' },
  { minPoints: 2000, discount: 25, name: 'Trailblazer' },
  { minPoints: 3500, discount: 30, name: 'Pioneer' },
  { minPoints: 5000, discount: 35, name: 'Legend' }
];

/**
 * Calculate user level based on points
 */
const calculateLevel = (points) => {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i].points) {
      level = LEVEL_THRESHOLDS[i].level;
      break;
    }
  }
  return level;
};

/**
 * Get discount tier for user
 */
const getDiscountTier = (points) => {
  let tier = DISCOUNT_TIERS[0];
  for (let i = DISCOUNT_TIERS.length - 1; i >= 0; i--) {
    if (points >= DISCOUNT_TIERS[i].minPoints) {
      tier = DISCOUNT_TIERS[i];
      break;
    }
  }
  return tier;
};

/**
 * Get points needed for next level
 */
const getPointsToNextLevel = (currentPoints) => {
  const currentLevel = calculateLevel(currentPoints);
  const nextLevelThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
  
  if (!nextLevelThreshold) {
    return { pointsNeeded: 0, nextLevel: currentLevel }; // Max level reached
  }
  
  return {
    pointsNeeded: nextLevelThreshold.points - currentPoints,
    nextLevel: nextLevelThreshold.level,
    nextLevelPoints: nextLevelThreshold.points
  };
};

/**
 * Award points to user and update level
 */
const awardPoints = async (userId, pointsToAdd, reason = 'Activity') => {
  const User = require('../models/User');
  
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  const oldPoints = user.points;
  const newPoints = oldPoints + pointsToAdd;
  const newLevel = calculateLevel(newPoints);
  
  user.points = newPoints;
  user.level = newLevel;
  await user.save();
  
  return {
    pointsAdded: pointsToAdd,
    oldPoints,
    newPoints,
    oldLevel: user.level,
    newLevel,
    leveledUp: newLevel > calculateLevel(oldPoints),
    reason
  };
};

module.exports = {
  POINTS,
  LEVEL_THRESHOLDS,
  DISCOUNT_TIERS,
  calculateLevel,
  getDiscountTier,
  getPointsToNextLevel,
  awardPoints
};


