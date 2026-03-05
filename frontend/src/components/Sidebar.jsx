import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: '⊞' },
        { name: 'Hackathons', path: '/hackathons', icon: '🏆' },
        { name: 'Teams', path: '/teams', icon: '👥' },
        { name: 'Profile', path: '/profile', icon: '👤' },
    ];

    return (
        <aside className="hidden lg:flex w-64 flex-shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] p-6 flex-col">
            <div className="flex items-center gap-3 mb-10 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl overflow-hidden shrink-0">
                    <img src="https://i.pravatar.cc/150?u=alex" alt="Alex" className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                    <h3 className="text-sm font-bold text-gray-900 truncate">Alex Chen</h3>
                    <p className="text-xs text-gray-500 truncate">Computer Science</p>
                </div>
            </div>

            <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <span className="text-lg opacity-80">{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-10">
                <div className="bg-blue-600 text-white rounded-2xl p-5 relative overflow-hidden shadow-sm">
                    <div className="absolute top-[-20%] right-[-20%] w-24 h-24 bg-white opacity-10 rounded-full"></div>
                    <div className="absolute bottom-[-20%] left-[-20%] w-16 h-16 bg-white opacity-10 rounded-full"></div>
                    <div className="flex items-center gap-2 mb-2 relative z-10">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm font-bold">Pro Member</span>
                    </div>
                    <p className="text-xs text-blue-100 mb-4 relative z-10">
                        Get access to exclusive hackathons and mentorships.
                    </p>
                    <button className="w-full py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-xl transition-colors relative z-10 shadow-sm">
                        Upgrade Plan
                    </button>
                </div>
            </div>
        </aside>
    );
}
