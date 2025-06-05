import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  wallet: { type: String, unique: true, required: true },
  fullName: String,
  dob: Date,
  gender: String,
  city: String,
  hobbies: [String],
  bio: String,
  ktpCid: String,
  profileCid: String,
  isVerified: { type: Boolean, default: false },
  verifiedAt: Date,
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
