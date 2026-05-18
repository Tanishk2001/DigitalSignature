import { PDFDocument, rgb, degrees } from 'pdf-lib';
import Document from '../models/Document.js';
import Signature from '../models/Signature.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateSignedPDF = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const signatures = await Signature.find({ documentId });
    const filePath = path.join(process.cwd(), document.filePath);

    // Load existing PDF
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Add signatures to PDF
    for (const signature of signatures) {
      if (signature.status === 'signed') {
        const page = pdfDoc.getPage(signature.coordinates.page || 0);

        page.drawText(signature.signatureText || `Signed by: ${signature.signerEmail}`, {
          x: signature.coordinates.x,
          y: signature.coordinates.y,
          size: 12,
          color: rgb(0, 0, 0),
        });

        // Add timestamp
        page.drawText(`Date: ${new Date(signature.signedAt).toLocaleDateString()}`, {
          x: signature.coordinates.x,
          y: signature.coordinates.y - 20,
          size: 10,
          color: rgb(0.5, 0.5, 0.5),
        });
      }
    }

    const signedPdfBytes = await pdfDoc.save();

    // Save signed PDF
    const signedFileName = `signed-${Date.now()}.pdf`;
    const signedFilePath = path.join(process.cwd(), 'uploads', signedFileName);
    fs.writeFileSync(signedFilePath, signedPdfBytes);

    // Update document status
    await Document.findByIdAndUpdate(documentId, {
      status: 'signed',
      filePath: `/uploads/${signedFileName}`,
    });

    res.json({
      message: 'Signed PDF generated',
      filePath: `/uploads/${signedFileName}`,
      downloadUrl: `/api/documents/download/${documentId}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const filePath = path.join(process.cwd(), document.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath, document.fileName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
