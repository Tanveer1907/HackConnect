import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-transparent dark:text-white flex flex-col">
            <main className="px-10 py-16 max-w-[1200px] mx-auto flex-1 w-full">
                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-24 gap-10">
                    <div className="flex-1 lg:pr-10">
                        <div className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold mb-5 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border dark:border-indigo-400/20">
                            🚀 v2.0 is now live!
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-slate-900 mb-5 dark:text-white">
                            Discover Hackathons.<br />
                            <span className="text-blue-600 dark:text-blue-400">Build Strong Teams.</span><br />
                            Grow Together.
                        </h1>
                        <p className="text-slate-500 text-lg max-w-[500px] leading-relaxed mb-10 dark:text-slate-400">
                            HackConnect is the ultimate platform for students to find teammates, join global hackathons, and launch their careers in tech.
                        </p>
                        <div className="flex gap-4 items-center">
                            <Link to="/signup" className="btn-primary px-6 py-3 text-base dark:shadow-[0_4px_15px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]">Get Started</Link>
                            <Link to="/hackathons" className="btn-outline px-6 py-3 text-base dark:bg-white/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10 dark:backdrop-blur-sm">Explore Hackathons</Link>
                        </div>
                    </div>
                    <div className="flex-1 relative w-full">
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                            alt="Team collaborating"
                            className="w-full rounded-3xl shadow-2xl opacity-90 dark:opacity-80"
                        />
                        <div className="absolute bottom-5 left-5 right-5 bg-white p-4 md:p-5 rounded-xl flex justify-between items-center shadow-lg transition-colors duration-300 dark:bg-slate-800 dark:border dark:border-white/10 dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex justify-center items-center text-xl dark:bg-indigo-900/50 dark:text-white">🏆</div>
                                <div>
                                    <div className="font-bold text-sm text-slate-900 dark:text-white">HackMIT 2024</div>
                                    <div className="text-slate-500 text-xs dark:text-slate-400">Registration closing in 2 days</div>
                                </div>
                            </div>
                            <button className="btn-primary px-3 py-1.5 text-xs rounded-full">Join</button>
                        </div>
                    </div>
                </div>

                {/* How it Works */}
                <div className="text-center mb-24">
                    <h2 className="text-3xl font-extrabold mb-4 text-slate-900 dark:text-white">How it Works</h2>
                    <p className="text-slate-500 mb-12 dark:text-slate-400">Join the community in three simple steps and start building your dream projects.</p>

                    <div className="flex flex-col md:flex-row gap-8 justify-between">
                        {[
                            { icon: '👤', title: '1. Create Profile', desc: 'Showcase your skills, GitHub repos, and past projects to attract the best teammates.' },
                            { icon: '👥', title: '2. Find a Team', desc: 'Browse listings or post your own to find the perfect squad for your next event.' },
                            { icon: '🏆', title: '3. Build & Win', desc: 'Collaborate efficiently, submit your project, and win prizes and recognition.' }
                        ].map((step, i) => (
                            <div key={i} className="flex-1 bg-white p-10 rounded-2xl border border-gray-100 shadow-sm transition-colors duration-300 dark:bg-slate-800/50 dark:border-white/10 dark:backdrop-blur-sm hover:shadow-md dark:shadow-none dark:hover:bg-slate-800/80">
                                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-5 flex justify-center items-center text-2xl dark:bg-slate-700/50">{step.icon}</div>
                                <h3 className="text-lg font-bold mb-2.5 text-slate-900 dark:text-white">{step.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed dark:text-slate-400">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8">
                        <span className="text-blue-600 font-semibold cursor-pointer hover:underline dark:text-blue-400">Learn more about the process →</span>
                    </div>
                </div>

                {/* Platform Features */}
                <div className="mb-24">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold mb-2.5 text-slate-900 dark:text-white">Platform Features</h2>
                            <p className="text-slate-500 dark:text-slate-400">Everything you need to succeed in the hackathon ecosystem.</p>
                        </div>
                        <button className="btn-outline px-4 py-2 text-sm rounded-full dark:bg-white/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10 dark:backdrop-blur-sm">View all features</button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {[
                            { tag: 'DISCOVERY', title: 'Global Hackathon List', desc: 'A curated, real-time list of global and local hackathons updated daily. Filter by location, prizes, or tech stack.', image: '/assets/features/hackathon-discovery.png' },
                            { tag: 'NETWORKING', title: 'Smart Team Formation', desc: 'Our AI matching algorithm helps you find teammates with complementary skills to build the perfect balanced squad.', image: '/assets/features/team-formation.png' },
                            { tag: 'CAREER', title: 'Internship Opportunities', desc: 'Connect directly with event sponsors and top tech companies looking to hire talent from hackathons.', image: '/assets/features/internship-opportunities.png' }
                        ].map((feature, i) => (
                            <div key={i} className="flex-1 bg-white rounded-2xl overflow-hidden border border-gray-200 transition-colors duration-300 dark:bg-slate-800/50 dark:border-white/10 dark:backdrop-blur-sm">
                                <div className="h-48 bg-gray-200 dark:bg-slate-700">
                                    <img src={feature.image} className="w-full h-full object-cover opacity-90 dark:opacity-80" alt={feature.title} />
                                </div>
                                <div className="p-6">
                                    <div className="text-blue-600 text-xs font-bold mb-2.5 dark:text-blue-400">{feature.tag}</div>
                                    <h3 className="text-lg font-bold mb-2.5 text-slate-900 dark:text-white">{feature.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed dark:text-slate-400">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-blue-600 rounded-3xl p-16 text-center text-white shadow-xl dark:bg-blue-700/80 dark:backdrop-blur-xl dark:shadow-[0_10px_30px_rgba(59,130,246,0.2)] dark:border dark:border-white/10">
                    <h2 className="text-3xl font-bold mb-8">Ready to build something amazing?</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signup" className="btn-outline px-6 py-3 rounded-full bg-white text-blue-600 hover:bg-gray-50 border-transparent font-bold">Sign Up Now</Link>
                        <Link to="/hackathons" className="px-6 py-3 rounded-full border border-white text-white font-semibold hover:bg-white/10 transition-colors dark:border-white/20 dark:hover:bg-white/5">View Hackathons</Link>
                    </div>
                </div>
            </main>

            <footer className="bg-white px-10 py-16 border-t border-gray-200 transition-colors duration-300 dark:bg-slate-900/80 dark:border-t-white/10">
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-2 font-extrabold text-xl text-slate-900 mb-4 tracking-tight dark:text-white">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_4px_10px_rgba(37,99,235,0.3)] dark:bg-blue-500 dark:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                            </div>
                            HackConnect
                        </div>
                        <p className="text-slate-500 text-sm max-w-xs dark:text-slate-400">Empowering the next generation of builders. Connect, create, and launch your career with HackConnect.</p>
                    </div>
                    <div className="flex gap-16 text-sm">
                        <div>
                            <h4 className="font-bold mb-4 text-slate-900 dark:text-white">PLATFORM</h4>
                            <div className="text-slate-500 flex flex-col gap-2.5 dark:text-slate-400">
                                <span className="hover:text-blue-600 cursor-pointer dark:hover:text-blue-400 transition-colors">Find Hackathons</span>
                                <span className="hover:text-blue-600 cursor-pointer dark:hover:text-blue-400 transition-colors">Find Teammates</span>
                                <span className="hover:text-blue-600 cursor-pointer dark:hover:text-blue-400 transition-colors">Internships</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-slate-900 dark:text-white">COMPANY</h4>
                            <div className="text-slate-500 flex flex-col gap-2.5 dark:text-slate-400">
                                <span className="hover:text-blue-600 cursor-pointer dark:hover:text-blue-400 transition-colors">About Us</span>
                                <span className="hover:text-blue-600 cursor-pointer dark:hover:text-blue-400 transition-colors">Careers</span>
                                <span className="hover:text-blue-600 cursor-pointer dark:hover:text-blue-400 transition-colors">Contact</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center text-slate-400 text-xs mt-16 dark:text-slate-500">
                    © 2024 HackConnect Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
