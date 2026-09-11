import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScroll, motion } from 'framer-motion';
import Skiper19ScrollStroke from '../components/ui/Skiper19ScrollStroke';
import ScrollStatsBanner from '../components/ui/ScrollStatsBanner';

export default function Home() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-transparent dark:text-white flex flex-col"
        >
            {/* Ambient Background Glow Spots */}
            <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[130px] dark:bg-blue-600/15" />
            <div className="pointer-events-none absolute top-[900px] -left-40 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[150px] dark:bg-indigo-600/15" />
            <div className="pointer-events-none absolute top-[1800px] right-10 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px] dark:bg-cyan-500/10" />

            {/* Skiper19 Scroll-Driven SVG Stroke Track */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden flex justify-center">
                <div className="relative w-full max-w-[1400px] h-full">
                    <Skiper19ScrollStroke
                        scrollYProgress={scrollYProgress}
                        className="absolute -right-24 md:-right-10 lg:right-0 top-6 w-[850px] md:w-[1150px] lg:w-[1350px] max-w-none opacity-85 dark:opacity-95"
                    />
                </div>
            </div>

            <main className="relative z-10 px-6 sm:px-10 py-16 max-w-[1200px] mx-auto flex-1 w-full">
                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-28 gap-12 pt-4">
                    <div className="flex-1 lg:pr-8">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-sm dark:from-indigo-950/60 dark:to-blue-950/60 dark:text-indigo-300 dark:border-indigo-500/20 backdrop-blur-sm"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                            <span>🚀 v2.0 is now live — Experience dynamic matchmaking</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl sm:text-6xl font-black leading-[1.1] tracking-tight text-slate-900 mb-6 dark:text-white"
                        >
                            Discover Hackathons.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-300">
                                Build Strong Teams.
                            </span><br />
                            Grow Together.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-slate-600 text-lg max-w-[520px] leading-relaxed mb-8 dark:text-slate-300"
                        >
                            HackConnect is the ultimate platform for students to find teammates, join global hackathons, and launch their careers in tech.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-wrap gap-4 items-center"
                        >
                            <Link
                                to="/signup"
                                className="btn-primary px-7 py-3.5 text-base font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all hover:scale-[1.02] dark:shadow-[0_4px_20px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                to="/hackathons"
                                className="btn-outline px-7 py-3.5 text-base font-semibold backdrop-blur-md dark:bg-white/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10 hover:border-slate-300 transition-all hover:scale-[1.02]"
                            >
                                Explore Hackathons
                            </Link>
                        </motion.div>

                        <div className="mt-8 flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Scroll down to watch the path unfold
                            </span>
                            <span>•</span>
                            <span>No credit card required</span>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex-1 relative w-full"
                    >
                        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/40 p-2 backdrop-blur-md shadow-2xl transition-all duration-300 dark:border-white/15 dark:bg-slate-800/40 dark:shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                                alt="Team collaborating"
                                className="w-full rounded-2xl object-cover opacity-95 dark:opacity-85 h-[340px] md:h-[400px]"
                            />
                            <div className="absolute bottom-5 left-5 right-5 bg-white/95 p-4 md:p-5 rounded-2xl flex justify-between items-center shadow-xl backdrop-blur-lg border border-slate-100 transition-colors duration-300 dark:bg-slate-900/90 dark:border-white/10 dark:shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex justify-center items-center text-xl shadow-md text-white">
                                        🏆
                                    </div>
                                    <div>
                                        <div className="font-extrabold text-sm text-slate-900 dark:text-white">HackMIT 2024</div>
                                        <div className="text-slate-500 text-xs dark:text-slate-400 font-medium">Registration closing in 2 days</div>
                                    </div>
                                </div>
                                <Link to="/hackathons" className="btn-primary px-4 py-2 text-xs font-bold rounded-full shadow-sm hover:scale-105 transition-all">
                                    Join
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* How it Works */}
                <div className="text-center mb-28">
                    <div className="inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 rounded-full dark:bg-blue-950/60 dark:text-cyan-400 dark:border dark:border-blue-500/20">
                        Workflow
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black mb-4 text-slate-900 dark:text-white">
                        How it Works
                    </h2>
                    <p className="text-slate-600 max-w-lg mx-auto mb-12 dark:text-slate-400">
                        Join the community in three simple steps and start building your dream projects.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {[
                            {
                                step: '01',
                                icon: '👤',
                                title: 'Create Profile',
                                desc: 'Showcase your skills, GitHub repos, and past projects to attract the best teammates.',
                                accent: 'border-blue-500/30'
                            },
                            {
                                step: '02',
                                icon: '👥',
                                title: 'Find a Team',
                                desc: 'Browse listings or post your own to find the perfect squad for your next event.',
                                accent: 'border-indigo-500/30'
                            },
                            {
                                step: '03',
                                icon: '🏆',
                                title: 'Build & Win',
                                desc: 'Collaborate efficiently, submit your project, and win prizes and recognition.',
                                accent: 'border-cyan-500/30'
                            }
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="group relative bg-white/80 p-8 rounded-3xl border border-slate-200/80 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:bg-slate-900/60 dark:border-white/10 dark:hover:border-blue-500/40 dark:hover:bg-slate-800/80"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-tr from-slate-100 to-blue-50 rounded-2xl flex justify-center items-center text-2xl shadow-inner dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <span className="text-2xl font-black text-slate-300 dark:text-slate-700 select-none">
                                        {item.step}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-2.5 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed dark:text-slate-400">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform Features */}
                <div className="mb-28">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                        <div>
                            <div className="inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 rounded-full dark:bg-indigo-950/60 dark:text-indigo-300 dark:border dark:border-indigo-500/20">
                                Ecosystem Features
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black mb-2 text-slate-900 dark:text-white">
                                Everything You Need to Win
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                Comprehensive tools tailored specifically for student innovators and hackathon builders.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                tag: 'DISCOVERY',
                                title: 'Global Hackathon List',
                                desc: 'A curated, real-time list of global and local hackathons updated daily. Filter by location, prizes, or tech stack.',
                                image: '/assets/features/hackathon-discovery.png'
                            },
                            {
                                tag: 'NETWORKING',
                                title: 'Smart Team Formation',
                                desc: 'Our AI matching algorithm helps you find teammates with complementary skills to build the perfect balanced squad.',
                                image: '/assets/features/team-formation.png'
                            },
                            {
                                tag: 'CAREER',
                                title: 'Internship Opportunities',
                                desc: 'Connect directly with event sponsors and top tech companies looking to hire talent from hackathons.',
                                image: '/assets/features/internship-opportunities.png'
                            }
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="group relative bg-white/80 rounded-3xl overflow-hidden border border-slate-200/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl dark:bg-slate-900/60 dark:border-white/10 dark:hover:border-blue-500/40"
                            >
                                <div className="h-48 bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                                    <img
                                        src={feature.image}
                                        className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105 dark:opacity-80"
                                        alt={feature.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                </div>
                                <div className="p-7">
                                    <div className="text-blue-600 text-xs font-extrabold tracking-wider uppercase mb-2.5 dark:text-cyan-400">
                                        {feature.tag}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2.5 text-slate-900 dark:text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed dark:text-slate-400">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Themed Skiper19 Showcase Banner */}
                <ScrollStatsBanner />

                {/* Call to Action Banner */}
                <div className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-blue-700 dark:via-indigo-800 dark:to-slate-900 dark:border dark:border-white/15 dark:shadow-[0_15px_45px_rgba(59,130,246,0.3)]">
                    <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/15 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-cyan-400/20 blur-2xl" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">
                            Ready to build something amazing?
                        </h2>
                        <p className="text-blue-100 text-base mb-8 max-w-xl mx-auto font-medium leading-relaxed">
                            Join thousands of ambitious developers, designers, and innovators forming squads and building the next big thing.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/signup"
                                className="px-8 py-3.5 rounded-full bg-white text-blue-600 hover:bg-slate-100 font-extrabold shadow-lg hover:scale-105 transition-all text-sm"
                            >
                                Sign Up Now — Free
                            </Link>
                            <Link
                                to="/hackathons"
                                className="px-8 py-3.5 rounded-full border-2 border-white/60 text-white font-bold hover:bg-white/10 transition-all hover:scale-105 text-sm backdrop-blur-sm"
                            >
                                View Hackathons
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 bg-white/80 px-6 sm:px-10 py-16 border-t border-slate-200/80 backdrop-blur-md transition-colors duration-300 dark:bg-slate-900/90 dark:border-t-white/10">
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-2.5 font-black text-xl text-slate-900 mb-4 tracking-tight dark:text-white">
                            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-[0_4px_10px_rgba(37,99,235,0.3)] dark:shadow-[0_0_15px_rgba(59,130,246,0.5)] text-white">
                                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                </svg>
                            </div>
                            HackConnect
                        </div>
                        <p className="text-slate-500 text-sm max-w-xs leading-relaxed dark:text-slate-400">
                            Empowering the next generation of builders. Connect, create, and launch your career with HackConnect.
                        </p>
                    </div>
                    <div className="flex gap-16 text-sm">
                        <div>
                            <h4 className="font-bold mb-4 text-slate-900 dark:text-white tracking-wider text-xs uppercase">
                                Platform
                            </h4>
                            <div className="text-slate-500 flex flex-col gap-3 dark:text-slate-400 font-medium">
                                <Link to="/hackathons" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                                    Find Hackathons
                                </Link>
                                <Link to="/teams" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                                    Find Teammates
                                </Link>
                                <Link to="/internships" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                                    Internships
                                </Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-slate-900 dark:text-white tracking-wider text-xs uppercase">
                                Company
                            </h4>
                            <div className="text-slate-500 flex flex-col gap-3 dark:text-slate-400 font-medium">
                                <span className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-pointer">
                                    About Us
                                </span>
                                <span className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-pointer">
                                    Careers
                                </span>
                                <span className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-pointer">
                                    Contact
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-[1200px] mx-auto text-center text-slate-400 text-xs mt-12 pt-6 border-t border-slate-100 dark:border-white/5 dark:text-slate-500">
                    © 2024 HackConnect Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
