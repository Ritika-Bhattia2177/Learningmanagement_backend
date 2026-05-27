const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// Enroll in Course
exports.enrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a course ID'
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    let enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (enrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Create enrollment
    enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
      status: 'active'
    });

    // Update course student count
    course.studentsEnrolled += 1;
    await course.save();

    // Populate references
    await enrollment.populate(['student', 'course']);

    res.status(201).json({
      success: true,
      message: 'Enrolled successfully',
      enrollment
    });
  } catch (error) {
    next(error);
  }
};

// Get Student Enrollments
exports.getStudentEnrollments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = { student: req.user.id };
    if (status) {
      query.status = status;
    }

    const enrollments = await Enrollment.find(query)
      .populate('course')
      .populate('student', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalEnrollments = await Enrollment.countDocuments(query);

    res.status(200).json({
      success: true,
      totalEnrollments,
      currentPage: page,
      totalPages: Math.ceil(totalEnrollments / limit),
      enrollments
    });
  } catch (error) {
    next(error);
  }
};

// Get Course Enrollments (Instructor only)
exports.getCourseEnrollments = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Check if course exists and user is instructor
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view enrollments for this course'
      });
    }

    let query = { course: courseId };
    if (status) {
      query.status = status;
    }

    const enrollments = await Enrollment.find(query)
      .populate('student', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalEnrollments = await Enrollment.countDocuments(query);

    res.status(200).json({
      success: true,
      totalEnrollments,
      currentPage: page,
      totalPages: Math.ceil(totalEnrollments / limit),
      enrollments
    });
  } catch (error) {
    next(error);
  }
};

// Update Enrollment
exports.updateEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, progress, score } = req.body;

    let enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check authorization
    if (enrollment.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this enrollment'
      });
    }

    // Update fields
    if (status) enrollment.status = status;
    if (progress !== undefined) enrollment.progress = progress;
    if (score !== undefined) enrollment.score = score;

    if (status === 'completed') {
      enrollment.completedAt = Date.now();
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      enrollment
    });
  } catch (error) {
    next(error);
  }
};

// Drop Course
exports.dropCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check authorization
    if (enrollment.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to drop this course'
      });
    }

    // Update course student count
    const course = await Course.findById(enrollment.course);
    if (course && course.studentsEnrolled > 0) {
      course.studentsEnrolled -= 1;
      await course.save();
    }

    await Enrollment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Course dropped successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get Enrollment Details
exports.getEnrollmentDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findById(id)
      .populate('student', 'name email')
      .populate('course');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      enrollment
    });
  } catch (error) {
    next(error);
  }
};
