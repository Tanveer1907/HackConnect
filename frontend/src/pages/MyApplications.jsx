import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-hot-toast';
import { getMyInternshipApplications, withdrawInternshipApplication } from '../services/api';

export default function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadApplications = async () => {
        try {
            const response = await getMyInternshipApplications();
            setApplications(response.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load your applications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
    }, []);

    const handleWithdraw = async (appId, companyName) => {
        if (!window.confirm(`Are you sure you want to withdraw your application to ${companyName}?`)) {
            return;
        }

        try {
            await withdrawInternshipApplication(appId);
            toast.success(`Withdrew application to ${companyName}`);
            // Refresh list
            loadApplications();
        } catch (err) {
            console.error(err);
            toast.error("Failed to withdraw application.");
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'accepted':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            case 'rejected':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            case 'shortlisted':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
            case 'interviewing':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            case 'withdrawn':
                return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
            case 'reviewed':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
            default: // applied
                return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
        }
    };

    return (
        <div className="flex flex-col flex-1 text-slate-800 bg-slate-50 transition-colors duration-300 dark:text-slate-200 dark:bg-transparent min-h-0">
            <div className="flex flex-1 overflow-hidden max-w-[1600px] w-full mx-auto relative z-10 min-h-0">
                <Sidebar className="hidden lg:flex" />

                <main className="flex-1 p-6 md:p-10 overflow-y-auto min-h-0">
                    <div className="max-w-6xl mx-auto">
                        
                        {/* HEADER */}
                        <div className="mb-10">
                            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight dark:text-white">
                                My Internship Applications 📁
                            </h1>
                            <p className="text-slate-600 font-medium dark:text-slate-400">
                                Monitor the status of your submissions, interview invitations, and credentials.
                            </p>
                        </div>

                        {/* LISTINGS GRID */}
                        {loading ? (
                            <div className="text-center py-20 text-slate-500 font-semibold bg-white rounded-3xl border border-gray-200 dark:bg-white/5 dark:border-white/10">
                                Loading application details...
                            </div>
                        ) : applications.length === 0 ? (
                            <div className="text-center py-20 text-slate-500 font-semibold bg-white rounded-3xl border border-gray-200 dark:bg-white/5 dark:border-white/10">
                                You haven't applied to any internships yet. Browse internships to get started!
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {applications.map((app) => {
                                    const internship = app.internshipId;
                                    if (!internship) return null; // Defensive check if listing was deleted

                                    return (
                                        <div key={app._id} className="bg-white rounded-3xl p-7 border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10">
                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-extrabold text-2xl text-slate-800 shadow-inner dark:bg-slate-800 dark:text-white">
                                                            {internship.logo || '💼'}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-extrabold text-slate-900 text-lg leading-tight dark:text-white">{internship.role}</h3>
                                                            <p className="text-xs text-blue-600 font-bold dark:text-blue-400">{internship.company} • {internship.location || 'Remote'}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Status Badge */}
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border ${getStatusStyles(app.status)}`}>
                                                        {app.status}
                                                    </span>
                                                </div>

                                                <p className="text-slate-500 text-xs font-semibold mb-6 dark:text-slate-400">
                                                    Applied on: {new Date(app.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </p>
                                                
                                                <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-slate-500 dark:text-slate-400">Resume Submitted:</span>
                                                        <a 
                                                            href={app.resumeUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="text-blue-600 hover:underline font-bold dark:text-blue-400"
                                                        >
                                                            View Resume PDF ↗
                                                        </a>
                                                    </div>
                                                    {app.portfolio && (
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-slate-500 dark:text-slate-400">Portfolio Link:</span>
                                                            <a 
                                                                href={app.portfolio} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="text-blue-600 hover:underline font-bold dark:text-blue-400 truncate max-w-[200px]"
                                                            >
                                                                {app.portfolio}
                                                            </a>
                                                        </div>
                                                    )}
                                                    <div className="text-xs">
                                                        <span className="text-slate-500 block mb-1 dark:text-slate-400">Cover Note:</span>
                                                        <p className="text-slate-700 italic bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-150 dark:border-white/5 dark:text-slate-300">
                                                            "{app.whyJoin}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center border-t border-gray-100 pt-5 mt-2 dark:border-white/5">
                                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                    Stipend: <strong className="text-slate-900 font-extrabold dark:text-white">{internship.stipend || 'Competitive'}</strong>
                                                </div>
                                                {app.status !== 'withdrawn' && app.status !== 'rejected' && (
                                                    <button 
                                                        onClick={() => handleWithdraw(app._id, internship.company)}
                                                        className="px-4 py-2 border border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold text-xs rounded-xl transition-all dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
                                                    >
                                                        Withdraw Application
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
