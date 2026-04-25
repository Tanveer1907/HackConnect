import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHackathons } from '../services/api';

export default function Hackathons() {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [mode, setMode] = useState('All');
    const [domain, setDomain] = useState('');

    useEffect(() => {
        const fetchHackathons = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (mode && mode !== 'All') params.append('mode', mode.toUpperCase());
                if (domain) params.append('domain', domain);
                const queryStr = params.toString() ? `?${params.toString()}` : '';

                const response = await getHackathons(queryStr);
                setHackathons(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch hackathons", err);
                setError("Failed to load hackathons. Please try again later.");
                setLoading(false);
            }
        };

        fetchHackathons();
        fetchHackathons();
    }, [mode, domain]);

    if (loading) {
        return <div className="flex-1 flex justify-center items-center h-screen bg-slate-50 dark:bg-[#0f172a]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }

    if (error) {
        return <div className="flex-1 flex justify-center items-center h-screen bg-slate-50 dark:bg-[#0f172a] text-red-500 font-semibold">{error}</div>;
    }

    // Prepare statistics logic if needed
    const upcomingCount = hackathons.length;

    return (
        <div className="bg-slate-50 transition-colors duration-300 dark:bg-transparent flex-1 flex flex-col">

            {/* Main Content */}
            <div className="flex flex-col md:flex-row max-w-[1400px] mx-auto p-4 md:p-10 relative z-10 w-full gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-[250px] shrink-0">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-base font-bold m-0 text-slate-900 drop-shadow-sm dark:text-white">Filters</h3>
                        <span onClick={() => { setMode('All'); setDomain(''); }} className="text-blue-600 text-xs cursor-pointer hover:text-blue-800 transition-colors dark:text-blue-400 dark:hover:text-blue-300">Reset All</span>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-4 font-bold">Mode</h4>
                        <label className="flex items-center gap-2.5 mb-2.5 text-sm text-slate-700 hover:text-blue-600 cursor-pointer transition-colors dark:text-slate-300 dark:hover:text-white">
                            <input type="radio" name="mode" checked={mode === 'All'} onChange={() => setMode('All')} className="accent-blue-600 w-4 h-4 cursor-pointer dark:accent-blue-500" /> All
                        </label>
                        <label className="flex items-center gap-2.5 mb-2.5 text-sm text-slate-700 hover:text-blue-600 cursor-pointer transition-colors dark:text-slate-300 dark:hover:text-white">
                            <input type="radio" name="mode" checked={mode === 'Online'} onChange={() => setMode('Online')} className="accent-blue-600 w-4 h-4 cursor-pointer dark:accent-blue-500" /> Online
                        </label>
                        <label className="flex items-center gap-2.5 mb-2.5 text-sm text-slate-700 hover:text-blue-600 cursor-pointer transition-colors dark:text-slate-300 dark:hover:text-white">
                            <input type="radio" name="mode" checked={mode === 'Offline'} onChange={() => setMode('Offline')} className="accent-blue-600 w-4 h-4 cursor-pointer dark:accent-blue-500" /> Offline
                        </label>
                        <label className="flex items-center gap-2.5 mb-2.5 text-sm text-slate-700 hover:text-blue-600 cursor-pointer transition-colors dark:text-slate-300 dark:hover:text-white">
                            <input type="radio" name="mode" checked={mode === 'Hybrid'} onChange={() => setMode('Hybrid')} className="accent-blue-600 w-4 h-4 cursor-pointer dark:accent-blue-500" /> Hybrid
                        </label>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-4 font-bold">Domain</h4>
                        <label className="flex items-center gap-2.5 mb-2.5 text-sm text-slate-700 hover:text-blue-600 cursor-pointer transition-colors dark:text-slate-300 dark:hover:text-white">
                            <input type="radio" name="domain" checked={domain === 'Web Development'} onChange={() => setDomain(domain === 'Web Development' ? '' : 'Web Development')} className="accent-blue-600 w-4 h-4 cursor-pointer dark:accent-blue-500" /> Web Development
                        </label>
                        <label className="flex items-center gap-2.5 mb-2.5 text-sm text-slate-700 hover:text-blue-600 cursor-pointer transition-colors dark:text-slate-300 dark:hover:text-white">
                            <input type="radio" name="domain" checked={domain === 'AI & Machine Learning'} onChange={() => setDomain(domain === 'AI & Machine Learning' ? '' : 'AI & Machine Learning')} className="accent-blue-600 w-4 h-4 cursor-pointer dark:accent-blue-500" /> AI & Machine Learning
                        </label>
                        <label className="flex items-center gap-2.5 mb-2.5 text-sm text-slate-700 hover:text-blue-600 cursor-pointer transition-colors dark:text-slate-300 dark:hover:text-white">
                            <input type="radio" name="domain" checked={domain === 'Blockchain'} onChange={() => setDomain(domain === 'Blockchain' ? '' : 'Blockchain')} className="accent-blue-600 w-4 h-4 cursor-pointer dark:accent-blue-500" /> Blockchain
                        </label>
                        <label className="flex items-center gap-2.5 mb-2.5 text-sm text-slate-700 hover:text-blue-600 cursor-pointer transition-colors dark:text-slate-300 dark:hover:text-white">
                            <input type="radio" name="domain" checked={domain === 'Cybersecurity'} onChange={() => setDomain(domain === 'Cybersecurity' ? '' : 'Cybersecurity')} className="accent-blue-600 w-4 h-4 cursor-pointer dark:accent-blue-500" /> Cybersecurity
                        </label>
                    </div>

                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 mt-10 shadow-sm dark:bg-blue-900/20 dark:border-blue-500/20 dark:shadow-[0_4px_15px_rgba(59,130,246,0.1)]">
                        <div className="text-blue-700 font-bold text-sm mb-2 drop-shadow-sm dark:text-blue-400">📢 Pro Tip</div>
                        <p className="text-blue-800 text-xs m-0 leading-relaxed dark:text-blue-200">Hackathons with "Beginner Friendly" tags often have mentors available 24/7.</p>
                    </div>
                </aside>

                {/* Hackathons Grid */}
                <main className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold m-0 mb-2.5 text-slate-900 drop-shadow-sm dark:text-white dark:drop-shadow-md">Upcoming Hackathons</h1>
                            <p className="text-slate-600 m-0 dark:text-slate-400">Discover, compete, and win prizes in global challenges.</p>
                        </div>
                        <select className="px-4 py-2 rounded-full border border-gray-200 bg-white text-slate-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none dark:border-white/20 dark:bg-white/5 dark:text-slate-300 dark:focus:ring-blue-500/50 dark:shadow-[0_4px_15px_rgba(0,0,0,0.1)] dark:backdrop-blur-md">
                            <option className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Recommended</option>
                            <option className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Newest</option>
                            <option className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Prize Pool</option>
                        </select>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex flex-col sm:flex-row gap-5 mb-10">
                        <div className="bg-white px-5 py-4 rounded-xl flex items-center gap-4 border border-gray-100 flex-1 shadow-sm group hover:border-gray-300 transition-colors dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] dark:hover:border-white/20">
                            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex justify-center items-center text-xl border border-emerald-100 shadow-sm dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:shadow-[0_0_10px_rgba(16,185,129,0.2)]">📅</div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold dark:text-slate-400">Active Now</div>
                                <div className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors dark:text-white dark:group-hover:text-emerald-400">14 Events</div>
                            </div>
                        </div>
                        <div className="bg-white px-5 py-4 rounded-xl flex items-center gap-4 border border-gray-100 flex-1 shadow-sm group hover:border-gray-300 transition-colors dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] dark:hover:border-white/20">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex justify-center items-center text-xl border border-purple-100 shadow-sm dark:bg-purple-500/20 dark:border-purple-500/30 dark:shadow-[0_0_10px_rgba(168,85,247,0.2)]">🚀</div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold dark:text-slate-400">Upcoming</div>
                                <div className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors dark:text-white dark:group-hover:text-purple-400">{upcomingCount} Events</div>
                            </div>
                        </div>
                        <div className="bg-white px-5 py-4 rounded-xl flex items-center gap-4 border border-gray-100 flex-1 shadow-sm group hover:border-gray-300 transition-colors dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] dark:hover:border-white/20">
                            <div className="w-10 h-10 bg-orange-50 rounded-lg flex justify-center items-center text-xl border border-orange-100 shadow-sm dark:bg-orange-500/20 dark:border-orange-500/30 dark:shadow-[0_0_10px_rgba(249,115,22,0.2)]">👥</div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold dark:text-slate-400">Hackers</div>
                                <div className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors dark:text-white dark:group-hover:text-orange-400">12k+ Active</div>
                            </div>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hackathons.map((hackathon, i) => (
                            <Link to={`/hackathon/${hackathon._id}`} key={hackathon._id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 transition-all duration-300 cursor-pointer block hover:shadow-md hover:border-blue-300 hover:-translate-y-1 group shadow-sm dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] dark:hover:border-white/20 no-underline">
                                <div className="h-[160px] bg-slate-200 relative dark:bg-slate-800">
                                    <img src={hackathon.image || '/assets/hackathons/default-hackathon.jpg'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-80" alt="Cover" />
                                    <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-slate-700 border border-white hover:bg-white transition hover:scale-110 shadow-sm dark:bg-black/40 dark:text-white dark:border-white/20 dark:hover:bg-white/20 dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col h-[calc(100%-160px)]">
                                    <div className="flex gap-2.5 mb-4 flex-wrap">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-[4px] tracking-[0.5px] border shadow-sm dark:shadow-[0_0_5px_rgba(0,0,0,0.1)] ${hackathon.mode === 'ONLINE' ? 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200 dark:bg-fuchsia-500/20 dark:text-fuchsia-300 dark:border-fuchsia-500/30' : (hackathon.mode === 'HYBRID' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30' : 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30')}`}>
                                            {hackathon.mode === 'ONLINE' ? '🌐 ONLINE' : hackathon.mode === 'HYBRID' ? '🏙️ HYBRID' : '🏢 OFFLINE'}
                                        </span>
                                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold px-2 py-1 rounded-[4px] tracking-[0.5px] shadow-sm dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 dark:shadow-[0_0_5px_rgba(0,0,0,0.1)]">
                                            👥 Team Size: {hackathon.teamSize || 4}
                                        </span>
                                        <span className="bg-indigo-50 text-indigo-600 border border-indigo-200 text-[10px] font-bold px-2 py-1 rounded-[4px] tracking-[0.5px] shadow-sm dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30 dark:shadow-[0_0_5px_rgba(0,0,0,0.1)]">
                                            📌 {hackathon.domain || 'Tech'}
                                        </span>
                                    </div>

                                    <h3 className="text-[18px] font-bold m-0 mb-2.5 text-slate-900 group-hover:text-blue-600 transition-colors drop-shadow-sm dark:text-white dark:group-hover:text-blue-400">{hackathon.title}</h3>
                                    <p className="text-slate-600 text-[14px] leading-relaxed m-0 mb-5 h-[42px] overflow-hidden line-clamp-2 dark:text-slate-400">{hackathon.description}</p>

                                    <div className="flex justify-between items-end mb-5 border-t border-gray-100 pt-4 mt-auto dark:border-white/10">
                                        <div className="flex items-center gap-1.5">
                                            <div className="flex -space-x-2">
                                                <div className="w-6 h-6 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden dark:bg-slate-700 dark:border-slate-800">
                                                    <img src={`https://i.pravatar.cc/150?u=${hackathon._id}a`} alt="u1" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="w-6 h-6 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden dark:bg-slate-600 dark:border-slate-800">
                                                    <img src={`https://i.pravatar.cc/150?u=${hackathon._id}b`} alt="u2" className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                            <span className="text-slate-500 text-[12px] font-medium ml-1 dark:text-slate-400">+{Math.floor(Math.random() * 200) + 10}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-slate-500 uppercase font-bold">DEADLINE</div>
                                            <div className="text-[14px] font-bold text-red-600 drop-shadow-sm dark:text-red-400 dark:drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]">
                                                {new Date(hackathon.deadline).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full py-2.5 bg-slate-50 border border-gray-200 text-slate-700 font-bold text-sm rounded-xl text-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-sm group-hover:shadow-md dark:bg-white/10 dark:border-white/20 dark:text-white dark:shadow-[0_4px_10px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]">View Details</button>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-10 gap-2.5">
                        <button className="w-9 h-9 rounded-full border border-gray-200 bg-white text-slate-600 hover:bg-gray-50 hover:text-slate-900 transition-colors flex items-center justify-center cursor-pointer shadow-sm dark:border-white/20 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white">&lt;</button>
                        <button className="w-9 h-9 rounded-full border-none bg-blue-600 text-white font-bold cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-transform dark:shadow-[0_4px_10px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]">1</button>
                        <button className="w-9 h-9 rounded-full border border-gray-200 bg-white text-slate-600 hover:bg-gray-50 hover:text-slate-900 transition-colors flex items-center justify-center cursor-pointer shadow-sm dark:border-white/20 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white">&gt;</button>
                    </div>
                </main>
            </div>

            <footer className="bg-white border-t border-gray-200 py-10 text-center relative z-10 transition-colors duration-300 dark:bg-black/20 dark:backdrop-blur-lg dark:border-white/10">
                <div className="flex justify-center gap-[30px] text-slate-500 text-[14px] mb-[20px] dark:text-slate-400">
                    <span className="hover:text-blue-600 transition-colors cursor-pointer dark:hover:text-white">About</span>
                    <span className="hover:text-blue-600 transition-colors cursor-pointer dark:hover:text-white">Contact</span>
                    <span className="hover:text-blue-600 transition-colors cursor-pointer dark:hover:text-white">Privacy Policy</span>
                    <span className="hover:text-blue-600 transition-colors cursor-pointer dark:hover:text-white">Terms of Service</span>
                </div>
                <div className="text-slate-500 text-[12px]">
                    © 2026 HackConnect. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

