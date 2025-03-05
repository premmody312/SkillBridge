const express = require('express');
const { getCourses, getCoursesByTag, addCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const router = express.Router();

router.get('/', getCourses);
router.get('/tag/:tag', getCoursesByTag);
router.post('/add', addCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;
