import Document from '../models/Document.js';
import Signature from '../models/Signature.js';
import path from 'path';
import fs from 'fs';

import { auditLog } from '../middleware/audit.js';

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const document = new Document({
      userId: req.userId,
      fileName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    await document.save();

    // Audit: document uploaded
    try {
      if (req.auditLog) {
        await req.auditLog('document_uploaded', {
          documentId: document._id,
          fileName: document.fileName,
          filePath: document.filePath,
        });
      } else {
        await auditLog(req.userId, 'document_uploaded', { documentId: document._id, fileName: document.fileName, filePath: document.filePath }, req.ip);
      }
    } catch (err) {
      console.error('Audit log error:', err);
    }

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        _id: document._id,
        fileName: document.fileName,
        filePath: document.filePath,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        status: document.status,
        uploadedAt: document.uploadedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.json({ documents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({ document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete file from uploads folder
    const filePath = path.join(process.cwd(), document.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Document.findByIdAndDelete(req.params.id);
    await Signature.deleteMany({ documentId: req.params.id });

    // Audit: document deleted
    try {
      if (req.auditLog) {
        await req.auditLog('document_deleted', {
          documentId: req.params.id,
          fileName: document.fileName,
        });
      } else {
        await auditLog(req.userId, 'document_deleted', { documentId: req.params.id, fileName: document.fileName }, req.ip);
      }
    } catch (err) {
      console.error('Audit log error:', err);
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
