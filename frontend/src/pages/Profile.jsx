import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getUserProfile } from '../services/api';

export default function Profile() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getUserProfile();
                setProfile(res.data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
                // Fallback for UI demonstration
                setProfile({
                    name: 'Alex Chen',
                    email: 'alex.chen@example.com',
                    role: 'Full Stack Developer',
                    university: 'Computer Science @ Stanford',
                    location: 'San Francisco, CA',
                    joined: 'Joined Sept 2023',
                    bio: 'Passionate about building scalable web applications and exploring the potential of Artificial Intelligence in everyday tools. I have a strong foundation in algorithms and data structures, acquired through competitive programming. When I\'m not coding, you can find me hiking or playing chess. Always eager to learn new technologies and collaborate on innovative projects that make a real-world impact.',
                    skills: [
                        { name: 'JavaScript / TypeScript', level: 90, type: 'Expert' },
                        { name: 'React & Next.js', level: 80, type: 'Advanced' },
                        { name: 'Python (Django/Flask)', level: 75, type: 'Advanced' },
                        { name: 'UI/UX Design', level: 60, type: 'Intermediate' }
                    ],
                    tags: ['PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'Tailwind CSS']
                });
            }
        };
        fetchProfile();
    }, []);

    if (!profile) return <div className="p-10 text-center font-medium text-gray-500">Loading profile...</div>;

    return (
        <div className="flex flex-col min-h-screen bg-[#fafafa]">
            <Navbar />
            <div className="flex flex-1 overflow-hidden max-w-[1600px] w-full mx-auto">
                <Sidebar className="hidden lg:flex" />

                <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                    <div className="max-w-5xl mx-auto">

                        {/* Header Card */}
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 flex flex-col md:flex-row items-start gap-8">
                            <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-white shadow-lg relative flex-shrink-0">
                                <img src="https://i.pravatar.cc/150?u=alex" alt="Profile" className="w-full h-full rounded-full object-cover" />
                                <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
                            </div>

                            <div className="flex-1 w-full">
                                <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                                    <div>
                                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{profile.name}</h1>
                                        <p className="text-blue-600 font-bold">{profile.role}</p>
                                    </div>
                                    <div className="flex gap-3 w-full md:w-auto">
                                        <button className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 hover:bg-blue-700 transition flex justify-center items-center gap-2">
                                            <span className="text-lg">👤+</span> Connect
                                        </button>
                                        <button className="flex-1 md:flex-none px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition flex justify-center items-center gap-2">
                                            <span className="text-lg">✉️</span> Message
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-500 mb-8 font-medium">
                                    <div className="flex items-center gap-2 text-gray-600"><span className="text-lg grayscale opacity-70">🎓</span> {profile.university}</div>
                                    <div className="flex items-center gap-2 text-gray-600"><span className="text-lg grayscale opacity-70">📍</span> {profile.location}</div>
                                    <div className="flex items-center gap-2 text-gray-600"><span className="text-lg grayscale opacity-70">📅</span> {profile.joined}</div>
                                    <div className="flex items-center gap-2 text-gray-600"><span className="text-lg grayscale opacity-70">📧</span> {profile.email}</div>
                                </div>

                                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-blue-600 text-lg">📢</span>
                                        <span className="font-extrabold text-gray-900 text-sm">Looking for a team</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                        Currently looking for teammates for <strong className="text-gray-900">HackMIT 2024</strong>. I specialize in backend architecture and API design but can handle frontend tasks with React. Interested in AI/ML projects.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* About & Skills Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-3 bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-sm">
                                <h2 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight">About Me</h2>
                                <p className="text-gray-600 leading-loose text-base">
                                    {profile.bio}
                                </p>
                            </div>

                            <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-3 tracking-tight">
                                        <span className="text-blue-600 text-2xl">⚡</span> Skills & Expertise
                                    </h2>
                                    <span className="text-sm text-blue-600 font-bold cursor-pointer hover:underline">View All</span>
                                </div>

                                <div className="space-y-6 mb-10">
                                    {profile.skills.map((skill) => (
                                        <div key={skill.name}>
                                            <div className="flex justify-between text-sm mb-3">
                                                <span className="font-bold text-gray-900">{skill.name}</span>
                                                <span className="text-gray-500 font-medium">{skill.type}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${skill.level}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2.5">
                                    {profile.tags.map((tag) => (
                                        <span key={tag} className="px-4 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-full shadow-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <h2 className="text-xl font-extrabold text-gray-900 mb-8 flex items-center gap-3 tracking-tight">
                                    <span className="text-yellow-500 text-2xl">🏆</span> Badges
                                </h2>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-14 h-14 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100 shadow-sm flex items-center justify-center text-2xl mb-3">🏆</div>
                                        <span className="text-[11px] text-gray-700 font-bold">Winner 2023</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-sm flex items-center justify-center text-2xl mb-3">💻</div>
                                        <span className="text-[11px] text-gray-700 font-bold leading-tight">Hackathon MVP</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-14 h-14 rounded-full bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-100 shadow-sm flex items-center justify-center text-2xl mb-3">👥</div>
                                        <span className="text-[11px] text-gray-700 font-bold">Top Mentor</span>
                                    </div>
                                    <div className="flex flex-col items-center mt-2">
                                        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm flex items-center justify-center text-2xl mb-3">🚀</div>
                                        <span className="text-[11px] text-gray-700 font-bold">First Launch</span>
                                    </div>
                                    <div className="flex flex-col items-center mt-2 opacity-50">
                                        <div className="w-14 h-14 rounded-full bg-gray-50 text-gray-400 border border-dashed border-gray-200 flex items-center justify-center text-2xl mb-3">🔒</div>
                                        <span className="text-[11px] text-gray-500 font-bold">Locked</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
