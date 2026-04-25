import React, { useState, useEffect } from 'react';
import TeamCard from '../components/TeamCard';
import { getAllUsers, getUserProfile, getRecommendedTeammates } from '../services/api';

export default function Teams() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [skillFilter, setSkillFilter] = useState('');
    const [uniFilter, setUniFilter] = useState('');
    const [expFilter, setExpFilter] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let currentUserId = null;
                let response;

                if (localStorage.getItem('token')) {
                    try {
                        const profileObj = await getUserProfile();
                        currentUserId = profileObj.data._id;
                        response = await getRecommendedTeammates();
                    } catch (e) {
                        response = await getAllUsers();
                    }
                } else {
                    response = await getAllUsers();
                }

                // Map the backend user model to the format expected by TeamCard
                // Filter out the logged-in user so they don't appear in the talent list
                const filteredUsers = currentUserId ? response.data.filter(u => u._id !== currentUserId) : response.data;

                const formattedUsers = filteredUsers.map(user => ({
                    id: user._id,
                    name: user.name,
                    profileImage: user.profileImage || "",
                    university: user.university || "University Not Specified",
                    major: user.major || "Role Not Specified",
                    matchPercentage: user.matchScore !== undefined ? user.matchScore : Math.floor(Math.random() * (99 - 70 + 1)) + 70,
                    skills: user.skills ? user.skills.map(skill => ({ name: skill.name || skill })) : [],
                    roleRequirement: user.bio || "Looking for a team",
                    hackathons: user.hackathonsParticipated?.length || 0,
                    projects: 0,
                    interests: []
                }));
                setUsers(formattedUsers);
            } catch (err) {
                console.error("Failed to fetch users:", err);
                setError("Failed to load talents. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="flex flex-col flex-1 font-sans text-slate-800 overflow-x-hidden transition-colors duration-300 dark:text-slate-200">
            <main className="flex-1 pb-20 relative z-10">
                {/* HERO SECTION */}
                <section className="mx-auto max-w-[1400px] px-6 md:px-12 mt-8 lg:mt-12 mb-8">
                    <div className="bg-white border border-gray-100 rounded-[2rem] p-10 md:p-16 lg:p-24 text-center text-slate-900 shadow-sm relative overflow-hidden transition-colors duration-300 dark:bg-gradient-to-br dark:from-[#1e293b] dark:to-[#0f172a] dark:border-white/10 dark:text-white dark:shadow-[0_0_40px_rgba(59,130,246,0.15)]">
                        <div className="absolute inset-0 opacity-5 dark:opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                        {/* Glow orbs */}
                        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-[100px] pointer-events-none dark:bg-blue-600/20"></div>
                        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-purple-100 rounded-full blur-[100px] pointer-events-none dark:bg-purple-600/20"></div>

                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-sm dark:drop-shadow-md">
                                Find the Perfect Teammate for<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Your Next Hackathon</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed dark:text-slate-400">
                                Collaborate, build, and innovate together with top talent from around the world. Your dream project starts with the right team.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                <button className="flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-bold rounded-full shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:-translate-y-1 transition-all w-full sm:w-auto">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                                    Get Started
                                </button>
                                <button className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-800 border border-gray-200 hover:bg-gray-50 font-bold rounded-full transition-all w-full sm:w-auto shadow-sm dark:bg-white/5 dark:hover:bg-white/10 dark:text-white dark:border-white/20 dark:backdrop-blur-sm dark:shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                                    How it works
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FILTER BAR SECTION */}
                <section className="mx-auto max-w-[1100px] px-6 md:px-12 -mt-16 mb-16 relative z-20">
                    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3 transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border-white/10">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input type="text" placeholder="Skills or Tech Stack" value={skillFilter} onChange={e => setSkillFilter(e.target.value)} className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all shadow-inner dark:bg-slate-800/50 dark:border-transparent dark:focus:border-blue-500/50 dark:text-white dark:placeholder-slate-400 dark:focus:bg-slate-800/80" />
                        </div>

                        <div className="hidden md:block w-px bg-gray-200 my-2 dark:bg-white/10"></div>

                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v6.5"></path></svg>
                            </div>
                            <input type="text" placeholder="College / University" value={uniFilter} onChange={e => setUniFilter(e.target.value)} className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all shadow-inner dark:bg-slate-800/50 dark:border-transparent dark:focus:border-blue-500/50 dark:text-white dark:placeholder-slate-400 dark:focus:bg-slate-800/80" />
                        </div>

                        <div className="hidden md:block w-px bg-gray-200 my-2 dark:bg-white/10"></div>

                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            </div>
                            <select value={expFilter} onChange={e => setExpFilter(e.target.value)} className="block w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium text-slate-900 appearance-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all shadow-inner dark:bg-slate-800/50 dark:border-transparent dark:focus:border-blue-500/50 dark:text-slate-400 dark:focus:text-white dark:focus:bg-slate-800/80">
                                <option value="">Experience Level</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PROFILE CARDS GRID */}
                <section className="mx-auto max-w-[1400px] px-6 md:px-12 mb-16">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-500 font-medium">{error}</div>
                    ) : (() => {
                        // Apply filters
                        const filteredList = users.filter(user => {
                            const matchSkill = !skillFilter || user.skills?.some(s => s.name.toLowerCase().includes(skillFilter.toLowerCase()));
                            const matchUni = !uniFilter || user.university.toLowerCase().includes(uniFilter.toLowerCase());
                            return matchSkill && matchUni;
                        });

                        if (filteredList.length === 0) {
                            return <div className="text-center py-20 text-slate-500 font-medium">No talents found matching your filters.</div>;
                        }

                        return (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredList.map((talent) => (
                                    <TeamCard
                                        key={talent.id}
                                        filterMatched={talent}
                                        onInviteClick={(user) => setSelectedUser(user)}
                                    />
                                ))}
                            </div>
                        );
                    })()}
                </section>

                {/* VIEW MORE TALENTS */}
                <div className="flex justify-center mb-10">
                    <button className="px-8 py-3.5 bg-white border border-gray-200 text-slate-800 font-bold rounded-full shadow-sm hover:shadow-md hover:border-gray-300 hover:bg-gray-50 transition-all dark:bg-white/5 dark:border-white/20 dark:text-white dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] dark:hover:border-white/40 dark:hover:bg-white/10 dark:backdrop-blur-md">
                        View More Talents
                    </button>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="border-t border-gray-200 bg-white py-12 text-sm text-slate-500 relative z-10 transition-colors duration-300 dark:border-white/10 dark:bg-black/20 dark:backdrop-blur-lg dark:text-slate-400">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
                        <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center shadow-sm dark:bg-blue-500 dark:shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                        </div>
                        HackConnect
                    </div>

                    <div className="flex gap-8 font-medium">
                        <a href="#" className="hover:text-blue-600 transition-colors dark:hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-600 transition-colors dark:hover:text-white">Terms of Service</a>
                        <a href="#" className="hover:text-blue-600 transition-colors dark:hover:text-white">Help Center</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer text-slate-600 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/20 dark:text-slate-300">
                            <svg className="w-4 h-4 text-current" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer text-slate-600 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/20 dark:text-slate-300">
                            <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center text-xs text-slate-500">
                    © 2026 HackConnect Inc. All rights reserved.
                </div>
            </footer>

            {/* SLIDE OUT INVITE PANEL */}
            {selectedUser && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    {/* Backdrop Blur overlay */}
                    <div
                        className="absolute inset-0 bg-slate-900/60 transition-opacity dark:bg-[#0f172a]/80 dark:backdrop-blur-sm"
                        onClick={() => setSelectedUser(null)}
                    ></div>

                    {/* Slide Panel */}
                    <div className="relative w-full max-w-md bg-white border-l border-gray-200 h-full shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out] transition-colors duration-300 dark:bg-slate-900 dark:border-white/10 dark:shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50 dark:backdrop-blur-xl dark:border-white/10">
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Invite to Team</h2>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-slate-500 transition-colors dark:hover:bg-white/10 dark:text-slate-400"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto font-medium">

                            {/* Profile Preview */}
                            <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-4 mb-8 relative overflow-hidden group dark:bg-white/5 dark:border-white/10">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-blue-500/10"></div>
                                <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0 relative z-10 dark:border-slate-700 dark:shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center">
                                    {selectedUser.profileImage ? (
                                        <img src={selectedUser.profileImage} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center text-[22px] font-extrabold text-white uppercase">
                                            {selectedUser.name ? selectedUser.name.charAt(0) : 'U'}
                                        </div>
                                    )}
                                </div>
                                <div className="relative z-10">
                                    <h3 className="font-bold text-slate-900 text-[15px] leading-tight group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-blue-400">{selectedUser.name}</h3>
                                    <p className="text-[13px] text-slate-500 dark:text-slate-400">{selectedUser.university} • {selectedUser.major && selectedUser.major.includes('Science') ? 'CS' : 'Developer'}</p>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="mb-6">
                                <label className="block text-[13px] font-bold text-slate-700 mb-2 dark:text-slate-300">Select Hackathon</label>
                                <div className="relative">
                                    <select className="w-full pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-xl text-sm text-slate-900 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm dark:bg-slate-800/80 dark:border-white/10 dark:text-white dark:focus:border-blue-500/50 dark:shadow-inner">
                                        <option>Global AI Innovations 2024</option>
                                        <option>Web3 Builders Hack</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-[13px] font-bold text-slate-700 mb-2 dark:text-slate-300">Message Request</label>
                                <textarea
                                    rows="4"
                                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-[13.5px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none leading-relaxed shadow-sm dark:bg-slate-800/80 dark:border-white/10 dark:text-slate-300 dark:focus:border-blue-500/50 dark:shadow-inner"
                                    defaultValue={`Hey ${selectedUser.name?.split(' ')[0]}! I saw you have great experience with ${selectedUser.skills && selectedUser.skills.length > 0 ? selectedUser.skills[0].name : 'your tech stack'}. We are looking for a teammate who can handle the ${selectedUser.major && selectedUser.major.includes('Science') ? 'backend' : 'frontend'} while I work on the ${selectedUser.major && selectedUser.major.includes('Science') ? 'frontend' : 'backend'} for the AI hackathon. Interested?`}
                                ></textarea>
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3 items-start shadow-sm dark:bg-blue-900/40 dark:border-blue-500/30 dark:shadow-[0_4px_15px_rgba(29,78,216,0.1)]">
                                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm dark:bg-blue-500 dark:shadow-[0_0_8px_rgba(59,130,246,0.8)]">i</div>
                                <p className="text-[13px] text-blue-800 leading-relaxed font-medium dark:text-blue-200">
                                    Sending an invitation will allow the user to view your team profile and project details. You'll be notified when they respond.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex gap-4 bg-gray-50 relative z-10 text-sm shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900/80 dark:border-white/10 dark:backdrop-blur-xl dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-6 py-3.5 bg-white border border-gray-300 text-slate-600 font-bold rounded-full hover:bg-gray-100 hover:text-slate-900 transition-colors w-28 text-center shadow-sm dark:bg-white/5 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 shadow-sm transition-all text-center dark:shadow-[0_4px_15px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:-translate-y-0.5"
                                onClick={() => setSelectedUser(null)}
                            >
                                Send Invitation
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Slide Animation Keyframes */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}} />
        </div>
    );
}
