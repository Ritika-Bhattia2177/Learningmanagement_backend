require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const seed = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Enrollment.deleteMany({});
    await Course.deleteMany({});
    await User.deleteMany({});

    console.log('Creating users...');
    const instructor = await User.create({
      name: 'Alice Instructor',
      email: 'alice.instructor@example.com',
      password: 'password123',
      role: 'instructor',
      bio: 'Experienced instructor in programming.'
    });

    const student1 = await User.create({
      name: 'Bob Student',
      email: 'bob.student@example.com',
      password: 'password123',
      role: 'student'
    });

    const student2 = await User.create({
      name: 'Carol Student',
      email: 'carol.student@example.com',
      password: 'password123',
      role: 'student'
    });

    console.log('Creating courses...');
    const course1 = await Course.create({
      title: 'Intro to JavaScript',
      description: 'Learn the fundamentals of JavaScript programming.',
      instructor: instructor._id,
      category: 'Programming',
      duration: '6 weeks',
      price: 49.99,
      level: 'Beginner',
      topics: ['Variables', 'Functions', 'DOM']
    });

    const course2 = await Course.create({
      title: 'Advanced Node.js',
      description: 'Deep dive into Node.js and backend development.',
      instructor: instructor._id,
      category: 'Programming',
      duration: '8 weeks',
      price: 99.99,
      level: 'Advanced',
      topics: ['Streams', 'Clusters', 'Performance']
    });

    console.log('Creating enrollments...');
    await Enrollment.create({
      student: student1._id,
      course: course1._id,
      status: 'active',
      progress: 10
    });

    await Enrollment.create({
      student: student2._id,
      course: course1._id,
      status: 'active',
      progress: 0
    });

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
