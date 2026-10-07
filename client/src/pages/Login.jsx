import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaArrowRight,
    FaShieldAlt,
    FaTicketAlt,
    FaCheckCircle,
    FaExclamationTriangle,
    FaSyncAlt,
    FaArrowLeft,
    FaRobot
} from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const { login, verifyOTP, resendOTP } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Restore remembered email if available
    useEffect(() => {
        const savedEmail = localStorage.getItem('eventora_remembered_email');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
        if (location.state?.message) {
            setInfoMessage(location.state.message);
        }
    }, [location.state]);

    // Resend countdown timer
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const validateForm = () => {
        if (!email.trim()) {
            setError('Please enter your email address.');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (!password) {
            setError('Please enter your password.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setInfoMessage('');

        if (!showOTP) {
            if (!validateForm()) return;
            setLoading(true);
            try {
                if (rememberMe) {
                    localStorage.setItem('eventora_remembered_email', email.trim());
                } else {
                    localStorage.removeItem('eventora_remembered_email');
                }

                const data = await login(email.trim().toLowerCase(), password);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            } catch (err) {
                if (err.needsVerification) {
                    setShowOTP(true);
                    setCountdown(60);
                    setInfoMessage('Your account is not verified yet. A verification code has been sent to your email.');
                } else {
                    setError(typeof err === 'string' ? err : err.message || 'Invalid email or password.');
                }
            } finally {
                setLoading(false);
            }
        } else {
            if (!otp || otp.trim().length !== 6) {
                setError('Please enter the 6-digit verification code.');
                return;
            }
            setLoading(true);
            try {
                const data = await verifyOTP(email.trim().toLowerCase(), otp.trim());
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            } catch (err) {
                setError(typeof err === 'string' ? err : err.message || 'Invalid or expired verification code.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleResend = async () => {
        if (countdown > 0 || resendLoading) return;
        setResendLoading(true);
        setError('');
        try {
            await resendOTP(email.trim().toLowerCase(), 'account_verification');
            setInfoMessage('A fresh verification code has been sent to your email.');
            setCountdown(60);
        } catch (err) {
            setError(typeof err === 'string' ? err : err.message || 'Failed to resend verification code.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-72px)] bg-[#070A12] text-white flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background lighting effects */}
            <div className="pointer-events-none absolute -left-48 top-1/4 h-96 w-96 rounded-full bg-blue-600/15 blur-[130px]" />
            <div className="pointer-events-none absolute -right-48 bottom-1/4 h-96 w-96 rounded-full bg-purple-600/15 blur-[130px]" />
            <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-64 w-[600px] rounded-full bg-cyan-500/10 blur-[140px]" />

            <div className="relative w-full max-w-5xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
                {/* Left Side: Brand & Feature Highlights (Desktop) */}
                <div className="hidden lg:block lg:col-span-5 space-y-8 pr-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-400">
                        <FaShieldAlt className="text-sm" />
                        <span>Secure Event Platform</span>
                    </div>

                    <div>
                        <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-tight">
                            Welcome back to{' '}
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                Eventora.
                            </span>
                        </h1>
                        <p className="mt-4 text-slate-400 text-base leading-relaxed">
                            Sign in to access your tickets, explore upcoming summits and workshops, and connect with vibrant event communities.
                        </p>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-white/5 bg-white/[0.02]">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                <FaTicketAlt />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-200">Instant Access to Bookings</h4>
                                <p className="text-xs text-slate-400 mt-0.5">Manage tickets, check seat availability, and view event itineraries anytime.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-white/5 bg-white/[0.02]">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                <FaRobot />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-200">AI Event Assistant</h4>
                                <p className="text-xs text-slate-400 mt-0.5">Get personalized recommendations based on your favorite cities and categories.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-white/5 bg-white/[0.02]">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                                <FaCheckCircle />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-200">Verified & Protected</h4>
                                <p className="text-xs text-slate-400 mt-0.5">Enterprise-grade security with OTP email verification and encrypted logins.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Authentication Card */}
                <div className="w-full lg:col-span-7 max-w-md mx-auto lg:max-w-none">
                    <div className="relative rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-10 shadow-2xl shadow-black/60 backdrop-blur-2xl">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                    {showOTP ? 'Verify Account' : 'Sign In'}
                                </h2>
                                {showOTP && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowOTP(false);
                                            setError('');
                                            setInfoMessage('');
                                        }}
                                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                                    >
                                        <FaArrowLeft className="text-[10px]" />
                                        <span>Back</span>
                                    </button>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-slate-400">
                                {showOTP
                                    ? `Enter the 6-digit verification code sent to ${email}`
                                    : 'Sign in to continue to your Eventora account.'}
                            </p>
                        </div>

                        {/* Alerts */}
                        {error && (
                            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-300 animate-in fade-in duration-200">
                                <FaExclamationTriangle className="mt-0.5 shrink-0 text-red-400" />
                                <span className="flex-1 text-xs sm:text-sm">{error}</span>
                            </div>
                        )}

                        {infoMessage && !error && (
                            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-3.5 text-sm text-blue-300 animate-in fade-in duration-200">
                                <FaCheckCircle className="mt-0.5 shrink-0 text-blue-400" />
                                <span className="flex-1 text-xs sm:text-sm">{infoMessage}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!showOTP ? (
                                <>
                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                                            <input
                                                type="email"
                                                required
                                                autoComplete="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all focus:border-blue-500/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-blue-500/10"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                                Password
                                            </label>
                                            <Link
                                                to="/forgot-password"
                                                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-12 text-sm text-white placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all focus:border-blue-500/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-blue-500/10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none"
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remember Me */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            type="checkbox"
                                            id="rememberMe"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="h-4 w-4 rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                                        />
                                        <label
                                            htmlFor="rememberMe"
                                            className="text-xs text-slate-400 cursor-pointer select-none hover:text-slate-300"
                                        >
                                            Remember my email on this device
                                        </label>
                                    </div>
                                </>
                            ) : (
                                /* OTP Verification Mode */
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 text-center">
                                            6-Digit Verification Code
                                        </label>
                                        <input
                                            type="text"
                                            maxLength="6"
                                            required
                                            autoFocus
                                            placeholder="000000"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            className="w-full rounded-2xl border border-white/20 bg-white/[0.06] py-4 text-center text-2xl font-black tracking-[0.4em] text-cyan-300 outline-none backdrop-blur-xl transition-all focus:border-blue-500 focus:bg-white/[0.09] focus:ring-4 focus:ring-blue-500/20"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between text-xs pt-1">
                                        <span className="text-slate-400">Didn't receive code?</span>
                                        <button
                                            type="button"
                                            onClick={handleResend}
                                            disabled={countdown > 0 || resendLoading}
                                            className="font-bold text-blue-400 hover:text-blue-300 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center gap-1.5"
                                        >
                                            <FaSyncAlt className={`text-[10px] ${resendLoading ? 'animate-spin' : ''}`} />
                                            <span>
                                                {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 py-3.5 px-4 font-bold text-white shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.01] hover:shadow-blue-900/50 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                            >
                                <span>
                                    {loading
                                        ? 'Signing in...'
                                        : showOTP
                                        ? 'Verify & Complete Sign In'
                                        : 'Sign In'}
                                </span>
                                {!loading && (
                                    <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center border-t border-white/10 pt-5">
                            <p className="text-xs text-slate-400">
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className="font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                                >
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
