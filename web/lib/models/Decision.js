import mongoose from 'mongoose';

const DecisionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['meal', 'task', 'clothing']
  },
  question: {
    type: String,
    default: 'Personalized suggestion'
  },
  context: {
    weather: { type: String, default: null },
    time: { type: String, default: null },
    location: { type: String, default: null }
  },
  options: {
    type: [String],
    required: true
  },
  aiSuggestion: {
    type: String,
    default: null
  },
  providerUsed: {
    type: String,
    enum: ['openrouter', 'groq', 'anthropic', 'fallback'],
    default: 'openrouter'
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for faster queries
DecisionSchema.index({ userId: 1, createdAt: -1 });
DecisionSchema.index({ type: 1 });

// Prevent overwriting model in hot reload
const Decision = mongoose.models.Decision || mongoose.model('Decision', DecisionSchema);

export default Decision;
