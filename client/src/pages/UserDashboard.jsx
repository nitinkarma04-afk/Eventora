import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';

import {
    FaTicketAlt,
    FaTimesCircle,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaClock,
    FaTimes,
    FaArrowRight,
    FaUserCircle,
    FaWallet
} from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (
            window.confirm(
                'Are you sure you want to cancel this booking request?'
            )
        ) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchBookings();
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
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    const confirmedCount = bookings.filter(
        (booking) => booking.status === 'confirmed'
    ).length;

    const pendingCount = bookings.filter(
        (booking) => booking.status === 'pending'
    ).length;

    const cancelledCount = bookings.filter(
        (booking) => booking.status === 'cancelled'
    ).length;

    return (
        <div className="min-h-screen bg-[#070A12] text-white">

            {/* Background Glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[140px]" />
                <div className="absolute -right-40 top-60 h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-[140px]" />
            </div>

            <main className="relative w-full max-w-7xl mx-auto px-5 sm:px-8 py-10 md:py-14">

                {/* ================= HEADER ================= */}

                <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-8 mb-8">

                    <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-600/10 blur-3xl" />

                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">

                        <div className="flex items-center gap-5">

                            {/* Avatar */}
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-3xl font-black text-white shadow-lg shadow-blue-900/30">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </div>

                            <div>
                                <p className="mb-1 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                                    Welcome back
                                </p>

                                <h1 className="text-2xl md:text-3xl font-black">
                                    {user?.name}
                                </h1>

                                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                    <span className="h-2 w-2 rounded-full bg-green-400" />
                                    Active User
                                </div>
                            </div>

                        </div>

                        <Link
                            to="/events"
                            className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-blue-900/40"
                        >
                            Explore Events
                            <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                        </Link>

                    </div>

                </section>

                {/* ================= STATS ================= */}

                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

                    {/* Total */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Total Bookings
                                </p>

                                <p className="mt-2 text-3xl font-black">
                                    {bookings.length}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                <FaTicketAlt />
                            </div>

                        </div>
                    </div>

                    {/* Confirmed */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Confirmed
                                </p>

                                <p className="mt-2 text-3xl font-black text-green-400">
                                    {confirmedCount}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                                <FaCheckCircle />
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
                                    {pendingCount}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                                <FaClock />
                            </div>

                        </div>
                    </div>

                    {/* Cancelled */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Cancelled
                                </p>

                                <p className="mt-2 text-3xl font-black text-red-400">
                                    {cancelledCount}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                                <FaTimes />
                            </div>

                        </div>
                    </div>

                </section>

                {/* ================= BOOKINGS HEADER ================= */}

                <section className="mb-6">

                    <div className="flex items-end justify-between gap-4">

                        <div>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                                <FaTicketAlt />
                                Your Activity
                            </div>

                            <h2 className="mt-2 text-3xl font-black">
                                My Bookings
                            </h2>

                            <p className="mt-2 text-slate-500">
                                Manage and track your event registrations.
                            </p>
                        </div>

                        <div className="hidden sm:block rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-400">
                            {bookings.length}{' '}
                            {bookings.length === 1 ? 'booking' : 'bookings'}
                        </div>

                    </div>

                </section>

                {/* ================= EMPTY STATE ================= */}

                {bookings.length === 0 ? (

                    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] py-24 px-6 text-center">

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 text-3xl text-slate-600">
                            <FaTicketAlt />
                        </div>

                        <h3 className="mt-6 text-2xl font-bold">
                            No bookings yet
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-slate-500">
                            You haven't registered for any events yet.
                            Discover something exciting and reserve your spot.
                        </p>

                        <Link
                            to="/events"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-bold text-white transition hover:-translate-y-0.5"
                        >
                            Browse Events
                            <FaArrowRight className="text-xs" />
                        </Link>

                    </div>

                ) : (

                    /* ================= BOOKING GRID ================= */

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {bookings.map((booking) => (

                            <div
                                key={booking._id}
                                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/20 hover:bg-white/[0.05]"
                            >

                                {booking.eventId ? (

                                    <>

                                        {/* Event Image */}
                                        <div className="relative h-44 overflow-hidden">

                                            {booking.eventId.image ? (

                                                <img
                                                    src={booking.eventId.image}
                                                    alt={booking.eventId.title}
                                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                                />

                                            ) : (

                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-950 to-purple-950">
                                                    <FaTicketAlt className="text-5xl text-white/20" />
                                                </div>

                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                                            {/* Status */}
                                            <div className="absolute left-4 top-4">

                                                <span
                                                    className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${
                                                        booking.status === 'confirmed'
                                                            ? 'bg-green-500/20 text-green-300 border border-green-400/20'
                                                            : booking.status === 'cancelled'
                                                            ? 'bg-red-500/20 text-red-300 border border-red-400/20'
                                                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/20'
                                                    }`}
                                                >
                                                    {booking.status}
                                                </span>

                                            </div>

                                            {/* Amount */}
                                            <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-sm font-bold backdrop-blur-md">
                                                {booking.amount === 0
                                                    ? 'FREE'
                                                    : `₹${booking.amount}`}
                                            </div>

                                        </div>

                                        {/* Card Content */}
                                        <div className="p-6">

                                            <div className="flex items-start justify-between gap-4">

                                                <h3 className="line-clamp-2 text-xl font-bold leading-tight">
                                                    {booking.eventId.title}
                                                </h3>

                                                <FaTicketAlt className="mt-1 shrink-0 text-blue-400" />

                                            </div>

                                            {/* Event Details */}
                                            <div className="mt-5 space-y-3 text-sm text-slate-400">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                                        <FaCalendarAlt />
                                                    </div>

                                                    <span>
                                                        {new Date(
                                                            booking.eventId.date
                                                        ).toLocaleDateString(
                                                            undefined,
                                                            {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            }
                                                        )}
                                                    </span>

                                                </div>

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                                        <FaMapMarkerAlt />
                                                    </div>

                                                    <span className="line-clamp-1">
                                                        {booking.eventId.location}
                                                    </span>

                                                </div>

                                            </div>

                                            {/* Booking Information */}
                                            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">

                                                <div className="flex items-center justify-between">

                                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                                        <FaWallet />
                                                        Amount
                                                    </div>

                                                    <span className="font-bold text-white">
                                                        {booking.amount === 0
                                                            ? 'Free'
                                                            : `₹${booking.amount}`}
                                                    </span>

                                                </div>

                                                <div className="mt-3 flex items-center justify-between">

                                                    <span className="text-sm text-slate-500">
                                                        Payment
                                                    </span>

                                                    <span
                                                        className={`text-xs font-bold uppercase ${
                                                            booking.paymentStatus === 'paid'
                                                                ? 'text-green-400'
                                                                : 'text-slate-400'
                                                        }`}
                                                    >
                                                        {booking.paymentStatus?.replace(
                                                            '_',
                                                            ' '
                                                        )}
                                                    </span>

                                                </div>

                                            </div>

                                            {/* Actions */}
                                            <div className="mt-5 flex items-center justify-between gap-3">

                                                {booking.status !== 'cancelled' ? (

                                                    <>
                                                        <Link
                                                            to={`/events/${booking.eventId._id}`}
                                                            className="group/button flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold transition hover:bg-blue-600"
                                                        >
                                                            View Event
                                                            <FaArrowRight className="text-xs transition-transform group-hover/button:translate-x-1" />
                                                        </Link>

                                                        <button
                                                            onClick={() =>
                                                                cancelBooking(
                                                                    booking._id
                                                                )
                                                            }
                                                            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/10"
                                                        >
                                                            <FaTimesCircle />
                                                            <span className="hidden sm:inline">
                                                                Cancel
                                                            </span>
                                                        </button>
                                                    </>

                                                ) : (

                                                    <div className="w-full rounded-xl bg-white/5 px-4 py-3 text-center text-sm font-semibold text-slate-500">
                                                        Booking Cancelled
                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    </>

                                ) : (

                                    <div className="p-8 text-center">

                                        <FaTimesCircle className="mx-auto text-3xl text-red-400" />

                                        <p className="mt-4 text-red-400">
                                            Event details unavailable
                                        </p>

                                        <p className="mt-1 text-sm text-slate-600">
                                            This event may have been deleted.
                                        </p>

                                    </div>

                                )}

                            </div>

                        ))}

                    </div>

                )}

            </main>
        </div>
    );
};

export default UserDashboard;