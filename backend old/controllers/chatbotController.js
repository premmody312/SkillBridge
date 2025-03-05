const Chatbot = require('../models/Chatbot');

exports.saveChatbotMessage = async (req, res) => {
    try {
        const { userId, userMessage, botResponse } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const chat = new Chatbot({ userId, userMessage, botResponse });
        await chat.save();

        res.status(201).json({ message: "Chat saved successfully", chat });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getChatbotMessages = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const messages = await Chatbot.find({ userId });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};