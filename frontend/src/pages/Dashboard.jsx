import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HackathonCard from '../components/HackathonCard';
import { getHackathons } from '../services/api';

export default function Dashboard() {
    const [hackathons, setHackathons] = useState([]);

    useEffect(() => {
        const fetchHackathons = async () => {
            try {
                const res = await getHackathons();
                setHackathons(res.data);
            } catch (err) {
                console.error("Failed to fetch hackathons", err);
                // Fallback dummy data mapped to screenshots
                setHackathons([
                    { id: 1, title: 'Global AI Challenge 2024', mode: 'ONLINE', duration: '48H', description: 'Build the future of generative AI. Solve real-world problems using the latest...', deadline: '2 Days 4h', joinedCount: 120, isStartsIn: false, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80' },
                    { id: 2, title: 'ChainReaction Hack', mode: 'HYBRID', duration: '72H', description: 'Decentralize the future. Connect with top protocols and build dApps...', deadline: '5 Days', joinedCount: 45, isStartsIn: false, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80' },
                    { id: 3, title: 'GreenTech Summit', mode: 'IN-PERSON', duration: '1 WEEK', description: 'Create solutions for a sustainable future. Focus on UI/UX and Impact.', deadline: 'Next Month', joinedCount: 128, isStartsIn: true, image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80' }
                ]);
            }
        };
        fetchHackathons();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-[#fafafa]">
            <Navbar />
            <div className="flex flex-1 overflow-hidden max-w-[1600px] w-full mx-auto">
                <Sidebar className="hidden md:flex" />

                <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                    <div className="mb-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome back, Alex! 👋</h1>
                        <p className="text-gray-500 font-medium">You have 3 upcoming events and 2 pending team invites.</p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
                        {/* Learning Card */}
                        <div className="xl:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
                            <div className="flex-1 w-full">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-extrabold text-xl text-gray-900">Full Stack Certification</h3>
                                    <span className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">75%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-5 overflow-hidden">
                                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <p className="text-gray-500 mb-8 leading-relaxed">Complete the 'Advanced React' module to earn your badge and get recognized by top employers.</p>
                                <div className="flex flex-wrap gap-4">
                                    <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">Resume Learning</button>
                                    <button className="px-6 py-2.5 bg-white text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all border border-gray-200">View Details</button>
                                </div>
                            </div>
                            <div className="w-full md:w-56 h-40 rounded-2xl bg-gray-900 overflow-hidden flex-shrink-0 shadow-lg relative">
                                <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80" alt="Code" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/50 to-transparent"></div>
                            </div>
                        </div>

                        {/* Team Invites */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-extrabold text-xl text-gray-900">Team Invites</h3>
                                <span className="bg-red-50 text-red-500 text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full">2</span>
                            </div>

                            <div className="space-y-6">
                                <div className="group">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-12 h-12 bg-teal-900 rounded-2xl flex items-center justify-center text-teal-400 font-bold text-xl border-2 border-teal-800 shadow-sm">C</div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">CyberPunks</h4>
                                            <p className="text-xs text-gray-500 font-medium">Global AI Hackathon</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 shadow-sm transition">Accept</button>
                                        <button className="flex-1 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 transition">Decline</button>
                                    </div>
                                </div>

                                <div className="group border-t border-gray-50 pt-6">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 font-bold text-xl border border-emerald-200 shadow-sm">P</div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">Pixel Wizards</h4>
                                            <p className="text-xs text-gray-500 font-medium">Game Jam 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 text-center">
                                <a href="/teams" className="text-sm text-blue-600 font-bold hover:text-blue-700 transition">View all teams</a>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mb-8">
                        <h2 className="text-2xl font-extrabold text-gray-900">Upcoming Hackathons</h2>
                        <a href="/hackathons" className="text-sm text-blue-600 font-bold hover:text-blue-700 flex items-center gap-1 transition-transform hover:translate-x-1">
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
