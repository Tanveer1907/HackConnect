import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-hot-toast';

const mockInternships = [
    {
        id: 1,
        company: 'Vercel',
        logo: '▲',
        role: 'Frontend Engineering Intern',
        location: 'San Francisco, CA',
        mode: 'REMOTE',
        stipend: '$50 - $65 / hour',
        duration: '12 Weeks (Summer)',
        tags: ['React', 'Next.js', 'TypeScript', 'TailwindCSS'],
        description: 'Work directly with the framework team building the future of Server Components, routing architecture, and caching optimization in Next.js.'
    },
    {
        id: 2,
        company: 'Stripe',
        logo: '💳',
        role: 'Backend Engineering Intern',
        location: 'Seattle, WA',
        mode: 'HYBRID',
        stipend: '$55 - $70 / hour',
        duration: '12 Weeks',
        tags: ['Ruby', 'Go', 'REST APIs', 'SQL'],
        description: 'Build reliable, high-performance financial systems. You will optimize credit card processing pipelines and ledger systems handling millions of daily transactions.'
    },
    {
        id: 3,
        company: 'Linear',
        logo: '⧉',
        role: 'UI/UX Product Design Intern',
        location: 'New York, NY',
        mode: 'REMOTE',
        stipend: 'Competitive',
        duration: '16 Weeks',
        tags: ['Figma', 'Product Design', 'Prototyping', 'CSS'],
        description: 'Collaborate with engineers and designers to refine Linear\'s desktop application. Focus on motion aesthetics, keyboard-driven navigation, and high information-density views.'
    },
    {
        id: 4,
        company: 'Google',
        logo: 'G',
        role: 'Machine Learning Research Intern',
        location: 'Mountain View, CA',
        mode: 'IN_OFFICE',
        stipend: '$60 - $75 / hour',
        duration: '14 Weeks',
        tags: ['Python', 'PyTorch', 'TensorFlow', 'LLMs'],
        description: 'Join the Google DeepMind team researching new reinforcement learning techniques and model optimization algorithms for consumer-facing LLM agents.'
    },
    {
        id: 5,
        company: 'Vite',
        logo: '⚡',
        role: 'Core Systems Developer Intern',
        location: 'Paris, France',
        mode: 'REMOTE',
        stipend: 'Competitive',
        duration: '12 Weeks',
        tags: ['JavaScript', 'Rust', 'Build Tools', 'Rollup'],
        description: 'Optimize build speed and dev server boot times. Work on native bundler features in Rust, improving tree-shaking and HMR mechanics in Vite core.'
    },
    {
        id: 6,
        company: 'Slack',
        logo: '💬',
        role: 'Full Stack Engineering Intern',
        location: 'Denver, CO',
        mode: 'HYBRID',
        stipend: '$45 - $55 / hour',
        duration: '12 Weeks',
        tags: ['React', 'PHP/Hack', 'WebSockets', 'MySQL'],
        description: 'Work on real-time messaging pipeline optimization. Focus on improving workspace sidebar rendering speed and client synchronization under bad network conditions.'
    }
];

export default function Internships() {
    const [search, setSearch] = useState('');
    const [modeFilter, setModeFilter] = useState('');
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [applyForm, setApplyForm] = useState({ portfolio: '', whyJoin: '', resumeName: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleApplySubmit = (e) => {
        e.preventDefault();
        if (!applyForm.whyJoin.trim()) return toast.error("Please explain why you want to join.");
        
        setIsSubmitting(true);
        setTimeout(() => {
            toast.success(`Application to ${selectedInternship.company} submitted successfully!`);
            setIsSubmitting(false);
            setSelectedInternship(null);
            setApplyForm({ portfolio: '', whyJoin: '', resumeName: '' });
        }, 1200);
    };

    const filteredInternships = mockInternships.filter(item => {
        const matchesSearch = item.role.toLowerCase().includes(search.toLowerCase()) || 
                              item.company.toLowerCase().includes(search.toLowerCase()) ||
                              item.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
        
        const matchesMode = !modeFilter || item.mode === modeFilter;
        return matchesSearch && matchesMode;
    });

    return (
        <div className="flex flex-col flex-1 text-slate-800 bg-slate-50 transition-colors duration-300 dark:text-slate-200 dark:bg-transparent min-h-0">
            <div className="flex flex-1 overflow-hidden max-w-[1600px] w-full mx-auto relative z-10 min-h-0">
                <Sidebar className="hidden lg:flex" />

                <main className="flex-1 p-6 md:p-10 overflow-y-auto min-h-0">
                    <div className="max-w-6xl mx-auto">
                        
                        {/* HERO HEADER */}
                        <div className="mb-10">
                            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight dark:text-white">
                                Tech Internship Opportunities 💼
                            </h1>
                            <p className="text-slate-600 font-medium dark:text-slate-400">Discover premium summer and co-op internships at leading tech companies. Apply directly with your profile.</p>
                        </div>

                        {/* SEARCH AND FILTER BAR */}
                        <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-200/80 mb-8 flex flex-col md:flex-row gap-3 dark:bg-white/5 dark:border-white/10">
                            <div className="flex-1 relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </span>
                                <input 
                                    type="text" 
                                    placeholder="Search by company, role, or skills..." 
                                    value={search} 
                                    onChange={e => setSearch(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium text-slate-950 placeholder-slate-500 outline-none dark:bg-slate-800/40 dark:border-transparent dark:text-white dark:focus:border-blue-500/50"
                                />
                            </div>
                            
                            <div className="relative min-w-[200px]">
                                <select 
                                    value={modeFilter} 
                                    onChange={e => setModeFilter(e.target.value)}
                                    className="block w-full px-4 py-3 bg-slate-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium text-slate-800 outline-none appearance-none dark:bg-slate-800/40 dark:border-transparent dark:text-slate-300 dark:focus:border-blue-500/50"
                                >
                                    <option value="">All Work Modes</option>
                                    <option value="REMOTE">Remote</option>
                                    <option value="HYBRID">Hybrid</option>
                                    <option value="IN_OFFICE">In-Office</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </span>
                            </div>
                        </div>

                        {/* LISTINGS GRID */}
                        {filteredInternships.length === 0 ? (
                            <div className="text-center py-20 text-slate-500 font-semibold bg-white rounded-3xl border border-gray-200 dark:bg-white/5 dark:border-white/10">
                                No internships found matching your filters.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredInternships.map((item) => (
                                    <div key={item.id} className="bg-white rounded-3xl p-7 border border-gray-200 hover:-translate-y-1 hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col justify-between dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] dark:hover:border-white/20">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-extrabold text-2xl text-slate-800 shadow-inner dark:bg-slate-800 dark:text-white">
                                                        {item.logo}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-extrabold text-slate-900 text-lg leading-tight dark:text-white">{item.role}</h3>
                                                        <p className="text-xs text-blue-600 font-bold dark:text-blue-400">{item.company} • {item.location}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border ${
                                                    item.mode === 'REMOTE' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30' :
                                                    item.mode === 'HYBRID' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30' :
                                                    'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30'
                                                }`}>
                                                    {item.mode}
                                                </span>
                                            </div>

                                            <p className="text-slate-600 text-sm leading-relaxed mb-6 dark:text-slate-300">{item.description}</p>

                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {item.tags.map((tag, idx) => (
                                                    <span key={idx} className="bg-slate-50 border border-gray-150 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg dark:bg-slate-800/80 dark:border-white/5 dark:text-slate-300">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center border-t border-gray-100 pt-5 mt-4 dark:border-white/5">
                                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                Stipend: <strong className="text-slate-900 font-extrabold dark:text-white">{item.stipend}</strong> • {item.duration}
                                            </div>
                                            <button 
                                                onClick={() => setSelectedInternship(item)}
                                                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all"
                                            >
                                                Apply Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* APPLICATION MODAL */}
            {selectedInternship && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl border border-gray-150 dark:bg-slate-900 dark:border-white/10 animate-scaleUp">
                        <div className="p-8 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <div>
                                <h2 className="font-extrabold text-slate-900 text-xl leading-none mb-1 dark:text-white">Apply to {selectedInternship.company}</h2>
                                <p className="text-xs text-slate-500 font-semibold dark:text-slate-400">{selectedInternship.role}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedInternship(null)}
                                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-350 text-slate-500 font-bold flex items-center justify-center transition-colors dark:bg-white/10 dark:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleApplySubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Resume / CV</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors dark:border-white/10">
                                    <span className="text-3xl mb-2 block">📄</span>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">Upload your resume (.pdf)</p>
                                    <input 
                                        type="file" 
                                        accept=".pdf"
                                        required={!applyForm.resumeName}
                                        onChange={(e) => setApplyForm({ ...applyForm, resumeName: e.target.files[0]?.name || '' })}
                                        className="hidden" 
                                        id="resume-upload" 
                                    />
                                    <label htmlFor="resume-upload" className="cursor-pointer inline-block mt-2 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-gray-200 transition-colors dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10">
                                        {applyForm.resumeName ? 'Change File' : 'Choose File'}
                                    </label>
                                    {applyForm.resumeName && (
                                        <p className="text-xs font-bold text-emerald-600 mt-2">✓ Selected: {applyForm.resumeName}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Portfolio / GitHub Link</label>
                                <input 
                                    type="url" 
                                    placeholder="https://github.com/yourusername"
                                    value={applyForm.portfolio}
                                    onChange={e => setApplyForm({ ...applyForm, portfolio: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-250 focus:border-blue-500 rounded-xl text-sm font-medium text-slate-900 outline-none dark:bg-slate-800/40 dark:border-white/5 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Why do you want to join {selectedInternship.company}?</label>
                                <textarea 
                                    rows="4" 
                                    required
                                    placeholder="Explain your interest, relevant project experience, and what you hope to achieve during the internship..."
                                    value={applyForm.whyJoin}
                                    onChange={e => setApplyForm({ ...applyForm, whyJoin: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-250 focus:border-blue-500 rounded-xl text-sm font-medium text-slate-900 outline-none resize-none dark:bg-slate-800/40 dark:border-white/5 dark:text-white"
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                            >
                                {isSubmitting ? 'SUBMITTING APPLICATION...' : 'SUBMIT APPLICATION'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
