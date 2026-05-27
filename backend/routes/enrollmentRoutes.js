const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Protected routes - Student
router.post('/', authMiddleware, enrollmentController.enrollCourse);
router.get('/my-enrollments', authMiddleware, roleMiddleware('student'), enrollmentController.getStudentEnrollments);
router.put('/:id', authMiddleware, enrollmentController.updateEnrollment);
router.delete('/:id', authMiddleware, enrollmentController.dropCourse);

// Protected routes - Instructor/Admin
router.get('/course/:courseId/students', authMiddleware, roleMiddleware('instructor', 'admin'), enrollmentController.getCourseEnrollments);
router.get('/:id', authMiddleware, enrollmentController.getEnrollmentDetails);

module.exports = router;
