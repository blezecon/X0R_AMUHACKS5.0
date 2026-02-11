import User from '../models/User.js';
import Decision from '../models/Decision.js';
import Feedback from '../models/Feedback.js';
import { connectDB } from './mongodb.js';
import {
  getAISuggestion,
  getFallbackOptions
} from './ai-proxy.js';
import {
  calculateConfidence,
  updatePreferences,
  getTopOptions,
  blendOptions
} from '../utils/learning.js';

export async function getRecommendation(userId, type, context) {
  // Ensure DB connection
  await connectDB();

  // Get user preferences
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const preferences = user.preferences || { meal: {}, task: {} };

  // Get AI suggestion
  let aiSuggestion = null;
  try {
    aiSuggestion = await getAISuggestion(userId, type, context, preferences);
  } catch (error) {
    console.error('AI suggestion failed:', error);
  }

  // Get fallback options
  const fallbackOptions = getFallbackOptions(type);

  // Get user's top preferred options
  const userTopOptions = getTopOptions(preferences, type, 2);

  // Blend options
  const options = blendOptions(aiSuggestion, fallbackOptions, userTopOptions);

  // Calculate confidence
  const primaryOption = options[0];
  const confidence = aiSuggestion
    ? Math.max(0.7, calculateConfidence(preferences, primaryOption, type))
    : calculateConfidence(preferences, primaryOption, type);

  // Create decision document
  const decision = new Decision({
    userId,
    type,
    context,
    options,
    aiSuggestion,
    confidence
  });

  await decision.save();

  return {
    decisionId: decision._id.toString(),
    options,
    aiSuggestion,
    confidence,
    type
  };
}

export async function recordFeedback(userId, decisionId, chosenOption, rating) {
  // Ensure DB connection
  await connectDB();

  // Get the decision
  const decision = await Decision.findOne({
    _id: decisionId,
    userId
  });

  if (!decision) {
    throw new Error('Decision not found');
  }

  // Validate chosen option
  if (!decision.options.includes(chosenOption)) {
    throw new Error('Invalid option selected');
  }

  // Record feedback
  const feedback = new Feedback({
    decisionId,
    chosenOption,
    rating,
    userId,
    type: decision.type
  });

  await feedback.save();

  // Update user preferences
  const user = await User.findById(userId);

  const updatedPreferences = updatePreferences(
    user.preferences || { meal: {}, task: {} },
    decision.type,
    chosenOption,
    rating
  );

  user.preferences = updatedPreferences;
  await user.save();

  return {
    success: true,
    updatedPreferences: updatedPreferences[decision.type]
  };
}

export async function getUserStats(userId) {
  // Ensure DB connection
  await connectDB();

  const totalDecisions = await Decision.countDocuments({ userId });
  const totalFeedback = await Feedback.countDocuments({ userId });

  // Calculate average rating
  const avgRatingResult = await Feedback.aggregate([
    { $match: { userId } },
    { $group: { _id: null, avg: { $avg: '$rating' } } }
  ]);

  const user = await User.findById(userId);

  return {
    totalDecisions,
    totalFeedback,
    averageRating: avgRatingResult[0]?.avg || 0,
    topPreferences: {
      meal: getTopOptions(user?.preferences || {}, 'meal', 3),
      task: getTopOptions(user?.preferences || {}, 'task', 3)
    }
  };
}
