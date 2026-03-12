# Newt Tracker - Quick Fix for Current Deployment Issue

## Problem
Your Vercel deployment is currently configured incorrectly. It's trying to deploy the **backend** instead of the **frontend**, which is causing the 500 Internal Server Error.

## Immediate Fix

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Find your "Newt_Tracker" or "newt-tracker" project
3. Click on it

### Step 2: Update Project Settings
1. Click on "Settings" tab
2. Go to "General" section
3. **IMPORTANT**: Set **Root Directory** to `frontend`
4. Click "Save"

### Step 3: Redeploy
1. Go to "Deployments" tab
2. Click the three dots (...) on the latest deployment
3. Click "Redeploy"
4. Wait for the build to complete

### Step 4: Add Environment Variable
1. Go to "Settings" → "Environment Variables"
2. Add a new variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your backend URL (e.g., `https://newt-tracker-backend.onrender.com`)
   - **Environments**: Select "Production", "Preview", and "Development"
3. Click "Save"

### Step 5: Redeploy Again
1. Go back to "Deployments"
2. Redeploy one more time with the three dots menu
3. This time it should work correctly!

## Verification
After redeployment, visit your Vercel URL. You should see your Next.js application instead of a 500 error.

If you still see errors, check the build logs in the Vercel dashboard for specific error messages.

## Backend Deployment (If Not Done)
If you haven't deployed your backend yet:

1. Go to https://render.com (or your preferred platform)
2. Create a new "Web Service"
3. Connect your GitHub repo
4. Set **Root Directory** to `backend`
5. Set **Build Command** to `npm install`
6. Set **Start Command** to `node server.js`
7. Add all the environment variables from `backend/.env`
8. Deploy!
9. Copy the backend URL and update Vercel's `NEXT_PUBLIC_API_URL`

## Summary
- **Frontend (Vercel)**: Deploy from `frontend/` directory
- **Backend (Render/other)**: Deploy from `backend/` directory  
- **Never deploy both together** - they are separate services!
