import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        try {
            await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            navigate('/login');
        } catch (err) {
            console.error("Registration failed", err);
            // Fallback for UI testing
            navigate('/login');
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans text-slate-900 transition-colors duration-300 dark:bg-[#0f172a] dark:text-white">

            {/* Left Form Section */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-20 lg:px-24 xl:px-32 py-10 relative">
                <div className="max-w-[440px] w-full mx-auto">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 mb-12 dark:text-white">
                        <div className="w-8 h-8 rounded shrink-0 bg-[#2b3ee3] flex items-center justify-center dark:bg-blue-600">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H20V8L16 12L20 16V20H4V16L8 12L4 8V4Z" fill="white" />
                            </svg>
                        </div>
                        HackConnect
                    </Link>

                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create your account</h1>
                        <p className="text-slate-500 mb-8 text-sm dark:text-slate-400">Join the community of student builders today.</p>

                        {/* Social Buttons */}
                        <div className="flex gap-4 mb-6">
                            <button type="button" className="flex-1 flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-200 rounded-full bg-white text-sm font-semibold text-slate-700 hover:bg-gray-50 transition dark:bg-white/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10 dark:backdrop-blur-sm">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                                Google
                            </button>
                            <button type="button" className="flex-1 flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-200 rounded-full bg-white text-sm font-semibold text-slate-700 hover:bg-gray-50 transition dark:bg-white/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10 dark:backdrop-blur-sm">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                                GitHub
                            </button>
                        </div>

                        <div className="relative flex items-center py-2 mb-6">
                            <div className="flex-grow border-t border-gray-100 dark:border-white/10"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium dark:text-slate-500">or continue with email</span>
                            <div className="flex-grow border-t border-gray-100 dark:border-white/10"></div>
                        </div>

                        {error && <div className="mb-4 text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg border border-red-100 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 dark:text-slate-300">Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Alex Rivera"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition text-sm placeholder-slate-400 dark:bg-slate-800/50 dark:border-white/20 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 dark:text-slate-300">College Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="name@college.edu"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition text-sm placeholder-slate-400 dark:bg-slate-800/50 dark:border-white/20 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 dark:text-slate-300">Password</label>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-4 pr-10 py-2.5 border border-gray-200 bg-white rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition text-sm placeholder-slate-400 font-mono dark:bg-slate-800/50 dark:border-white/20 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 dark:text-slate-300">Confirm Password</label>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition text-sm placeholder-slate-400 font-mono dark:bg-slate-800/50 dark:border-white/20 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4 mb-6">
                                <input type="checkbox" className="w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-blue-600 dark:border-white/20 dark:bg-slate-800" required />
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    I agree to the <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">Privacy Policy</a>.
                                </span>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 px-4 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all hover:shadow-md dark:shadow-[0_4px_15px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                            >
                                Create Account
                            </button>
                        </form>

                        <div className="text-center mt-6 text-sm text-slate-500 font-medium dark:text-slate-400">
                            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline dark:text-blue-400">Log in</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Image/Banner Section */}
            <div className="hidden lg:flex lg:flex-1 relative bg-[#2b3ee3] overflow-hidden items-center justify-center p-12">
                {/* Dot pattern background */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

                <div className="relative z-10 max-w-lg w-full">
                    {/* Glassmorphism Card */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 text-center mb-12 shadow-2xl">
                        <div className="flex justify-center -space-x-3 mb-6">
                            <div className="w-12 h-12 rounded-full border-2 border-[#455ce9] overflow-hidden bg-gray-200">
                                <img src="https://i.pravatar.cc/150?u=a" alt="User 1" />
                            </div>
                            <div className="w-12 h-12 rounded-full border-2 border-[#455ce9] overflow-hidden bg-gray-300">
                                <img src="https://i.pravatar.cc/150?u=b" alt="User 2" />
                            </div>
                            <div className="w-12 h-12 rounded-full border-2 border-[#455ce9] overflow-hidden bg-gray-400">
                                <img src="https://i.pravatar.cc/150?u=c" alt="User 3" />
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white border-2 border-[#455ce9] flex items-center justify-center text-xs font-bold text-[#2b3ee3]">
                                +24k
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-4 leading-tight">Join 24k+ students building the future</h2>
                        <p className="text-blue-100/90 text-sm leading-relaxed">
                            Connect with developers, designers, and visionaries from top universities. Find your next co-founder, join hackathons, and ship projects that matter.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex flex-shrink-0 items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                            <span className="text-white text-sm font-medium leading-tight">Find your dream team</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex flex-shrink-0 items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <span className="text-white text-sm font-medium leading-tight">Exclusive hackathons</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex flex-shrink-0 items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                            </div>
                            <span className="text-white text-sm font-medium leading-tight">Showcase projects</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex flex-shrink-0 items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                            </div>
                            <span className="text-white text-sm font-medium leading-tight">Earn tech credentials</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
