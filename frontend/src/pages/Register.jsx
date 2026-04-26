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
        <div className="flex flex-1 w-full font-sans transition-colors duration-300">
            {/* Left Form Section */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-20 lg:px-24 xl:px-32 py-2 relative">
                <div className="max-w-[400px] w-full mx-auto">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white mb-4">
                        <div className="w-8 h-8 rounded shrink-0 bg-blue-600 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H20V8L16 12L20 16V20H4V16L8 12L4 8V4Z" fill="white" />
                            </svg>
                        </div>
                        HackConnect
                    </Link>

                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight mb-1 text-slate-900 dark:text-white">Create your account</h1>
                        <p className="text-blue-500/80 mb-2 text-sm font-medium">Join the community of student builders today.</p>

                        {/* Social Buttons */}
                        <div className="flex gap-4 mb-3">
                            <button onClick={handleGoogleLogin} type="button" className="flex-1 flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 dark:border-slate-700/50 rounded-full bg-white dark:bg-slate-800/20 text-sm font-semibold text-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 shadow-sm dark:shadow-none transition">
                                <FcGoogle className="w-4 h-4" />
                                Google
                            </button>
                            <button onClick={handleGithubLogin} type="button" className="flex-1 flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 dark:border-slate-700/50 rounded-full bg-white dark:bg-slate-800/20 text-sm font-semibold text-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 shadow-sm dark:shadow-none transition">
                                <FaGithub className="w-4 h-4" />
                                GitHub
                            </button>
                        </div>

                        <div className="relative flex items-center py-1 mb-3">
                            <div className="flex-grow border-t mt-1 border-gray-200 dark:border-[#1a1d2d]"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-500 text-[10px] font-bold uppercase py-1 px-4 tracking-widest bg-slate-50 dark:bg-[#151722] rounded-full border border-gray-200 dark:border-[#1a1d2d]">or continue with email</span>
                            <div className="flex-grow border-t mt-1 border-gray-200 dark:border-[#1a1d2d]"></div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-2.5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="name">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    aria-label="Full Name"
                                    placeholder="Alex Rivera"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-white dark:bg-[#1a1d2d] border border-gray-300 dark:border-transparent rounded-2xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">College Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    aria-label="College Email"
                                    placeholder="name@college.edu"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-white dark:bg-[#1a1d2d] border border-gray-300 dark:border-transparent rounded-2xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="password">Password</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-2.5 text-slate-500 dark:text-slate-400">
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
                                            className="w-full pl-11 pr-10 py-2 bg-white dark:bg-[#1a1d2d] border border-gray-300 dark:border-transparent rounded-2xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition text-sm placeholder-slate-500 text-slate-900 dark:text-white font-mono"
                                        />
                                        <button
                                            type="button"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 dark:text-slate-400 hover:text-white"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="confirmPassword">Confirm</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-2.5 text-slate-500 dark:text-slate-400">
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
                                            className="w-full pl-11 pr-10 py-2 bg-white dark:bg-[#1a1d2d] border border-gray-300 dark:border-transparent rounded-2xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition text-sm placeholder-slate-500 text-slate-900 dark:text-white font-mono"
                                        />
                                        <button
                                            type="button"
                                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 dark:text-slate-400 hover:text-white"
                                            onClick={toggleConfirmPasswordVisibility}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1 pb-2">
                                <input id="terms" type="checkbox" className="w-4 h-4 border-gray-600 rounded text-blue-600 focus:ring-blue-600 bg-transparent accent-blue-600" required />
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    I agree to the <a href="#" className="text-blue-500 font-bold hover:text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-500 font-bold hover:text-blue-400 hover:underline">Privacy Policy</a>
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2 px-4 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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

                        <div className="text-center mt-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            Already have an account? <Link to="/login" className="text-blue-500 font-bold hover:text-blue-400 transition-colors">Log In</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Banner Section */}
            <div className="hidden lg:flex lg:flex-1 relative items-center justify-center p-6">
                <div className="w-full h-[90%] max-h-[700px] rounded-[28px] overflow-hidden relative flex flex-col bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border border-blue-500/20 shadow-xl">
                    {/* Decorative background elements */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-[60px]"></div>

                    <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col justify-center max-w-lg mx-auto">
                        <div className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4 w-max">
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">New Cohort Starting</span>
                        </div>

                        <h2 className="text-[2rem] xl:text-[2.25rem] font-extrabold text-white mb-3 leading-[1.15]">Join 24k+ students building the future</h2>
                        <p className="text-blue-100 text-sm xl:text-base leading-relaxed mb-4">
                            The world's largest ecosystem for student innovators. Connect with top-tier developers and award-winning designers.
                        </p>

                        {/* Features List */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white border border-white/20">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                </div>
                                <span className="text-white text-sm font-medium">Find your dream team</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white border border-white/20">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <span className="text-white text-sm font-medium">Exclusive hackathons</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white border border-white/20">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                                </div>
                                <span className="text-white text-sm font-medium">Showcase projects</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white border border-white/20">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                                </div>
                                <span className="text-white text-sm font-medium">Earn tech credentials</span>
                            </div>
                        </div>

                        {/* Community Strength */}
                        <div className="flex items-center justify-between border-t border-white/20 pt-4 mt-auto">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full border-2 border-blue-700 overflow-hidden bg-gray-200">
                                    <img src="https://i.pravatar.cc/150?u=a" alt="User 1" />
                                </div>
                                <div className="w-10 h-10 rounded-full border-2 border-blue-700 overflow-hidden bg-gray-300">
                                    <img src="https://i.pravatar.cc/150?u=b" alt="User 2" />
                                </div>
                                <div className="w-10 h-10 rounded-full border-2 border-blue-700 overflow-hidden bg-gray-400">
                                    <img src="https://i.pravatar.cc/150?u=c" alt="User 3" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-blue-700 flex items-center justify-center text-[10px] font-bold text-white">
                                    +24k
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-white uppercase tracking-wider mb-1">Community Strength</div>
                                <div className="text-xs text-blue-200">Growing 12% monthly</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
