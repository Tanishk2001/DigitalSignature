import Signature from '../models/Signature.js';
import Document from '../models/Document.js';
import jwt from 'jsonwebtoken';

import { auditLog } from '../middleware/audit.js';

export const saveSignature = async (req, res) => {
  try {
    const { documentId, coordinates, signatureText } = req.body;

    if (!documentId || !coordinates) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const signature = new Signature({
      documentId,
      signerId: req.userId,
      coordinates,
      signatureText: signatureText || `Signed by user on ${new Date().toLocaleDateString()}`,
      status: 'pending',
    });

    await signature.save();

    // Log audit: signature created
    try {
      if (req.auditLog) {
        await req.auditLog('signature_added', {
          documentId,
          signatureId: signature._id,
          coordinates,
        });
      } else {
        // fallback for routes that might not have audit middleware
        await auditLog(req.userId, 'signature_added', { documentId, signatureId: signature._id, coordinates }, req.ip);
      }
    } catch (err) {
      console.error('Audit log error:', err);
    }

    res.status(201).json({
      message: 'Signature saved successfully',
      signature,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSignatures = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const signatures = await Signature.find({ documentId }).populate(
      'signerId',
      'name email'
    );

    res.json({ signatures });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSignatureStatus = async (req, res) => {
  try {
    const { signatureId } = req.params;
    const { status, rejectionReason } = req.body;

    const signature = await Signature.findById(signatureId);
    if (!signature) {
      return res.status(404).json({ message: 'Signature not found' });
    }

    signature.status = status;
    if (status === 'signed') {
      signature.signedAt = new Date();
    } else if (status === 'rejected') {
      signature.rejectionReason = rejectionReason;
      signature.rejectedAt = new Date();
    }

    await signature.save();

    // Log audit: signature status updated
    try {
      if (req.auditLog) {
        await req.auditLog('signature_status_updated', {
          signatureId,
          documentId: signature.documentId,
          status,
          rejectionReason: rejectionReason || null,
        });
      } else {
        await auditLog(req.userId, 'signature_status_updated', { signatureId, documentId: signature.documentId, status, rejectionReason }, req.ip);
      }
    } catch (err) {
      console.error('Audit log error:', err);
    }

    // Update document status
    const allSignatures = await Signature.find({
      documentId: signature.documentId,
    });
    const allSigned = allSignatures.every((s) => s.status === 'signed');
    if (allSigned) {
      await Document.findByIdAndUpdate(signature.documentId, {
        status: 'signed',
      });
    }

    res.json({ message: 'Signature status updated', signature });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateSigningToken = async (req, res) => {
  try {
    const { documentId, signerEmail } = req.body;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const token = jwt.sign(
      { documentId, signerEmail },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const signature = new Signature({
      documentId,
      signerEmail,
      signingToken: token,
      status: 'pending',
    });

    await signature.save();

    res.json({
      message: 'Signing token generated',
      token,
      signingUrl: `${process.env.FRONTEND_URL}/sign/${token}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
