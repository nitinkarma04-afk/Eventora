import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import {
    FaRobot,
    FaPaperPlane,
    FaTrashAlt,
    FaUser,
    FaBolt,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaTicketAlt,
    FaArrowRight,
    FaInfoCircle,
    FaExclamationTriangle,
    FaSyncAlt
} from 'react-icons/fa';

const SUGGESTED_PROMPTS = [
    'Recommend an AI event',
    'Show technology events',
    'Events under ₹500',
    'Events in Lucknow',
    'Tell me about the AI Summit',
    'Music events available?'
];

const AIAssistant = () => {
    const [messages, setMessages] = useState([
        {
            id: 'welcome-msg',
            role: 'assistant',
            content:
                "Hello! I'm your Eventora AI Assistant 🎟️\n\nI can help you discover upcoming events, check ticket prices, seat availability, and give you personalized recommendations. How can I help you today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSendMessage = async (customMessage = null) => {
        const messageToSend = (typeof customMessage === 'string' ? customMessage : input).trim();
        if (!messageToSend || loading) return;

        setError(null);
        setInput('');

        const userMessageId = `user-${Date.now()}`;
        const userMsg = {
            id: userMessageId,
            role: 'user',
            content: messageToSend,
            timestamp: new Date()
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setLoading(true);

        try {
            // Build conversation history for context (exclude welcome message)
            const conversationHistory = updatedMessages
                .filter((m) => m.id !== 'welcome-msg' && !m.error)
                .map((m) => ({
                    role: m.role === 'user' ? 'user' : 'assistant',
                    content: m.content
                }));

            const response = await api.post('/ai/chat', {
                message: messageToSend,
                conversationHistory
            });

            const replyContent =
                response?.data?.response ||
                'I received your request but could not generate a response. Please try again.';

            setMessages((prev) => [
                ...prev,
                {
                    id: `ai-${Date.now()}`,
                    role: 'assistant',
                    content: replyContent,
                    timestamp: new Date()
                }
            ]);
        } catch (err) {
            console.error('AI Chat Error:', err);
            const friendlyError =
                err?.response?.data?.message ||
                'Unable to reach Eventora AI at the moment. Please check your connection or try again shortly.';

            setError(friendlyError);
            setMessages((prev) => [
                ...prev,
                {
                    id: `ai-err-${Date.now()}`,
                    role: 'assistant',
                    content: `⚠️ ${friendlyError}`,
                    timestamp: new Date(),
                    error: true
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleClearChat = () => {
        setMessages([
            {
                id: 'welcome-msg',
                role: 'assistant',
                content:
                    "Chat cleared! I'm ready for your next event question or recommendation. What would you like to explore?",
                timestamp: new Date()
            }
        ]);
        setError(null);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Lightweight markdown/structured text renderer
    const formatAIResponse = (text) => {
        if (!text) return null;

        const lines = text.split('\n');

        return lines.map((line, lineIndex) => {
            const trimmed = line.trim();

            if (!trimmed) {
                return <div key={lineIndex} className="h-2" />;
            }

            // Headers
            if (trimmed.startsWith('### ')) {
                return (
                    <h4
                        key={lineIndex}
                        className="mt-3 mb-1 text-base font-bold text-blue-300"
                    >
                        {formatInline(trimmed.replace('### ', ''))}
                    </h4>
                );
            }
            if (trimmed.startsWith('## ')) {
                return (
                    <h3
                        key={lineIndex}
                        className="mt-4 mb-2 text-lg font-black text-white"
                    >
                        {formatInline(trimmed.replace('## ', ''))}
                    </h3>
                );
            }
            if (trimmed.startsWith('# ')) {
                return (
                    <h2
                        key={lineIndex}
                        className="mt-4 mb-2 text-xl font-black text-white"
                    >
                        {formatInline(trimmed.replace('# ', ''))}
                    </h2>
                );
            }

            // Dividers
            if (trimmed === '---' || trimmed === '***') {
                return (
                    <hr
                        key={lineIndex}
                        className="my-3 border-white/10"
                    />
                );
            }

            // Bullet points
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                    <div
                        key={lineIndex}
                        className="my-1 flex items-start gap-2 text-sm leading-relaxed text-slate-200"
                    >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                        <div className="flex-1">
                            {formatInline(trimmed.substring(2))}
                        </div>
                    </div>
                );
            }

            // Numbered list (e.g. "1. ")
            const matchNumber = trimmed.match(/^(\d+)\.\s+(.*)$/);
            if (matchNumber) {
                return (
                    <div
                        key={lineIndex}
                        className="my-1.5 flex items-start gap-2.5 text-sm leading-relaxed text-slate-200"
                    >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300">
                            {matchNumber[1]}
                        </span>
                        <div className="flex-1">
                            {formatInline(matchNumber[2])}
                        </div>
                    </div>
                );
            }

            return (
                <p
                    key={lineIndex}
                    className="my-1 text-sm leading-relaxed text-slate-200"
                >
                    {formatInline(line)}
                </p>
            );
        });
    };

    // Helper for **bold** and *italic*
    const formatInline = (text) => {
        // Split on bold markers
        const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={index} className="font-bold text-white">
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            if (part.startsWith('*') && part.endsWith('*')) {
                return (
                    <em key={index} className="italic text-slate-300">
                        {part.slice(1, -1)}
                    </em>
                );
            }
            return part;
        });
    };

    return (
        <div className="min-h-[calc(100vh-72px)] bg-[#070A12] text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background glowing effects */}
            <div className="pointer-events-none absolute -left-40 top-10 h-[450px] w-[450px] rounded-full bg-blue-600/15 blur-[140px]" />
            <div className="pointer-events-none absolute -right-40 top-40 h-[450px] w-[450px] rounded-full bg-purple-600/15 blur-[140px]" />

            <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 flex-1 flex flex-col">
                {/* Header section */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
                            <FaRobot className="text-2xl text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                                    Eventora AI Assistant
                                </h1>
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-green-400 border border-green-500/20">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                    Live
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                                Your smart companion for real-time event recommendations and inquiries.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to="/events"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-white/[0.08] hover:text-white"
                        >
                            <FaTicketAlt className="text-blue-400" />
                            Browse Events
                        </Link>
                        {messages.length > 1 && (
                            <button
                                onClick={handleClearChat}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-400 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                                title="Clear conversation"
                            >
                                <FaTrashAlt className="text-xs" />
                                <span className="hidden sm:inline">Clear Chat</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Suggested Prompts Pill Bar */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <FaBolt className="text-blue-400" />
                        <span>Suggested Queries</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTED_PROMPTS.map((prompt, index) => (
                            <button
                                key={index}
                                onClick={() => handleSendMessage(prompt)}
                                disabled={loading}
                                className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-slate-300 transition-all hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Container */}
                <div className="flex-1 flex flex-col rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden min-h-[420px] max-h-[600px]">
                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                        {messages.map((msg) => {
                            const isUser = msg.role === 'user';
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-3 ${
                                        isUser ? 'flex-row-reverse' : 'flex-row'
                                    }`}
                                >
                                    {/* Avatar */}
                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-md ${
                                            isUser
                                                ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                                                : msg.error
                                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                : 'bg-white/10 text-blue-300 border border-white/10'
                                        }`}
                                    >
                                        {isUser ? <FaUser /> : <FaRobot />}
                                    </div>

                                    {/* Message Bubble */}
                                    <div
                                        className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 transition-all ${
                                            isUser
                                                ? 'bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-blue-500/30 text-white shadow-lg shadow-blue-900/10'
                                                : msg.error
                                                ? 'bg-red-950/30 border border-red-500/20 text-red-200'
                                                : 'bg-white/[0.045] border border-white/10 text-slate-200 shadow-lg shadow-black/20'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-4 mb-1">
                                            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                                                {isUser ? 'You' : 'Eventora Assistant'}
                                            </span>
                                            <span className="text-[10px] text-slate-500">
                                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>

                                        <div className="text-sm">
                                            {isUser ? (
                                                <p className="whitespace-pre-wrap leading-relaxed text-slate-100 font-medium">
                                                    {msg.content}
                                                </p>
                                            ) : (
                                                <div className="ai-content">
                                                    {formatAIResponse(msg.content)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-300 border border-white/10">
                                    <FaRobot />
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-slate-300 shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" />
                                        <div
                                            className="h-2 w-2 rounded-full bg-purple-400 animate-bounce"
                                            style={{ animationDelay: '0.2s' }}
                                        />
                                        <div
                                            className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"
                                            style={{ animationDelay: '0.4s' }}
                                        />
                                        <span className="ml-2 text-xs font-medium text-slate-400">
                                            Thinking & checking Eventora database...
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-white/10 bg-[#070A12]/80 p-3 sm:p-4 backdrop-blur-xl">
                        {error && (
                            <div className="mb-3 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs text-red-300">
                                <div className="flex items-center gap-2">
                                    <FaExclamationTriangle className="text-red-400" />
                                    <span>{error}</span>
                                </div>
                                <button
                                    onClick={() => handleSendMessage()}
                                    className="font-bold underline hover:text-white"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        <div className="relative flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about events, recommendations, ticket prices, cities..."
                                disabled={loading}
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] py-3.5 pl-4 pr-12 text-sm text-white outline-none backdrop-blur-xl transition-all placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
                            />

                            <button
                                onClick={() => handleSendMessage()}
                                disabled={!input.trim() || loading}
                                className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-900/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
                                title="Send message"
                            >
                                <FaPaperPlane className="text-xs" />
                            </button>
                        </div>
                        <p className="mt-2 text-center text-[10px] text-slate-500">
                            Eventora AI uses live data from the Eventora event catalog.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;

