const callAI = require('../services/aiService');
const Event = require('../models/Event');

/**
 * Handles AI chat & recommendation queries
 */
const askAI = async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;

        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'A valid message is required'
            });
        }

        // Fetch current active events from MongoDB
        const events = await Event.find()
            .select(
                'title description date location category totalSeats availableSeats ticketPrice'
            )
            .lean();

        // Send user message + event data to AI service
        const response = await callAI(message.trim(), events, conversationHistory);

        return res.status(200).json({
            success: true,
            response
        });
    } catch (error) {
        console.error('AI Controller Error:', error.message || error);

        return res.status(500).json({
            success: false,
            message: 'Unable to process your AI request at the moment. Please try again later.'
        });
    }
};

module.exports = {
    askAI,
    testAI: askAI
};