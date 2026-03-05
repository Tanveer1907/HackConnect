import React from 'react';

export default function TeamCard({ filterMatched, onInviteClick }) {
    return (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-5px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full shadow-sm relative group">

            {/* Looking For Team Badge */}
            <div className="absolute top-6 right-6 z-10">
                <span className="bg-emerald-50 text-emerald-600 font-bold text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full border border-emerald-100/50">
                    Looking for Team
                </span>
            </div>

            <div className="p-7 flex-1 flex flex-col">
                {/* Header Profile */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden shrink-0">
                        <img src={`https://i.pravatar.cc/150?u=${filterMatched.id}`} alt={filterMatched.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-gray-900 text-lg leading-tight">{filterMatched.name}</h3>
                        <p className="text-xs text-gray-500 font-medium mb-0.5">{filterMatched.university}</p>
                        <p className="text-[11px] font-bold text-[#2b3ee3]">{filterMatched.major}</p>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="mb-6">
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Skills</span>
                        <span className="text-[13px] font-extrabold text-[#2b3ee3] leading-none">{filterMatched.matchPercentage}% Match</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {filterMatched.skills.map((skill, idx) => (
                            <div key={idx} className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-gray-700">{skill.name}</span>
                                {skill.level && <span className="text-[10px] font-bold text-gray-400">{skill.level}</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Role Need Badge */}
                <div className="mb-6">
                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold px-3 py-1.5 rounded-full border border-indigo-100">
                        <span className="text-sm">🗣️</span> {filterMatched.roleRequirement}
                    </span>
                </div>

                {/* Stats Flex */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-50 py-4 mb-6 text-center mt-auto">
                    <div>
                        <div className="text-xl font-extrabold text-gray-900 mb-0.5">{filterMatched.hackathons}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Hackathons</div>
                    </div>
                    <div>
                        <div className="text-xl font-extrabold text-gray-900 mb-0.5">{filterMatched.projects}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Projects</div>
                    </div>
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {filterMatched.interests.map(tag => (
                        <span key={tag} className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 text-sm mt-auto">
                    <button
                        onClick={() => onInviteClick(filterMatched)}
                        className="flex-1 bg-[#2b3ee3] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#202eb8] shadow-md shadow-blue-500/20 transition-all active:scale-95"
                    >
                        Invite
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
