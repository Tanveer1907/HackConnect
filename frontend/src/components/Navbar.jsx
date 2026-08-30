import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const { user, token, logout } = useAuth();

    const [hasNotifications, setHasNotifications] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (token && user) {
                try {
                    if (location.pathname === '/chat') {
                        localStorage.setItem('lastChatVisit', Date.now().toString());
                        setHasNotifications(false);
                        return;
                    }

                    const { getMyChats } = await import('../services/api');
                    const chatRes = await getMyChats();
                    
                    const lastVisit = parseInt(localStorage.getItem('lastChatVisit') || '0');
                    
                    if (chatRes.data && chatRes.data.length > 0) {
                        const hasUnread = chatRes.data.some(chat => {
                            const lastMsg = chat.latestMessage;
                            if (!lastMsg) return false;
                            
                            const isFromOthers = lastMsg.sender !== user._id && lastMsg.sender?._id !== user._id;
                            const isNew = new Date(lastMsg.createdAt).getTime() > lastVisit;
                            
                            return isFromOthers && isNew;
                        });
                        setHasNotifications(hasUnread);
                    }
                } catch (err) {
                    console.error('Failed to fetch navbar notifications', err);
                }
            }
        };
        fetchNotifications();
        
        if (location.pathname === '/chat') {
            setHasNotifications(false);
            localStorage.setItem('lastChatVisit', Date.now().toString());
        }
    }, [token, user, location.pathname]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    const renderAvatar = () => {
        if (!user) {
            return (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
            );
        }
        if (user.profileImage) {
            return <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />;
        }
        return (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                {user.name ? user.name.charAt(0) : 'U'}
            </div>
        );
    };

    const logoDestination = token ? '/dashboard' : '/';

    const navLinks = [
        { name: 'Explore Hackathons', path: '/hackathons' },
        { name: 'Find Teammates', path: '/teams' },
        { name: 'Internships', path: '/internships' },
        ...(token ? [{ name: 'Applications', path: '/applications' }] : []),
    ];

    return (
        <header className="sticky top-0 z-50 w-full transition-all duration-300">
            <nav className="bg-white/85 dark:bg-[#0b0f19]/85 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 h-[72px] flex items-center justify-between">
                    
                    {/* Brand Logo with Gamer Glow */}
                    <Link to={logoDestination} className="flex items-center gap-3.5 group active:scale-95 transition-transform">
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] group-hover:scale-105 transition-all duration-300 border border-white/20">
                            <svg className="w-5 h-5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                            </svg>
                        </div>
                        <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-cyan-200 dark:to-blue-400 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-all duration-300">
                            HackConnect
                        </span>
                    </Link>

                    {/* Desktop Navigation Links with Gamer Neon HUD Hover */}
                    <div className="hidden md:flex items-center gap-2 p-1.5 bg-slate-100/70 dark:bg-white/[0.04] rounded-2xl border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-inner">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 group overflow-hidden ${
                                        isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-cyan-400/40'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-blue-50/80 dark:hover:bg-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_18px_rgba(59,130,246,0.35),inset_0_0_10px_rgba(34,211,238,0.15)] border border-transparent hover:scale-105 active:scale-95'
                                    }`}
                                >
                                    {/* Gamer HUD Laser Accent on Hover */}
                                    <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                    <span className="relative z-10 drop-shadow-[0_0_8px_rgba(0,0,0,0.2)] dark:group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]">
                                        {link.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Controls & Profile with Gamer Aesthetics */}
                    <div className="flex items-center gap-3.5">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100/80 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-200 active:scale-95 shadow-sm"
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? (
                                <svg className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                                </svg>
                            )}
                        </button>

                        {token ? (
                            <>
                                {/* Chat / Notifications Beacon with Neon Glow */}
                                <Link
                                    to="/chat"
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100/80 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] relative transition-all duration-200 active:scale-95 shadow-sm group"
                                    title="Messages & Chat"
                                    aria-label="Messages"
                                >
                                    <svg className="w-4 h-4 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                    </svg>
                                    {hasNotifications && (
                                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)] animate-pulse"></span>
                                    )}
                                </Link>

                                {/* Profile Link & Avatar with Cyber Ring */}
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2.5 p-1 pr-3 rounded-full bg-slate-100/80 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 hover:border-cyan-400/60 hover:shadow-[0_0_16px_rgba(34,211,238,0.35)] transition-all duration-200 shadow-sm group"
                                    title="View Profile"
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500 group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all">
                                        {renderAvatar()}
                                    </div>
                                    <span className="hidden sm:inline-block text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-cyan-300 max-w-[100px] truncate transition-colors">
                                        {user?.name?.split(' ')[0] || 'Profile'}
                                    </span>
                                </Link>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="hidden lg:inline-flex px-3.5 py-1.5 text-xs font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 hover:shadow-[0_0_12px_rgba(239,68,68,0.3)] rounded-xl border border-transparent hover:border-red-500/30 transition-all duration-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2.5">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-cyan-400 dark:text-slate-300 dark:hover:text-cyan-300 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] border border-white/20 transition-all active:scale-95"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile Drawer Hamburger Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-white/10 transition"
                            aria-label="Open Navigation Menu"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden px-4 pt-2 pb-4 border-t border-slate-200/60 dark:border-white/10 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-2xl animate-fade-in space-y-1">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                                        isActive
                                            ? 'bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-white font-semibold'
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                        {token && (
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                            >
                                Log Out
                            </button>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}
