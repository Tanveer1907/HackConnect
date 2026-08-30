import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getHackathonDetails, createTeam, sendTeamRequest, registerForHackathon } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function HackathonDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const [hackathon, setHackathon] = useState(null);
    const [teamName, setTeamName] = useState('');
    const [joinTeamId, setJoinTeamId] = useState('');
    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const [showJoinTeam, setShowJoinTeam] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState(null);

    const handleSoloRegister = async () => {
        setIsRegistering(true);
        try {
            await registerForHackathon(id);
            toast.success("Successfully registered for this hackathon!");
            const res = await getHackathonDetails(id);
            setHackathon(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setIsRegistering(false);
        }
    };

    const handleCreateTeam = async () => {
        if (!teamName) return toast.error('Please enter a team name');
        try {
            await createTeam({ name: teamName, hackathonId: id });
            toast.success("Team created successfully!");
            setTeamName('');
            setShowCreateTeam(false);
        } catch (err) {
            toast.error("Error creating team: " + (err.response?.data?.message || err.message));
        }
    };

    const handleJoinTeam = async () => {
        if (!joinTeamId) return toast.error('Please enter a Team ID');
        try {
            await sendTeamRequest(joinTeamId);
            toast.success("Join request sent successfully!");
            setJoinTeamId('');
            setShowJoinTeam(false);
        } catch (err) {
            toast.error("Error sending request: " + (err.response?.data?.message || err.message));
        }
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setError(null);
                const res = await getHackathonDetails(id);
                setHackathon(res.data);
            } catch (err) {
                console.error("Failed to fetch hackathon details", err);
                setError("Failed to load hackathon details. Please try again later.");
                toast.error("Failed to load hackathon details.");
            }
        };
        fetchDetails();
    }, [id]);

    if (error) {
        return (
            <div className="flex flex-col flex-1 bg-[#fafafa] dark:bg-[#0f172a] justify-center items-center p-10 text-center text-red-500 font-bold">
                <span className="text-4xl mb-4">⚠️</span>
                {error}
                <Link to="/dashboard" className="mt-6 text-sm text-blue-600 hover:underline dark:text-blue-400">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

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
                                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                                    <button 
                                        onClick={handleSoloRegister}
                                        disabled={isRegistering || hackathon.registeredUsers?.some(u => (u._id || u) === user?._id)}
                                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/40 text-white font-bold rounded-xl shadow-md transition disabled:cursor-not-allowed"
                                    >
                                        {hackathon.registeredUsers?.some(u => (u._id || u) === user?._id) ? '✓ Registered' : isRegistering ? 'Registering...' : 'Register (Solo)'}
                                    </button>
                                    <button 
                                        onClick={() => setShowCreateTeam(true)} 
                                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition"
                                    >
                                        Create Team
                                    </button>
                                    <button 
                                        onClick={() => setShowJoinTeam(true)} 
                                        className="px-6 py-3 bg-white border border-gray-200 text-slate-700 font-bold rounded-xl hover:bg-gray-50 transition dark:bg-white/5 dark:text-slate-200 dark:border-white/10"
                                    >
                                        Join Team
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5 dark:text-slate-400"><span className="text-red-500 drop-shadow-sm">📅</span> Deadline</div>
                                    <div className="font-bold text-gray-900 transition-colors duration-300 dark:text-white">
                                        {hackathon.deadline ? new Date(hackathon.deadline).toLocaleDateString() : 'Rolling'}
                                    </div>
                                </div>
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5 dark:text-slate-400"><span className="text-blue-500 drop-shadow-sm">🎯</span> Domain</div>
                                    <div className="font-bold text-gray-900 transition-colors duration-300 dark:text-white">{hackathon.domain || 'General'}</div>
                                </div>
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5 dark:text-slate-400"><span className="text-fuchsia-500 drop-shadow-sm">🌐</span> Mode</div>
                                    <div className="font-bold text-gray-900 transition-colors duration-300 dark:text-white">{hackathon.mode || 'ONLINE'}</div>
                                </div>
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5 dark:text-slate-400"><span className="text-emerald-500 drop-shadow-sm">👥</span> Team Size</div>
                                    <div className="font-bold text-gray-900 transition-colors duration-300 dark:text-white">Up to {hackathon.teamSize || 4}</div>
                                </div>
                            </div>

                            <div className="max-w-4xl mb-12">
                                <h3 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight border-b border-gray-200 pb-4 transition-colors duration-300 dark:text-white dark:border-white/10">About this Hackathon</h3>
                                <p className="text-gray-600 leading-loose text-base whitespace-pre-line transition-colors duration-300 dark:text-slate-300">
                                    {hackathon.description}
                                </p>
                            </div>

                            {/* Submissions Gallery */}
                            <div className="max-w-4xl pt-8 border-t border-gray-200 dark:border-white/10">
                                <h3 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight flex items-center gap-2 dark:text-white">
                                    💡 Project Submissions ({hackathon.submissions?.length || 0})
                                </h3>

                                {(!hackathon.submissions || hackathon.submissions.length === 0) ? (
                                    <div className="p-8 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl text-center text-slate-500 dark:text-slate-400">
                                        No project submissions yet. Be the first team to submit!
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {hackathon.submissions.map((sub, idx) => (
                                            <div key={idx} className="p-5 bg-slate-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">{sub.projectTitle}</h4>
                                                        <span className="text-[10px] px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold rounded-md">{sub.teamName || 'Solo'}</span>
                                                    </div>
                                                    {sub.tagline && <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 font-medium">{sub.tagline}</p>}
                                                    {sub.description && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{sub.description}</p>}
                                                    {sub.techStack && sub.techStack.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                                            {sub.techStack.map((tech, tIdx) => (
                                                                <span key={tIdx} className="text-[10px] bg-slate-200/60 dark:bg-white/10 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 font-semibold">{tech}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-white/5">
                                                    {sub.githubUrl && (
                                                        <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">
                                                            GitHub ↗
                                                        </a>
                                                    )}
                                                    {sub.demoUrl && (
                                                        <a href={sub.demoUrl} target="_blank" rel="noreferrer" className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline ml-3">
                                                            Live Demo ↗
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* CREATE TEAM MODAL */}
            {showCreateTeam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-200 dark:border-white/10 p-6 md:p-8 max-w-md w-full shadow-2xl relative">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">🚀 Create a Team</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Form a new squad for {hackathon.title}</p>
                            </div>
                            <button
                                onClick={() => setShowCreateTeam(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Team Name *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Neural Ninjas"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    autoFocus
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateTeam(false)}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCreateTeam}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-md transition"
                                >
                                    Create Team
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* JOIN TEAM MODAL */}
            {showJoinTeam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-200 dark:border-white/10 p-6 md:p-8 max-w-md w-full shadow-2xl relative">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">🤝 Join an Existing Team</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Enter the Team ID shared by your team leader</p>
                            </div>
                            <button
                                onClick={() => setShowJoinTeam(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Team ID *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter 24-character Team ID"
                                    value={joinTeamId}
                                    onChange={(e) => setJoinTeamId(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    autoFocus
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowJoinTeam(false)}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleJoinTeam}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-md transition"
                                >
                                    Send Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
