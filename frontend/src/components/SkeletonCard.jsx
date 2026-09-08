import React from 'react';

export default function SkeletonCard({ type = 'card' }) {
    if (type === 'talent') {
        return (
            <div className="bg-white dark:bg-slate-900/60 rounded-3xl border border-gray-100 dark:border-white/10 p-6 shadow-sm flex flex-col justify-between h-[360px] animate-pulse">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                                <div className="h-3 w-36 bg-slate-100 dark:bg-slate-800/60 rounded-md"></div>
                            </div>
                        </div>
                        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    </div>
                    <div className="space-y-2 mb-6">
                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800/50 rounded-md"></div>
                        <div className="h-3 w-4/5 bg-slate-100 dark:bg-slate-800/50 rounded-md"></div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                        <div className="h-6 w-14 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex gap-2">
                    <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (type === 'internship') {
        return (
            <div className="bg-white dark:bg-slate-900/60 rounded-3xl border border-gray-100 dark:border-white/10 p-6 shadow-sm flex flex-col justify-between h-[280px] animate-pulse">
                <div>
                    <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-3/5 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                            <div className="h-3 w-2/5 bg-slate-100 dark:bg-slate-800/60 rounded-md"></div>
                        </div>
                    </div>
                    <div className="space-y-2 mb-4">
                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800/50 rounded-md"></div>
                        <div className="h-3 w-4/5 bg-slate-100 dark:bg-slate-800/50 rounded-md"></div>
                    </div>
                    <div className="flex gap-2">
                        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                        <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                    </div>
                </div>
                <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl mt-4"></div>
            </div>
        );
    }

    // Default: Hackathon card skeleton
    return (
        <div className="bg-white dark:bg-slate-900/60 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm flex flex-col h-[380px] animate-pulse">
            <div className="h-44 w-full bg-slate-200 dark:bg-slate-800 relative">
                <div className="absolute top-4 left-4 h-6 w-24 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                    <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800/50 rounded-md"></div>
                    <div className="h-3 w-2/3 bg-slate-100 dark:bg-slate-800/50 rounded-md"></div>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                    <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                </div>
            </div>
        </div>
    );
}
