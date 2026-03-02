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
        <div className="auth-container">
            {/* Top Navigation */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '20px', color: '#111827' }}>
                    <div style={{ width: '24px', height: '24px', backgroundColor: '#2563eb', borderRadius: '4px' }}></div>
                    HackConnect
                </Link>
                <Link to="/" style={{ color: '#4b5563', fontSize: '14px', fontWeight: '500' }}>Back to Home</Link>
            </div>

            <div className="auth-card">
                <div className="auth-form-section">
                    <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '10px' }}>Welcome back</h2>
                    <p style={{ color: '#6b7280', marginBottom: '40px' }}>Enter your credentials to access your account.</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>College Email</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }}>✉️</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="student@university.edu"
                                    className="auth-input"
                                    style={{ paddingLeft: '40px' }}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }}>🔒</span>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="auth-input"
                                    style={{ paddingLeft: '40px' }}
                                    required
                                />
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                <span style={{ color: '#2563eb', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Forgot Password?</span>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ padding: '14px', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                            Log In <span>→</span>
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '30px 0', color: '#9ca3af', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                        <span style={{ padding: '0 15px' }}>or continue with</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button className="btn-outline" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: '#ea4335', fontWeight: 'bold' }}>G</span> Google
                        </button>
                        <button className="btn-outline" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                            <span>GitHub</span>
                        </button>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '14px', color: '#6b7280' }}>
                        Don't have an account? <Link to="/signup" style={{ color: '#2563eb', fontWeight: '600' }}>Sign up now</Link>
                    </div>
                </div>

                <div className="auth-image-section">
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', position: 'relative', zIndex: 10 }}>
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80" alt="Students" style={{ borderRadius: '12px', width: '100%', marginBottom: '15px' }} />
                        <div style={{ position: 'absolute', bottom: '40px', left: '10px', backgroundColor: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
                            24 Hackathons live
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '15px', backgroundColor: '#dbeafe', color: '#1e40af', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', fontWeight: 'bold', marginLeft: '-5px', border: '2px solid white' }}>JD</div>
                                <div style={{ width: '30px', height: '30px', borderRadius: '15px', backgroundColor: '#fce7f3', color: '#9d174d', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', fontWeight: 'bold', marginLeft: '-5px', border: '2px solid white' }}>AL</div>
                                <div style={{ width: '30px', height: '30px', borderRadius: '15px', backgroundColor: '#dcfce7', color: '#166534', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', fontWeight: 'bold', marginLeft: '-5px', border: '2px solid white' }}>MK</div>
                            </div>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>+12 joining</span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '40px', zIndex: 10 }}>
                        <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>Build the future together</h3>
                        <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', maxWidth: '300px' }}>Join thousands of student developers, designers, and creators building the next big thing.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
