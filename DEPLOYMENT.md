# 🚀 Deployment Guide

This guide will walk you through deploying your Social Post Application to production.

---

## Prerequisites

- ✅ GitHub account
- ✅ MongoDB Atlas account
- ✅ Render account (backend)
- ✅ Vercel account (frontend)

---

## Step 1: Setup MongoDB Atlas

### 1.1 Create Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Sign Up"** or **"Sign In"**
3. Click **"Build a Database"**
4. Select **"FREE"** (M0) tier
5. Choose your preferred cloud provider and region
6. Click **"Create Cluster"**

### 1.2 Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username (e.g., `socialapp`)
5. Click **"Autogenerate Secure Password"** and save it
6. Under **"Database User Privileges"**, select **"Read and write to any database"**
7. Click **"Add User"**

### 1.3 Whitelist IP Address

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0` to the IP whitelist
4. Click **"Confirm"**

> ⚠️ **Note**: For production, you should whitelist only Render's IP addresses

### 1.4 Get Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://socialapp:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual database user password
6. Replace `?retryWrites` with `/social-post-app?retryWrites` to specify the database name

**Final connection string example:**
```
mongodb+srv://socialapp:MySecurePassword123@cluster0.xxxxx.mongodb.net/social-post-app?retryWrites=true&w=majority
```

---

## Step 2: Push to GitHub

### 2.1 Initialize Git Repository

```bash
cd social-post-app
git init
git add .
git commit -m "Initial commit: Social Post Application"
```

### 2.2 Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click **"New repository"**
3. Name it `social-post-app`
4. **DO NOT** initialize with README (you already have one)
5. Click **"Create repository"**

### 2.3 Push Code

```bash
git remote add origin https://github.com/YOUR_USERNAME/social-post-app.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Render

### 3.1 Create Web Service

1. Go to [Render](https://render.com)
2. Click **"Sign In"** (use GitHub)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Select `social-post-app` repository

### 3.2 Configure Web Service

- **Name**: `social-post-backend`
- **Region**: Choose closest to you
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### 3.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A random secure string (e.g., `3W_internship_jwt_secret_key_12345`) |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Leave blank for now (will add after frontend deployment) |
| `PORT` | `5000` |

### 3.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, copy the URL (e.g., `https://social-post-backend.onrender.com`)

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### 4.2 Deploy via Vercel Dashboard

1. Go to [Vercel](https://vercel.com)
2. Click **"Sign Up"** (use GitHub)
3. Click **"Add New..."** → **"Project"**
4. Import `social-post-app` repository
5. Configure:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 4.3 Add Environment Variables

Click **"Environment Variables"** → Add:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | Your Render backend URL + `/api` (e.g., `https://social-post-backend.onrender.com/api`) |

### 4.4 Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Once deployed, copy the URL (e.g., `https://social-post-app.vercel.app`)

---

## Step 5: Update Backend CORS

### 5.1 Add Frontend URL to Render

1. Go back to Render dashboard
2. Select your `social-post-backend` service
3. Go to **"Environment"** tab
4. Add/Update the `FRONTEND_URL` variable with your Vercel URL
5. Click **"Save Changes"**
6. Service will automatically redeploy

---

## Step 6: Test Production App

### 6.1 Open Frontend

Visit your Vercel URL in a browser

### 6.2 Test Complete Flow

1. **Signup**: Create a new account
2. **Login**: Sign in with credentials
3. **Create Post**: Add text and/or image
4. **Like**: Like posts
5. **Comment**: Add comments
6. **Logout**: Sign out and back in

### 6.3 Check Database

1. Go to MongoDB Atlas
2. Click **"Browse Collections"**
3. Verify `users` and `posts` collections have data

---

## 🎉 Done!

Your application is now live!

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Database**: MongoDB Atlas

---

## 📝 Submission Checklist

- [ ] GitHub repository is public
- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Render
- [ ] MongoDB Atlas configured
- [ ] README updated with live URLs
- [ ] All features working in production
- [ ] Fill out submission form with:
  - GitHub repository link
  - Live demo link (Vercel)
  - Backend API link (Render)

---

## 🔧 Troubleshooting

### Backend not connecting to MongoDB
- Check connection string format
- Verify password doesn't contain special characters (URL encode if needed)
- Ensure IP whitelist includes `0.0.0.0/0`

### Frontend can't reach backend
- Check `REACT_APP_API_URL` in Vercel environment variables
- Verify CORS is configured (FRONTEND_URL in Render)
- Check Render logs for errors

### Images not loading
- Render's free tier doesn't persist files
- Consider using Cloudinary or AWS S3 for production image storage

### Render service sleeping
- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Consider upgrading for production use

---

**Need help?** Check the Render and Vercel documentation or reach out!
