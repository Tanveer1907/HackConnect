import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getUserProfile, updateUserProfile } from '../services/api';

export default function EditProfile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '', // read-only
        university: '',
        location: '',
        role: '',
        skills: [],
        bio: '',
        lookingForTeam: false,
        profileImage: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getUserProfile();
                const u = res.data;
                setFormData({
                    name: u.name || '',
                    email: u.email || '',
                    university: u.university || '',
                    location: u.location || '',
                    role: u.role || '',
                    skills: u.skills || [],
                    bio: u.bio || '',
                    lookingForTeam: u.lookingForTeam || false,
                    profileImage: u.profileImage || ''
                });
            } catch (err) {
                console.error("Failed to fetch profile", err);
                setError('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSkillChange = (index, field, value) => {
        const updatedSkills = [...formData.skills];
        updatedSkills[index] = { ...updatedSkills[index], [field]: field === 'level' ? Number(value) : value };
        setFormData(prev => ({ ...prev, skills: updatedSkills }));
    };

    const addSkill = () => {
        setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, { name: '', level: 50, type: 'Intermediate' }]
        }));
    };

    const removeSkill = (index) => {
        const updatedSkills = formData.skills.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, skills: updatedSkills }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await updateUserProfile({
                ...formData,
                skills: formData.skills.filter(s => s.name.trim() !== '')
            });
            setSuccess('Profile updated successfully!');
            setTimeout(() => navigate('/profile'), 1500);
        } catch (err) {
            console.error("Failed to update profile", err);
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-10 text-center font-medium text-gray-500">Loading profile editor...</div>;
    }

    return (
        <div className="flex flex-col flex-1 text-slate-800 bg-slate-50 transition-colors duration-300 dark:text-slate-200 dark:bg-transparent">
            <div className="flex flex-1 overflow-hidden max-w-[1600px] w-full mx-auto relative z-10">
                <Sidebar className="hidden lg:flex" />

                <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8 flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm dark:text-white">Edit Profile</h1>
                                <p className="text-slate-600 font-medium dark:text-slate-400">Manage your public presence and preferences.</p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex justify-center items-center gap-2 dark:shadow-[0_4px_15px_rgba(59,130,246,0.4)] disabled:opacity-70"
                            >
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>

                        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400">{error}</div>}
                        {success && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl font-medium dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400">{success}</div>}

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Personal Info */}
                            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                                <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3 drop-shadow-sm dark:text-white">
                                    <span className="text-blue-600 dark:text-blue-400">👤</span> Personal Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-slate-300">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 bg-slate-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all dark:bg-slate-800/80 dark:border-transparent dark:focus:border-blue-500/50 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-slate-300">Email (Read-only)</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 cursor-not-allowed dark:bg-slate-800/40 dark:border-transparent dark:text-slate-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-slate-300">University / College</label>
                                        <input
                                            type="text"
                                            name="university"
                                            value={formData.university}
                                            onChange={handleChange}
                                            placeholder="e.g. Stanford University"
                                            className="w-full p-3 bg-slate-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all dark:bg-slate-800/80 dark:border-transparent dark:focus:border-blue-500/50 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-slate-300">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="e.g. San Francisco, CA"
                                            className="w-full p-3 bg-slate-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all dark:bg-slate-800/80 dark:border-transparent dark:focus:border-blue-500/50 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Professional Details */}
                            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                                <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3 drop-shadow-sm dark:text-white">
                                    <span className="text-blue-600 dark:text-blue-400">💼</span> Professional Details
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-slate-300">Role / Title</label>
                                        <input
                                            type="text"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            placeholder="e.g. Full Stack Developer"
                                            className="w-full p-3 bg-slate-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all dark:bg-slate-800/80 dark:border-transparent dark:focus:border-blue-500/50 dark:text-white"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Skills & Expertise</label>
                                            <button
                                                type="button"
                                                onClick={addSkill}
                                                className="text-sm font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                            >
                                                + Add Skill
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {formData.skills.map((skill, index) => (
                                                <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 border border-gray-200 rounded-xl dark:bg-slate-800/40 dark:border-white/10 relative group">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(index)}
                                                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/40 shadow-sm"
                                                    >
                                                        ✕
                                                    </button>
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-bold text-slate-500 mb-1 dark:text-slate-400">Skill Name</label>
                                                        <input
                                                            type="text"
                                                            value={skill.name}
                                                            onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                                                            placeholder="e.g. React"
                                                            className="w-full p-2.5 bg-white border border-gray-300 focus:border-blue-500 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all dark:bg-slate-900/50 dark:border-transparent dark:focus:border-blue-500/50 dark:text-white"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-end mb-1">
                                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Proficiency: {skill.level}%</label>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={skill.level}
                                                            onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                                                            className="w-full h-2 mt-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-bold text-slate-500 mb-1 dark:text-slate-400">Experience Type</label>
                                                        <select
                                                            value={skill.type}
                                                            onChange={(e) => handleSkillChange(index, 'type', e.target.value)}
                                                            className="w-full p-2.5 bg-white border border-gray-300 focus:border-blue-500 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all dark:bg-slate-900/50 dark:border-transparent dark:focus:border-blue-500/50 dark:text-white"
                                                        >
                                                            <option value="Beginner">Beginner</option>
                                                            <option value="Intermediate">Intermediate</option>
                                                            <option value="Advanced">Advanced</option>
                                                            <option value="Expert">Expert</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                            {formData.skills.length === 0 && (
                                                <div className="text-center p-6 border border-dashed border-gray-300 rounded-xl text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                                                    No skills added yet. Add some to stand out!
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-slate-300">Bio</label>
                                        <textarea
                                            name="bio"
                                            rows="4"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            placeholder="Tell us a little about yourself, your interests, and what you're looking to build."
                                            className="w-full p-4 bg-slate-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none dark:bg-slate-800/80 dark:border-transparent dark:focus:border-blue-500/50 dark:text-white"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm transition-colors duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                                <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3 drop-shadow-sm dark:text-white">
                                    <span className="text-blue-600 dark:text-blue-400">⚙️</span> Preferences
                                </h2>

                                <label className="flex items-center gap-4 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="lookingForTeam"
                                            checked={formData.lookingForTeam}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </div>
                                    <div>
                                        <span className="block text-sm font-bold text-slate-900 dark:text-white">Looking for a team</span>
                                        <span className="block text-xs text-slate-500 mt-1 dark:text-slate-400">Turn this on to let others know you're open to joining a squad for upcoming hackathons.</span>
                                    </div>
                                </label>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
