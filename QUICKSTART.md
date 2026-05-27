# 🚀 Quick Start Guide - Learning Management System API

## 5 Minutes Setup

### Step 1: Install Dependencies
```bash
cd /home/ritika/Desktop/BIG\ BANG/Learningmanagement
npm install
```

### Step 2: Setup MongoDB

**Option A: MongoDB Atlas (Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free account)
3. Create a new project
4. Create a cluster (free tier)
5. Click "Database" > "Connect"
6. Choose "Connect Your Application"
7. Copy connection string
8. Replace `<username>` and `<password>` with your credentials

**Option B: Local MongoDB**
- If MongoDB is installed locally:
```
mongodb://localhost:27017/learningmanagement
```

### Step 3: Configure Environment Variables

Edit `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learningmanagement?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_12345
PORT=5000
NODE_ENV=development
JWT_EXPIRE=24
```

### Step 4: Start Server
```bash
npm run dev
```

You should see:
```
╔═══════════════════════════════════════╗
║  Learning Management System API       ║
║  Server running on port 5000          ║
║  Environment: development             ║
╚═══════════════════════════════════════╝
```

### Step 5: Test API

**Option 1: Using Postman (Easy)**
1. Open Postman
2. Import file: `LMS-API-Collection.postman_collection.json`
3. Click collection requests and test

**Option 2: Using cURL**
```bash
# Check if server is running
curl http://localhost:5000

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```

---

## 🧪 Testing Workflow

### 1. Register as Student
```json
POST /api/auth/register
{
  "name": "Alice Student",
  "email": "alice@example.com",
  "password": "password123",
  "role": "student"
}
```
✅ Save the token from response

### 2. Register as Instructor
```json
POST /api/auth/register
{
  "name": "Bob Instructor",
  "email": "bob@example.com",
  "password": "password123",
  "role": "instructor"
}
```
✅ Save this token too

### 3. Create Course (As Instructor)
```json
POST /api/courses
- Authorization: Bearer <instructor_token>

{
  "title": "Python Basics",
  "description": "Learn Python programming from scratch with hands-on examples",
  "category": "Programming",
  "duration": "6 weeks",
  "price": 49,
  "level": "Beginner",
  "topics": ["Variables", "Functions", "Object-oriented"]
}
```
✅ Copy the courseId

### 4. View All Courses
```json
GET /api/courses
```
✅ See your created course

### 5. Enroll in Course (As Student)
```json
POST /api/enrollments
- Authorization: Bearer <student_token>

{
  "courseId": "<courseId from step 3>"
}
```
✅ Enrollment created!

### 6. Check Enrollment Progress
```json
GET /api/enrollments/my-enrollments
- Authorization: Bearer <student_token>
```
✅ See your enrollment

### 7. Update Progress
```json
PUT /api/enrollments/<enrollmentId>
- Authorization: Bearer <student_token>

{
  "progress": 50,
  "status": "active",
  "notes": "Going well so far"
}
```

---

## 📊 MongoDB Data Verification

### View Data in MongoDB Atlas
1. Connect to cluster
2. Go to Collections
3. Select database: `learningmanagement`
4. View collections:
   - `users` - registered users
   - `courses` - created courses
   - `enrollments` - student enrollments

### Query Examples:
```javascript
// Find all students
db.users.find({ role: "student" })

// Find all programming courses
db.courses.find({ category: "Programming" })

// Find active enrollments
db.enrollments.find({ status: "active" })
```

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module 'express'"
**Solution:**
```bash
npm install
```

### Issue: "MONGODB_URI is undefined"
**Solution:** Check `.env` file exists and has correct MongoDB URI

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Change PORT in .env to 5001 or kill process:
lsof -ti:5000 | xargs kill -9
```

### Issue: "Invalid token"
**Solution:** Make sure token is copied correctly with "Bearer " prefix

### Issue: "Access Denied" error
**Solution:** Check user role - instructor routes need `role: "instructor"`

---

## 📝 Endpoints Summary

| Feature | Endpoint | Type |
|---------|----------|------|
| **Registration** | POST /api/auth/register | Public |
| **Login** | POST /api/auth/login | Public |
| **Get Courses** | GET /api/courses | Public |
| **Create Course** | POST /api/courses | Instructor |
| **Enroll** | POST /api/enrollments | Student |
| **My Progress** | GET /api/enrollments/my-enrollments | Student |
| **Search** | GET /api/courses/search?query=python | Public |

---

## Frontend Setup

```bash
cd /home/ritika/Desktop/BIG\ BANG/Learningmanagement/frontend
npm install
npm run dev
```

If your backend is not running on port 5000, create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:5000
```

---

## 🎯 For Assignment Submission

Make sure to include:
1. ✅ All code files (models, controllers, routes, middleware)
2. ✅ .env file example (with dummy values)
3. ✅ README.md with documentation
4. ✅ Postman collection for testing
5. ✅ Screenshots of:
   - Server running
   - Postman tests
   - Database records
   - API responses
6. ✅ Challenges faced and solutions

---

## 🆘 Need Help?

Check logs in terminal for error messages. Most issues are related to:
- MongoDB connection (verify URI in .env)
- Node dependencies (run npm install)
- Server port conflicts (change PORT in .env)
- Token authentication (include "Bearer " prefix)

---

Happy coding! 🎉
