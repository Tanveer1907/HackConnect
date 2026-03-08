import React from 'react';

export default function TeamCard({ filterMatched, onInviteClick }) {
    return (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden hover:-translate-y-1.5 hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col h-full relative group shadow-sm dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] dark:hover:border-white/20">

            {/* Subtle background glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none dark:from-blue-500/10"></div>

            <div className="p-7 flex-1 flex flex-col relative z-10">
                {/* Header: Profile and Info Stack */}
                <div className="flex items-start gap-4 mb-6">
                    {/* Left: Avatar */}
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden shrink-0 mt-0.5 dark:bg-slate-800 dark:border-slate-700 dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center">
                        {filterMatched.profileImage ? (
                            <img src={filterMatched.profileImage} alt={filterMatched.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center text-lg md:text-xl font-bold text-white uppercase">
                                {filterMatched.name ? filterMatched.name.charAt(0) : 'U'}
                            </div>
                        )}
                    </div>

                    {/* Right: Info and Badge Stack */}
                    <div className="flex flex-col flex-1">
                        <h3 className="font-extrabold text-slate-900 text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors drop-shadow-sm dark:text-white dark:group-hover:text-blue-400">{filterMatched.name}</h3>
                        <p className="text-xs text-slate-500 font-medium mb-0.5 dark:text-slate-400">{filterMatched.university}</p>
                        <p className="text-[11px] font-bold text-blue-600 mb-3 dark:text-blue-400">{filterMatched.major}</p>

                        <div className="self-start">
                            <span className="bg-emerald-50 text-emerald-600 font-bold text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full border border-emerald-200 shadow-sm dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 dark:shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                Looking for Team
                            </span>
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="mb-6">
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Skills</span>
                        <span className="text-[13px] font-extrabold text-emerald-600 leading-none drop-shadow-sm dark:text-emerald-400 dark:drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">{filterMatched.matchPercentage}% Match</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {filterMatched.skills.map((skill, idx) => (
                            <div key={idx} className="bg-slate-50 border border-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm dark:bg-slate-800/80 dark:border-white/10 dark:shadow-inner">
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{skill.name}</span>
                                {skill.level && <span className="text-[10px] font-bold text-slate-500">{skill.level}</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Role Need Badge */}
                <div className="mb-6">
                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-[11px] font-bold px-3 py-1.5 rounded-full border border-indigo-200 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30 dark:shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                        <span className="text-sm">🗣️</span> {filterMatched.roleRequirement}
                    </span>
                </div>

                {/* Stats Flex */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4 mb-6 text-center mt-auto bg-slate-50 rounded-xl dark:border-white/10 dark:bg-black/20">
                    <div>
                        <div className="text-xl font-extrabold text-slate-900 mb-0.5 dark:text-white">{filterMatched.hackathons}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Hackathons</div>
                    </div>
                    <div>
                        <div className="text-xl font-extrabold text-slate-900 mb-0.5 dark:text-white">{filterMatched.projects}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Projects</div>
                    </div>
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {filterMatched.interests.map(tag => (
                        <span key={tag} className="text-xs font-semibold text-slate-500 bg-white border border-gray-200 px-2 py-1 rounded-md shadow-sm dark:text-slate-400 dark:bg-white/5 dark:border-white/10">
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 text-sm mt-auto">
                    <button
                        onClick={() => onInviteClick(filterMatched)}
                        className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 shadow-[0_4px_10px_rgba(59,130,246,0.3)] transition-all active:scale-95 dark:hover:bg-blue-500 dark:shadow-[0_4px_15px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                    >
                        Invite
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center bg-white text-slate-500 rounded-xl hover:bg-gray-50 hover:text-slate-900 transition-colors border border-gray-200 hover:border-gray-300 shadow-sm dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-white dark:hover:border-white/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center bg-white text-slate-500 rounded-xl hover:bg-gray-50 hover:text-slate-900 transition-colors border border-gray-200 hover:border-gray-300 shadow-sm dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-white dark:hover:border-white/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
