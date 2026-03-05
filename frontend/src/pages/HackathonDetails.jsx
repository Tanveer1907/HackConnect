import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getHackathonDetails } from '../services/api';

export default function HackathonDetails() {
    const { id } = useParams();
    const [hackathon, setHackathon] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await getHackathonDetails(id);
                setHackathon(res.data);
            } catch (err) {
                console.error("Failed to fetch hackathon details", err);
                // Fallback for UI demonstration
                setHackathon({
                    title: 'Global AI Challenge 2024',
                    description: 'Build the future of generative AI. Solve real-world problems using the latest AI models and agents. Join thousands of developers worldwide to create innovative solutions that can revolutionize fields ranging from healthcare to sustainable energy. Mentors from top tech companies will be available 24/7 to help you crack the toughest challenges.',
                    deadline: 'October 15, 2024',
                    domain: 'AI & Machine Learning',
                    mode: 'ONLINE',
                    teamSize: '1-4 Members',
                    prizePool: '$50,000',
                    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80'
                });
            }
        };
        fetchDetails();
    }, [id]);

    if (!hackathon) return <div className="p-10 text-center font-medium text-gray-500">Loading hackathon info...</div>;

    return (
        <div className="flex flex-col min-h-screen bg-[#fafafa]">
            <Navbar />
            <div className="flex flex-1 overflow-hidden max-w-[1600px] w-full mx-auto">
                <Sidebar className="hidden lg:flex" />

                <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                    <Link to="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 inline-flex items-center gap-2 transition">
                        <span className="text-lg">←</span> Back to Dashboard
                    </Link>

                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="h-72 md:h-96 w-full relative group">
                            <img src={hackathon.image} alt={hackathon.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 inline-block uppercase tracking-wider">{hackathon.domain}</span>
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 drop-shadow-sm">{hackathon.title}</h1>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                                <div className="flex gap-4 items-center bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100">
                                    <div className="text-2xl">🏆</div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Prize Pool</p>
                                        <p className="font-extrabold text-xl text-gray-900">{hackathon.prizePool || '$10,000'}</p>
                                    </div>
                                </div>
                                <button className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all hover:-translate-y-1">
                                    Join Hackathon
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5"><span className="text-red-500">📅</span> Deadline</div>
                                    <div className="font-bold text-gray-900">{hackathon.deadline}</div>
                                </div>
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5"><span className="text-blue-500">🎯</span> Domain</div>
                                    <div className="font-bold text-gray-900">{hackathon.domain}</div>
                                </div>
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5"><span className="text-fuchsia-500">🌐</span> Mode</div>
                                    <div className="font-bold text-gray-900">{hackathon.mode}</div>
                                </div>
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5"><span className="text-emerald-500">👥</span> Team Size</div>
                                    <div className="font-bold text-gray-900">{hackathon.teamSize}</div>
                                </div>
                            </div>

                            <div className="max-w-4xl">
                                <h3 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight border-b border-gray-100 pb-4">About this Hackathon</h3>
                                <p className="text-gray-600 leading-loose text-lg whitespace-pre-line">
                                    {hackathon.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
