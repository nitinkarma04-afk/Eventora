const callAI = async (message, events = [], conversationHistory = []) => {
    try {
        const eventContext = events.length
            ? events
                .map(
                    (event, idx) =>
                        `Event #${idx + 1}:
- Title: ${event.title}
- Category: ${event.category}
- Location: ${event.location}
- Date: ${event.date ? new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
- Ticket Price: ₹${event.ticketPrice === 0 ? '0 (Free)' : event.ticketPrice}
- Available Seats: ${event.availableSeats} / ${event.totalSeats || event.availableSeats}
- Description: ${event.description || 'No description provided.'}`
                )
                .join('\n\n')
            : 'No events are currently available on Eventora.';

        const systemPrompt = `You are Eventora AI Assistant, an intelligent, professional, friendly, and helpful AI assistant for the Eventora event booking platform.

YOUR CAPABILITIES & SCOPE:
1. Event Recommendations:
   - Understand user preferences including category (Technology, Music, Workshop, etc.), location/city (e.g. Lucknow, Kanpur), price/budget (e.g. under ₹500, free events), dates, and seat availability.
   - Recommend matching events from the database.
   - Format recommendations clearly with:
     * Event Title
     * Category
     * Location
     * Date
     * Ticket Price (in ₹)
     * Available Seats
     * Short reason why it matches the user's request.
2. Event Information Queries:
   - Answer questions about event timings, locations, prices, seat counts, and descriptions.
3. General Eventora Inquiries:
   - Provide assistance on how Eventora works, finding events, and booking tickets.

CRITICAL GROUNDING & ACCURACY RULES:
- Use ONLY the Eventora event data provided below.
- NEVER invent, hallucinate, or assume events, dates, locations, prices, available seats, or descriptions that are not in the provided data.
- If no event matches the user's criteria, or if the requested event is not in the data, state clearly: "No matching event is currently available on Eventora." You may briefly mention what categories or cities are available.
- Understand English, Hindi, and Hinglish queries naturally (e.g., "Mujhe AI aur technology events chahiye", "Events under ₹500 in Lucknow").
- Keep answers concise, clear, and focused on events.

CURRENT EVENTORA EVENT DATA:
${eventContext}`;

        const messages = [
            {
                role: 'system',
                content: systemPrompt
            }
        ];

        // Add recent conversation history if provided
        if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
            const recentHistory = conversationHistory.slice(-6);
            for (const turn of recentHistory) {
                if (turn.role && turn.content && (turn.role === 'user' || turn.role === 'assistant')) {
                    messages.push({
                        role: turn.role,
                        content: turn.content
                    });
                }
            }
        }

        // Add current message
        messages.push({
            role: 'user',
            content: message
        });

        const sendRequest = async () => {
            const response = await fetch(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: 'openrouter/free',
                        messages: messages
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error('OpenRouter Error:', data);
                throw new Error(
                    data?.error?.message || 'AI API request failed'
                );
            }

            const content = data?.choices?.[0]?.message?.content;
            return content;
        };

        let aiResponse = await sendRequest();

        // If response is malformed or an unintended safety tag from free pool, retry once
        const isBad = (text) => {
            if (!text || typeof text !== 'string') return true;
            const t = text.trim().toLowerCase();
            return t === 'user safety: safe' || t === 'safe' || t.startsWith('user safety:');
        };

        if (isBad(aiResponse)) {
            aiResponse = await sendRequest();
        }

        if (!aiResponse || isBad(aiResponse)) {
            throw new Error('AI returned an empty or invalid response');
        }

        return aiResponse;
    } catch (error) {
        console.error('AI Service Error:', error);
        throw error;
    }
};

module.exports = callAI;