const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/search/query', courseController.searchCourses);
router.get('/search', courseController.searchCourses);

// Instructor routes
router.post('/', authMiddleware, roleMiddleware('instructor', 'admin'), courseController.createCourse);
router.get('/instructor/courses', authMiddleware, roleMiddleware('instructor', 'admin'), courseController.getInstructorCourses);

// Resource routes
router.get('/:id', courseController.getCourse);
router.put('/:id', authMiddleware, roleMiddleware('instructor', 'admin'), courseController.updateCourse);
router.delete('/:id', authMiddleware, roleMiddleware('instructor', 'admin'), courseController.deleteCourse);

module.exports = router;
