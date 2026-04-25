import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUserProfile } from '../services/api';

export default function Sidebar() {
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (localStorage.getItem('token')) {
                try {
                    const res = await getUserProfile();
                    setUser(res.data);
                } catch (err) {
                    // silently ignore if token is invalid or user not found
                }
            }
        };
        fetchUser();
    }, []);

    const renderAvatar = () => {
        if (!user) {
            return (
                <div className="w-full h-full bg-slate-300 flex items-center justify-center dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-white dark:border-slate-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
            );
        }
        if (user.profileImage) {
            return <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover border border-white dark:border-slate-700" />;
        }
        return (
            <div className="w-full h-full bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center text-sm font-bold text-white uppercase border border-white dark:border-slate-700">
                {user.name ? user.name.charAt(0) : 'U'}
            </div>
        );
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: '⊞' },
        { name: 'Hackathons', path: '/hackathons', icon: '🏆' },
        { name: 'Teams', path: '/teams', icon: '👥' },
        { name: 'Profile', path: '/profile', icon: '👤' },
    ];

    return (
        <aside className="hidden lg:flex w-64 flex-shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] p-6 flex-col shadow-sm transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-[inset_-1px_0_0_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-3 mb-10 p-3 rounded-xl border transition-colors cursor-pointer group bg-gray-50 border-gray-200 hover:bg-gray-100 shadow-sm dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10 dark:shadow-[0_4px_15px_rgba(0,0,0,0.1)] dark:hover:bg-white/10">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-xl overflow-hidden shrink-0 shadow-sm">
                    {renderAvatar()}
                </div>
                <div className="overflow-hidden">
                    <h3 className="text-sm font-bold truncate group-hover:text-blue-600 transition-colors text-slate-900 dark:text-slate-200 dark:group-hover:text-white">
                        {user ? user.name : 'Loading...'}
                    </h3>
                    <p className="text-xs truncate text-slate-500 dark:text-slate-400">
                        {user ? (user.role || 'Developer') : 'Please wait'}
                    </p>
                </div>
            </div>

            <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                                ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30 dark:drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                                : 'text-slate-600 border border-transparent hover:bg-gray-50 hover:text-slate-900 hover:border-gray-200 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200 dark:hover:border-white/10'
                                }`}
                        >
                            <span className={`text-lg transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-sm dark:drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]' : ''}`}>{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-10">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-5 relative overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-500/50">
                    <div className="absolute top-[-20%] right-[-20%] w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-[-20%] left-[-20%] w-16 h-16 bg-white opacity-10 rounded-full blur-xl"></div>
                    <div className="flex items-center gap-2 mb-2 relative z-10">
                        <span className="text-yellow-300 drop-shadow-[0_0_5px_rgba(253,224,71,0.8)]">⭐</span>
                        <span className="text-sm font-bold text-white drop-shadow-md">Pro Member</span>
                    </div>
                    <p className="text-xs text-blue-100 mb-4 relative z-10 opacity-90">
                        Get access to exclusive hackathons and mentorships.
                    </p>
                    <button className="w-full py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/20 text-xs font-bold rounded-xl transition-all duration-300 relative z-10 shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:-translate-y-0.5">
                        Upgrade Plan
                    </button>
                </div>
            </div>
        </aside>
    );
}
