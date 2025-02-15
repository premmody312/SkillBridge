const mongoose = require('mongoose');

const ChatbotSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userMessage: { type: String, required: true },
    botResponse: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chatbot', ChatbotSchema);
