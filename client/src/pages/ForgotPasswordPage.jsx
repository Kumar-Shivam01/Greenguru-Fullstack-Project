import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiArrowLeft,
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiCheckCircle,
    FiArrowRight,
    FiRefreshCw,
    FiFeather
} from 'react-icons/fi';
import { sendResetPasswordOtp, resetPassword } from '../api/authApi';

function ForgotPasswordPage() {
    const navigate = useNavigate();

    // Step 1: 'send-otp' | Step 2: 'reset-password' | Step 3: 'success'
    const [step, setStep] = useState('send-otp');

    // Form inputs
    const [email, setEmail] = useState('');
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI state
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    const otpInputRefs = useRef([]);

    // Countdown timer for resending OTP
    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    // Handle Step 1: Send Reset OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        try {
            setLoading(true);
            const response = await sendResetPasswordOtp(email.trim());
            setSuccessMsg(response?.message || 'A 6-digit reset code has been sent to your email.');
            setStep('reset-password');
            setResendCooldown(60);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to send reset code. Please check your email.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP Box Typing
    const handleOtpChange = (index, value) => {
        // Only accept numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otpDigits];
        // Handle pasted string
        if (value.length > 1) {
            const pasted = value.slice(0, 6).split('');
            pasted.forEach((char, i) => {
                if (i < 6) newOtp[i] = char;
            });
            setOtpDigits(newOtp);
            const nextIndex = Math.min(pasted.length, 5);
            otpInputRefs.current[nextIndex]?.focus();
            return;
        }

        newOtp[index] = value;
        setOtpDigits(newOtp);

        // Auto-advance to next input
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    // Handle Resend OTP in Step 2
    const handleResendOtp = async () => {
        if (resendCooldown > 0 || resendLoading) return;
        setError('');
        try {
            setResendLoading(true);
            const response = await sendResetPasswordOtp(email.trim());
            setSuccessMsg(response?.message || 'New reset code sent successfully.');
            setResendCooldown(60);
        } catch (err) {
            const msg = err.response?.data?.message || 'Unable to resend reset code.';
            setError(msg);
        } finally {
            setResendLoading(false);
        }
    };

    // Handle Step 2: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        const otp = otpDigits.join('');
        if (otp.length < 6) {
            setError('Please enter the full 6-digit verification code.');
            return;
        }

        if (!newPassword) {
            setError('Please enter a new password.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            setLoading(true);
            await resetPassword({
                email: email.trim(),
                otp: otp.trim(),
                newPassword: newPassword
            });
            setStep('success');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to reset password. Please verify the code.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-emerald-50 via-stone-50 to-green-50">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-100 p-6 sm:p-10 relative overflow-hidden">
                {/* Background decorative glow */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-green-100/50 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10" />

                {/* GreenGuru Header */}
                <div className="flex items-center justify-between mb-8 relative">
                    <Link
                        to="/login"
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200 text-forest-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all shadow-xs"
                        title="Back to Login"
                    >
                        <FiArrowLeft className="h-5 w-5" />
                    </Link>

                    <div className="inline-flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-hero text-white shadow-xs">
                            <FiFeather className="h-4 w-4" />
                        </div>
                        <span className="text-base font-bold tracking-tight text-forest-800">GreenGuru</span>
                    </div>

                    <div className="w-10" /> {/* Spacer for symmetry */}
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 rounded-2xl border border-red-100 bg-red-50/90 p-4 flex items-start gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-xs">
                            !
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-red-800">Action Failed</p>
                            <p className="text-xs text-red-600 mt-0.5 leading-relaxed">{error}</p>
                        </div>
                    </div>
                )}

                {/* Success Banner */}
                {successMsg && step !== 'success' && (
                    <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50/90 p-3.5 flex items-center gap-2.5 text-xs text-emerald-800 font-medium">
                        <FiCheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{successMsg}</span>
                    </div>
                )}

                {/* ── STEP 1: Enter Email ───────────────────────────── */}
                {step === 'send-otp' && (
                    <div>
                        <div className="mb-6">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-forest-800">
                                Forgot password?
                            </h1>
                            <p className="text-sm text-forest-500 mt-2 leading-relaxed">
                                No worries! Enter your account email address and we'll send you a 6-digit verification code to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-2">
                                    Account Email
                                </label>
                                <div className="relative group">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-forest-400 group-focus-within:text-emerald-600 transition-colors">
                                        <FiMail className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your.email@example.com"
                                        className="w-full rounded-2xl border-2 border-stone-200 bg-white pl-12 pr-4 py-3.5 text-sm text-forest-800 placeholder:text-stone-400 transition-all duration-200 hover:border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-xs"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full rounded-2xl gradient-hero px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-900/25 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 text-sm"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Sending Code...
                                        </>
                                    ) : (
                                        <>
                                            Send Reset Code
                                            <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-500 hover:text-emerald-700 transition-colors"
                            >
                                <FiArrowLeft className="h-3.5 w-3.5" />
                                Remember your password? Sign in
                            </Link>
                        </div>
                    </div>
                )}

                {/* ── STEP 2: Verify OTP & Set New Password ──────────── */}
                {step === 'reset-password' && (
                    <div>
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold tracking-tight text-forest-800">
                                Enter Reset Code
                            </h1>
                            <p className="text-xs text-forest-500 mt-1.5 leading-relaxed">
                                We sent a 6-digit verification code to <span className="font-semibold text-forest-800">{email}</span>.{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep('send-otp');
                                        setError('');
                                    }}
                                    className="text-emerald-600 hover:underline font-medium"
                                >
                                    Change
                                </button>
                            </p>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-4">
                            {/* 6-Digit OTP Boxes */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-2">
                                    6-Digit Verification Code
                                </label>
                                <div className="flex items-center justify-between gap-2">
                                    {otpDigits.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            ref={(el) => (otpInputRefs.current[idx] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                            className="w-11 sm:w-12 h-13 text-center text-xl font-bold text-forest-800 border-2 border-stone-200 rounded-xl bg-stone-50/50 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-xs outline-none"
                                        />
                                    ))}
                                </div>

                                {/* Resend Code Timer */}
                                <div className="mt-2.5 flex items-center justify-between text-xs">
                                    <span className="text-stone-400">Didn't receive the code?</span>
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={resendCooldown > 0 || resendLoading}
                                        className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 disabled:text-stone-400 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <FiRefreshCw className={`h-3 w-3 ${resendLoading ? 'animate-spin' : ''}`} />
                                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label htmlFor="newPassword" className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-1.5">
                                    New Password
                                </label>
                                <div className="relative group">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-forest-400 group-focus-within:text-emerald-600 transition-colors">
                                        <FiLock className="h-4 w-4" />
                                    </div>
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? 'text' : 'password'}
                                        required
                                        minLength={6}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Minimum 6 characters"
                                        className="w-full rounded-2xl border-2 border-stone-200 bg-white pl-10 pr-10 py-3 text-sm text-forest-800 placeholder:text-stone-400 transition-all hover:border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword((p) => !p)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-forest-400 hover:text-emerald-600 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showNewPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-1.5">
                                    Confirm New Password
                                </label>
                                <div className="relative group">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-forest-400 group-focus-within:text-emerald-600 transition-colors">
                                        <FiLock className="h-4 w-4" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        minLength={6}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter your password"
                                        className="w-full rounded-2xl border-2 border-stone-200 bg-white pl-10 pr-10 py-3 text-sm text-forest-800 placeholder:text-stone-400 transition-all hover:border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((p) => !p)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-forest-400 hover:text-emerald-600 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full rounded-2xl gradient-hero px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-900/25 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 text-sm mt-2"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Resetting Password...
                                        </>
                                    ) : (
                                        <>
                                            Save New Password
                                            <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>
                    </div>
                )}

                {/* ── STEP 3: Success Screen ────────────────────────── */}
                {step === 'success' && (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-600/15">
                            <FiCheckCircle className="h-8 w-8" />
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-forest-800">
                            Password Reset!
                        </h2>

                        <p className="text-xs text-forest-500 mt-2 leading-relaxed max-w-xs mx-auto">
                            Your password has been updated successfully. You can now log in using your new credentials.
                        </p>

                        <div className="mt-8">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full rounded-2xl gradient-hero px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-900/25 hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2"
                            >
                                Return to Sign In
                                <FiArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default ForgotPasswordPage;