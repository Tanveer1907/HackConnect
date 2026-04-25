import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getUserProfile } from '../services/api';

export default function Profile() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getUserProfile();
                const u = res.data;
                setProfile({
                    name: u.name,
                    email: u.email,
                    role: u.role || 'Developer',
                    university: u.university || 'Not specified',
                    location: u.location || 'Not specified',
                    joined: new Date(u.createdAt).toLocaleDateString() || 'Recently',
                    bio: u.bio || 'No bio provided.',
                    skills: u.skills || [],
                    tags: ['React', 'Node.js', 'MongoDB'], // default tags
                    lookingForTeam: u.lookingForTeam || false,
                    profileImage: u.profileImage || ''
                });
            } catch (err) {
                console.error("Failed to fetch profile", err);
                // Set minimal fallback 
                setProfile({
                    name: 'Guest User',
                    email: 'No Email',
                    role: 'Visitor',
                    university: 'Not specified',
                    location: 'Not specified',
                    joined: 'Today',
                    bio: 'No bio provided.',
                    skills: [],
                    tags: [],
                    profileImage: ''
                });
            }
        };
        fetchProfile();
    }, []);

    if (!profile) return <div className="p-10 text-center font-medium text-gray-500">Loading profile...</div>;

    return (
        <div className="flex flex-col flex-1 text-slate-800 bg-slate-50 transition-colors duration-300 dark:text-slate-200 dark:bg-transparent">
            <div className="flex flex-1 overflow-hidden max-w-[1600px] w-full mx-auto relative z-10">
                <Sidebar className="hidden lg:flex" />

                <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                    <div className="max-w-5xl mx-auto">

                        {/* Header Card */}
                        <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-10 shadow-sm mb-8 flex flex-col md:flex-row items-start gap-8 relative overflow-hidden transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[80px] pointer-events-none dark:bg-blue-500/10"></div>

                            <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-sm relative flex-shrink-0 z-10 dark:bg-slate-800 dark:border-slate-700 dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
                                {profile.profileImage ? (
                                    <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center text-4xl font-extrabold text-white uppercase">
                                        {profile.name ? profile.name.charAt(0) : 'U'}
                                    </div>
                                )}
                                <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-sm dark:border-slate-800 dark:shadow-[0_0_10px_rgba(16,185,129,0.5)] z-20"></div>
                            </div>

                            <div className="flex-1 w-full relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                                    <div>
                                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm dark:text-white">{profile.name}</h1>
                                        <p className="text-blue-600 font-bold drop-shadow-sm dark:text-blue-400">{profile.role}</p>
                                    </div>
                                    <div className="flex gap-3 w-full md:w-auto">
                                        <button
                                            onClick={() => window.location.href = '/edit-profile'}
                                            className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 dark:shadow-[0_4px_15px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                                        >
                                            <span className="text-lg">✏️</span> Edit Profile
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-600 mb-8 font-medium dark:text-slate-400">
                                    <div className="flex items-center gap-2"><span className="text-lg opacity-80">🎓</span> {profile.university}</div>
                                    <div className="flex items-center gap-2"><span className="text-lg opacity-80">📍</span> {profile.location}</div>
                                    <div className="flex items-center gap-2"><span className="text-lg opacity-80">📅</span> {profile.joined}</div>
                                    <div className="flex items-center gap-2"><span className="text-lg opacity-80">📧</span> {profile.email}</div>
                                </div>

                                {profile.lookingForTeam && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-sm dark:bg-blue-900/40 dark:border-blue-500/30 dark:shadow-inner">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-blue-600 text-lg drop-shadow-sm dark:text-blue-400 dark:drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]">📢</span>
                                            <span className="font-extrabold text-slate-900 text-sm dark:text-white">Looking for a team</span>
                                        </div>
                                        <p className="text-sm text-slate-700 leading-relaxed font-medium dark:text-slate-300">
                                            I am currently open to joining teams for upcoming hackathons. Let's build something awesome together!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* About & Skills Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-3 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm text-sm transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                                <h2 className="text-xl font-extrabold text-slate-900 mb-4 tracking-tight drop-shadow-sm dark:text-white">About Me</h2>
                                <p className="text-slate-700 leading-loose text-base dark:text-slate-300">
                                    {profile.bio}
                                </p>
                            </div>

                            <div className="md:col-span-2 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight drop-shadow-sm dark:text-white">
                                        <span className="text-blue-600 text-2xl drop-shadow-sm dark:text-blue-400 dark:drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]">⚡</span> Skills & Expertise
                                    </h2>
                                    <span className="text-sm text-blue-600 font-bold cursor-pointer hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300">View All</span>
                                </div>

                                <div className="space-y-6 mb-10">
                                    {profile.skills.map((skill) => (
                                        <div key={skill.name}>
                                            <div className="flex justify-between text-sm mb-3">
                                                <span className="font-bold text-slate-900 dark:text-white">{skill.name}</span>
                                                <span className="text-slate-500 font-medium dark:text-slate-400">{skill.type}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner dark:bg-slate-800">
                                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full shadow-sm dark:from-blue-600 dark:to-indigo-500 dark:shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${skill.level}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                    {profile.skills.length === 0 && (
                                        <div className="text-center p-6 border border-dashed border-gray-300 rounded-xl text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                                            No skills found. <a href="/edit-profile" className="text-blue-600 hover:underline">Add some skills</a> to your profile!
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2.5">
                                    {profile.tags.map((tag) => (
                                        <span key={tag} className="px-4 py-1.5 bg-slate-50 border border-gray-200 text-slate-700 text-xs font-bold rounded-full shadow-sm hover:bg-gray-100 transition-colors cursor-pointer dark:bg-slate-800/80 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:border-blue-300 transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] dark:hover:border-white/20">
                                <h2 className="text-xl font-extrabold text-slate-900 mb-8 flex items-center gap-3 tracking-tight drop-shadow-sm dark:text-white">
                                    <span className="text-yellow-500 text-2xl drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">🏆</span> Badges
                                </h2>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 text-center">
                                    <div className="flex flex-col items-center group">
                                        <div className="w-14 h-14 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-200 shadow-sm flex items-center justify-center text-2xl mb-3 group-hover:scale-110 group-hover:bg-yellow-100 transition-all dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30 dark:shadow-[0_0_15px_rgba(234,179,8,0.2)] dark:group-hover:bg-yellow-500/30">🏆</div>
                                        <span className="text-[11px] text-slate-600 font-bold group-hover:text-yellow-600 transition-colors dark:text-slate-300 dark:group-hover:text-yellow-400">Winner 2023</span>
                                    </div>
                                    <div className="flex flex-col items-center group">
                                        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 border border-blue-200 shadow-sm flex items-center justify-center text-2xl mb-3 group-hover:scale-110 group-hover:bg-blue-100 transition-all dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30 dark:shadow-[0_0_15px_rgba(59,130,246,0.2)] dark:group-hover:bg-blue-500/30">💻</div>
                                        <span className="text-[11px] text-slate-600 font-bold leading-tight group-hover:text-blue-600 transition-colors dark:text-slate-300 dark:group-hover:text-blue-400">Hackathon MVP</span>
                                    </div>
                                    <div className="flex flex-col items-center group">
                                        <div className="w-14 h-14 rounded-full bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-200 shadow-sm flex items-center justify-center text-2xl mb-3 group-hover:scale-110 group-hover:bg-fuchsia-100 transition-all dark:bg-fuchsia-500/20 dark:text-fuchsia-400 dark:border-fuchsia-500/30 dark:shadow-[0_0_15px_rgba(217,70,239,0.2)] dark:group-hover:bg-fuchsia-500/30">👥</div>
                                        <span className="text-[11px] text-slate-600 font-bold group-hover:text-fuchsia-600 transition-colors dark:text-slate-300 dark:group-hover:text-fuchsia-400">Top Mentor</span>
                                    </div>
                                    <div className="flex flex-col items-center mt-2 group">
                                        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm flex items-center justify-center text-2xl mb-3 group-hover:scale-110 group-hover:bg-emerald-100 transition-all dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 dark:shadow-[0_0_15px_rgba(16,185,129,0.2)] dark:group-hover:bg-emerald-500/30">🚀</div>
                                        <span className="text-[11px] text-slate-600 font-bold group-hover:text-emerald-600 transition-colors dark:text-slate-300 dark:group-hover:text-emerald-400">First Launch</span>
                                    </div>
                                    <div className="flex flex-col items-center mt-2 md:opacity-40">
                                        <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-500 border border-dashed border-gray-300 flex items-center justify-center text-2xl mb-3 dark:bg-slate-800 dark:border-white/20">🔒</div>
                                        <span className="text-[11px] text-slate-500 font-bold">Locked</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
