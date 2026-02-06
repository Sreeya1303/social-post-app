# 📋 Quick Start Guide

Welcome to the Social Post Application! This guide will help you get the app running locally in under 10 minutes.

---

## ⚡ Quick Setup

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### Step 2: Setup MongoDB

**Option A: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed steps

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Use connection string: `mongodb://localhost:27017/social-post-app`

### Step 3: Configure Environment Variables

**Backend** (`backend/.env`):
```env
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=any_random_secret_key_12345
PORT=5000
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
✅ Backend running on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
✅ Frontend running on `http://localhost:3000`

---

## 🎯 Test the App

1. **Open** `http://localhost:3000` in your browser
2. **Sign up** with a new account
3. **Create** your first post (text, image, or both!)
4. **Like** and **comment** on posts
5. **Logout** and login to test persistence

---

## 📁 Project Structure

```
social-post-app/
├── backend/          # Node.js + Express API
│   ├── models/      # MongoDB schemas
│   ├── routes/      # API endpoints
│   ├── middleware/  # Auth middleware
│   └── server.js    # Entry point
│
└── frontend/        # React.js application
    ├── components/  # Reusable UI components
    ├── pages/       # Page components
    ├── context/     # State management
    └── services/    # API calls
```

---

## 🚀 Next Steps

- See [README.md](README.md) for detailed documentation
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions
- Check API endpoints in README.md

---

## ❓ Common Issues

**MongoDB connection failed?**
- Check your connection string format
- Ensure MongoDB Atlas IP whitelist includes your IP

**Frontend can't reach backend?**
- Verify backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend/.env

**Port already in use?**
- Change `PORT` in backend/.env
- Update `REACT_APP_API_URL` in frontend/.env accordingly

---

**Happy Coding! 🎉**
