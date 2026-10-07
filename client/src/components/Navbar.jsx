import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    FaTicketAlt,
    FaArrowRight,
    FaUserCircle,
    FaSignOutAlt,
    FaRobot
} from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#070A12]/90 shadow-xl shadow-black/20 backdrop-blur-xl">

            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

                <div className="flex min-h-[72px] items-center justify-between">

                    {/* ================= LOGO ================= */}

                    <Link
                        to="/"
                        className="group flex items-center gap-3"
                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg text-white shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
                            <FaTicketAlt />
                        </div>

                        <div className="hidden sm:block">

                            <span className="block text-xl font-black tracking-tight text-white">
                                Eventora
                            </span>

                            <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                Events made easy
                            </span>

                        </div>

                    </Link>

                    {/* ================= NAVIGATION ================= */}

                    <div className="flex items-center gap-1.5 sm:gap-2">

                        {/* Events */}

                        <Link
                            to="/events"
                            className={`rounded-xl px-3 py-2 text-sm font-semibold transition-all sm:px-4 ${
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
                            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all sm:px-4 ${
                                isActive('/ai-assistant')
                                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-900/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <FaRobot className="text-blue-400 text-xs sm:text-sm" />
                            <span>AI Assistant</span>
                        </Link>

                        {user ? (
                            <>

                                {/* Dashboard */}

                                <Link
                                    to={
                                        user.role === 'admin'
                                            ? '/admin'
                                            : '/dashboard'
                                    }
                                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all sm:px-4 ${
                                        isActive(
                                            user.role === 'admin'
                                                ? '/admin'
                                                : '/dashboard'
                                        )
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-900/30'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >

                                    <FaUserCircle className="hidden sm:block" />

                                    Dashboard

                                </Link>

                                {/* User */}

                                <div className="ml-2 hidden items-center gap-2 border-l border-white/10 pl-4 lg:flex">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-400/20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-sm font-bold text-blue-300">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="max-w-[130px]">

                                        <p className="truncate text-sm font-bold text-slate-200">
                                            {user.name}
                                        </p>

                                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                                            {user.role}
                                        </p>

                                    </div>

                                </div>

                                {/* Logout */}

                                <button
                                    onClick={handleLogout}
                                    className="ml-1 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-semibold text-slate-400 transition-all hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 sm:px-4"
                                >

                                    <FaSignOutAlt className="hidden sm:block" />

                                    Logout

                                </button>

                            </>
                        ) : (
                            <>

                                {/* Login */}

                                <Link
                                    to="/login"
                                    className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 transition-all hover:bg-white/5 hover:text-white sm:px-4"
                                >
                                    Login
                                </Link>

                                {/* Sign Up */}

                                <Link
                                    to="/register"
                                    className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-900/30 transition-all hover:-translate-y-0.5 hover:shadow-blue-900/50 sm:px-5"
                                >

                                    Sign Up

                                    <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />

                                </Link>

                            </>
                        )}

                    </div>

                </div>

            </div>

        </nav>
    );
};

export default Navbar;