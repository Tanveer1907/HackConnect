import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-10 py-5 bg-white border-b border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
            <Link to="/" className="flex items-center gap-2.5 font-extrabold text-[#111827] text-xl tracking-tight">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                </div>
                HackConnect
            </Link>

            <div className="hidden lg:flex gap-8 text-sm font-semibold">
                <Link to="/hackathons" className={`transition-colors py-1 ${location.pathname === '/hackathons' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>Explore Hackathons</Link>
                <Link to="/teams" className={`transition-colors py-1 ${location.pathname === '/teams' ? 'text-[#2b3ee3] border-b-2 border-[#2b3ee3]' : 'text-gray-500 hover:text-gray-900'}`}>Find Teammates</Link>
                <Link to="/internships" className={`transition-colors py-1 ${location.pathname === '/internships' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>Internships</Link>
            </div>

            <div className="flex items-center gap-5">
                <button className="text-gray-400 hover:text-gray-700 relative transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    <span className="absolute top-0 right-[2px] w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                </button>
                <button className="text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                </button>
                <Link to="/profile">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden ml-1">
                        <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </Link>
            </div>
        </nav>
    );
}
