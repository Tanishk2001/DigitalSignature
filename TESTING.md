# 🧪 Testing Guide

## Local Testing Setup

### 1. Backend Testing with Postman

**Import Postman Collection**
1. Open Postman
2. Click "Import"
3. Select `Postman_Collection.json`

### 2. Manual API Testing

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response will include JWT token - save for next requests.

#### Upload Document
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/document.pdf"
```

#### Save Signature
```bash
curl -X POST http://localhost:5000/api/signatures/save \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "documentId": "DOCUMENT_ID",
    "coordinates": {
      "page": 0,
      "x": 100,
      "y": 200
    },
    "signatureText": "Signed by John"
  }'
```

#### Get Signatures
```bash
curl -X GET http://localhost:5000/api/signatures/DOCUMENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Generate Signed PDF
```bash
curl -X POST http://localhost:5000/api/pdf/generate-signed/DOCUMENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Audit Trail
```bash
curl -X GET http://localhost:5000/api/audit/user/trail \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Frontend Testing

### Test Scenarios

#### 1. Authentication Flow
- [ ] Register with valid email/password
- [ ] Register with duplicate email (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Logout
- [ ] Protected routes redirect to login when not authenticated

#### 2. Document Upload
- [ ] Upload PDF successfully
- [ ] Upload non-PDF file (should fail)
- [ ] View uploaded documents in dashboard
- [ ] Delete document
- [ ] Download document

#### 3. Signature Placement
- [ ] Open document
- [ ] Add signature with text
- [ ] Place signature on PDF
- [ ] View placed signature
- [ ] Update signature status

#### 4. Public Signing
- [ ] Generate signing token
- [ ] Open public signing link
- [ ] Fill in signer details
- [ ] Sign document as external user

#### 5. Audit Trail
- [ ] View audit trail page
- [ ] See all user actions logged
- [ ] Verify timestamp and action details

## Automated Testing (Optional)

### Jest Unit Tests (Backend)

Create `backend/__tests__/auth.test.js`:
```javascript
const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });
});
```

### React Testing Library (Frontend)

Create `frontend/src/__tests__/Login.test.jsx`:
```javascript
import { render, screen } from '@testing-library/react';
import Login from '../pages/Login';

describe('Login Component', () => {
  it('should render login form', () => {
    render(<Login />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});
```

## Performance Testing

### Load Testing with Artillery

Install:
```bash
npm install -g artillery
```

Create `load-test.yml`:
```yaml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Health Check"
    flow:
      - get:
          url: "/api/health"
```

Run:
```bash
artillery run load-test.yml
```

## Security Testing

### SQL Injection Testing
- Try email: `test@example.com" OR "1"="1`
- Should not bypass authentication

### CSRF Testing
- Verify CORS headers are properly set
- Check if cross-origin requests are blocked

### XSS Testing
- Try uploading files with script tags in name
- Should be sanitized

## Browser Testing

### Cross-Browser Compatibility
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Responsive Design
- [ ] Mobile (320px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)

## User Acceptance Testing (UAT)

### Test Case 1: Basic Document Signing
1. Create account
2. Upload PDF
3. Add signature
4. Generate signed PDF
5. Verify signature on output

### Test Case 2: External Signer
1. As document owner, generate signing link
2. Open link in incognito (new user)
3. Sign document without login
4. Verify signature recorded

### Test Case 3: Audit Trail
1. Perform various actions
2. Check audit trail
3. Verify all actions logged with timestamps

## Known Issues

- [ ] Document any bugs found
- [ ] Add fixes to backlog

## Performance Benchmarks

- [ ] Page load time < 2 seconds
- [ ] API response time < 500ms
- [ ] PDF upload speed (file size dependent)
- [ ] Database query time < 100ms

## Final Checklist

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] No console errors
- [ ] No CORS issues
- [ ] All features functional
- [ ] Performance acceptable
- [ ] Security vulnerabilities addressed
- [ ] Ready for production
