import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaSearch,
    FaRegClock,
    FaTicketAlt,
    FaShieldAlt,
    FaArrowRight,
    FaBolt,
    FaUsers,
    FaStar,
    FaFire
} from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#070A12] text-white">

            {/* =====================================================
                HERO
            ====================================================== */}

            <section className="relative overflow-hidden border-b border-white/5">

                {/* Background glow */}
                <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[130px]" />

                <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[130px]" />

                <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

                <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

                    <div className="grid items-center gap-16 lg:grid-cols-2">

                        {/* Hero Content */}
                        <div>

                            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-400">
                                <FaBolt />
                                Discover • Connect • Experience
                            </div>

                            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">

                                Find Events

                                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                    Worth Remembering.
                                </span>

                            </h1>

                            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400 md:text-xl">
                                Discover workshops, conferences, festivals and
                                unforgettable experiences. Find your next event
                                and secure your spot.
                            </p>

                            {/* Search */}
                            <div className="group relative mt-10 max-w-2xl">

                                <FaSearch className="absolute left-6 top-1/2 z-10 -translate-y-1/2 text-lg text-slate-500 transition-colors group-focus-within:text-blue-400" />

                                <input
                                    type="text"
                                    placeholder="Search events by title..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-5 pl-14 pr-6 text-white outline-none backdrop-blur-xl transition-all placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-white/[0.09] focus:ring-4 focus:ring-blue-500/10"
                                />

                            </div>

                            {/* Stats */}
                            <div className="mt-9 flex flex-wrap gap-8">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                                        <FaCalendarAlt />
                                    </div>

                                    <div>
                                        <p className="font-bold text-white">
                                            {events.length}+
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Events
                                        </p>
                                    </div>

                                </div>

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-purple-400">
                                        <FaUsers />
                                    </div>

                                    <div>
                                        <p className="font-bold text-white">
                                            Easy
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Booking
                                        </p>
                                    </div>

                                </div>

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-green-400/20 bg-green-500/10 text-green-400">
                                        <FaShieldAlt />
                                    </div>

                                    <div>
                                        <p className="font-bold text-white">
                                            Secure
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Platform
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Hero Image */}
                        <div className="relative hidden lg:block">

                            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-blue-950/40 backdrop-blur-xl">

                                <img
                                    src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=85&w=1200"
                                    alt="Event experience"
                                    className="h-[500px] w-full rounded-[1.5rem] object-cover opacity-90"
                                />

                                <div className="absolute inset-3 rounded-[1.5rem] bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                {/* Floating Card */}
                                <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur-xl">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
                                                Eventora
                                            </p>

                                            <h3 className="mt-1 text-lg font-bold text-white">
                                                Your next experience awaits.
                                            </h3>

                                        </div>

                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
                                            <FaTicketAlt />
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* =====================================================
                FEATURES
            ====================================================== */}

            <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">

                <div className="mb-12">

                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                        Why Eventora
                    </span>

                    <h2 className="mt-3 text-3xl font-black md:text-4xl">
                        Everything for your next event.
                    </h2>

                    <p className="mt-3 max-w-2xl text-slate-500">
                        A simple platform to discover, book and manage
                        unforgettable experiences.
                    </p>

                </div>

                <div className="grid gap-6 md:grid-cols-3">

                    {/* Feature */}
                    <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.05]">

                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-xl text-blue-400">
                            <FaRegClock />
                        </div>

                        <h3 className="text-xl font-bold">
                            Fast Booking
                        </h3>

                        <p className="mt-3 leading-7 text-slate-500">
                            Find an event and submit your booking request
                            through a simple and secure process.
                        </p>

                    </div>

                    {/* Feature */}
                    <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-white/[0.05]">

                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-xl text-purple-400">
                            <FaTicketAlt />
                        </div>

                        <h3 className="text-xl font-bold">
                            Easy Access
                        </h3>

                        <p className="mt-3 leading-7 text-slate-500">
                            Manage your bookings and track your event status
                            directly from your dashboard.
                        </p>

                    </div>

                    {/* Feature */}
                    <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/30 hover:bg-white/[0.05]">

                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-xl text-green-400">
                            <FaShieldAlt />
                        </div>

                        <h3 className="text-xl font-bold">
                            Secure Platform
                        </h3>

                        <p className="mt-3 leading-7 text-slate-500">
                            OTP verification and protected APIs keep your
                            Eventora account secure.
                        </p>

                    </div>

                </div>

            </section>

            {/* =====================================================
                EVENTS
            ====================================================== */}

            <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">

                <div className="mb-10 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">

                    <div>

                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                            <FaFire />
                            Explore
                        </div>

                        <h2 className="mt-2 text-3xl font-black md:text-4xl">
                            Upcoming Events
                        </h2>

                    </div>

                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-400">
                        {events.length}{' '}
                        {events.length === 1 ? 'event' : 'events'} found
                    </div>

                </div>

                {/* Loading */}
                {loading ? (

                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-24 text-center">

                        <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />

                        <p className="font-medium text-slate-500">
                            Finding amazing events...
                        </p>

                    </div>

                ) : events.length === 0 ? (

                    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] py-24 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-2xl text-slate-500">
                            <FaSearch />
                        </div>

                        <h3 className="mt-5 text-xl font-bold">
                            No events found
                        </h3>

                        <p className="mt-2 text-slate-500">
                            Try searching with another event title.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">

                        {events.map((event) => (

                            <div
                                key={event._id}
                                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:bg-white/[0.055] hover:shadow-blue-950/30"
                            >

                                {/* Image */}
                                <div className="relative h-56 overflow-hidden">

                                    {event.image ? (
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-950 to-purple-950 text-xl font-bold text-slate-400">
                                            {event.category || 'Event'}
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                                    {/* Price */}
                                    <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm font-black backdrop-blur-md">
                                        {event.ticketPrice === 0 ? (
                                            <span className="text-green-400">
                                                FREE
                                            </span>
                                        ) : (
                                            <span className="text-white">
                                                ₹{event.ticketPrice}
                                            </span>
                                        )}
                                    </div>

                                    {/* Category */}
                                    <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-300 backdrop-blur-md">
                                        {event.category}
                                    </div>

                                </div>

                                {/* Content */}
                                <div className="flex flex-col p-6">

                                    <h3 className="line-clamp-2 min-h-[56px] text-xl font-bold text-white">
                                        {event.title}
                                    </h3>

                                    <div className="mt-5 space-y-3 text-sm text-slate-400">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                                <FaCalendarAlt />
                                            </div>

                                            <span>
                                                {new Date(
                                                    event.date
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
                                                {event.location}
                                            </span>

                                        </div>

                                    </div>

                                    {/* Seats */}
                                    <div className="mt-6">

                                        <div className="mb-2 flex justify-between text-xs font-semibold">

                                            <span className="text-slate-500">
                                                Availability
                                            </span>

                                            <span className="text-slate-300">
                                                {event.availableSeats} /{' '}
                                                {event.totalSeats}
                                            </span>

                                        </div>

                                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">

                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                                style={{
                                                    width: `${Math.max(
                                                        0,
                                                        Math.min(
                                                            100,
                                                            (event.availableSeats /
                                                                event.totalSeats) *
                                                                100
                                                        )
                                                    )}%`
                                                }}
                                            />

                                        </div>

                                    </div>

                                    {/* Button */}
                                    <Link
                                        to={`/events/${event._id}`}
                                        className="group/button mt-6 flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3.5 font-bold text-white transition-all hover:bg-blue-600"
                                    >
                                        View Event Details

                                        <FaArrowRight className="text-xs transition-transform group-hover/button:translate-x-1" />
                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

            {/* =====================================================
                CTA
            ====================================================== */}

            <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">

                <div className="relative overflow-hidden rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-blue-950 via-purple-950 to-slate-950 px-8 py-16 text-center shadow-2xl shadow-blue-950/30 md:px-16">

                    <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

                    <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

                    <div className="relative">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-xl text-blue-300 backdrop-blur-md">
                            <FaStar />
                        </div>

                        <h2 className="mt-6 text-3xl font-black md:text-4xl">
                            Your next great experience is waiting.
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                            Explore upcoming events and find something worth
                            remembering.
                        </p>

                    </div>

                </div>

            </section>

            {/* =====================================================
                FOOTER
            ====================================================== */}

            <footer className="border-t border-white/10 bg-[#05070D]">

                <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">

                    <div className="flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
                                <FaTicketAlt />
                            </div>

                            <span className="text-xl font-black">
                                Eventora
                            </span>

                        </div>

                        <p className="max-w-md text-sm text-slate-500">
                            Discover, book and experience amazing events
                            through one powerful platform.
                        </p>

                        <p className="text-xs font-medium text-slate-600">
                            © {new Date().getFullYear()} Eventora
                        </p>

                    </div>

                </div>

            </footer>

        </div>
    );
};

export default Home;