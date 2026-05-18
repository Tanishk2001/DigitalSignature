import nodemailer from 'nodemailer';
import Signature from '../models/Signature.js';
import Document from '../models/Document.js';

// Configure email service (using Gmail or mock)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendSigningLink = async (req, res) => {
  try {
    const { signatureId } = req.params;

    const signature = await Signature.findById(signatureId);
    if (!signature) {
      return res.status(404).json({ message: 'Signature not found' });
    }

    const document = await Document.findById(signature.documentId);

    const signingUrl = `${process.env.FRONTEND_URL}/sign/${signature.signingToken}`;

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: signature.signerEmail,
      subject: `Document Signature Request: ${document.fileName}`,
      html: `
        <h2>Document Signature Request</h2>
        <p>You have been asked to sign the following document:</p>
        <p><strong>${document.fileName}</strong></p>
        <p>Click the link below to review and sign the document:</p>
        <a href="${signingUrl}" style="background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Sign Document
        </a>
        <p>This link will expire in 7 days.</p>
      `,
    };

    // Send email (or log in development)
    if (process.env.NODE_ENV === 'production') {
      await transporter.sendMail(mailOptions);
    } else {
      console.log('📧 Email would be sent to:', signature.signerEmail);
      console.log('🔗 Signing URL:', signingUrl);
    }

    res.json({ message: 'Signing link sent to email', signingUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendNotification = async (email, subject, message) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject,
      html: message,
    };

    if (process.env.NODE_ENV === 'production') {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(`📧 Email to ${email}: ${subject}`);
    }
  } catch (error) {
    console.error('Email error:', error);
  }
};
