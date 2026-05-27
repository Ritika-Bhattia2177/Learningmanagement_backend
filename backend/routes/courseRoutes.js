const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourse);
router.get('/search/query', courseController.searchCourses);

// Instructor routes
router.post('/', authMiddleware, roleMiddleware('instructor', 'admin'), courseController.createCourse);
router.put('/:id', authMiddleware, roleMiddleware('instructor', 'admin'), courseController.updateCourse);
router.delete('/:id', authMiddleware, roleMiddleware('instructor', 'admin'), courseController.deleteCourse);
router.get('/instructor/courses', authMiddleware, roleMiddleware('instructor', 'admin'), courseController.getInstructorCourses);

module.exports = router;
