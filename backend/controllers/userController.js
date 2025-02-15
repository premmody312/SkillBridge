const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Create new user
        const user = await User.create({ name, email, password });

        res.status(201).json({
            message: "User registered successfully",
            userId: user._id
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found for email:", email);
            return res.status(401).json({ message: 'User not found' });
        }

        console.log("User found:", user.email);
        console.log("Stored Password Hash:", user.password);
        console.log("Entered Password:", password);

        // Compare entered password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password Match Result:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({ message: "Login successful", userId: user._id });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: error.message });
    }
};
