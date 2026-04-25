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
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome back</h1>
                        <p className="text-slate-400 mb-8 text-sm">Enter your credentials to access your account</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1.5" htmlFor="email">College Email</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-slate-400">
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
                                        className="w-full pl-11 pr-4 py-3 bg-[#1a1d2d] border border-transparent rounded-2xl focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition text-sm placeholder-slate-500 text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-xs font-bold text-slate-300" htmlFor="password">Password</label>
                                    <Link to="/forgot-password" className="text-xs text-violet-500 hover:text-violet-400 font-medium">Forgot Password?</Link>
                                </div>
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
                                        {showPassword ? <FaEyeSlash className="w-4 h-4" aria-hidden="true" /> : <FaEye className="w-4 h-4" aria-hidden="true" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3.5 px-4 mt-2 flex justify-center items-center gap-2 rounded-full text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-600/30 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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

                        <div className="relative flex items-center py-4 my-4">
                            <div className="flex-grow border-t border-slate-800"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">or continue with</span>
                            <div className="flex-grow border-t border-slate-800"></div>
                        </div>

                        {/* Social Buttons */}
                        <div className="flex gap-4 mb-6">
                            <button onClick={handleGoogleLogin} type="button" className="flex-1 flex justify-center items-center gap-2 py-2.5 px-4 border border-slate-700/50 rounded-full bg-slate-800/20 text-sm font-semibold text-white hover:bg-slate-800 transition">
                                <FcGoogle className="w-4 h-4" />
                                Google
                            </button>
                            <button onClick={handleGithubLogin} type="button" className="flex-1 flex justify-center items-center gap-2 py-2.5 px-4 border border-slate-700/50 rounded-full bg-slate-800/20 text-sm font-semibold text-white hover:bg-slate-800 transition">
                                <FaGithub className="w-4 h-4" />
                                GitHub
                            </button>
                        </div>

                        <div className="text-center mt-6 text-sm text-slate-400 font-medium">
                            Don't have an account? <Link to="/register" className="text-violet-500 font-bold hover:text-violet-400 transition-colors">Sign up for free</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Image/Banner Section */}
            <div className="hidden lg:flex lg:flex-1 relative items-center justify-center p-6 bg-[#13151a]">
                <div className="w-full h-[90%] max-h-[700px] rounded-[28px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#1c1e2d' }}>
                    <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-violet-900/10 to-transparent"></div>

                    <div className="relative z-10 pt-10 px-10 shrink-0">
                        <div className="inline-flex items-center gap-2 bg-violet-600 rounded-full px-3 py-1 mb-6">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                            <span className="text-xs font-bold text-white">24 Hackathons live</span>
                        </div>
                        <h2 className="text-[2rem] xl:text-[2.25rem] font-extrabold text-white mb-4 leading-tight">Build the future<br />together</h2>
                        <p className="text-violet-100/70 text-sm leading-relaxed max-w-[90%]">
                            Join thousands of student developers, designers, and creators building the next big thing. Connect with mentors, find teammates, and win prizes.
                        </p>
                    </div>

                    <div className="relative z-10 mx-auto w-[85%] max-w-[450px] mb-8 mt-auto bg-[#2A2649] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/5">
                        {/* Abstract Illustration */}
                        <div className="relative w-full h-[180px] flex items-end justify-center px-8 bg-[#222E4E]">
                            {/* Table */}
                            <div className="absolute bottom-10 w-[80%] h-3 bg-[#D4A373] z-10"></div>
                            <div className="absolute bottom-0 left-[20%] w-3 h-[40px] bg-[#C18E5E] z-0"></div>
                            <div className="absolute bottom-0 right-[20%] w-3 h-[40px] bg-[#C18E5E] z-0"></div>

                            {/* Person Left */}
                            <div className="absolute bottom-10 left-[25%] z-0">
                                <div className="w-14 h-20 bg-[#1E3A8A] rounded-t-xl mb-[-4px]"></div>
                            </div>

                            {/* Person Right */}
                            <div className="absolute bottom-10 right-[25%] z-0">
                                <div className="w-14 h-20 bg-[#F59E0B] rounded-t-xl mb-[-4px]"></div>
                            </div>

                            {/* Laptop */}
                            <div className="absolute bottom-[40px] z-20">
                                <div className="w-12 h-8 bg-white shadow-sm flex items-end">
                                    <div className="w-full h-1 bg-gray-300"></div>
                                </div>
                            </div>
                        </div>

                        {/* Banner bottom info */}
                        <div className="py-4 px-6 flex items-center justify-between z-30 bg-[#1A1831]">
                            <div className="flex -space-x-3">
                                <div className="w-8 h-8 rounded-full border-2 border-[#1A1831] overflow-hidden bg-gray-200">
                                    <img src="https://i.pravatar.cc/150?u=1" alt="User 1" />
                                </div>
                                <div className="w-8 h-8 rounded-full border-2 border-[#1A1831] overflow-hidden bg-gray-300">
                                    <img src="https://i.pravatar.cc/150?u=2" alt="User 2" />
                                </div>
                                <div className="w-8 h-8 rounded-full border-2 border-[#1A1831] overflow-hidden bg-gray-400">
                                    <img src="https://i.pravatar.cc/150?u=3" alt="User 3" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-violet-600 border-2 border-[#1A1831] flex items-center justify-center text-[10px] font-bold text-white">
                                    +12
                                </div>
                            </div>
                            <div className="text-[10px] italic text-slate-400 font-medium tracking-wide">
                                Active in "AI Innovation Hub"
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
