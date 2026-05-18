import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser } from '../services/api';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function Login() {
    const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
    
    // User State
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    
    // Admin State
    const [adminData, setAdminData] = useState({ email: '', password: '' });
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const otpRefs = useRef([]);

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

    // Handle User Input
    const handleUserChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Admin Input
    const handleAdminChange = (e) => {
        setAdminData({ ...adminData, [e.target.name]: e.target.value });
    };

    // Handle OTP Input
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

    // Submit User Login
    const handleUserSubmit = async (e) => {
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

    // Submit Admin Auth
    const handleAdminSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!adminData.email || !adminData.password) {
                setLoading(false);
                return toast.error("Please enter admin credentials");
            }
            // Real API call to the backend
            const API = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            const response = await fetch(`${API}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(adminData)
            });
            const data = await response.json();

            if (response.ok) {
                setOtpSent(true);
                toast.success(data.message || "OTP sent to your administrator email!");
            } else {
                toast.error(data.message || "Invalid Admin Credentials");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    const handleAdminVerify = async (e) => {
        e.preventDefault();
        const fullOtp = otp.join('');
        if (fullOtp.length !== 6) return toast.error("Please enter a valid 6-digit OTP");
        
        setLoading(true);
        try {
            const API = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            const response = await fetch(`${API}/api/admin/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email: adminData.email, otp: fullOtp })
            });
            const data = await response.json();

            if (response.ok) {
                // Save admin token if needed
                localStorage.setItem('adminToken', data.token);
                toast.success("Admin Verified! Redirecting to secure portal...");
                window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/dashboard`;
            } else {
                toast.error(data.message || "Invalid or Expired OTP");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to verify OTP");
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
                <p className="text-sm text-slate-400 mb-8 font-medium">Enterprise Authentication</p>

                {/* Toggle */}
                <div className="w-full flex bg-[#1a1e2d] rounded-xl p-1 mb-6 border border-white/5">
                    <button 
                        onClick={() => { setLoginType('user'); setOtpSent(false); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${loginType === 'user' ? 'bg-[#252a3d] text-white shadow-sm border border-white/5' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        USER LOGIN
                    </button>
                    <button 
                        onClick={() => setLoginType('admin')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${loginType === 'admin' ? 'bg-[#252a3d] text-white shadow-sm border border-white/5' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        ADMIN LOGIN
                    </button>
                </div>

                {/* --- USER LOGIN FORM --- */}
                {loginType === 'user' && (
                    <div className="w-full w-full animate-fadeIn">
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
                )}

                {/* --- ADMIN LOGIN FORM --- */}
                {loginType === 'admin' && (
                    <div className="w-full animate-fadeIn">
                        <form onSubmit={handleAdminSendOtp} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Admin Email</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-3 text-slate-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></span>
                                    <input type="email" name="email" required placeholder="admin@hackconnect.dev" value={adminData.email} onChange={handleAdminChange} disabled={otpSent}
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#0e111a] border border-white/5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm text-white placeholder-slate-600 outline-none disabled:opacity-50" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Master Password</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-3 text-slate-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg></span>
                                    <input type={showPassword ? "text" : "password"} name="password" required placeholder="••••••••••••" value={adminData.password} onChange={handleAdminChange} disabled={otpSent}
                                        className="w-full pl-10 pr-10 py-2.5 bg-[#0e111a] border border-white/5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm text-white placeholder-slate-600 outline-none font-mono disabled:opacity-50" />
                                </div>
                            </div>
                            
                            {!otpSent ? (
                                <button type="submit" disabled={loading} className="w-full py-3 mt-2 bg-[#4F46E5] hover:bg-indigo-500 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-[0_4px_15px_rgba(79,70,229,0.3)] flex justify-center items-center gap-2">
                                    {loading ? 'PROCESSING...' : (
                                        <>SEND OTP <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></>
                                    )}
                                </button>
                            ) : (
                                <div className="pt-2 animate-fadeIn">
                                    <div className="flex items-center my-4">
                                        <div className="flex-1 border-t border-white/5"></div>
                                        <span className="px-3 text-slate-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></span>
                                        <div className="flex-1 border-t border-white/5"></div>
                                    </div>
                                    <label className="block text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Enter 6-Digit OTP</label>
                                    <div className="flex justify-between gap-2 mb-6">
                                        {otp.map((digit, i) => (
                                            <input key={i} ref={el => otpRefs.current[i] = el}
                                                type="text" maxLength="1" value={digit}
                                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                                className="w-12 h-14 bg-[#0e111a] border border-white/10 rounded-xl text-center text-xl text-white font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition outline-none shadow-inner"
                                            />
                                        ))}
                                    </div>
                                    <button type="button" onClick={handleAdminVerify} disabled={loading} className="w-full py-3 bg-[#252a3d] hover:bg-[#2d334a] border border-white/10 text-white rounded-xl text-xs font-bold tracking-wide transition-all flex justify-center items-center gap-2">
                                        {loading ? 'VERIFYING...' : (
                                            <>VERIFY & ENTER PORTAL <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg></>
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                )}
            </div>

            <div className="absolute bottom-6 flex gap-6 text-[11px] font-medium text-slate-500">
                <a href="#" className="hover:text-slate-300">Contact Support</a>
                <span className="w-1 h-1 rounded-full bg-slate-700 my-auto"></span>
                <a href="#" className="hover:text-slate-300">Security Policy</a>
            </div>

            <style jsx>{`
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
