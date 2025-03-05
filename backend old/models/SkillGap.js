const mongoose = require('mongoose');

const SkillGapSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    currentSkills: [String],
    missingSkills: [String],
    suggestedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SkillGap', SkillGapSchema);
