# Newt Tracker Deployment Guide

## Overview
This is a full-stack application with:
- **Frontend**: Next.js (deployed on Vercel)
- **Backend**: Express.js (deployed on Render or similar)

## Deployment Steps

### 1. Backend Deployment (Render)

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `newt-tracker-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` or `node server.js`
   - **Environment**: Node
6. Add Environment Variables:
   ```
   PORT=5000
   DATABASE_URL=your_postgres_url
   JWT_SECRET=your_secret_key
   NODE_ENV=production
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
7. Click "Create Web Service"
8. **Copy your backend URL** (e.g., `https://newt-tracker-backend.onrender.com`)

### 2. Frontend Deployment (Vercel)

#### Option A: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. **IMPORTANT**: Set **Root Directory** to `frontend`
5. Framework Preset: Next.js (should auto-detect)
6. Build Settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
7. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```
   Replace `your-backend-url` with the actual Render backend URL
8. Click "Deploy"

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Post-Deployment Configuration

After both are deployed:

1. **Update Frontend Environment Variable**:
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL` to your actual backend URL

2. **Update Backend CORS**:
   - Add your Vercel frontend URL to allowed origins in `backend/config/cors.js`

3. **Test the deployment**:
   - Visit your Vercel frontend URL
   - Try logging in
   - Check browser console for any CORS or API errors

## Important Files

### Frontend (`frontend/`)
- `.env.local` - Local development (not committed)
- `.env.production` - Production environment (not committed, set in Vercel)
- `vercel.json` - Vercel deployment configuration
- `next.config.js` - Next.js configuration

### Backend (`backend/`)
- `.env` - Environment variables (not committed, set in Render)
- `server.js` - Main server file
- `config/cors.js` - CORS configuration

## Troubleshooting

### Issue: 500 Internal Server Error
- **Cause**: Environment variables not set correctly
- **Solution**: Verify all environment variables in Vercel dashboard

### Issue: CORS errors
- **Cause**: Backend not allowing frontend origin
- **Solution**: Update CORS configuration in backend to include Vercel URL

### Issue: API calls failing
- **Cause**: Wrong API URL in frontend
- **Solution**: Check `NEXT_PUBLIC_API_URL` in Vercel environment variables

### Issue: Build fails
- **Cause**: Missing dependencies or wrong Node version
- **Solution**: 
  - Check Node version (should be 18.x or higher)
  - Run `npm install` locally to verify dependencies

## Environment Variables Summary

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### Backend (Render)
```env
PORT=5000
DATABASE_URL=postgres://...
JWT_SECRET=your_secret
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Vercel Project Settings

Make sure in your Vercel project settings:
- **Root Directory**: `frontend` (CRITICAL!)
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x or later

## Quick Commands

```bash
# Install dependencies (both)
cd frontend && npm install
cd ../backend && npm install

# Run locally
cd frontend && npm run dev    # Port 3001
cd backend && npm start        # Port 5000

# Build frontend
cd frontend && npm run build

# Deploy frontend to Vercel
cd frontend && vercel --prod
```
