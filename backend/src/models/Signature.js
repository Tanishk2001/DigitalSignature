import mongoose from 'mongoose';

const signatureSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    signerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    signerEmail: {
      type: String,
    },
    coordinates: {
      page: {
        type: Number,
        required: true,
      },
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'signed', 'rejected'],
      default: 'pending',
    },
    signatureText: {
      type: String,
    },
    rejectionReason: {
      type: String,
    },
    signingToken: {
      type: String,
    },
    signedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Signature', signatureSchema);
