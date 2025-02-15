const SkillGap = require('../models/SkillGap');

exports.getSkillGap = async (req, res) => {
    try {
        const userId = req.query.userId || req.body.userId;

        console.log("🔍 Searching skill gap for userId:", userId);

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const skillGap = await SkillGap.findOne({ userId });

        if (!skillGap) {
            console.log("❌ No skill gap data found for userId:", userId);
            return res.status(404).json({ message: "Skill gap analysis not found" });
        }

        res.json(skillGap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
