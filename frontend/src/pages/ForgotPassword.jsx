import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/api';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const otpRefs = useRef([]);
    const navigate = useNavigate();

    // Send OTP handler
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your registered email");

        setLoading(true);
        try {
            const res = await forgotPassword({ email });
            toast.success(res.data.message || "OTP code sent to email!");
            
            // For development fallback convenience
            if (res.data.devOtp) {
                toast.success(`OTP Code: ${res.data.devOtp} (Enter below)`, { duration: 10000 });
            }
            
            setStep(2);
        } catch (err) {
            console.error("Forgot password request failed:", err);
            toast.error(err.response?.data?.message || "Failed to request password reset");
        } finally {
            setLoading(false);
        }
    };

    // OTP Input Change
    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value !== '' && index < 5) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    // Reset Password handler
    const handleResetPassword = async (e) => {
        e.preventDefault();
        const fullOtp = otp.join('');
        if (fullOtp.length !== 6) return toast.error("Please enter a valid 6-digit OTP code");
        if (newPassword.length < 8) return toast.error("Password must be at least 8 characters");

        setLoading(true);
        try {
            const res = await resetPassword({ email, otp: fullOtp, newPassword });
            toast.success(res.data.message || "Password reset successfully!");
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            console.error("Password reset failed:", err);
            toast.error(err.response?.data?.message || "Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-1 w-full font-sans transition-colors duration-300">
            {/* Left Info/Hero Section */}
            <div className="hidden lg:flex flex-col justify-between w-[40%] bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-black p-12 text-white relative overflow-hidden border-r border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
                
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 font-bold text-xl relative z-10">
                    <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shadow-md">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    </div>
                    HackConnect
                </Link>

                {/* Content */}
                <div className="relative z-10 max-w-sm">
                    <h2 className="text-3xl font-extrabold mb-4 tracking-tight leading-tight">Reset your password quickly and securely.</h2>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">Verify your email address using a secure OTP code, and enter your new password to regain access to the platform.</p>
                </div>

                {/* Footer */}
                <div className="relative z-10 text-xs text-slate-500 font-medium">
                    © 2026 HackConnect. All rights reserved.
                </div>
            </div>

            {/* Right Form Section */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-20 lg:px-24 xl:px-32 py-10 relative bg-[#090b11]">
                <div className="max-w-[400px] w-full mx-auto">
                    
                    {/* Logo (Visible only on mobile/tablet) */}
                    <div className="flex lg:hidden items-center gap-2 font-bold text-xl text-white mb-8">
                        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                        </div>
                        HackConnect
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white">Reset Password</h1>
                        <p className="text-blue-500/80 text-sm font-medium">
                            {step === 1 
                                ? "Enter your email to receive a password reset code." 
                                : "Check your email and enter the OTP code to set your new password."}
                        </p>
                    </div>

                    {step === 1 ? (
                        /* --- STEP 1: REQUEST OTP --- */
                        <form onSubmit={handleSendOtp} className="space-y-5 animate-fadeIn">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">College Email</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-3.5 text-slate-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></span>
                                    <input type="email" name="email" required placeholder="student@university.edu" value={email} onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-[#0e111a] border border-white/5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm text-white placeholder-slate-600 outline-none" />
                                </div>
                            </div>
                            
                            <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 disabled:opacity-50">
                                {loading ? 'SENDING OTP...' : 'SEND OTP CODE'}
                            </button>

                            <div className="text-center mt-6">
                                <Link to="/login" className="text-xs text-slate-400 hover:text-white font-bold transition-colors">
                                    ← Back to login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        /* --- STEP 2: VERIFY AND RESET --- */
                        <form onSubmit={handleResetPassword} className="space-y-5 animate-fadeIn">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">Enter 6-Digit OTP Code</label>
                                <div className="flex justify-between gap-2 max-w-[320px] mx-auto mb-4">
                                    {otp.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            ref={el => otpRefs.current[idx] = el}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={e => handleOtpChange(idx, e.target.value)}
                                            onKeyDown={e => handleOtpKeyDown(idx, e)}
                                            className="w-10 h-12 text-center text-lg font-bold bg-[#0e111a] border border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white outline-none"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">New Password</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-3.5 text-slate-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg></span>
                                    <input type={showPassword ? "text" : "password"} name="newPassword" required placeholder="Min. 8 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                        className="w-full pl-10 pr-10 py-3 bg-[#0e111a] border border-white/5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm text-white placeholder-slate-600 outline-none font-mono" />
                                    <button type="button" className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEyeSlash className="w-4.5 h-4.5" /> : <FaEye className="w-4.5 h-4.5" />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 disabled:opacity-50">
                                {loading ? 'RESETTING PASSWORD...' : 'CONFIRM PASSWORD RESET'}
                            </button>

                            <div className="text-center mt-6">
                                <button type="button" onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-white font-bold transition-colors">
                                    ← Request new OTP code
                                </button>
                            </div>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
}
