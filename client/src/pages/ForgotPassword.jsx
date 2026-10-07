import React, { useState, useContext, useEffect, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaArrowRight,
    FaArrowLeft,
    FaCheckCircle,
    FaExclamationTriangle,
    FaSyncAlt,
    FaKey
} from 'react-icons/fa';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Request, 2: Reset Form, 3: Success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const { forgotPassword, resetPassword, resendOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    // Resend countdown timer
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    // Password strength computation
    const passwordStrength = useMemo(() => {
        if (!newPassword) return { score: 0, label: '', color: 'bg-slate-700', percent: '0%' };
        let score = 0;
        if (newPassword.length >= 8) score += 1;
        if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) score += 1;
        if (/\d/.test(newPassword)) score += 1;
        if (/[!@#$%^&*(),.?":{}|<>_\-]/.test(newPassword)) score += 1;

        switch (score) {
            case 1:
                return { score: 1, label: 'Weak', color: 'bg-red-500', percent: '25%' };
            case 2:
                return { score: 2, label: 'Fair', color: 'bg-amber-500', percent: '50%' };
            case 3:
                return { score: 3, label: 'Good', color: 'bg-blue-500', percent: '75%' };
            case 4:
                return { score: 4, label: 'Strong', color: 'bg-emerald-500', percent: '100%' };
            default:
                return { score: 0, label: 'Too Weak', color: 'bg-red-500', percent: '15%' };
        }
    }, [newPassword]);

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setError('');
        setInfoMessage('');

        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            await forgotPassword(email.trim().toLowerCase());
            setStep(2);
            setCountdown(60);
            setInfoMessage(`If an account exists for ${email.trim().toLowerCase()}, a 6-digit code has been sent.`);
        } catch (err) {
            setError(typeof err === 'string' ? err : err.message || 'Failed to process request.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setInfoMessage('');

        if (!otp || otp.trim().length !== 6) {
            setError('Please enter the 6-digit verification code.');
            return;
        }
        if (!newPassword) {
            setError('Please enter a new password.');
            return;
        }
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await resetPassword(email.trim().toLowerCase(), otp.trim(), newPassword);
            setStep(3);
        } catch (err) {
            setError(typeof err === 'string' ? err : err.message || 'Failed to reset password. Check your code and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0 || resendLoading) return;
        setResendLoading(true);
        setError('');
        try {
            await resendOTP(email.trim().toLowerCase(), 'password_reset');
            setInfoMessage('A fresh verification code has been sent to your email.');
            setCountdown(60);
        } catch (err) {
            setError(typeof err === 'string' ? err : err.message || 'Failed to resend code.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-72px)] bg-[#070A12] text-white flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background lighting */}
            <div className="pointer-events-none absolute -left-48 top-1/4 h-96 w-96 rounded-full bg-blue-600/15 blur-[130px]" />
            <div className="pointer-events-none absolute -right-48 bottom-1/4 h-96 w-96 rounded-full bg-purple-600/15 blur-[130px]" />

            <div className="relative w-full max-w-md mx-auto">
                <div className="relative rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-10 shadow-2xl shadow-black/60 backdrop-blur-2xl">
                    {/* Step 1: Request Password Reset */}
                    {step === 1 && (
                        <div>
                            <div className="mb-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-xl text-white shadow-lg shadow-blue-500/20 mb-4">
                                    <FaKey />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                    Reset Password
                                </h2>
                                <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                                    Enter the email associated with your account and we'll send you a 6-digit verification code.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-300">
                                    <FaExclamationTriangle className="mt-0.5 shrink-0 text-red-400" />
                                    <span className="flex-1 text-xs">{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleRequestReset} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                                        <input
                                            type="email"
                                            required
                                            autoFocus
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all focus:border-blue-500/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-blue-500/10"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 py-3.5 px-4 font-bold text-white shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.01] hover:shadow-blue-900/50 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                >
                                    <span>{loading ? 'Sending code...' : 'Send Verification Code'}</span>
                                    {!loading && <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />}
                                </button>
                            </form>

                            <div className="mt-8 text-center border-t border-white/10 pt-5">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                                >
                                    <FaArrowLeft className="text-[10px]" />
                                    <span>Back to Sign In</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Enter OTP & Set New Password */}
                    {step === 2 && (
                        <div>
                            <div className="mb-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep(1);
                                        setError('');
                                        setInfoMessage('');
                                    }}
                                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-3"
                                >
                                    <FaArrowLeft className="text-[10px]" />
                                    <span>Change email</span>
                                </button>
                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                    Set New Password
                                </h2>
                                <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                                    Enter the 6-digit code sent to <strong className="text-slate-200">{email}</strong> and create your new password.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-300">
                                    <FaExclamationTriangle className="mt-0.5 shrink-0 text-red-400" />
                                    <span className="flex-1 text-xs">{error}</span>
                                </div>
                            )}

                            {infoMessage && !error && (
                                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-3.5 text-sm text-blue-300">
                                    <FaCheckCircle className="mt-0.5 shrink-0 text-blue-400" />
                                    <span className="flex-1 text-xs">{infoMessage}</span>
                                </div>
                            )}

                            <form onSubmit={handleResetPassword} className="space-y-4">
                                {/* OTP */}
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
                                        className="w-full rounded-2xl border border-white/20 bg-white/[0.06] py-3.5 text-center text-2xl font-black tracking-[0.4em] text-cyan-300 outline-none backdrop-blur-xl transition-all focus:border-blue-500 focus:bg-white/[0.09] focus:ring-4 focus:ring-blue-500/20"
                                    />
                                    <div className="flex items-center justify-between text-xs pt-1.5">
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

                                {/* New Password */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            placeholder="At least 8 characters"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
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

                                    {/* Strength Meter */}
                                    {newPassword.length > 0 && (
                                        <div className="mt-2 space-y-1.5">
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="text-slate-400">Strength:</span>
                                                <span className={`font-bold ${
                                                    passwordStrength.score >= 3 ? 'text-emerald-400' : passwordStrength.score === 2 ? 'text-amber-400' : 'text-red-400'
                                                }`}>
                                                    {passwordStrength.label}
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                                    style={{ width: passwordStrength.percent }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm New Password */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            placeholder="Re-enter your new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-12 text-sm text-white placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all focus:border-blue-500/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-blue-500/10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none"
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 py-3.5 px-4 font-bold text-white shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.01] hover:shadow-blue-900/50 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-3"
                                >
                                    <span>{loading ? 'Updating password...' : 'Update Password'}</span>
                                    {!loading && <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step 3: Success State */}
                    {step === 3 && (
                        <div className="text-center py-4 space-y-6 animate-in zoom-in-95 duration-300">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20 text-3xl text-green-400 border border-green-500/30 shadow-lg shadow-green-500/10">
                                <FaCheckCircle />
                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-white">
                                    Password Reset Complete
                                </h2>
                                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                                    Your password has been successfully updated. You can now sign in with your new credentials.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate('/login', {
                                    state: { message: 'Password reset successfully. Please sign in.' }
                                })}
                                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 py-3.5 px-4 font-bold text-white shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.01] hover:shadow-blue-900/50"
                            >
                                <span>Proceed to Sign In</span>
                                <FaArrowRight className="text-xs" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

