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
    of: new mongoose.Schema({
      encrypted: {
        type: String,
        required: true
      },
      iv: {
        type: String,
        required: true
      }
    }, { _id: false }),
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
  profilePhoto: {
    type: String,
    default: null
  },
  preferredProvider: {
    type: String,
    enum: ['openrouter', 'groq', 'anthropic', 'fallback'],
    default: 'openrouter'
  },
  onboarded: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent overwriting model in hot reload
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
