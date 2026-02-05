import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String },
    googleId: { type: String, sparse: true },
    createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', userSchema);
