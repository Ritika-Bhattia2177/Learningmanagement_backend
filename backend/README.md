# Learning Management System (LMS) API

## 📋 Project Overview

A comprehensive Learning Management System API built with Node.js and Express that enables users to manage courses, enroll in courses, and track their learning progress. The system supports multiple user roles (student, instructor, admin) with JWT-based authentication and complete CRUD operations.

---

## 🎯 Objectives

✅ Build scalable APIs using Node.js & Express  
✅ Connect and manage MongoDB database  
✅ Implement complete CRUD operations for Courses, Users, and Enrollments  
✅ Secure APIs with JWT authentication  
✅ Implement role-based access control  
✅ Add comprehensive middleware for security, logging, and error handling  
✅ Handle errors properly with custom error messages  
✅ Enable full testing using Postman  

---

## 🛠️ Tools & Technologies

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB |
| **ODM** | Mongoose |
| **Authentication** | JWT (JSON Web Tokens) |
| **Password Hashing** | bcryptjs |
| **Environment** | dotenv |
| **CORS** | cors |
| **Testing** | Postman |
| **Dev Tools** | Nodemon |

---

## 🏗️ System Architecture

```
┌─────────────────┐
│   CLIENT SIDE   │ (Postman, Frontend)
└────────┬────────┘
         │ HTTP/REST
┌────────▼────────────────────────────┐
│      EXPRESS SERVER (Port 5000)      │
│  ┌────────────────────────────────┐  │
│  │  Routes (API Endpoints)        │  │
│  │  - /api/auth                   │  │
│  │  - /api/courses                │  │
│  │  - /api/enrollments            │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │  Controllers (Business Logic)  │  │
│  │  - authController             │  │
│  │  - courseController           │  │
│  │  - enrollmentController       │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │  Middleware                    │  │
│  │  - Authentication & Auth       │  │
│  │  - Error Handling              │  │
│  │  - Logging                     │  │
│  │  - CORS                        │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │  Models (Database Schema)      │  │
│  │  - User Schema                 │  │
│  │  - Course Schema               │  │
│  │  - Enrollment Schema           │  │
│  └────────────────────────────────┘  │
└──────────┬────────────────────────────┘
           │ MongoDB driver
┌──────────▼─────────────┐
│   MONGODB DATABASE      │
│  ┌───────────────────┐  │
│  │  Users Coll.      │  │
│  │  Courses Coll.    │  │
│  │  Enrollments Coll.│  │
│  └───────────────────┘  │
└─────────────────────────┘
```

---

## 📁 Project Folder Structure

```
backend/
├── models/
│   ├── User.js              # User schema with password hashing
│   ├── Course.js            # Course schema with validation
│   └── Enrollment.js        # Enrollment schema with constraints
├── controllers/
│   ├── authController.js    # Auth logic: register, login, profile
│   ├── courseController.js  # Course CRUD operations
│   └── enrollmentController.js # Enrollment management
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── courseRoutes.js      # Course endpoints
│   └── enrollmentRoutes.js  # Enrollment endpoints
├── middleware/
│   ├── auth.js              # JWT verification & role-based access
│   ├── errorHandler.js      # Error handling middleware
│   └── logger.js            # Request/Response logging
├── config/
│   └── database.js          # MongoDB connection setup
├── server.js               # Main server file
├── .env                    # Environment variables
├── package.json            # Dependencies
└── README.md              # Documentation
```

---

## 💾 Database Schema

### **User Collection**
```javascript
{
  _id: ObjectId,
  name: String (required, min: 2),
  email: String (unique, required),
  password: String (hashed, required, min: 6),
  role: String (enum: ['student', 'instructor', 'admin'], default: 'student'),
  profilePicture: String (default: placeholder),
  bio: String (max: 500),
  createdAt: Date,
  updatedAt: Date
}
```

### **Course Collection**
```javascript
{
  _id: ObjectId,
  title: String (required, min: 3),
  description: String (required, min: 10),
  instructor: ObjectId (ref: User, required),
  category: String (enum: ['Programming', 'Design', 'Business', ...]),
  duration: String (required),
  price: Number (required, min: 0),
  level: String (enum: ['Beginner', 'Intermediate', 'Advanced']),
  studentsEnrolled: Number (default: 0),
  rating: Number (min: 0, max: 5),
  thumbnail: String,
  topics: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### **Enrollment Collection**
```javascript
{
  _id: ObjectId,
  student: ObjectId (ref: User, required),
  course: ObjectId (ref: Course, required),
  enrolledAt: Date,
  status: String (enum: ['active', 'completed', 'dropped']),
  progress: Number (min: 0, max: 100),
  completedAt: Date (null initially),
  score: Number (min: 0, max: 100),
  notes: String (max: 1000),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### **Authentication Endpoints**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/profile` | Get user profile | ✅ |
| PUT | `/api/auth/profile` | Update user profile | ✅ |
| GET | `/api/auth/users` | Get all users (Admin) | ✅ Admin |
| DELETE | `/api/auth/users/:id` | Delete user (Admin) | ✅ Admin |

### **Course Endpoints**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/courses` | Get all courses | ❌ |
| GET | `/api/courses/:id` | Get single course | ❌ |
| GET | `/api/courses/search` | Search courses | ❌ |
| POST | `/api/courses` | Create course (Instructor) | ✅ Instructor |
| PUT | `/api/courses/:id` | Update course (Instructor) | ✅ Instructor |
| DELETE | `/api/courses/:id` | Delete course (Instructor) | ✅ Instructor |
| GET | `/api/courses/instructor/courses` | Get instructor's courses | ✅ Instructor |

### **Enrollment Endpoints**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/enrollments` | Enroll in course | ✅ Student |
| GET | `/api/enrollments/my-enrollments` | Get student enrollments | ✅ Student |
| PUT | `/api/enrollments/:id` | Update enrollment | ✅ Student |
| DELETE | `/api/enrollments/:id` | Drop course | ✅ Student |
| GET | `/api/enrollments/course/:courseId/students` | Get course enrollments (Instructor) | ✅ Instructor |
| GET | `/api/enrollments/:id` | Get enrollment details | ✅ |

---

## Frontend Application

A separate React client is available in the sibling `frontend/` folder.

### Frontend Stack

- React 18
- Vite
- React Router
- Lucide icons
- Custom responsive UI with a dashboard-style layout

### Frontend Features

- Landing page with featured courses
- Login and registration flow
- Public course catalog with search and filters
- Single course detail page
- Protected dashboard for student, instructor, and admin roles
- API token storage and authenticated requests

### Run the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Set the backend URL in `../frontend/.env` if needed:

```env
VITE_API_URL=http://localhost:5000
```

---

## 🔐 Authentication Method: JWT

### **How JWT Works**
1. User registers or logs in with credentials
2. Server validates credentials
3. Server generates JWT token containing user ID and role
4. Client stores token (localStorage/sessionStorage)
5. Client sends token in Authorization header for protected routes
6. Server verifies token and grants access

### **Token Format**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Token Payload**
```javascript
{
  id: "userId",
  role: "student/instructor/admin",
  iat: 1234567890,
  exp: 1234654290
}
```

---

## ⚠️ Error Handling Approach

### **Error Middleware Structure**
- Try-catch blocks in all controllers
- Custom error messages with status codes
- Mongoose validation errors caught and formatted
- Duplicate key errors handled (unique fields)
- Invalid ObjectId errors caught
- Centralized error handler middleware

### **Error Response Format**
```javascript
{
  success: false,
  message: "Error description",
  error: { /* detailed error info in dev mode */ }
}
```

### **Common Error Status Codes**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (not authorized for this action)
- `404` - Not Found (resource doesn't exist)
- `500` - Server Error

---

## 🚀 Deployment Details

### **Deployment Platform: Heroku / Railway / Render**

#### **Steps to Deploy**
1. **Prepare for deployment:**
   ```bash
   # Ensure package.json has start script
   # Create Procfile (for Heroku): web: node server.js
   ```

2. **Environment Variables:**
   - Add `MONGODB_URI` (MongoDB Atlas connection)
   - Add `JWT_SECRET` (secure random string)
   - Add `NODE_ENV=production`

3. **Deploy using Git:**
   ```bash
   git push heroku main
   ```

4. **Verify deployment:**
   - Check logs: `heroku logs --tail`
   - Test endpoints: `https://your-app.herokuapp.com/api/auth/...`

#### **MongoDB Atlas Setup**
- Create account at mongodb.com
- Create cluster
- Add IP whitelist (0.0.0.0/0 for development)
- Generate connection string
- Add to `.env` file

---

## 🧪 Testing APIs with Postman

### **Setup Postman Environment**
1. Create environment with variables:
   - `base_url`: `http://localhost:5000`
   - `token`: (will be set after login)

2. **Collection Structure:**
   - Authentication
   - Courses
   - Enrollments

### **Sample Test Requests**

#### **1. Register User**
```
POST http://localhost:5000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

#### **2. Login**
```
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### **3. Get All Courses**
```
GET http://localhost:5000/api/courses
```

#### **4. Create Course (Instructor)**
```
POST http://localhost:5000/api/courses
Authorization: Bearer <token>

{
  "title": "Web Development Basics",
  "description": "Learn HTML, CSS, and JavaScript fundamentals",
  "category": "Programming",
  "duration": "4 weeks",
  "price": 99,
  "level": "Beginner",
  "topics": ["HTML", "CSS", "JavaScript"]
}
```

#### **5. Enroll in Course**
```
POST http://localhost:5000/api/enrollments
Authorization: Bearer <token>

{
  "courseId": "courseId123"
}
```

#### **6. Update Enrollment Progress**
```
PUT http://localhost:5000/api/enrollments/enrollmentId123
Authorization: Bearer <token>

{
  "progress": 50,
  "status": "active"
}
```

---

## ✅ Installation & Setup

### **Prerequisites**
- Node.js (v14+)
- MongoDB (local or Atlas)
- Postman
- Git

### **Step-by-Step Installation**

1. **Clone/Navigate to project:**
   ```bash
   cd /home/ritika/Desktop/Learningmanagement
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure .env file:**
   - Update `MONGODB_URI` with your MongoDB connection string
   - Change `JWT_SECRET` to a secure value
   - Set `PORT` if needed

4. **Get MongoDB URI:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create cluster
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` and `<username>`

   Example:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/learningmanagement?retryWrites=true&w=majority
   ```

5. **Start server (Development):**
   ```bash
   npm run dev
   ```

   OR (Production):
   ```bash
   npm start
   ```

6. **Verify server running:**
   - Open `http://localhost:5000` in browser
   - Should see welcome message

---

## 🐛 Challenges Faced & Solutions

| Challenge | Solution |
|-----------|----------|
| Duplicate user enrollment | Added unique compound index on (student, course) |
| JWT token expiration | Set expiration time and refresh logic |
| Password security | Used bcryptjs for hashing with salt rounds |
| CORS errors | Added cors middleware with proper configuration |
| MongoDB connection timeouts | Used connection pooling in Mongoose config |
| Role-based access denial | Implemented roleMiddleware for fine-grained control |
| Data validation errors | Used Mongoose schema validations with custom messages |

---

## 📸 Screenshots Documentation

### **Screenshots to Include in Project Submission:**

1. **User Registration in Postman**
   - Show request and successful 201 response

2. **User Login with JWT Token**
   - Show token in response

3. **Database Records in MongoDB**
   - Show Users collection
   - Show Courses collection
   - Show Enrollments collection

4. **Course Creation by Instructor**
   - Show POST request to /api/courses
   - Show course created in database

5. **Student Enrollment**
   - Show POST request to /api/enrollments
   - Show enrollment record created

6. **API Testing**
   - Show multiple endpoints working
   - Show error handling (401, 403, 404)

7. **Deployed API Response**
   - If deployed, show live API responding from deployed URL

---

## 📝 Notes

- Keep `.env` file secure and never commit it to git
- Always hash passwords before storing
- Use environment variables for sensitive data
- Test all endpoints before deployment
- Monitor server logs for errors
- Update MongoDB IP whitelist for production

---

## 👨‍💼 Author
Ritika - Learning Management System API

---

## 📄 License
MIT License
