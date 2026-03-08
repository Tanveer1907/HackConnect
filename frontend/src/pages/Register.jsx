import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.error("All fields are required.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address.");
            return false;
        }
        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            toast.success("Account created successfully!");
            navigate('/login');
        } catch (err) {
            console.error("Registration failed", err);
            toast.error(err.response?.data?.message || 'Failed to create account.');
            // Fallback for UI testing
            // navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    const handleGithubLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/github';
    };

    return (
        <div className="flex min-h-screen font-sans text-white" style={{ backgroundColor: '#13151a' }}>
            {/* Left Form Section */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-20 lg:px-24 xl:px-32 py-6 relative">
                <div className="max-w-[400px] w-full mx-auto">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white mb-8">
                        <div className="w-8 h-8 rounded shrink-0 bg-blue-600 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H20V8L16 12L20 16V20H4V16L8 12L4 8V4Z" fill="white" />
                            </svg>
                        </div>
                        HackConnect
                    </Link>

                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create your account</h1>
                        <p className="text-violet-500/80 mb-6 text-sm font-medium">Join the community of student builders today.</p>

                        {/* Social Buttons */}
                        <div className="flex gap-4 mb-5">
                            <button onClick={handleGoogleLogin} type="button" className="flex-1 flex justify-center items-center gap-2 py-2.5 px-4 border border-slate-700/50 rounded-full bg-slate-800/20 text-sm font-semibold text-white hover:bg-slate-800 transition">
                                <FcGoogle className="w-4 h-4" />
                                Google
                            </button>
                            <button onClick={handleGithubLogin} type="button" className="flex-1 flex justify-center items-center gap-2 py-2.5 px-4 border border-slate-700/50 rounded-full bg-slate-800/20 text-sm font-semibold text-white hover:bg-slate-800 transition">
                                <FaGithub className="w-4 h-4" />
                                GitHub
                            </button>
                        </div>

                        <div className="relative flex items-center py-2 mb-6">
                            <div className="flex-grow border-t mt-1 border-[#1a1d2d]"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-500 text-[10px] font-bold uppercase py-1 px-4 tracking-widest bg-[#151722] rounded-full border border-[#1a1d2d]">or continue with email</span>
                            <div className="flex-grow border-t mt-1 border-[#1a1d2d]"></div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1.5" htmlFor="name">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    aria-label="Full Name"
                                    placeholder="Alex Rivera"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#1a1d2d] border border-transparent rounded-2xl focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition text-sm placeholder-slate-500 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1.5" htmlFor="email">College Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    aria-label="College Email"
                                    placeholder="name@college.edu"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#1a1d2d] border border-transparent rounded-2xl focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition text-sm placeholder-slate-500 text-white"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5" htmlFor="password">Password</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                        </span>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            aria-label="Password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-10 py-3 bg-[#1a1d2d] border border-transparent rounded-2xl focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition text-sm placeholder-slate-500 text-white font-mono"
                                        />
                                        <button
                                            type="button"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5" htmlFor="confirmPassword">Confirm</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                        </span>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            aria-label="Confirm Password"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-10 py-3 bg-[#1a1d2d] border border-transparent rounded-2xl focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition text-sm placeholder-slate-500 text-white font-mono"
                                        />
                                        <button
                                            type="button"
                                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
                                            onClick={toggleConfirmPasswordVisibility}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2 pb-4">
                                <input id="terms" type="checkbox" className="w-4 h-4 border-gray-600 rounded text-violet-600 focus:ring-violet-600 bg-transparent accent-violet-600" required />
                                <span className="text-xs text-slate-400">
                                    I agree to the <a href="#" className="text-violet-500 font-bold hover:text-violet-400 hover:underline">Terms of Service</a> and <a href="#" className="text-violet-500 font-bold hover:text-violet-400 hover:underline">Privacy Policy</a>
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3.5 px-4 rounded-full text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-600/30 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                        Creating Account...
                                    </div>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </form>

                        <div className="text-center mt-6 text-sm text-slate-400 font-medium">
                            Already have an account? <Link to="/login" className="text-violet-500 font-bold hover:text-violet-400 transition-colors">Log In</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Banner Section */}
            <div className="hidden lg:flex lg:flex-1 relative items-center justify-center p-6 bg-[#13151a]">
                <div className="w-full h-[90%] max-h-[700px] rounded-[28px] overflow-hidden relative border border-slate-800" style={{ backgroundColor: '#1c1e2d' }}>
                    <div className="absolute inset-x-0 inset-y-0 bg-gradient-to-b from-[#22253a] to-[#1c1e2d]"></div>

                    <div className="relative z-10 p-10 h-full flex flex-col justify-center max-w-lg mx-auto">
                        <div className="inline-flex items-center bg-violet-600/20 border border-violet-500/30 rounded-full px-4 py-1.5 mb-6 w-max">
                            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">New Cohort Starting</span>
                        </div>

                        <h2 className="text-[2rem] xl:text-[2.25rem] font-extrabold text-white mb-5 leading-[1.15]">Join 24k+ students building the future</h2>
                        <p className="text-slate-300 text-sm xl:text-base leading-relaxed mb-10">
                            The world's largest ecosystem for student innovators. Connect with top-tier developers and award-winning designers.
                        </p>

                        {/* Features List */}
                        <div className="space-y-4 mb-10">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500 border border-violet-500/20">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                </div>
                                <span className="text-slate-100 text-sm font-medium">Find your dream team</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500 border border-violet-500/20">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <span className="text-slate-100 text-sm font-medium">Exclusive hackathons</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500 border border-violet-500/20">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                                </div>
                                <span className="text-slate-100 text-sm font-medium">Showcase projects</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500 border border-violet-500/20">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                                </div>
                                <span className="text-slate-100 text-sm font-medium">Earn tech credentials</span>
                            </div>
                        </div>

                        {/* Community Strength */}
                        <div className="flex items-center justify-between border-t border-slate-700/50 pt-6 mt-auto">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full border-2 border-[#1c1e2d] overflow-hidden bg-gray-200">
                                    <img src="https://i.pravatar.cc/150?u=a" alt="User 1" />
                                </div>
                                <div className="w-10 h-10 rounded-full border-2 border-[#1c1e2d] overflow-hidden bg-gray-300">
                                    <img src="https://i.pravatar.cc/150?u=b" alt="User 2" />
                                </div>
                                <div className="w-10 h-10 rounded-full border-2 border-[#1c1e2d] overflow-hidden bg-gray-400">
                                    <img src="https://i.pravatar.cc/150?u=c" alt="User 3" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-[#1c1e2d] flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                                    +24k
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-white uppercase tracking-wider mb-1">Community Strength</div>
                                <div className="text-xs text-slate-400">Growing 12% monthly</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
