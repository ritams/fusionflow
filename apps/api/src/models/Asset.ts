import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: false }, // Not required for text
    type: { type: String, enum: ['image', 'video', 'text'], required: true },
    prompt: { type: String },
    content: { type: String }, // For text assets
    position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 }
    },
    dimensions: {
        width: { type: Number },
        height: { type: Number }
    },
    customTitle: { type: String },
    isVisibleOnCanvas: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

export const Asset = mongoose.model('Asset', assetSchema);
