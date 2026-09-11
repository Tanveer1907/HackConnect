import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * ScrollStatsBanner
 * Inspired by the high-impact skiper19 typography showcase,
 * moulded with HackConnect's tech stack stats, live metrics, and glassmorphism.
 */
export default function ScrollStatsBanner() {
  const stats = [
    { label: 'Curated Hackathons', value: '500+', desc: 'Global & regional tech events' },
    { label: 'Student Builders', value: '12k+', desc: 'Engineers, designers & PMs' },
    { label: 'Squads Formed', value: '1,800+', desc: 'Winning teams matched' },
    { label: 'Prize Pools', value: '$2.4M+', desc: 'Cash prizes & sponsor awards' },
  ];

  return (
    <section className="relative my-24 w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-100/80 p-8 shadow-2xl transition-colors duration-300 dark:border-white/10 dark:from-slate-900/90 dark:via-[#0f172a]/95 dark:to-black/90 dark:shadow-[0_20px_60px_rgba(37,99,235,0.15)] md:p-12 lg:p-16">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-[100px] dark:bg-blue-600/25" />
      <div className="pointer-events-none absolute -bottom-24 right-10 h-72 w-96 rounded-full bg-indigo-500/20 blur-[100px] dark:bg-indigo-600/20" />

      {/* Top Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-white/10">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            HackConnect Ecosystem Active
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-cyan-400">
          <span>⚡ Live Matchmaking & Hackathon Tracking</span>
        </div>
      </div>

      {/* Monumental Typography Hero */}
      <div className="relative py-10 text-center overflow-hidden">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="select-none text-[10vw] sm:text-[9vw] md:text-[8vw] lg:text-[7.5vw] font-black leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-300"
        >
          HACKCONNECT
        </motion.h2>
        <p className="mx-auto mt-4 max-w-xl text-sm font-medium text-slate-600 dark:text-slate-400 md:text-base">
          The collaborative network where college hackers build winning teams, discover high-impact competitions, and launch their developer careers.
        </p>
      </div>

      {/* High-Impact Stat Cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-6 text-center shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-lg dark:border-white/10 dark:bg-slate-800/50 dark:hover:border-blue-400/30 dark:hover:bg-slate-800/80"
          >
            <div className="text-3xl font-black text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-cyan-400 md:text-4xl">
              {stat.value}
            </div>
            <div className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
              {stat.label}
            </div>
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {stat.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Features Strip */}
      <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-8 dark:border-white/10 md:flex-row">
        <div className="flex flex-wrap items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-blue-500 font-bold">✓</span> 100% Free Forever
          </div>
          <div className="flex items-center gap-2">
            <span className="text-indigo-500 font-bold">✓</span> Real-Time Team Chats
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-500 font-bold">✓</span> Verified Hackathon Listings
          </div>
        </div>

        <Link
          to="/signup"
          className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold shadow-md transition-all hover:scale-105 hover:shadow-blue-500/30 dark:shadow-[0_4px_20px_rgba(59,130,246,0.4)]"
        >
          <span>Join the Network</span>
          <span>→</span>
        </Link>
      </div>
    </section>
  );
}
