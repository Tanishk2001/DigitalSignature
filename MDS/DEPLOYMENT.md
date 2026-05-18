# 🚀 Deployment Guide

## Backend Deployment

### Option 1: Render.com

1. **Push to GitHub**
   - Commit your code
   - Push to GitHub repository

2. **Create Render Service**
   - Go to render.com
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repo
   - Select backend folder

3. **Environment Variables**
   - Add in Render dashboard:
     ```
     MONGODB_URI=mongodb+srv://...
     JWT_SECRET=your_secure_secret
     NODE_ENV=production
     FRONTEND_URL=https://your-frontend.com
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=your_email@gmail.com
     SMTP_PASS=your_app_password
     ```

4. **Build Command**
   ```
   npm install
   ```

5. **Start Command**
   ```
   npm start
   ```

### Option 2: Railway.app

1. Go to railway.app
2. Create new project
3. Deploy from GitHub
4. Add environment variables
5. Set start command to `npm start`

## Frontend Deployment

### Option 1: Vercel

1. **Connect GitHub**
   - Push frontend folder to GitHub
   - Go to vercel.com
   - Import project

2. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend.com/api
   ```

### Option 2: Netlify

1. **Connect GitHub**
   - Go to netlify.com
   - Create new site from Git
   - Select repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   - Add in Netlify dashboard

## Database Deployment

### MongoDB Atlas

1. **Create Account**
   - Go to mongodb.com/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Select region close to your backend
   - Choose M0 (free tier)

3. **Create Database User**
   - Set username and password
   - Save credentials

4. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password

5. **Update Backend .env**
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/digital-signature
   ```

## Domain Configuration

1. **Custom Domain**
   - Frontend: Add domain in Vercel/Netlify settings
   - Backend: Add domain in Render/Railway settings

2. **DNS Configuration**
   - Point domain to your hosting provider's nameservers

## SSL/HTTPS

- Vercel: Automatic HTTPS
- Netlify: Automatic HTTPS
- Render: Free SSL certificate
- Railway: Free SSL certificate

## Environment Variables Checklist

### Backend Production
- [ ] MONGODB_URI (with real database)
- [ ] JWT_SECRET (strong random string)
- [ ] NODE_ENV=production
- [ ] FRONTEND_URL (your frontend domain)
- [ ] SMTP_HOST
- [ ] SMTP_PORT
- [ ] SMTP_USER
- [ ] SMTP_PASS
- [ ] MAIL_FROM

### Frontend Production
- [ ] VITE_API_URL (your backend domain)

## Health Checks

After deployment, verify:

1. **Backend Health**
   ```
   GET https://your-backend.com/api/health
   ```
   Should return: `{"message":"✅ Digital Signature API is running"}`

2. **Frontend**
   - Open https://your-frontend.com
   - Should load without CORS errors

3. **Database**
   - Try registering a new user
   - Should create document in MongoDB

## Monitoring

- Set up uptime monitoring (Uptime Robot, StatusPage.io)
- Configure error tracking (Sentry, DataDog)
- Monitor logs in your hosting platform

## Troubleshooting

### CORS Errors
- Check FRONTEND_URL in backend .env
- Ensure frontend is using correct API_URL

### MongoDB Connection Failed
- Verify connection string
- Check IP whitelist in MongoDB Atlas
- Ensure username/password are correct

### PDF Upload Not Working
- Check file size limits
- Verify uploads folder has write permissions
- Ensure MIME type validation is correct

## Production Checklist

- [ ] Change JWT_SECRET to random secure string
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure real SMTP email service
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set up monitoring
- [ ] Test all functionality
- [ ] Set up automated tests
- [ ] Document API
