# 🏗️ Architecture & Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Auth Pages  │  │ Dashboard    │  │  PDF Viewer  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                 │                  │               │
│         └─────────────────┼──────────────────┘               │
│                           │                                  │
│                    Axios API Client                          │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │ HTTP/HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend (Express.js + Node.js)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Router Layer                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │Auth      │  │Document  │  │Signature │          │  │
│  │  │Routes    │  │Routes    │  │Routes    │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  └──────────────────────────────────────────────────────┘  │
│           │                                                  │
│  ┌────────▼──────────────────────────────────────────────┐  │
│  │          Middleware Layer                            │  │
│  │  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │Auth          │  │Audit         │                 │  │
│  │  │Middleware    │  │Middleware    │                 │  │
│  │  └──────────────┘  └──────────────┘                 │  │
│  └──────────────────────────────────────────────────────┘  │
│           │                                                  │
│  ┌────────▼──────────────────────────────────────────────┐  │
│  │          Controller Layer                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │Auth      │  │Document  │  │PDF       │           │  │
│  │  │Ctrl      │  │Ctrl      │  │Ctrl      │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │Signature │  │Email     │  │Audit     │           │  │
│  │  │Ctrl      │  │Ctrl      │  │Ctrl      │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  └──────────────────────────────────────────────────────┘  │
│           │                                                  │
│  ┌────────▼──────────────────────────────────────────────┐  │
│  │          Model/Schema Layer                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │User      │  │Document  │  │Signature │           │  │
│  │  │Schema    │  │Schema    │  │Schema    │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  │  ┌──────────┐                                         │  │
│  │  │Audit     │                                         │  │
│  │  │Schema    │                                         │  │
│  │  └──────────┘                                         │  │
│  └──────────────────────────────────────────────────────┘  │
│           │                                                  │
└───────────┼──────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        MongoDB Database                             │  │
│  │  Collections:                                        │  │
│  │  - users                                             │  │
│  │  - documents                                         │  │
│  │  - signatures                                        │  │
│  │  - audits                                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        File Storage                                 │  │
│  │  - uploads/ (PDF files)                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Email Service                                │  │
│  │  - nodemailer (SMTP)                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### User Registration & Login Flow
```
User Input (Register Form)
         │
         ▼
Frontend Validation
         │
         ▼
POST /api/auth/register
         │
         ▼
Backend Validation
         │
         ├─ Check email exists?
         │
         ▼
Password Hashing (bcrypt)
         │
         ▼
Save to MongoDB
         │
         ▼
Generate JWT Token
         │
         ▼
Return Token to Frontend
         │
         ▼
Store in LocalStorage
         │
         ▼
Redirect to Dashboard
```

### Document Upload & Signature Flow
```
Select PDF File (Frontend)
         │
         ▼
Validate File (PDF, <50MB)
         │
         ▼
Upload to /api/documents/upload
         │
         ▼
Multer Middleware
         │
         ├─ Validate MIME type
         │
         ├─ Save to uploads/
         │
         ▼
Create Document record in MongoDB
         │
         ▼
Return Document to Frontend
         │
         ▼
Display in Dashboard
         │
         ▼
User opens Document
         │
         ▼
View PDF with react-pdf
         │
         ▼
Click to place Signature
         │
         ▼
POST /api/signatures/save
         │
         ▼
Save Signature coordinates in MongoDB
         │
         ▼
Update Document status
```

### PDF Generation & Signing Flow
```
User clicks "Generate Signed PDF"
         │
         ▼
POST /api/pdf/generate-signed/:documentId
         │
         ▼
Load original PDF (pdf-lib)
         │
         ▼
Get all signatures for document
         │
         ├─ Filter "signed" signatures
         │
         ▼
Add text/image for each signature
         │
         ├─ Position: coordinates
         │
         ├─ Text: signature text + timestamp
         │
         ▼
Save signed PDF to uploads/
         │
         ▼
Update Document in MongoDB
         │
         ├─ filePath: new signed PDF
         │
         ├─ status: "signed"
         │
         ▼
Return download URL to Frontend
```

### Audit Trail Flow
```
User performs action (upload, sign, etc)
         │
         ▼
Controller action executed
         │
         ▼
Audit middleware captures:
         │
         ├─ userId
         │
         ├─ action (type)
         │
         ├─ details (action data)
         │
         ├─ IP address
         │
         ├─ timestamp
         │
         ▼
Save to audits collection in MongoDB
         │
         ▼
User requests audit trail
         │
         ▼
GET /api/audit/user/trail
         │
         ▼
Return sorted audit records
```

## Security Architecture

### Authentication Flow
```
┌─────────────────────────────────┐
│    User Credentials             │
│    (email + password)           │
└──────────────┬──────────────────┘
               │
               ▼
        ┌──────────────┐
        │ Validate     │
        │ Email/Pass   │
        └──────┬───────┘
               │
               ▼
        ┌──────────────────────┐
        │ bcrypt.compare()     │
        │ (compare hash)       │
        └──────┬───────────────┘
               │
               ▼
        ┌──────────────────────┐
        │ Generate JWT Token   │
        │ (expires: 7 days)    │
        └──────┬───────────────┘
               │
               ▼
        ┌──────────────────────┐
        │ Return Token         │
        │ to Frontend          │
        └──────┬───────────────┘
               │
               ▼
        ┌──────────────────────┐
        │ Store in             │
        │ localStorage         │
        └──────┬───────────────┘
               │
               ▼
        ┌──────────────────────┐
        │ Send in every        │
        │ API request          │
        │ (Authorization:      │
        │  Bearer TOKEN)       │
        └──────┬───────────────┘
               │
               ▼
        ┌──────────────────────┐
        │ Backend verifies     │
        │ token signature      │
        └──────┬───────────────┘
               │
               ▼
        ┌──────────────────────┐
        │ Extract userId       │
        │ from token           │
        └──────┬───────────────┘
               │
               ▼
        ✅ Request Authorized
```

## Technology Stack Details

### Frontend
- **React 18**: UI library
- **Vite**: Build tool (faster than CRA)
- **React Router v6**: Client-side routing
- **Tailwind CSS**: Utility-first CSS
- **Axios**: HTTP client with interceptors
- **react-pdf**: PDF viewer component
- **pdfjs-dist**: PDF rendering engine

### Backend
- **Express.js**: Web framework
- **Node.js**: Runtime
- **MongoDB**: NoSQL database
- **Mongoose**: ODM (Object Document Mapper)
- **JWT**: Token-based authentication
- **bcryptjs**: Password hashing
- **Multer**: File upload middleware
- **pdf-lib**: PDF manipulation
- **nodemailer**: Email service
- **CORS**: Cross-Origin Resource Sharing

### Database Schema

#### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

#### Document Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref User),
  fileName: String,
  filePath: String,
  fileSize: Number,
  mimeType: String,
  status: Enum ["draft", "pending-signature", "signed", "rejected"],
  uploadedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Signature Collection
```javascript
{
  _id: ObjectId,
  documentId: ObjectId (ref Document),
  signerId: ObjectId (ref User, optional),
  signerEmail: String,
  coordinates: {
    page: Number,
    x: Number,
    y: Number
  },
  status: Enum ["pending", "signed", "rejected"],
  signatureText: String,
  signingToken: String,
  signedAt: Date,
  rejectionReason: String,
  rejectedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Audit Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref User),
  action: String,
  details: Mixed (any JSON data),
  ipAddress: String,
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## API Response Format

### Success Response
```javascript
{
  message: "Success message",
  data: { /* response data */ },
  timestamp: "2024-01-01T00:00:00Z"
}
```

### Error Response
```javascript
{
  message: "Error message",
  status: 400|401|403|404|500,
  timestamp: "2024-01-01T00:00:00Z"
}
```

## Scalability Considerations

1. **Database**: MongoDB Atlas auto-scaling
2. **File Storage**: Cloud storage (AWS S3, Google Cloud Storage)
3. **Caching**: Redis for session/token caching
4. **API**: Load balancing with multiple backend instances
5. **CDN**: CloudFlare/CloudFront for static assets

## Performance Optimization

1. **Frontend**
   - Code splitting with React.lazy()
   - Image optimization
   - CSS minification

2. **Backend**
   - Database indexing on userId, email
   - Connection pooling
   - Response compression
   - Rate limiting

3. **PDF Processing**
   - Stream file uploads
   - Async PDF generation
   - Background job queue (Bull, RabbitMQ)

## Monitoring & Logging

1. **Application Logs**
   - Winston/Morgan for logging
   - Structured JSON logs

2. **Error Tracking**
   - Sentry for exception monitoring
   - Error alerting

3. **Performance Monitoring**
   - New Relic/DataDog
   - APM insights

4. **User Analytics**
   - Google Analytics
   - Mixpanel
