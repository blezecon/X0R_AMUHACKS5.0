import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  },
  passwordHash: {
    type: String,
    required: true
  },
  encryptedApiKeys: {
    type: Map,
    of: String,
    default: {}
  },
  preferences: {
    meal: {
      type: Map,
      of: Number,
      default: {}
    },
    task: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  otpCode: {
    type: String,
    default: null
  },
  otpExpiresAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index on email for faster lookups
UserSchema.index({ email: 1 });

// Prevent overwriting model in hot reload
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
