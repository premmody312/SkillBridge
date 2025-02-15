const Course = require('../models/Course');

// Fetch all courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch courses by skill/tag
exports.getCoursesByTag = async (req, res) => {
    try {
        const { tag } = req.params;
        const courses = await Course.find({ tags: tag });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new course
exports.addCourse = async (req, res) => {
    try {
        const { title, description, provider, link, tags } = req.body;
        const course = await Course.create({ title, description, provider, link, tags });
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update course details
exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        await Course.findByIdAndDelete(id);
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
