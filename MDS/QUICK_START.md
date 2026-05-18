# ⚡ Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
# From DigitalSignature folder
cd backend
npm install
cd ../frontend
npm install
cd ..
```

### Step 2: Configure Environment
```bash
# Backend
cd backend
copy .env.example .env
# Edit .env and update:
# - MONGODB_URI (MongoDB connection string)
# - JWT_SECRET (any random string)

# Frontend
cd ../frontend
copy .env.example .env.local
# No changes needed for local development
```

### Step 3: Start Backend & Frontend
```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Should show: ✅ Server running on port 5000

# Terminal 2 - Frontend
cd frontend
npm run dev
# Should show: ✅ Ready on http://localhost:5173
```

### Step 4: Test the App
1. Open http://localhost:5173
2. Click "Register"
3. Fill in: Name, Email, Password
4. Click "Register"
5. You should be redirected to Dashboard

## Testing API Endpoints

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```
Copy the token from response.

### 3. Check API Health
```bash
curl http://localhost:5000/api/health
```

## Common Issues

### MongoDB Connection Error
**Error**: `MongoDB Connection Error`

**Solution**:
1. Ensure MongoDB is running
2. Check MONGODB_URI in .env
3. For MongoDB Atlas: Add your IP to whitelist

### Port Already in Use
**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### CORS Error
**Error**: `Access to XMLHttpRequest blocked by CORS`

**Solution**:
1. Ensure FRONTEND_URL is set correctly in backend .env
2. Restart backend server
3. Hard refresh frontend (Ctrl+Shift+Delete)

### PDF Upload Not Working
**Solution**:
1. Ensure uploads/ folder exists
2. Check file is actually PDF
3. File size < 50MB
4. Check permissions on uploads/ folder

## Project Structure Quick View
```
DigitalSignature/
├── backend/              (Express + MongoDB)
│   ├── src/
│   │   ├── models/       (Database schemas)
│   │   ├── controllers/  (Business logic)
│   │   ├── routes/       (API endpoints)
│   │   ├── middleware/   (Auth, audit)
│   │   └── config/       (Database)
│   └── server.js         (Entry point)
├── frontend/             (React + Vite)
│   ├── src/
│   │   ├── pages/        (React pages)
│   │   ├── components/   (React components)
│   │   ├── utils/        (API, auth helpers)
│   │   └── styles/       (CSS)
│   └── index.html        (Entry point)
└── README.md             (Full documentation)
```

## Key Features to Try

### 1. Upload PDF
- Dashboard → Upload file field
- Select a PDF file
- Click Upload
- See file in documents table

### 2. Add Signature
- Click on document
- Enter signature text
- Click "Add Signature"
- Click on PDF where you want to sign
- Signature saved!

### 3. Generate Signed PDF
- Go to document
- Make sure signature is added
- Click "Generate Signed PDF"
- Download the signed version

### 4. Check Audit Trail
- Click "Audit Trail" in navbar
- See all your actions logged

## Next Steps

1. **Read Full Documentation**
   - [README.md](./README.md) - Complete overview
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
   - [TESTING.md](./TESTING.md) - Testing guide
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

2. **Explore Code**
   - Check backend controllers for API logic
   - Check frontend pages for UI
   - Modify to add features

3. **Deploy**
   - Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Get your app on the internet!

## Useful Commands

```bash
# Backend
npm run dev        # Start development server
npm start          # Start production server
npm test           # Run tests

# Frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build

# Both
npm run dev-all    # Run both backend and frontend
```

## Development Tips

1. **Use Postman** - Test APIs before frontend
2. **Check Console** - Frontend errors in browser console
3. **Check Terminal** - Backend errors in terminal
4. **Database** - Use MongoDB Compass to view data
5. **Token** - JWT tokens expire after 7 days

## Need Help?

1. Check error messages carefully
2. Look in README.md FAQ section
3. Review TESTING.md for troubleshooting
4. Check browser console for JavaScript errors
5. Check terminal for server errors

## Deployment Preview

Once you're ready:

```bash
# Build frontend
cd frontend
npm run build

# Set up backend env for production
# Update .env with production values

# Deploy to Vercel/Netlify (frontend)
# Deploy to Render/Railway (backend)
# Setup MongoDB Atlas (database)
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for details.

---

**Happy Building! 🚀**
