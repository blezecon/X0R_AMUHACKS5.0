import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  decisionId: {
    type: String,
    required: true,
    index: true
  },
  chosenOption: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['meal', 'task']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for faster queries
FeedbackSchema.index({ userId: 1, createdAt: -1 });
FeedbackSchema.index({ decisionId: 1 });

// Prevent overwriting model in hot reload
const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);

export default Feedback;
