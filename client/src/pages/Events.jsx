import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';

import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaSearch,
    FaTicketAlt,
    FaArrowRight,
    FaFire,
    FaChair
} from 'react-icons/fa';

const Events = () => {
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

            const { data } = await api.get(
                `/events?search=${encodeURIComponent(search)}`
            );

            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#070A12] text-white">

            {/* Background Glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[130px]" />
                <div className="absolute -right-40 top-60 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[130px]" />
            </div>

            {/* Main Content */}
            <main className="relative w-full max-w-7xl mx-auto px-5 sm:px-8 py-12 md:py-16">

                {/* Header */}
                <div className="mb-10">

                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                        <FaFire />
                        Explore Eventora
                    </div>

                    <div className="mt-3 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                                Discover Events
                            </h1>

                            <p className="mt-3 max-w-2xl text-slate-400 text-lg">
                                Find workshops, conferences, festivals and experiences
                                worth remembering.
                            </p>
                        </div>

                        <div className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-400">
                            {events.length}{' '}
                            {events.length === 1 ? 'event' : 'events'} available
                        </div>

                    </div>
                </div>

                {/* Search */}
                <div className="relative group mb-12">

                    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />

                    <input
                        type="text"
                        placeholder="Search events by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.05] py-5 pl-14 pr-6 text-white outline-none backdrop-blur-xl transition-all placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-blue-500/10"
                    />

                </div>

                {/* Loading */}
                {loading ? (

                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-28 text-center">

                        <div className="mx-auto mb-5 h-11 w-11 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />

                        <p className="font-medium text-slate-500">
                            Finding amazing events...
                        </p>

                    </div>

                ) : events.length === 0 ? (

                    /* No Events */
                    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] py-28 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-2xl text-slate-500">
                            <FaSearch />
                        </div>

                        <h2 className="mt-5 text-2xl font-bold">
                            No events found
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Try searching with another event title.
                        </p>

                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
                            >
                                Clear Search
                            </button>
                        )}

                    </div>

                ) : (

                    /* Event Grid */
                    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">

                        {events.map((event) => {

                            const availabilityPercentage =
                                event.totalSeats > 0
                                    ? Math.max(
                                        0,
                                        Math.min(
                                            100,
                                            (event.availableSeats /
                                                event.totalSeats) *
                                            100
                                        )
                                    )
                                    : 0;

                            const isSoldOut = event.availableSeats <= 0;

                            return (
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

                                        {/* Image Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

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
                                            {event.category || 'Event'}
                                        </div>

                                        {/* Sold Out */}
                                        {isSoldOut && (
                                            <div className="absolute bottom-4 right-4 rounded-full bg-red-500/90 px-3 py-1.5 text-xs font-bold text-white">
                                                SOLD OUT
                                            </div>
                                        )}

                                    </div>

                                    {/* Card Content */}
                                    <div className="flex flex-col p-6">

                                        <h2 className="line-clamp-2 min-h-[56px] text-xl font-bold text-white">
                                            {event.title}
                                        </h2>

                                        {/* Date & Location */}
                                        <div className="mt-5 space-y-3 text-sm text-slate-400">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                                    <FaCalendarAlt />
                                                </div>

                                                <span>
                                                    {new Date(event.date).toLocaleDateString(
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

                                        {/* Availability */}
                                        <div className="mt-6">

                                            <div className="mb-2 flex justify-between text-xs font-semibold">

                                                <span className="text-slate-500">
                                                    Availability
                                                </span>

                                                <span className="text-slate-300">
                                                    {event.availableSeats} / {event.totalSeats}
                                                </span>

                                            </div>

                                            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">

                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                                    style={{
                                                        width: `${availabilityPercentage}%`
                                                    }}
                                                />

                                            </div>

                                        </div>

                                        {/* View Button */}
                                        <Link
                                            to={`/events/${event._id}`}
                                            className="group/button mt-6 flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3.5 font-bold text-white transition-all hover:bg-blue-600"
                                        >
                                            <FaTicketAlt />

                                            View Event Details

                                            <FaArrowRight className="text-xs transition-transform group-hover/button:translate-x-1" />

                                        </Link>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                )}

            </main>
        </div>
    );
};

export default Events;