import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';

import {
    FaCalendarAlt,
    FaTicketAlt,
    FaUsers,
    FaClock,
    FaRupeeSign,
    FaPlus,
    FaTrash,
    FaCheckCircle,
    FaTimesCircle,
    FaMapMarkerAlt,
    FaChair,
    FaImage,
    FaArrowRight
} from 'react-icons/fa';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showEventForm, setShowEventForm] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        category: '',
        totalSeats: '',
        ticketPrice: '',
        image: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }

        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my')
            ]);

            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();

        try {
            await api.post('/events', formData);

            setShowEventForm(false);

            setFormData({
                title: '',
                description: '',
                date: '',
                location: '',
                category: '',
                totalSeats: '',
                ticketPrice: '',
                image: ''
            });

            fetchData();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                'Error creating event'
            );
        }
    };

    const handleDeleteEvent = async (id) => {
        if (
            window.confirm(
                'Are you sure you want to delete this event?'
            )
        ) {
            try {
                await api.delete(`/events/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting event');
            }
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/confirm`, {
                paymentStatus
            });

            fetchData();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                'Error confirming booking'
            );
        }
    };

    const handleCancelBooking = async (id) => {
        if (
            window.confirm(
                "Cancel this user's booking request?"
            )
        ) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchData();
            } catch (error) {
                alert(
                    error.response?.data?.message ||
                    'Error cancelling booking'
                );
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#070A12] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />
                    <p className="text-lg font-medium text-slate-400">
                        Loading admin panel...
                    </p>
                </div>
            </div>
        );
    }

    const totalRevenue = bookings.reduce(
        (sum, booking) =>
            booking.paymentStatus === 'paid' &&
            booking.status === 'confirmed'
                ? sum + booking.amount
                : sum,
        0
    );

    const paidClients = new Set(
        bookings
            .filter(
                (booking) =>
                    booking.paymentStatus === 'paid' &&
                    booking.status === 'confirmed'
            )
            .map((booking) => booking.userId?._id)
        ).size;

    const pendingBookings = bookings.filter(
        (booking) => booking.status === 'pending'
    ).length;

    const confirmedBookings = bookings.filter(
        (booking) => booking.status === 'confirmed'
    ).length;

    return (
        <div className="min-h-screen bg-[#070A12] text-white">

            {/* Background Glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[140px]" />
                <div className="absolute -right-40 top-60 h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-[140px]" />
            </div>

            <main className="relative w-full max-w-7xl mx-auto px-5 sm:px-8 py-10 md:py-14">

                {/* ================= HEADER ================= */}

                <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-8 mb-8">

                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />

                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">

                        <div className="flex items-center gap-5">

                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-3xl font-black shadow-lg shadow-blue-900/30">
                                A
                            </div>

                            <div>
                                <p className="mb-1 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                                    Eventora Control Center
                                </p>

                                <h1 className="text-2xl md:text-3xl font-black">
                                    Admin Dashboard
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage events, bookings and platform activity.
                                </p>
                            </div>

                        </div>

                        <button
                            onClick={() =>
                                setShowEventForm(!showEventForm)
                            }
                            className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-blue-900/40"
                        >
                            {showEventForm ? (
                                <>
                                    <FaTimesCircle />
                                    Close Form
                                </>
                            ) : (
                                <>
                                    <FaPlus />
                                    Create New Event
                                </>
                            )}
                        </button>

                    </div>

                </section>

                {/* ================= STATS ================= */}

                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

                    {/* Revenue */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Total Revenue
                                </p>

                                <p className="mt-2 text-2xl md:text-3xl font-black text-green-400">
                                    ₹{totalRevenue}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                                <FaRupeeSign />
                            </div>

                        </div>

                    </div>

                    {/* Paid Clients */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Paid Clients
                                </p>

                                <p className="mt-2 text-3xl font-black text-blue-400">
                                    {paidClients}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                <FaUsers />
                            </div>

                        </div>

                    </div>

                    {/* Pending */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Pending
                                </p>

                                <p className="mt-2 text-3xl font-black text-yellow-400">
                                    {pendingBookings}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                                <FaClock />
                            </div>

                        </div>

                    </div>

                    {/* Events */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Total Events
                                </p>

                                <p className="mt-2 text-3xl font-black text-purple-400">
                                    {events.length}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                <FaCalendarAlt />
                            </div>

                        </div>

                    </div>

                </section>

                {/* ================= CREATE EVENT ================= */}

                {showEventForm && (

                    <section className="mb-10 overflow-hidden rounded-3xl border border-blue-500/20 bg-white/[0.035] shadow-2xl">

                        <div className="border-b border-white/10 bg-white/[0.025] p-6">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                    <FaPlus />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold">
                                        Create New Event
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Add a new event to the Eventora platform.
                                    </p>
                                </div>

                            </div>

                        </div>

                        <form
                            onSubmit={handleCreateEvent}
                            className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6"
                        >

                            {/* Title */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-400">
                                    Event Title
                                </label>

                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. AI & Web Development Workshop"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-400">
                                    Category
                                </label>

                                <input
                                    required
                                    type="text"
                                    placeholder="Technology, Music, Workshop..."
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-400">
                                    Event Date
                                </label>

                                <input
                                    required
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            date: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-400">
                                    Location
                                </label>

                                <input
                                    required
                                    type="text"
                                    placeholder="Lucknow, Uttar Pradesh"
                                    value={formData.location}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            location: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            {/* Seats */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-400">
                                    Total Seats
                                </label>

                                <input
                                    required
                                    type="number"
                                    min="1"
                                    placeholder="50"
                                    value={formData.totalSeats}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            totalSeats: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-400">
                                    Ticket Price
                                </label>

                                <input
                                    required
                                    type="number"
                                    min="0"
                                    placeholder="299 (0 for free)"
                                    value={formData.ticketPrice}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            ticketPrice: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            {/* Image */}
                            <div className="md:col-span-2">

                                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-400">
                                    <FaImage />
                                    Event Image URL
                                </label>

                                <input
                                    type="text"
                                    placeholder="https://example.com/event-image.jpg"
                                    value={formData.image}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            image: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                                />

                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">

                                <label className="mb-2 block text-sm font-semibold text-slate-400">
                                    Event Description
                                </label>

                                <textarea
                                    required
                                    rows="5"
                                    placeholder="Describe your event..."
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value
                                        })
                                    }
                                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                                />

                            </div>

                            {/* Submit */}
                            <div className="md:col-span-2 flex justify-end">

                                <button
                                    type="submit"
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-blue-900/40"
                                >
                                    <FaPlus />
                                    Publish Event
                                </button>

                            </div>

                        </form>

                    </section>

                )}

                {/* ================= MANAGEMENT ================= */}

                <section className="mb-6">

                    <div className="flex items-end justify-between">

                        <div>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                                <FaTicketAlt />
                                Management Center
                            </div>

                            <h2 className="mt-2 text-3xl font-black">
                                Events & Bookings
                            </h2>

                            <p className="mt-2 text-slate-500">
                                Manage your events and review customer booking requests.
                            </p>
                        </div>

                    </div>

                </section>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                    {/* ================= EVENTS ================= */}

                    <section>

                        <div className="mb-4 flex items-center justify-between">

                            <h3 className="flex items-center gap-3 text-xl font-bold">

                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-sm text-blue-400">
                                    <FaCalendarAlt />
                                </span>

                                All Events

                            </h3>

                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm font-bold text-slate-400">
                                {events.length}
                            </span>

                        </div>

                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

                            <div className="max-h-[650px] overflow-y-auto">

                                {events.length === 0 ? (

                                    <div className="p-12 text-center">

                                        <FaCalendarAlt className="mx-auto text-4xl text-slate-700" />

                                        <p className="mt-4 text-slate-500">
                                            No events created yet.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="divide-y divide-white/10">

                                        {events.map((event) => (

                                            <div
                                                key={event._id}
                                                className="group p-5 transition hover:bg-white/[0.035]"
                                            >

                                                <div className="flex gap-4">

                                                    {/* Image */}
                                                    <div className="hidden sm:block h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-white/5">

                                                        {event.image ? (
                                                            <img
                                                                src={event.image}
                                                                alt={event.title}
                                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-slate-700">
                                                                <FaTicketAlt />
                                                            </div>
                                                        )}

                                                    </div>

                                                    {/* Info */}
                                                    <div className="min-w-0 flex-1">

                                                        <div className="flex items-start justify-between gap-3">

                                                            <div>

                                                                <h4 className="font-bold text-white leading-tight">
                                                                    {event.title}
                                                                </h4>

                                                                <span className="mt-2 inline-block rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                                                                    {event.category}
                                                                </span>

                                                            </div>

                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteEvent(
                                                                        event._id
                                                                    )
                                                                }
                                                                className="shrink-0 rounded-lg border border-red-500/20 bg-red-500/5 p-2.5 text-red-400 transition hover:bg-red-500 hover:text-white"
                                                                title="Delete event"
                                                            >
                                                                <FaTrash />
                                                            </button>

                                                        </div>

                                                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">

                                                            <span className="flex items-center gap-1.5">
                                                                <FaCalendarAlt className="text-blue-400" />
                                                                {new Date(
                                                                    event.date
                                                                ).toLocaleDateString()}
                                                            </span>

                                                            <span className="flex items-center gap-1.5">
                                                                <FaMapMarkerAlt className="text-purple-400" />
                                                                {event.location}
                                                            </span>

                                                            <span
                                                                className={`flex items-center gap-1.5 ${
                                                                    event.availableSeats > 0
                                                                        ? 'text-green-400'
                                                                        : 'text-red-400'
                                                                }`}
                                                            >
                                                                <FaChair />
                                                                {event.availableSeats}/
                                                                {event.totalSeats}
                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </div>

                        </div>

                    </section>

                    {/* ================= BOOKINGS ================= */}

                    <section>

                        <div className="mb-4 flex items-center justify-between">

                            <h3 className="flex items-center gap-3 text-xl font-bold">

                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/10 text-sm text-yellow-400">
                                    <FaTicketAlt />
                                </span>

                                Booking Requests

                            </h3>

                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm font-bold text-slate-400">
                                {bookings.length}
                            </span>

                        </div>

                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

                            <div className="max-h-[650px] overflow-y-auto">

                                {bookings.length === 0 ? (

                                    <div className="p-12 text-center">

                                        <FaTicketAlt className="mx-auto text-4xl text-slate-700" />

                                        <p className="mt-4 text-slate-500">
                                            No bookings yet.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="divide-y divide-white/10">

                                        {bookings.map((booking) => (

                                            <div
                                                key={booking._id}
                                                className={`p-5 transition hover:bg-white/[0.035] border-l-2 ${
                                                    booking.status === 'pending'
                                                        ? 'border-yellow-400'
                                                        : booking.status === 'confirmed'
                                                        ? 'border-green-400'
                                                        : 'border-red-400'
                                                }`}
                                            >

                                                {/* Header */}
                                                <div className="flex items-start justify-between gap-4">

                                                    <div className="min-w-0">

                                                        <h4 className="font-bold text-white leading-tight">
                                                            {booking.eventId?.title ||
                                                                'Deleted Event'}
                                                        </h4>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {booking.userId?.name ||
                                                                'Unknown User'}
                                                        </p>

                                                    </div>

                                                    <div className="flex shrink-0 flex-col items-end gap-1.5">

                                                        <span
                                                            className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                                                                booking.status === 'confirmed'
                                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                                    : booking.status === 'cancelled'
                                                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                            }`}
                                                        >
                                                            {booking.status}
                                                        </span>

                                                        {booking.status !== 'cancelled' && (
                                                            <span
                                                                className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                                                                    booking.paymentStatus === 'paid'
                                                                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                                        : 'bg-white/5 text-slate-500 border border-white/10'
                                                                }`}
                                                            >
                                                                {booking.paymentStatus?.replace(
                                                                    '_',
                                                                    ' '
                                                                )}
                                                            </span>
                                                        )}

                                                    </div>

                                                </div>

                                                {/* Booking Info */}
                                                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">

                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                                User
                                                            </p>

                                                            <p className="mt-1 font-semibold text-slate-300">
                                                                {booking.userId?.name}
                                                            </p>

                                                            <p className="text-xs text-slate-600 break-all">
                                                                {booking.userId?.email}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                                Amount
                                                            </p>

                                                            <p
                                                                className={`mt-1 font-bold ${
                                                                    booking.amount === 0
                                                                        ? 'text-green-400'
                                                                        : 'text-white'
                                                                }`}
                                                            >
                                                                {booking.amount === 0
                                                                    ? 'Free'
                                                                    : `₹${booking.amount}`}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                                Requested
                                                            </p>

                                                            <p className="mt-1 text-slate-400">
                                                                {new Date(
                                                                    booking.bookedAt
                                                                ).toLocaleString()}
                                                            </p>
                                                        </div>

                                                        {booking.eventId && (
                                                            <div>
                                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                                    Seats
                                                                </p>

                                                                <p
                                                                    className={`mt-1 font-bold ${
                                                                        booking.eventId.availableSeats > 0
                                                                            ? 'text-green-400'
                                                                            : 'text-red-400'
                                                                    }`}
                                                                >
                                                                    {booking.eventId.availableSeats}
                                                                    <span className="font-normal text-slate-600">
                                                                        {' '}remaining /{' '}
                                                                        {booking.eventId.totalSeats}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        )}

                                                    </div>

                                                </div>

                                                {/* Actions */}
                                                {booking.status === 'pending' && (

                                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">

                                                        <button
                                                            onClick={() =>
                                                                handleConfirmBooking(
                                                                    booking._id,
                                                                    'paid'
                                                                )
                                                            }
                                                            className="flex items-center justify-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 px-3 py-2.5 text-xs font-bold text-green-400 transition hover:bg-green-500 hover:text-white"
                                                        >
                                                            <FaCheckCircle />
                                                            Approve Paid
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleConfirmBooking(
                                                                    booking._id,
                                                                    'not_paid'
                                                                )
                                                            }
                                                            className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-xs font-bold text-slate-400 transition hover:bg-white/10 hover:text-white"
                                                        >
                                                            <FaCheckCircle />
                                                            Approve Unpaid
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleCancelBooking(
                                                                    booking._id
                                                                )
                                                            }
                                                            className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
                                                        >
                                                            <FaTimesCircle />
                                                            Reject
                                                        </button>

                                                    </div>

                                                )}

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </div>

                        </div>

                    </section>

                </div>

            </main>
        </div>
    );
};

export default AdminDashboard;