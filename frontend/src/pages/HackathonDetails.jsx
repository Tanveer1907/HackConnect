import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getHackathonDetails, createTeam, sendTeamRequest } from '../services/api';

export default function HackathonDetails() {
    const { id } = useParams();
    const [hackathon, setHackathon] = useState(null);
    const [teamName, setTeamName] = useState('');
    const [joinTeamId, setJoinTeamId] = useState('');
    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const [showJoinTeam, setShowJoinTeam] = useState(false);

    const handleCreateTeam = async () => {
        if (!teamName) return alert('Please enter a team name');
        try {
            await createTeam({ name: teamName, hackathonId: id });
            alert("Team created successfully!");
            setTeamName('');
            setShowCreateTeam(false);
        } catch (err) {
            alert("Error creating team: " + (err.response?.data?.message || err.message));
        }
    };

    const handleJoinTeam = async () => {
        if (!joinTeamId) return alert('Please enter a Team ID');
        try {
            await sendTeamRequest(joinTeamId);
            alert("Join request sent successfully!");
            setJoinTeamId('');
            setShowJoinTeam(false);
        } catch (err) {
            alert("Error sending request: " + (err.response?.data?.message || err.message));
        }
    };

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
        <div className="flex flex-col flex-1 bg-[#fafafa] transition-colors duration-300 dark:bg-transparent">
            <div className="flex flex-1 overflow-hidden max-w-[1600px] w-full mx-auto">
                <Sidebar className="hidden lg:flex" />

                <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                    <Link to="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 inline-flex items-center gap-2 transition dark:text-slate-400 dark:hover:text-white">
                        <span className="text-lg">←</span> Back to Dashboard
                    </Link>

                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                        <div className="h-72 md:h-96 w-full relative group">
                            <img src={hackathon.image || '/assets/hackathons/default-hackathon.jpg'} alt={hackathon.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-105 opacity-90 dark:opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent dark:from-black/90 dark:via-gray-900/40"></div>
                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 inline-block uppercase tracking-wider shadow-sm dark:bg-blue-500/80 dark:shadow-md">
                                    {hackathon.domain}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 drop-shadow-sm dark:drop-shadow-md">
                                    {hackathon.title}
                                </h1>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                                <div className="flex gap-4 items-center bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-inner">
                                    <div className="text-2xl drop-shadow-sm">🏆</div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider dark:text-slate-400">Prize Pool</p>
                                        <p className="font-extrabold text-xl text-gray-900 transition-colors duration-300 dark:text-white">{hackathon.prizePool || '$10,000'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 w-full md:w-auto">
                                    <button onClick={() => setShowCreateTeam(!showCreateTeam)} className="w-full md:w-auto px-10 py-3 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all hover:-translate-y-1 dark:shadow-[0_4px_15px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                                        Create Team
                                    </button>
                                    <button onClick={() => setShowJoinTeam(!showJoinTeam)} className="w-full md:w-auto px-10 py-3 bg-white border-2 border-blue-600 text-blue-600 text-lg font-bold rounded-xl hover:bg-blue-50 transition-all hover:-translate-y-1 dark:bg-transparent dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20">
                                        Join Team
                                    </button>
                                </div>
                            </div>
                            
                            {/* Actions Dropdowns */}
                            {(showCreateTeam || showJoinTeam) && (
                                <div className="mb-10 p-6 bg-blue-50 rounded-2xl border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
                                    {showCreateTeam && (
                                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                                            <input 
                                                type="text" 
                                                placeholder="Enter Team Name" 
                                                value={teamName}
                                                onChange={(e) => setTeamName(e.target.value)}
                                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                            />
                                            <button onClick={handleCreateTeam} className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">Submit</button>
                                        </div>
                                    )}
                                    {showJoinTeam && (
                                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                                            <input 
                                                type="text" 
                                                placeholder="Enter Team ID to Join" 
                                                value={joinTeamId}
                                                onChange={(e) => setJoinTeamId(e.target.value)}
                                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                            />
                                            <button onClick={handleJoinTeam} className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">Send Request</button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5 dark:text-slate-400"><span className="text-red-500 drop-shadow-sm">📅</span> Deadline</div>
                                    <div className="font-bold text-gray-900 transition-colors duration-300 dark:text-white">{hackathon.deadline}</div>
                                </div>
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5 dark:text-slate-400"><span className="text-blue-500 drop-shadow-sm">🎯</span> Domain</div>
                                    <div className="font-bold text-gray-900 transition-colors duration-300 dark:text-white">{hackathon.domain}</div>
                                </div>
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5 dark:text-slate-400"><span className="text-fuchsia-500 drop-shadow-sm">🌐</span> Mode</div>
                                    <div className="font-bold text-gray-900 transition-colors duration-300 dark:text-white">{hackathon.mode}</div>
                                </div>
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5 dark:text-slate-400"><span className="text-emerald-500 drop-shadow-sm">👥</span> Team Size</div>
                                    <div className="font-bold text-gray-900 transition-colors duration-300 dark:text-white">{hackathon.teamSize}</div>
                                </div>
                            </div>

                            <div className="max-w-4xl">
                                <h3 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight border-b border-gray-200 pb-4 transition-colors duration-300 dark:text-white dark:border-white/10">About this Hackathon</h3>
                                <p className="text-gray-600 leading-loose text-lg whitespace-pre-line transition-colors duration-300 dark:text-slate-300">
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
