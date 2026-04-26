import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getUserProfile } from '../services/api';

export default function Navbar() {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('token');

    const [hasNotifications, setHasNotifications] = useState(false);

    useEffect(() => {
        const fetchUserAndNotifications = async () => {
            if (token) {
                try {
                    const res = await getUserProfile();
                    const userData = res.data;
                    setUser(userData);
                    
                    // If we are currently on the chat page, mark as seen immediately
                    if (location.pathname === '/chat') {
                        localStorage.setItem('lastChatVisit', Date.now().toString());
                        setHasNotifications(false);
                        return;
                    }

                    // Fetch chats to see if there are NEW messages
                    const { getMyChats } = await import('../services/api');
                    const chatRes = await getMyChats();
                    
                    const lastVisit = parseInt(localStorage.getItem('lastChatVisit') || '0');
                    
                    if (chatRes.data && chatRes.data.length > 0) {
                        const hasUnread = chatRes.data.some(chat => {
                            const lastMsg = chat.latestMessage;
                            if (!lastMsg) return false;
                            
                            // It's unread if:
                            // 1. It's not from me
                            // 2. It was created after my last visit
                            const isFromOthers = lastMsg.sender !== userData._id && lastMsg.sender?._id !== userData._id;
                            const isNew = new Date(lastMsg.createdAt).getTime() > lastVisit;
                            
                            return isFromOthers && isNew;
                        });
                        setHasNotifications(hasUnread);
                    }
                } catch (err) {
                    // silently ignore
                }
            }
        };
        fetchUserAndNotifications();
        
        // Also clear notification if user navigates TO chat
        if (location.pathname === '/chat') {
            setHasNotifications(false);
            localStorage.setItem('lastChatVisit', Date.now().toString());
        }
    }, [token, location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/';
    };

    const renderAvatar = () => {
        if (!user) {
            return (
                <div className="w-full h-full bg-slate-300 flex items-center justify-center dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
            );
        }
        if (user.profileImage) {
            return <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />;
        }
        return (
            <div className="w-full h-full bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center text-sm font-bold text-white uppercase">
                {user.name ? user.name.charAt(0) : 'U'}
            </div>
        );
    };

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-10 py-5 bg-white/90 border-b border-gray-200 shadow-sm backdrop-blur-xl transition-colors duration-300 dark:bg-[#0f172a]/70 dark:border-white/10 dark:shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <Link to="/" className="flex items-center gap-2.5 font-extrabold text-slate-900 text-xl tracking-tight dark:text-white">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_4px_10px_rgba(37,99,235,0.3)] dark:bg-blue-500 dark:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                </div>
                HackConnect
            </Link>

            <div className="hidden lg:flex gap-8 text-sm font-medium">
                <Link to="/hackathons" className={`transition-colors py-1 ${location.pathname === '/hackathons' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400 dark:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'}`}>Explore Hackathons</Link>
                <Link to="/teams" className={`transition-colors py-1 ${location.pathname === '/teams' ? 'text-purple-600 border-b-2 border-purple-600 dark:text-purple-400 dark:border-purple-400 dark:drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'}`}>Find Teammates</Link>
                <Link to="/internships" className={`transition-colors py-1 ${location.pathname === '/internships' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400 dark:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'}`}>Internships</Link>
            </div>

            <div className="flex items-center gap-5">
                <button
                    onClick={toggleTheme}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-amber-500 hover:bg-slate-200 transition-colors shadow-inner dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-700 dark:shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                    )}
                </button>
                {token ? (
                    <>
                        <Link to="/chat" className="text-slate-500 hover:text-slate-900 relative transition-all duration-300 hover:scale-110 dark:text-slate-400 dark:hover:text-white dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                            {hasNotifications && (
                                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#0f172a] shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></span>
                            )}
                        </Link>
                        <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors hidden md:block dark:text-red-400 dark:hover:text-red-300 mx-2">
                            Logout
                        </button>
                        <Link to="/profile">
                            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm hover:border-blue-500 transition-all duration-300 overflow-hidden ml-1 dark:bg-slate-800 dark:border-slate-700 dark:shadow-[0_0_10px_rgba(0,0,0,0.5)] dark:hover:border-blue-500 dark:hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]">
                                {renderAvatar()}
                            </div>
                        </Link>
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="px-5 py-2 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors dark:text-slate-300 dark:hover:text-white">Login</Link>
                        <Link to="/register" className="px-5 py-2 text-sm font-bold bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all dark:bg-blue-500 dark:hover:bg-blue-400 dark:shadow-[0_0_15px_rgba(59,130,246,0.3)]">Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
