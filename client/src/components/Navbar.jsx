import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    FaTicketAlt,
    FaArrowRight,
    FaUserCircle,
    FaSignOutAlt,
    FaRobot,
    FaBars,
    FaTimes
} from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Close mobile menu whenever location changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#070A12]/90 shadow-xl shadow-black/20 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex min-h-[72px] items-center justify-between">
                    {/* ================= LOGO ================= */}
                    <Link
                        to="/"
                        className="group flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg text-white shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
                            <FaTicketAlt />
                        </div>

                        <div>
                            <span className="block text-xl font-black tracking-tight text-white">
                                Eventora
                            </span>
                            <span className="hidden sm:block text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                Events made easy
                            </span>
                        </div>
                    </Link>

                    {/* ================= DESKTOP NAVIGATION ================= */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Events */}
                        <Link
                            to="/events"
                            className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                                isActive('/events')
                                    ? 'bg-blue-500/10 text-blue-400'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            Events
                        </Link>

                        {/* AI Assistant */}
                        <Link
                            to="/ai-assistant"
                            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                                isActive('/ai-assistant')
                                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-900/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <FaRobot className="text-blue-400 text-xs" />
                            <span>AI Assistant</span>
                        </Link>

                        {user ? (
                            <>
                                {/* Dashboard */}
                                <Link
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                    className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                                        isActive(user.role === 'admin' ? '/admin' : '/dashboard')
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-900/30'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <FaUserCircle />
                                    Dashboard
                                </Link>

                                {/* User info */}
                                <div className="ml-2 flex items-center gap-2 border-l border-white/10 pl-4">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-400/20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-sm font-bold text-blue-300">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="max-w-[120px]">
                                        <p className="truncate text-sm font-bold text-slate-200">
                                            {user.name}
                                        </p>
                                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                                            {user.role}
                                        </p>
                                    </div>
                                </div>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="ml-1 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-semibold text-slate-400 transition-all hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                                >
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Login */}
                                <Link
                                    to="/login"
                                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                                        isActive('/login')
                                            ? 'bg-white/10 text-white'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    Login
                                </Link>

                                {/* Sign Up */}
                                <Link
                                    to="/register"
                                    className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-900/30 transition-all hover:-translate-y-0.5 hover:shadow-blue-900/50"
                                >
                                    <span>Sign Up</span>
                                    <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* ================= MOBILE HAMBURGER BUTTON ================= */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300 transition-all hover:bg-white/10 hover:text-white focus:outline-none"
                        >
                            {mobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
                        </button>
                    </div>
                </div>

                {/* ================= MOBILE DROPDOWN MENU ================= */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-white/10 py-4 px-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Link
                            to="/events"
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                                isActive('/events')
                                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                                    : 'text-slate-300 hover:bg-white/5'
                            }`}
                        >
                            <FaTicketAlt className="text-blue-400" />
                            Events
                        </Link>

                        <Link
                            to="/ai-assistant"
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                                isActive('/ai-assistant')
                                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                                    : 'text-slate-300 hover:bg-white/5'
                            }`}
                        >
                            <FaRobot className="text-purple-400" />
                            AI Assistant
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                                        isActive(user.role === 'admin' ? '/admin' : '/dashboard')
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                            : 'text-slate-300 hover:bg-white/5'
                                    }`}
                                >
                                    <FaUserCircle className="text-blue-400" />
                                    <span>Dashboard ({user.name})</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all text-left"
                                >
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
                                <Link
                                    to="/login"
                                    className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-center text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-900/30"
                                >
                                    <span>Sign Up</span>
                                    <FaArrowRight className="text-xs" />
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;