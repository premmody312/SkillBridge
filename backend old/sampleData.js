const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Resume = require('./models/Resume');
const SkillGap = require('./models/SkillGap');
const Chatbot = require('./models/Chatbot');
const Course = require('./models/Course');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ MongoDB Connection Error:', err));

const seedData = async () => {
    try {
        console.log("🚀 Seeding data...");

        // Clear existing data
        await User.deleteMany();
        await Resume.deleteMany();
        await SkillGap.deleteMany();
        await Chatbot.deleteMany();
        await Course.deleteMany();

        // Generate password hash
        const passwordHash = await bcrypt.hash("password123", 10);

        // Insert Users
        const users = await User.insertMany([
            { name: "John Doe", email: "john@example.com", password: passwordHash },
            { name: "Jane Smith", email: "jane@example.com", password: passwordHash }
        ]);

        console.log("👤 Users inserted:", users.map(u => u.email));

        // Insert Resumes
        const resumes = await Resume.insertMany([
            { userId: users[0]._id, resumeText: "Software Engineer with 3 years experience", parsedData: { skills: ["JavaScript", "React", "Node.js"] } },
            { userId: users[1]._id, resumeText: "Data Scientist skilled in Python and AI", parsedData: { skills: ["Python", "TensorFlow", "Data Analysis"] } }
        ]);

        console.log("📜 Resumes inserted.");

        // Insert Skill Gap Analysis
        const skillGaps = await SkillGap.insertMany([
            { userId: users[0]._id, currentSkills: ["JavaScript", "React"], missingSkills: ["TypeScript", "GraphQL"], suggestedCourses: [] },
            { userId: users[1]._id, currentSkills: ["Python", "TensorFlow"], missingSkills: ["AWS", "Big Data"], suggestedCourses: [] }
        ]);

        console.log("🎯 Skill gap data inserted.");

        // Insert Chatbot Conversations
        const chatbotConversations = await Chatbot.insertMany([
            { userId: users[0]._id, userMessage: "What skills should I learn?", botResponse: "You should learn TypeScript and GraphQL" },
            { userId: users[1]._id, userMessage: "What jobs are available?", botResponse: "Data Scientist roles are trending" }
        ]);

        console.log("🤖 Chatbot conversations inserted.");

        // Insert Courses
        const courses = await Course.insertMany([
            { title: "Mastering React", description: "Learn React from scratch", provider: "Udemy", link: "https://udemy.com/react", tags: ["React", "Frontend"] },
            { title: "Full-Stack JavaScript", description: "Learn MERN stack", provider: "Coursera", link: "https://coursera.com/mern", tags: ["MERN", "Full-Stack"] },
            { title: "AI for Beginners", description: "Introduction to AI", provider: "edX", link: "https://edx.com/ai", tags: ["AI", "Python"] }
        ]);

        console.log("📚 Courses inserted.");

        console.log("✅ Sample data inserted successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error inserting sample data:", error);
        mongoose.connection.close();
    }
};

seedData();
