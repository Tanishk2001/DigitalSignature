import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
    },
    mimeType: {
      type: String,
      default: 'application/pdf',
    },
    status: {
      type: String,
      enum: ['draft', 'pending-signature', 'signed', 'rejected'],
      default: 'draft',
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Document', documentSchema);
