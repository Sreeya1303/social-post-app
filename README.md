# 🌐 Social Post App 📱

**Live Demo:** [https://social-post-app-zeta.vercel.app/](https://social-post-app-zeta.vercel.app/)  
**API Endpoint:** [https://social-post-app-75qi.onrender.com](https://social-post-app-75qi.onrender.com)

A full-stack social media application featuring posts, likes, comments, user search, and real-time chat.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![Node](https://img.shields.io/badge/Node-18.x-339933.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)

---

## ✨ Features

### Authentication
- ✅ User signup with email and password
- ✅ Secure login with JWT token authentication
- ✅ Password hashing with bcryptjs
- ✅ Persistent sessions with localStorage

### Social Features
- ✅ Create posts with text, image, or both
- ✅ Public feed displaying all users' posts
- ✅ Like/unlike posts with user tracking
- ✅ Add comments to posts
- ✅ Real-time like and comment counts
- ✅ Responsive and mobile-friendly UI

### Technical Highlights
- ✅ Clean, modern Material-UI design
- ✅ Protected routes and authentication flow
- ✅ Image upload with preview
- ✅ RESTful API architecture
- ✅ Error handling and validation
- ✅ Code comments and best practices

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js 18.x
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: Context API

### Backend
- **Runtime**: Node.js 18.x
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Security**: bcryptjs for password hashing

---

## 📁 Project Structure

```
social-post-app/
├── backend/
│   ├── models/              # MongoDB schemas
│   │   ├── User.js         # User model with password hashing
│   │   └── Post.js         # Post model with likes & comments
│   ├── routes/              # API endpoints
│   │   ├── auth.js         # Signup & login routes
│   │   └── posts.js        # Post CRUD & interactions
│   ├── middleware/          # Custom middleware
│   │   └── auth.js         # JWT authentication middleware
│   ├── uploads/             # Uploaded images storage
│   ├── server.js            # Express server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/      # Reusable components
│       │   ├── Navbar.jsx
│       │   ├── CreatePost.jsx
│       │   └── PostCard.jsx
│       ├── pages/           # Page components
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   └── Feed.jsx
│       ├── context/         # Context providers
│       │   └── AuthContext.js
│       ├── services/        # API calls
│       │   └── api.js
│       ├── utils/           # Helper functions
│       │   └── helpers.js
│       ├── App.js           # Main app with routing
│       └── index.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd social-post-app
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social-post-app?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

> **Note**: Replace `MONGODB_URI` with your MongoDB Atlas connection string

Start the backend server:

```bash
npm start
# or for development with auto-restart:
npm run dev
```

Server will run on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

Frontend will run on `http://localhost:3000`

---

## 📡 API Endpoints

### Authentication

#### POST `/api/auth/signup`
Register a new user

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/auth/login`
Authenticate user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Posts

#### GET `/api/posts`
Get all posts (public)

#### POST `/api/posts`
Create a new post (protected)

**Form Data:**
- `content` (optional): Post text
- `image` (optional): Image file

#### POST `/api/posts/:id/like`
Toggle like on a post (protected)

#### POST `/api/posts/:id/comment`
Add a comment to a post (protected)

**Request Body:**
```json
{
  "text": "Great post!"
}
```

---

## 🌍 Deployment

### MongoDB Atlas
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your IP or allow access from anywhere (`0.0.0.0/0`)
4. Get your connection string and update `MONGODB_URI` in `.env`

### Backend (Render)
1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your GitHub repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL` (your Vercel URL)

### Frontend (Vercel)
1. Install Vercel CLI: `npm i -g vercel`
2. From `frontend/` directory: `vercel`
3. Follow the prompts
4. Add environment variable in Vercel dashboard:
   - `REACT_APP_API_URL` (your Render backend URL + `/api`)

---

## 🎨 UI/UX Design

This application is inspired by TaskPlanet's social feed with:
- Clean, modern Material-UI components
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Intuitive user interactions
- Professional color scheme

---

## 🧪 Testing Locally

### Complete User Flow

1. **Signup**: Create a new account at `/signup`
2. **Login**: Sign in with your credentials
3. **Create Post**: Share text and/or an image
4. **Interact**: Like and comment on posts
5. **Logout**: Sign out and login again to verify persistence

### Test Data
- Create multiple user accounts
- Post various content types (text, image, both)
- Test like toggle (like/unlike)
- Add multiple comments
- Check responsive design on different screen sizes

---

## 📝 Code Quality

### Best Practices Implemented
- ✅ Comprehensive code comments
- ✅ Consistent naming conventions
- ✅ Reusable component architecture
- ✅ Proper error handling
- ✅ Input validation (client & server)
- ✅ Security best practices
- ✅ Clean separation of concerns

### Security Features
- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Input sanitization
- File upload restrictions (type, size)

---

## 🤝 Contributing

This is an internship assignment project. For questions or improvements:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is created for the **3W Full Stack Internship Assignment**.

---

## 👤 Author

**[Your Name]**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Inspired by [TaskPlanet App](https://play.google.com/store/apps/details?id=com.taskplanet)
- Built as part of 3W Full Stack Internship Round 1 Assignment
- Material-UI for the beautiful component library

---

## 📸 Screenshots

> Add screenshots of your application here after deployment

---

## 🔗 Live Demo

- **Frontend**: [Your Vercel URL]
- **Backend**: [Your Render URL]
- **GitHub**: [Your Repository URL]

---

**Happy Coding! 🚀**
