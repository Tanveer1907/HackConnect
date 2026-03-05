import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import TeamCard from '../components/TeamCard';

export default function Teams() {
    const [selectedUser, setSelectedUser] = useState(null);

    // Dummy Data replicating the screenshot UI
    const dummyTalents = [
        {
            id: "a1",
            name: "Alex Rivera",
            university: "Stanford University",
            major: "Computer Science",
            matchPercentage: 95,
            skills: [
                { name: "React", level: "Adv." },
                { name: "Python", level: "Int." },
                { name: "FastAPI" }
            ],
            roleRequirement: "Need Backend Developer",
            hackathons: 8,
            projects: 12,
            interests: ["AIHackathon", "OpenSource"]
        },
        {
            id: "s2",
            name: "Sarah Chen",
            university: "MIT",
            major: "UI/UX Design",
            matchPercentage: 88,
            skills: [
                { name: "Figma", level: "Adv." },
                { name: "Tailwind" },
                { name: "Prototyping" }
            ],
            roleRequirement: "Need Frontend Dev",
            hackathons: 5,
            projects: 6,
            interests: ["DesignJam", "Fintech"]
        },
        {
            id: "m3",
            name: "Michael Chang",
            university: "UC Berkeley",
            major: "Data Science",
            matchPercentage: 92,
            skills: [
                { name: "TensorFlow", level: "Adv." },
                { name: "PyTorch", level: "Int." },
                { name: "AWS" }
            ],
            roleRequirement: "Need ML Engineer",
            hackathons: 11,
            projects: 15,
            interests: ["MachineLearning", "DataForGood"]
        },
        {
            id: "e4",
            name: "Elena Rodriguez",
            university: "Georgia Tech",
            major: "Software Engineering",
            matchPercentage: 85,
            skills: [
                { name: "Node.js", level: "Adv." },
                { name: "Express" },
                { name: "MongoDB", level: "Int." }
            ],
            roleRequirement: "Need UI Designer",
            hackathons: 4,
            projects: 8,
            interests: ["Web3", "EduTech"]
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-900 overflow-x-hidden">
            <Navbar />

            <main className="flex-1 pb-20 relative">
                {/* HERO SECTION */}
                <section className="mx-auto max-w-[1400px] px-6 md:px-12 mt-8 lg:mt-12 mb-8">
                    <div className="bg-gradient-to-br from-[#2b3ee3] to-[#713de0] rounded-[2rem] p-10 md:p-16 lg:p-24 text-center text-white shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                                Find the Perfect Teammate for<br />Your Next Hackathon
                            </h1>
                            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Collaborate, build, and innovate together with top talent from around the world. Your dream project starts with the right team.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                <button className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#2b3ee3] font-bold rounded-full shadow-lg hover:bg-gray-50 hover:-translate-y-0.5 transition-all w-full sm:w-auto">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                                    Get Started
                                </button>
                                <button className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold rounded-full transition-all w-full sm:w-auto backdrop-blur-sm">
                                    How it works
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FILTER BAR SECTION */}
                <section className="mx-auto max-w-[1100px] px-6 md:px-12 -mt-16 mb-16 relative z-20">
                    <div className="bg-white rounded-2xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input type="text" placeholder="Skills or Tech Stack" className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#2b3ee3] focus:bg-white transition-colors" />
                        </div>

                        <div className="hidden md:block w-px bg-gray-100 my-2"></div>

                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v6.5"></path></svg>
                            </div>
                            <input type="text" placeholder="College / University" className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#2b3ee3] focus:bg-white transition-colors" />
                        </div>

                        <div className="hidden md:block w-px bg-gray-100 my-2"></div>

                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            </div>
                            <select className="block w-full pl-11 pr-10 py-3.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-500 appearance-none focus:ring-2 focus:ring-[#2b3ee3] focus:bg-white transition-colors focus:text-gray-900">
                                <option value="" disabled selected>Experience Level</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PROFILE CARDS GRID */}
                <section className="mx-auto max-w-[1400px] px-6 md:px-12 mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {dummyTalents.map((talent) => (
                            <TeamCard
                                key={talent.id}
                                filterMatched={talent}
                                onInviteClick={(user) => setSelectedUser(user)}
                            />
                        ))}
                    </div>
                </section>

                {/* VIEW MORE TALENTS */}
                <div className="flex justify-center mb-10">
                    <button className="px-8 py-3.5 bg-white border border-gray-200 text-gray-900 font-bold rounded-full shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
                        View More Talents
                    </button>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="border-t border-gray-200 bg-white py-12 text-sm text-gray-500">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 font-bold text-lg text-gray-900">
                        <div className="w-6 h-6 bg-[#2b3ee3] rounded-md flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                        </div>
                        HackConnect
                    </div>

                    <div className="flex gap-8 font-medium">
                        <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Help Center</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center text-xs text-gray-400">
                    © 2024 HackConnect Inc. All rights reserved.
                </div>
            </footer>

            {/* SLIDE OUT INVITE PANEL */}
            {selectedUser && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    {/* Backdrop Blur overlay */}
                    <div
                        className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedUser(null)}
                    ></div>

                    {/* Slide Panel */}
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-extrabold text-gray-900">Invite to Team</h2>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto font-medium">

                            {/* Profile Preview */}
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0">
                                    <img src={`https://i.pravatar.cc/150?u=${selectedUser.id}`} alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-[15px] leading-tight">{selectedUser.name}</h3>
                                    <p className="text-[13px] text-gray-500">{selectedUser.university} • {selectedUser.major.includes('Science') ? 'CS' : 'Design'}</p>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="mb-6">
                                <label className="block text-[13px] font-bold text-gray-700 mb-2">Select Hackathon</label>
                                <div className="relative">
                                    <select className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#2b3ee3] focus:border-transparent transition-shadow">
                                        <option>Global AI Innovations 2024</option>
                                        <option>Web3 Builders Hack</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-[13px] font-bold text-gray-700 mb-2">Message Request</label>
                                <textarea
                                    rows="4"
                                    className="w-full p-4 bg-white border border-gray-200 rounded-xl text-[13.5px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2b3ee3] focus:border-transparent transition-shadow resize-none leading-relaxed"
                                    defaultValue={`Hey ${selectedUser.name.split(' ')[0]}! I saw you have great experience with ${selectedUser.skills[0].name}. We are looking for a teammate who can handle the ${selectedUser.major.includes('Science') ? 'backend' : 'frontend'} while I work on the ${selectedUser.major.includes('Science') ? 'frontend' : 'backend'} for the AI hackathon. Interested?`}
                                ></textarea>
                            </div>

                            {/* Info Box */}
                            <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 flex gap-3 items-start">
                                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">i</div>
                                <p className="text-[13px] text-indigo-900/80 leading-relaxed font-medium">
                                    Sending an invitation will allow the user to view your team profile and project details. You'll be notified when they respond.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex gap-4 bg-gray-50 relative z-10 text-sm">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-6 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-100 transition-colors w-28 text-center"
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 py-3.5 bg-[#2b3ee3] text-white font-bold rounded-full hover:bg-[#202eb8] shadow-md shadow-blue-500/20 transition-all hover:shadow-lg text-center"
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
