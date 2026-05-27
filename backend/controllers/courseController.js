const Course = require('../models/Course');
const User = require('../models/User');

// Create Course
exports.createCourse = async (req, res, next) => {
  try {
    const { title, description, category, duration, price, level, topics } = req.body;

    // Validation
    if (!title || !description || !category || !duration || !price || !topics) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if instructor exists
    const instructor = await User.findById(req.user.id);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    const course = await Course.create({
      title,
      description,
      category,
      duration,
      price,
      level,
      topics: Array.isArray(topics) ? topics : [topics],
      instructor: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// Get All Courses
exports.getAllCourses = async (req, res, next) => {
  try {
    const { category, level, page = 1, limit = 10, sortBy = '-createdAt' } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }
    if (level) {
      query.level = level;
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalCourses = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      totalCourses,
      currentPage: page,
      totalPages: Math.ceil(totalCourses / limit),
      courses
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Course
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email bio');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    next(error);
  }
};

// Update Course
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the instructor
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    // Update fields
    const { title, description, category, duration, price, level, topics, thumbnail } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (duration) course.duration = duration;
    if (price !== undefined) course.price = price;
    if (level) course.level = level;
    if (topics) course.topics = Array.isArray(topics) ? topics : [topics];
    if (thumbnail) course.thumbnail = thumbnail;
    course.updatedAt = Date.now();

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// Delete Course
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the instructor
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Search Courses
exports.searchCourses = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const courses = await Course.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).populate('instructor', 'name email');

    res.status(200).json({
      success: true,
      totalResults: courses.length,
      courses
    });
  } catch (error) {
    next(error);
  }
};

// Get Instructor Courses
exports.getInstructorCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });

    res.status(200).json({
      success: true,
      totalCourses: courses.length,
      courses
    });
  } catch (error) {
    next(error);
  }
};
