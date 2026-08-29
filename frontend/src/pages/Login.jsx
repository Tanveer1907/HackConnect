import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser } from '../services/api';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    
    // User State
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const err = searchParams.get('error');

        if (token) {
            login(token);
            toast.success('Successfully logged in with OAuth!');
            navigate('/dashboard', { replace: true });
        }
        if (err) {
            toast.error('OAuth Authentication failed. Please try again.');
        }
    }, [searchParams, navigate, login]);

    // Handle User Input
    const handleUserChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit User Login
    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await loginUser(formData);
            const { token, user } = response.data;
            login(token, user);
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
        window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/auth/google`;
    };

    const handleGithubLogin = () => {
        window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/auth/github`;
    };

    return (
        <div className="min-h-screen w-full bg-[#0b0f19] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[20%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[20%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Login Card */}
            <div className="w-full max-w-[420px] bg-[#151824] rounded-2xl border border-white/5 shadow-2xl overflow-hidden relative z-10 flex flex-col items-center pt-8 pb-6 px-8">
                
                {/* Logo Section */}
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] mb-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h1 className="text-2xl font-extrabold text-white mb-1">HackConnect</h1>
                <p className="text-sm text-slate-400 mb-6 font-medium">Welcome back! Sign in to continue</p>

                {/* --- USER LOGIN FORM --- */}
                <div className="w-full animate-fadeIn">
                    <form onSubmit={handleUserSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">College Email</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-3 text-slate-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></span>
                                <input type="email" name="email" required placeholder="student@university.edu" value={formData.email} onChange={handleUserChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#0e111a] border border-white/5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm text-white placeholder-slate-600 outline-none" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                                <Link to="/forgot-password" className="text-[10px] text-blue-500 hover:text-blue-400 font-bold">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3.5 top-3 text-slate-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg></span>
                                <input type={showPassword ? "text" : "password"} name="password" required placeholder="••••••••" value={formData.password} onChange={handleUserChange}
                                    className="w-full pl-10 pr-10 py-2.5 bg-[#0e111a] border border-white/5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm text-white placeholder-slate-600 outline-none font-mono" />
                                <button type="button" className="absolute right-3 top-3 text-slate-500 hover:text-white" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-3 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:-translate-y-0.5">
                            {loading ? 'AUTHENTICATING...' : 'LOGIN TO PLATFORM'}
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-white/10"></div>
                        <span className="px-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">Or</span>
                        <div className="flex-1 border-t border-white/10"></div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={handleGoogleLogin} className="flex-1 py-2.5 bg-[#1a1e2d] hover:bg-[#252a3d] border border-white/5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-300 transition-colors">
                            <FcGoogle className="w-4 h-4" /> Google
                        </button>
                        <button onClick={handleGithubLogin} className="flex-1 py-2.5 bg-[#1a1e2d] hover:bg-[#252a3d] border border-white/5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-300 transition-colors">
                            <FaGithub className="w-4 h-4" /> GitHub
                        </button>
                    </div>
                    <div className="text-center mt-6 text-xs text-slate-500 font-medium">
                        New here? <Link to="/register" className="text-blue-500 font-bold hover:text-blue-400">Create an account</Link>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 flex gap-6 text-[11px] font-medium text-slate-500">
                <a href="#" className="hover:text-slate-300">Contact Support</a>
                <span className="w-1 h-1 rounded-full bg-slate-700 my-auto"></span>
                <a href="#" className="hover:text-slate-300">Security Policy</a>
            </div>
        </div>
    );
}
