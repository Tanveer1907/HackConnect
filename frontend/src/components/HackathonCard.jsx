import React from 'react';
import { Link } from 'react-router-dom';

export default function HackathonCard({ hackathon }) {
    const isStartsIn = hackathon.isStartsIn;

    return (
        <Link to={`/hackathon/${hackathon._id || hackathon.id || 1}`} className="block bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
            <div className="h-44 bg-gray-200 relative">
                <img
                    src={hackathon.image || `https://images.unsplash.com/photo-${1500000000000 + (hackathon.id || 1) * 10}?auto=format&fit=crop&w=600&q=80`}
                    className="w-full h-full object-cover"
                    alt={hackathon.title}
                />
                <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white/40 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                </div>
                {hackathon.deadline.includes('Days') && (
                    <div className="absolute top-4 right-14 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                        In {parseInt(hackathon.deadline)} days
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="flex gap-2 mb-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide ${hackathon.mode === 'ONLINE' ? 'bg-fuchsia-50 text-fuchsia-600' : (hackathon.mode === 'HYBRID' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600')}`}>
                        {hackathon.mode === 'ONLINE' ? '🌐 Web3' : hackathon.mode === 'HYBRID' ? '🏢 Hybrid' : '🤖 AI/ML'}
                    </span>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide">
                        {hackathon.mode === 'ONLINE' ? 'Remote' : 'Design'}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{hackathon.title}</h3>
                <p className="text-sm text-gray-500 mb-6 line-clamp-2 h-10 leading-relaxed">{hackathon.description || hackathon.desc}</p>

                <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white overflow-hidden shadow-sm">
                                <img src="https://i.pravatar.cc/150?u=1" alt="u1" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white overflow-hidden shadow-sm">
                                <img src="https://i.pravatar.cc/150?u=2" alt="u2" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <span className="text-[11px] font-semibold text-gray-500">+{hackathon.joinedCount || hackathon.joined || 42}</span>
                    </div>
                    <div className="text-gray-400 hover:text-blue-600 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}
