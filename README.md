# 📝 Digital Signature Application

A complete MERN stack application for secure, legally binding digital document signing with PDF handling, email notifications, and comprehensive audit trails.

## 🎯 Features

### Core Features
- ✅ **User Authentication** - JWT-based authentication with secure password hashing
- ✅ **PDF Upload & Management** - Upload and manage PDF documents
- ✅ **Digital Signatures** - Add signatures to documents with coordinate-based placement
- ✅ **PDF Generation** - Generate signed PDF documents with embedded signatures
- ✅ **Email Notifications** - Send signing links via email to external signers
- ✅ **Audit Trail** - Complete logging of all actions with IP tracking
- ✅ **Status Management** - Track signature status (Pending, Signed, Rejected)
- ✅ **Public Signing** - External users can sign documents via tokenized links
- ✅ **Responsive UI** - Beautiful Tailwind CSS interface

## 📁 Project Structure

```
DigitalSignature/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── documentController.js
│   │   │   ├── signatureController.js
│   │   │   ├── pdfController.js
│   │   │   ├── emailController.js
│   │   │   └── auditController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Document.js
│   │   │   ├── Signature.js
│   │   │   └── Audit.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── audit.js
│   │   └── routes/
│   │       ├── authRoutes.js
│   │       ├── documentRoutes.js
│   │       ├── signatureRoutes.js
│   │       ├── pdfRoutes.js
│   │       ├── emailRoutes.js
│   │       └── auditRoutes.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DocumentDetail.jsx
│   │   │   ├── PublicSign.jsx
│   │   │   └── AuditTrail.jsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── auth.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your values:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/digital-signature
   JWT_SECRET=your_secure_secret_key
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   MAIL_FROM=noreply@digitalsignature.com
   ```

3. **Start Server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   ```

3. **Start Dev Server**
   ```bash
   npm run dev
   ```
   App will run on `http://localhost:5173`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Documents
- `POST /api/documents/upload` - Upload PDF
- `GET /api/documents` - Get user's documents
- `GET /api/documents/:id` - Get document details
- `DELETE /api/documents/:id` - Delete document

### Signatures
- `POST /api/signatures/save` - Save signature placement
- `GET /api/signatures/:documentId` - Get document signatures
- `PATCH /api/signatures/:signatureId` - Update signature status
- `POST /api/signatures/token/generate` - Generate signing token

### PDF
- `POST /api/pdf/generate-signed/:documentId` - Generate signed PDF
- `GET /api/pdf/download/:documentId` - Download document

### Email
- `POST /api/email/send-link/:signatureId` - Send signing link

### Audit
- `GET /api/audit/document/:documentId` - Get document audit trail
- `GET /api/audit/user/trail` - Get user's audit trail

## 📊 Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  timestamps
}
```

### Document
```javascript
{
  userId: ObjectId,
  fileName: String,
  filePath: String,
  fileSize: Number,
  mimeType: String,
  status: "draft|pending-signature|signed|rejected",
  uploadedAt: Date,
  timestamps
}
```

### Signature
```javascript
{
  documentId: ObjectId,
  signerId: ObjectId,
  signerEmail: String,
  coordinates: {
    page: Number,
    x: Number,
    y: Number
  },
  status: "pending|signed|rejected",
  signatureText: String,
  signingToken: String,
  signedAt: Date,
  rejectedAt: Date,
  rejectionReason: String,
  timestamps
}
```

### Audit
```javascript
{
  userId: ObjectId,
  action: String,
  details: Mixed,
  ipAddress: String,
  timestamp: Date,
  timestamps
}
```

## 🔒 Security Features

- JWT-based authentication with expiration
- Bcrypt password hashing
- Protected API routes with middleware
- CORS configuration
- IP tracking for audit trails
- Secure file upload with MIME type validation
- File size limits (50MB)

## 🎨 Frontend Features

- Clean, responsive UI with Tailwind CSS
- PDF viewer with page navigation
- Click-based signature placement on PDFs
- Real-time document status tracking
- User-friendly authentication forms
- Audit trail visualization
- Public signing interface

## 📧 Email Configuration

For production, configure real SMTP credentials. For development, emails are logged to console.

### Gmail Setup
1. Enable 2FA on Google Account
2. Generate App Password
3. Use App Password as `SMTP_PASS`

## 🧪 Testing with Postman

1. Register user
2. Login to get JWT token
3. Upload PDF document
4. Create signatures with coordinates
5. Generate signed PDF
6. Check audit trail

## 🚀 Deployment

### Backend (Render/Railway)
1. Push to GitHub
2. Connect repository
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push to GitHub
2. Connect repository
3. Deploy with `npm run build`

### Database (MongoDB Atlas)
1. Create cluster
2. Get connection string
3. Add to backend `.env`

## 📝 Next Steps

- [ ] Add signature image/handwriting support
- [ ] Implement batch document signing
- [ ] Add document templates
- [ ] SMS notifications
- [ ] Multi-language support
- [ ] Dark mode UI
- [ ] Advanced PDF annotation tools
- [ ] Integration with DocuSign-like services

## 📄 License

MIT License

## 👥 Contributors

Built as part of the 2-week Digital Signature project.

## 📞 Support

For issues and questions, please refer to the documentation or create an issue.

---

**Happy Signing! 📝✍️**
