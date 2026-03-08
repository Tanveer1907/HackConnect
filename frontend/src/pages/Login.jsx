import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login Submitted:', formData);
    };

    return (
        <div className="auth-container transition-colors duration-300 dark:bg-[#0f172a] flex-1">
            <div className="auth-card transition-colors duration-300 dark:bg-slate-800/50 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                <div className="auth-form-section">
                    <h2 className="text-3xl font-extrabold mb-2.5 text-slate-900 dark:text-white">Welcome back</h2>
                    <p className="text-slate-500 mb-10 dark:text-slate-400">Enter your credentials to access your account.</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">College Email</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3.5 text-slate-400">✉️</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="student@university.edu"
                                    className="auth-input pl-10 bg-white transition-colors dark:bg-slate-900/50 dark:border-white/10 dark:text-white dark:focus:border-blue-500 dark:focus:ring-1 dark:focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Password</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3.5 text-slate-400">🔒</span>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="auth-input pl-10 bg-white transition-colors dark:bg-slate-900/50 dark:border-white/10 dark:text-white dark:focus:border-blue-500 dark:focus:ring-1 dark:focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="text-right mt-2.5">
                                <span className="text-blue-600 text-sm font-medium cursor-pointer hover:underline dark:text-blue-400">Forgot Password?</span>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary p-3.5 text-base flex justify-center items-center gap-2.5 dark:shadow-[0_4px_15px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            Log In <span>→</span>
                        </button>
                    </form>

                    <div className="flex items-center my-7 text-slate-400 text-xs uppercase tracking-widest dark:text-slate-500">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-white/10"></div>
                        <span className="px-4">or continue with</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-white/10"></div>
                    </div>

                    <div className="flex gap-4">
                        <button className="btn-outline flex-1 flex justify-center items-center gap-2.5 transition-colors dark:bg-white/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                            <span className="text-red-500 font-bold">G</span> Google
                        </button>
                        <button className="btn-outline flex-1 flex justify-center items-center gap-2.5 transition-colors dark:bg-white/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                            <span>GitHub</span>
                        </button>
                    </div>

                    <div className="text-center mt-10 text-sm text-slate-500 dark:text-slate-400">
                        Don't have an account? <Link to="/signup" className="text-blue-600 font-semibold hover:underline dark:text-blue-400">Sign up now</Link>
                    </div>
                </div>

                <div className="auth-image-section dark:bg-[#1a2339] dark:bg-none">
                    <div className="bg-white p-5 rounded-2xl shadow-xl relative z-10 transition-colors duration-300 dark:bg-slate-800 dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] dark:border dark:border-white/5">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80" alt="Students" className="rounded-xl w-full mb-4 opacity-90 dark:opacity-80" />
                        <div className="absolute bottom-10 left-2.5 bg-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors dark:bg-slate-700 dark:text-white dark:border dark:border-white/10">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            24 Hackathons live
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="flex">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex justify-center items-center text-[10px] font-bold -ml-[5px] border-2 border-white dark:border-slate-800 dark:bg-blue-900/50 dark:text-blue-300">JD</div>
                                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-800 flex justify-center items-center text-[10px] font-bold -ml-[5px] border-2 border-white dark:border-slate-800 dark:bg-pink-900/50 dark:text-pink-300">AL</div>
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex justify-center items-center text-[10px] font-bold -ml-[5px] border-2 border-white dark:border-slate-800 dark:bg-green-900/50 dark:text-green-300">MK</div>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">+12 joining</span>
                        </div>
                    </div>
                    <div className="text-center mt-10 z-10">
                        <h3 className="text-2xl font-extrabold mb-2.5 text-slate-900 dark:text-white">Build the future together</h3>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-[300px] mx-auto dark:text-slate-400">Join thousands of student developers, designers, and creators building the next big thing.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
