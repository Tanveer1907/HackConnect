import React from 'react';
import { Link } from 'react-router-dom';

export default function HackathonCard({ hackathon }) {
    const isStartsIn = hackathon.isStartsIn;

    return (
        <Link to={`/hackathon/${hackathon._id || hackathon.id || 1}`} className="block bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 group dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] dark:hover:border-white/20">
            <div className="h-44 bg-gray-100 relative dark:bg-slate-800">
                <img
                    src={hackathon.image || '/assets/hackathons/default-hackathon.jpg'}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-80"
                    alt={hackathon.title}
                />
                <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-800 border border-gray-200 hover:bg-gray-50 transition hover:scale-110 shadow-sm dark:bg-black/40 dark:backdrop-blur-md dark:text-white dark:border-white/20 dark:hover:bg-white/20 dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                </div>
                {hackathon.deadline.includes('Days') && (
                    <div className="absolute top-4 right-14 bg-white border border-gray-200 text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm drop-shadow-sm dark:bg-white/10 dark:backdrop-blur-md dark:border-white/20 dark:text-white dark:drop-shadow-md">
                        In {parseInt(hackathon.deadline)} days
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col h-[calc(100%-11rem)]">
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide border shadow-sm dark:shadow-[0_0_5px_rgba(0,0,0,0.1)] ${hackathon.mode === 'ONLINE' ? 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200 dark:bg-fuchsia-500/20 dark:text-fuchsia-300 dark:border-fuchsia-500/30' : (hackathon.mode === 'HYBRID' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30' : 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30')}`}>
                        {hackathon.mode === 'ONLINE' ? '🌐 ONLINE' : hackathon.mode === 'HYBRID' ? '🏙️ HYBRID' : '🏢 OFFLINE'}
                    </span>
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide shadow-sm dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 dark:shadow-[0_0_5px_rgba(0,0,0,0.1)]">
                        📍 {hackathon.location || 'India'}
                    </span>
                    <span className="bg-indigo-50 text-indigo-600 border border-indigo-200 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide shadow-sm dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30 dark:shadow-[0_0_5px_rgba(0,0,0,0.1)]">
                        ⏱️ {hackathon.duration}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors drop-shadow-sm dark:text-white dark:group-hover:text-blue-400">{hackathon.title}</h3>
                <p className="text-sm text-slate-600 mb-6 line-clamp-2 leading-relaxed flex-grow dark:text-slate-400">{hackathon.description || hackathon.desc}</p>

                <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-4 mt-auto dark:border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white overflow-hidden shadow-sm dark:bg-slate-700 dark:border-slate-800">
                                <img src={`https://i.pravatar.cc/150?u=${hackathon.id || 1}a`} alt="u1" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white overflow-hidden shadow-sm dark:bg-slate-600 dark:border-slate-800">
                                <img src={`https://i.pravatar.cc/150?u=${hackathon.id || 1}b`} alt="u2" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">+{hackathon.joinedCount || hackathon.joined || 42}</span>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">{hackathon.isStartsIn ? 'STARTS IN' : 'DEADLINE'}</div>
                        <div className={`text-xs font-bold ${hackathon.isStartsIn ? 'text-slate-900 dark:text-white' : 'text-red-500 dark:text-red-400 dark:drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]'}`}>{hackathon.deadline}</div>
                    </div>
                </div>

                <div className="w-full py-2 bg-slate-100 border border-gray-200 text-slate-800 font-bold text-sm rounded-xl text-center shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 dark:bg-white/10 dark:border-white/20 dark:text-white dark:shadow-[0_4px_10px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]">
                    View Details
                </div>
            </div>
        </Link>
    );
}
