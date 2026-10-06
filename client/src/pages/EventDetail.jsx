import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';

import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaChair,
    FaMoneyBillWave,
    FaArrowLeft,
    FaShieldAlt,
    FaCheckCircle,
    FaTicketAlt,
    FaClock
} from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setBookingLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (!showOTP) {
                await api.post('/bookings/send-otp');
                setShowOTP(true);
                setSuccessMsg(
                    'OTP sent to your email. Please verify to confirm booking.'
                );
            } else {
                await api.post('/bookings', {
                    eventId: event._id,
                    otp
                });

                setSuccessMsg(
                    'Booking requested! Awaiting admin confirmation.'
                );

                setShowOTP(false);

                // Update local seats count dynamically after booking
                setEvent({
                    ...event,
                    availableSeats: event.availableSeats - 1
                });
            }
        } catch (err) {
            setError(
                err.response?.data?.message || 'Booking failed'
            );
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#070A12] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-5"></div>
                    <p className="text-gray-400 text-lg">
                        Loading event...
                    </p>
                </div>
            </div>
        );
    }

    if (error && !event) {
        return (
            <div className="min-h-screen bg-[#070A12] text-white flex items-center justify-center px-6">
                <div className="text-center">
                    <p className="text-red-400 text-xl mb-6">
                        {error || 'Event not found'}
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    const isSoldOut = event.availableSeats <= 0;

    const formattedDate = new Date(event.date).toLocaleDateString(
        'en-IN',
        {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }
    );

    const formattedTime = new Date(event.date).toLocaleTimeString(
        'en-IN',
        {
            hour: 'numeric',
            minute: '2-digit'
        }
    );

    return (
        <div className="min-h-screen bg-[#070A12] text-white py-8 md:py-12">

            <div className="w-full max-w-7xl mx-auto px-5 sm:px-8">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Events
                </button>

                {/* Main Event Card */}
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl">

                    {/* Glow Effects */}
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-600/20 blur-3xl rounded-full pointer-events-none"></div>

                    <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/10 blur-3xl rounded-full pointer-events-none"></div>

                    {/* Event Image */}
                    <div className="relative h-[300px] md:h-[440px] overflow-hidden">

                        {event.image ? (
                            <>
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-[#070A12] via-black/20 to-transparent"></div>
                            </>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-950 via-[#101323] to-purple-950 flex items-center justify-center">
                                <FaTicketAlt className="text-7xl text-white/20" />
                            </div>
                        )}

                        {/* Category */}
                        <div className="absolute top-6 left-6">
                            <span className="inline-flex items-center px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-blue-400 text-sm font-bold uppercase tracking-wider">
                                {event.category}
                            </span>
                        </div>

                        {/* Sold Out */}
                        {isSoldOut && (
                            <div className="absolute top-6 right-6">
                                <span className="px-4 py-2 rounded-full bg-red-500/90 text-white text-sm font-bold">
                                    SOLD OUT
                                </span>
                            </div>
                        )}

                        {/* Image Bottom Title */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight max-w-4xl">
                                {event.title}
                            </h1>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-10">

                        <div className="grid lg:grid-cols-[1fr_380px] gap-10">

                            {/* LEFT SIDE */}
                            <div>

                                <div className="mb-10">
                                    <p className="text-blue-400 text-sm font-bold uppercase tracking-[0.2em] mb-3">
                                        About this event
                                    </p>

                                    <h2 className="text-2xl md:text-3xl font-bold mb-5">
                                        Experience something unforgettable
                                    </h2>

                                    <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>

                                {/* Event Information */}
                                <div className="grid sm:grid-cols-2 gap-4">

                                    {/* Date */}
                                    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                                <FaCalendarAlt />
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                                                    Date
                                                </p>

                                                <p className="font-semibold text-white">
                                                    {formattedDate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                                                <FaClock />
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                                                    Time
                                                </p>

                                                <p className="font-semibold text-white">
                                                    {formattedTime}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                                                <FaMapMarkerAlt />
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                                                    Location
                                                </p>

                                                <p className="font-semibold text-white">
                                                    {event.location}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seats */}
                                    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                                                <FaChair />
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                                                    Availability
                                                </p>

                                                <p className="font-semibold text-white">
                                                    <span
                                                        className={
                                                            event.availableSeats < 10
                                                                ? 'text-orange-400'
                                                                : 'text-green-400'
                                                        }
                                                    >
                                                        {event.availableSeats}
                                                    </span>

                                                    <span className="text-gray-500">
                                                        {' '} / {event.totalSeats} seats
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* RIGHT SIDE - BOOKING */}
                            <div>

                                <div className="lg:sticky lg:top-28 rounded-3xl border border-white/10 bg-[#0D111C]/90 backdrop-blur-xl p-6 md:p-7 shadow-2xl">

                                    {/* Booking Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <p className="text-xs text-blue-400 uppercase tracking-wider font-bold mb-1">
                                                Reserve your spot
                                            </p>

                                            <h3 className="text-2xl font-bold">
                                                Booking Details
                                            </h3>
                                        </div>

                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                            <FaTicketAlt />
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="pb-6 mb-6 border-b border-white/10">
                                        <p className="text-gray-500 text-sm mb-1">
                                            Ticket Price
                                        </p>

                                        <div className="flex items-end gap-2">
                                            <span className="text-4xl font-black">
                                                {event.ticketPrice === 0
                                                    ? 'Free'
                                                    : `₹${event.ticketPrice}`}
                                            </span>

                                            {event.ticketPrice !== 0 && (
                                                <span className="text-gray-500 text-sm mb-1">
                                                    / person
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick Info */}
                                    <div className="space-y-4 mb-6">

                                        <div className="flex items-center gap-3 text-gray-300">
                                            <FaCheckCircle className="text-green-400" />
                                            <span>Secure event registration</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-gray-300">
                                            <FaShieldAlt className="text-blue-400" />
                                            <span>Email OTP verification</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-gray-300">
                                            <FaChair className="text-purple-400" />
                                            <span>
                                                {event.availableSeats} seats remaining
                                            </span>
                                        </div>

                                    </div>

                                    {/* OTP */}
                                    {showOTP && (
                                        <div className="mb-5">

                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                Enter OTP
                                            </label>

                                            <input
                                                type="text"
                                                required
                                                placeholder="6-digit code"
                                                maxLength="6"
                                                value={otp}
                                                onChange={(e) =>
                                                    setOtp(e.target.value)
                                                }
                                                className="w-full px-4 py-4 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition text-center text-xl font-bold tracking-[0.4em]"
                                            />

                                            <p className="text-xs text-gray-500 mt-2 text-center">
                                                Check your registered email for the OTP.
                                            </p>

                                        </div>
                                    )}

                                    {/* Booking Button */}
                                    <button
                                        onClick={handleBooking}
                                        disabled={
                                            isSoldOut ||
                                            bookingLoading ||
                                            (showOTP && !otp)
                                        }
                                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                                            isSoldOut ||
                                            (successMsg && !showOTP)
                                                ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/20'
                                        }`}
                                    >
                                        {bookingLoading
                                            ? 'Processing...'
                                            : showOTP
                                            ? 'Verify OTP & Confirm'
                                            : successMsg && !showOTP
                                            ? 'Request Sent'
                                            : isSoldOut
                                            ? 'Sold Out'
                                            : 'Confirm Registration'}
                                    </button>

                                    {/* Error */}
                                    {error && (
                                        <p className="text-red-400 mt-4 text-center font-medium bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                                            {error}
                                        </p>
                                    )}

                                    {/* Success */}
                                    {successMsg && (
                                        <p className="text-green-400 mt-4 text-center font-medium bg-green-500/10 border border-green-500/20 p-3 rounded-xl">
                                            {successMsg}
                                        </p>
                                    )}

                                    <p className="text-xs text-gray-600 text-center mt-5">
                                        By registering, you agree to the event booking terms.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;