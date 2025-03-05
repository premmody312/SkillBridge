const Resume = require('../models/Resume');

exports.uploadResume = async (req, res) => {
    try {
        const { userId, resumeText } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const newResume = new Resume({ userId, resumeText, parsedData: {} });
        await newResume.save();

        res.status(201).json({ message: "Resume uploaded successfully", resume: newResume });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserResumes = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const resumes = await Resume.find({ userId });

        if (!resumes.length) {
            return res.status(404).json({ message: "No resumes found for this user" });
        }

        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};