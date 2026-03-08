import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import HackathonCard from '../components/HackathonCard';
import { getHackathons } from '../services/api';

export default function Dashboard() {
    const [hackathons, setHackathons] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // We'll fetch user profile to get the first name, AND hackathons array
                const { getUserProfile, getHackathons } = require('../services/api');

                const [userRes, hackathonsRes] = await Promise.all([
                    getUserProfile().catch(() => ({ data: { name: 'Guest' } })),
                    getHackathons().catch(() => ({ data: [] }))
                ]);

                setUser(userRes.data);
                setHackathons(hackathonsRes.data);

            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                setUser({ name: 'Guest' });
                setHackathons([]);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-1 overflow-hidden max-w-[1600px] w-full mx-auto relative">
                <Sidebar className="hidden md:flex" />

                <main className="flex-1 p-6 md:p-10 overflow-y-auto z-10">
                    <div className="mb-10">
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight drop-shadow-sm dark:text-white dark:drop-shadow-md">
                            Welcome back{user?.name && user.name !== 'Guest' ? `, ${user.name.split(' ')[0]}` : ''}! 👋
                        </h1>
                        <p className="text-slate-600 font-medium dark:text-slate-400">You have upcoming events and pending team invites to manage.</p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
                        {/* Learning Card */}
                        <div className="xl:col-span-2 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-md hover:border-blue-300 transition-all duration-300 group dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] dark:hover:border-white/20">
                            <div className="flex-1 w-full">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-blue-400">Full Stack Certification</h3>
                                    <span className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full border border-blue-200 shadow-sm dark:text-blue-300 dark:bg-blue-500/20 dark:border-blue-500/30 dark:shadow-[0_0_10px_rgba(59,130,246,0.2)]">75%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-5 overflow-hidden shadow-inner border border-gray-200 dark:bg-slate-800/80 dark:border-white/5">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-400 h-full rounded-full shadow-sm dark:shadow-[0_0_10px_rgba(59,130,246,0.8)]" style={{ width: '75%' }}></div>
                                </div>
                                <p className="text-slate-600 mb-8 leading-relaxed dark:text-slate-300">Complete the 'Advanced React' module to earn your badge and get recognized by top employers.</p>
                                <div className="flex flex-wrap gap-4">
                                    <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-[0_4px_15px_rgba(59,130,246,0.4)] hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:-translate-y-0.5 transition-all">Resume Learning</button>
                                    <button className="px-6 py-2.5 bg-white text-slate-700 font-bold rounded-xl hover:bg-gray-50 border border-gray-200 transition-all shadow-sm dark:bg-white/10 dark:text-white dark:border-white/20 dark:hover:bg-white/20 dark:backdrop-blur-sm dark:hover:border-white/30 dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">View Details</button>
                                </div>
                            </div>
                            <div className="w-full md:w-56 h-40 rounded-2xl bg-slate-900 overflow-hidden flex-shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 relative group-hover:border-blue-500/30 transition-colors">
                                <img src="/assets/hackathons/global-game-jam.jpg" alt="Code" className="w-full h-full object-cover opacity-60 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 to-transparent"></div>
                            </div>
                        </div>

                        {/* Team Invites */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm transition-all duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:hover:border-white/20">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Team Invites</h3>
                                <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold w-10 h-7 flex items-center justify-center rounded-full shadow-sm dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30 dark:shadow-[0_0_10px_rgba(239,68,68,0.2)]">2 New</span>
                            </div>

                            <div className="space-y-6">
                                <div className="group">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 font-bold text-xl border border-teal-200 shadow-sm dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/30 dark:shadow-[0_0_15px_rgba(20,184,166,0.15)]">C</div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900 group-hover:text-teal-500 transition-colors dark:text-white dark:group-hover:text-teal-400">CyberPunks</h4>
                                            <p className="text-xs text-slate-500 font-medium dark:text-slate-400">Global AI Hackathon</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="flex-1 py-2 bg-blue-600/90 text-white text-xs font-bold rounded-xl hover:bg-blue-500 shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all">Accept</button>
                                        <button className="flex-1 py-2 bg-white border border-gray-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-gray-50 hover:text-slate-900 shadow-sm transition-all dark:bg-white/5 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white">Decline</button>
                                    </div>
                                </div>

                                <div className="group border-t border-gray-100 pt-6 dark:border-white/10">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 font-bold text-xl border border-purple-200 shadow-sm dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30 dark:shadow-[0_0_15px_rgba(168,85,247,0.15)]">P</div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors dark:text-white dark:group-hover:text-purple-400">Pixel Wizards</h4>
                                            <p className="text-xs text-slate-500 font-medium dark:text-slate-400">Game Jam 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 text-center border-t border-gray-100 dark:border-white/5">
                                <a href="/teams" className="text-sm text-blue-600 font-bold hover:text-blue-500 transition-all dark:text-blue-400 dark:hover:text-blue-300 dark:hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">View all teams</a>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mb-8 mt-4">
                        <h2 className="text-2xl font-extrabold text-slate-900 drop-shadow-sm dark:text-white">Upcoming Hackathons</h2>
                        <a href="/hackathons" className="text-sm text-blue-600 font-bold hover:text-blue-500 transition-all hover:translate-x-1 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] flex items-center gap-1">
                            See all <span>→</span>
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {hackathons.map((hackathon) => (
                            <HackathonCard key={hackathon.id || hackathon._id} hackathon={hackathon} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
