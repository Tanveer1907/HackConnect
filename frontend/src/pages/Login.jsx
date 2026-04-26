import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser } from '../services/api';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const err = searchParams.get('error');

        if (token) {
            localStorage.setItem('token', token);
            toast.success('Successfully logged in with OAuth!');
            navigate('/dashboard', { replace: true });
        }
        if (err) {
            toast.error('OAuth Authentication failed. Please try again.');
        }
    }, [searchParams, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await loginUser(formData);
            const { token } = response.data;
            localStorage.setItem('token', token);
            toast.success('Successfully logged in!');
            navigate('/dashboard');
        } catch (err) {
            console.error('Login Failed:', err);
            const errorMsg = err.response?.data?.message || 'Failed to login. Please check your credentials.';
            toast.error(errorMsg);
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
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white">Welcome back</h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">Enter your credentials to access your account</p>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">College Email</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-slate-500 dark:text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    </span>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        aria-label="College Email"
                                        placeholder="student@university.edu"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-[#1a1d2d] border border-gray-300 dark:border-transparent rounded-2xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                                    <Link to="/forgot-password" className="text-xs text-blue-500 hover:text-blue-400 font-medium">Forgot Password?</Link>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-slate-500 dark:text-slate-400">
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
                                        className="w-full pl-11 pr-10 py-2.5 bg-white dark:bg-[#1a1d2d] border border-gray-300 dark:border-transparent rounded-2xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition text-sm placeholder-slate-500 text-slate-900 dark:text-white font-mono"
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 dark:text-slate-400 hover:text-white"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <FaEyeSlash className="w-4 h-4" aria-hidden="true" /> : <FaEye className="w-4 h-4" aria-hidden="true" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2.5 px-4 mt-2 flex justify-center items-center gap-2 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                        Logging in...
                                    </>
                                ) : (
                                    <>Log In <span className="font-bold text-lg leading-none">→</span></>
                                )}
                            </button>
                        </form>

                        <div className="relative flex items-center py-2 my-2">
                            <div className="flex-grow border-t border-gray-200 dark:border-slate-800"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">or continue with</span>
                            <div className="flex-grow border-t border-gray-200 dark:border-slate-800"></div>
                        </div>

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

                        <div className="text-center mt-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            Don't have an account? <Link to="/register" className="text-blue-500 font-bold hover:text-blue-400 transition-colors">Sign up for free</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Image/Banner Section */}
            <div className="hidden lg:flex lg:flex-1 relative items-center justify-center p-6">
                <div className="w-full h-[90%] max-h-[700px] rounded-[28px] overflow-hidden relative flex flex-col justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border border-blue-500/20 shadow-xl">
                    {/* Decorative background elements */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-[60px]"></div>

                    <div className="relative z-10 px-10">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-3 border border-white/20">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span className="text-xs font-bold text-white">24 Hackathons live</span>
                        </div>
                        <h2 className="text-[2rem] xl:text-[2.25rem] font-extrabold text-white mb-2 leading-tight">Build the future<br />together</h2>
                        <p className="text-blue-100 text-sm leading-relaxed max-w-[90%]">
                            Join thousands of student developers, designers, and creators building the next big thing. Connect with mentors, find teammates, and win prizes.
                        </p>
                    </div>

                    <div className="relative z-10 mx-auto w-[85%] max-w-[450px] mt-6 bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/15">
                        {/* Abstract Illustration */}
                        <div className="relative w-full h-[140px] flex items-end justify-center px-8 bg-white/5">
                            {/* Table */}
                            <div className="absolute bottom-10 w-[80%] h-3 bg-amber-400 z-10 rounded-sm"></div>
                            <div className="absolute bottom-0 left-[20%] w-3 h-[40px] bg-amber-500/80 z-0"></div>
                            <div className="absolute bottom-0 right-[20%] w-3 h-[40px] bg-amber-500/80 z-0"></div>

                            {/* Person Left */}
                            <div className="absolute bottom-10 left-[25%] z-0">
                                <div className="w-14 h-20 bg-blue-400 rounded-t-xl mb-[-4px]"></div>
                            </div>

                            {/* Person Right */}
                            <div className="absolute bottom-10 right-[25%] z-0">
                                <div className="w-14 h-20 bg-amber-400 rounded-t-xl mb-[-4px]"></div>
                            </div>

                            {/* Laptop */}
                            <div className="absolute bottom-[40px] z-20">
                                <div className="w-12 h-8 bg-white shadow-sm flex items-end rounded-t-sm">
                                    <div className="w-full h-1 bg-gray-300"></div>
                                </div>
                            </div>
                        </div>

                        {/* Banner bottom info */}
                        <div className="py-3 px-6 flex items-center justify-between z-30 bg-white/10 backdrop-blur-sm">
                            <div className="flex -space-x-3">
                                <div className="w-8 h-8 rounded-full border-2 border-blue-700 overflow-hidden bg-gray-200">
                                    <img src="https://i.pravatar.cc/150?u=1" alt="User 1" />
                                </div>
                                <div className="w-8 h-8 rounded-full border-2 border-blue-700 overflow-hidden bg-gray-300">
                                    <img src="https://i.pravatar.cc/150?u=2" alt="User 2" />
                                </div>
                                <div className="w-8 h-8 rounded-full border-2 border-blue-700 overflow-hidden bg-gray-400">
                                    <img src="https://i.pravatar.cc/150?u=3" alt="User 3" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-blue-700 flex items-center justify-center text-[10px] font-bold text-white">
                                    +12
                                </div>
                            </div>
                            <div className="text-[10px] italic text-blue-200 font-medium tracking-wide">
                                Active in "AI Innovation Hub"
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
