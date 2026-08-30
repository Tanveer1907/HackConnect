import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
    FaUser, 
    FaGraduationCap, 
    FaLocationDot, 
    FaCode, 
    FaServer, 
    FaLayerGroup, 
    FaPaintbrush, 
    FaBrain, 
    FaMobileScreen, 
    FaPlus, 
    FaXmark, 
    FaCheck, 
    FaArrowRight, 
    FaWandMagicSparkles, 
    FaUsers
} from 'react-icons/fa6';

const ROLE_OPTIONS = [
    { id: 'frontend', label: 'Frontend Developer', desc: 'React, Vue, Web UI & UX', icon: FaCode },
    { id: 'backend', label: 'Backend Developer', desc: 'Node.js, Python, APIs, Databases', icon: FaServer },
    { id: 'fullstack', label: 'Full Stack Engineer', desc: 'End-to-end web & cloud apps', icon: FaLayerGroup },
    { id: 'designer', label: 'UI/UX Designer', desc: 'Figma, Prototyping, Design Systems', icon: FaPaintbrush },
    { id: 'aiml', label: 'AI / ML Engineer', desc: 'PyTorch, LLMs, Computer Vision', icon: FaBrain },
    { id: 'mobile', label: 'Mobile Developer', desc: 'React Native, Flutter, Swift, Kotlin', icon: FaMobileScreen },
];

const SUGGESTED_SKILLS = [
    'React', 'Node.js', 'Python', 'TypeScript', 'Next.js', 
    'Figma', 'PyTorch', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 
    'Flutter', 'Docker', 'GraphQL', 'Express', 'Machine Learning'
];

export default function CompleteProfile() {
    const navigate = useNavigate();
    const { refreshProfile } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        university: '',
        location: '',
        role: '',
        skills: [],
        bio: '',
        lookingForTeam: true,
        profileImage: ''
    });

    const [newSkillInput, setNewSkillInput] = useState('');
    const [newSkillLevel, setNewSkillLevel] = useState(70);

    useEffect(() => {
        const fetchInitialProfile = async () => {
            try {
                const res = await getUserProfile();
                const u = res.data;
                if (u) {
                    setFormData({
                        name: u.name || '',
                        university: u.university || '',
                        location: u.location || '',
                        role: u.role || 'Full Stack Engineer',
                        skills: Array.isArray(u.skills) ? u.skills : [],
                        bio: u.bio || '',
                        lookingForTeam: u.lookingForTeam !== undefined ? u.lookingForTeam : true,
                        profileImage: u.profileImage || ''
                    });
                }
            } catch (err) {
                console.error("Failed to load profile data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialProfile();
    }, []);

    const handleRoleSelect = (roleLabel) => {
        setFormData(prev => ({ ...prev, role: roleLabel }));
    };

    const handleToggleSkill = (skillName) => {
        const existingIndex = formData.skills.findIndex(
            s => s.name.toLowerCase() === skillName.toLowerCase()
        );

        if (existingIndex >= 0) {
            setFormData(prev => ({
                ...prev,
                skills: prev.skills.filter((_, i) => i !== existingIndex)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, { name: skillName, level: 75, type: 'Intermediate' }]
            }));
        }
    };

    const handleAddCustomSkill = (e) => {
        if (e) e.preventDefault();
        const trimmed = newSkillInput.trim();
        if (!trimmed) return;

        const exists = formData.skills.some(
            s => s.name.toLowerCase() === trimmed.toLowerCase()
        );

        if (exists) {
            toast.error('Skill already added!');
            return;
        }

        let typeLevel = 'Intermediate';
        if (newSkillLevel <= 40) typeLevel = 'Beginner';
        else if (newSkillLevel >= 80) typeLevel = 'Advanced';

        setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, { name: trimmed, level: newSkillLevel, type: typeLevel }]
        }));

        setNewSkillInput('');
    };

    const handleRemoveSkill = (index) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    const handleSaveProfile = async (isSkipping = false) => {
        setSaving(true);
        try {
            const payload = {
                ...formData,
                isProfileCompleted: true,
                skills: formData.skills.filter(s => s && s.name && s.name.trim() !== '')
            };

            await updateUserProfile(payload);
            await refreshProfile();

            if (isSkipping) {
                toast.success('Profile saved! You can complete the rest anytime.');
            } else {
                toast.success('🎉 Profile completed successfully! Welcome aboard.');
            }

            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error("Failed to update profile", err);
            toast.error(err.response?.data?.message || 'Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-medium text-sm">Preparing your onboarding setup...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0f19] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center">
            {/* Background Glow Orbs */}
            <div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[15%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute top-[40%] right-[5%] w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-4xl w-full mx-auto relative z-10">
                {/* Brand Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
                        <FaWandMagicSparkles className="w-3.5 h-3.5" /> Welcome to HackConnect
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
                        Complete Your Profile
                    </h1>
                    <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
                        Tell us about your background, skills, and interests so we can match you with high-performing hackathon teams and project opportunities.
                    </p>
                </div>

                {/* Progress Stepper */}
                <div className="bg-[#151824]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-8 shadow-xl">
                    <div className="grid grid-cols-3 gap-2 text-center relative">
                        {/* Step 1 */}
                        <button 
                            type="button" 
                            onClick={() => setCurrentStep(1)}
                            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all ${
                                currentStep === 1 
                                    ? 'bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                currentStep === 1 ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>1</span>
                            <span className="text-xs sm:text-sm">Basic Info</span>
                        </button>

                        {/* Step 2 */}
                        <button 
                            type="button" 
                            onClick={() => setCurrentStep(2)}
                            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all ${
                                currentStep === 2 
                                    ? 'bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                currentStep === 2 ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>2</span>
                            <span className="text-xs sm:text-sm">Role & Skills</span>
                        </button>

                        {/* Step 3 */}
                        <button 
                            type="button" 
                            onClick={() => setCurrentStep(3)}
                            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all ${
                                currentStep === 3 
                                    ? 'bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                currentStep === 3 ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>3</span>
                            <span className="text-xs sm:text-sm">Preferences & Bio</span>
                        </button>
                    </div>
                </div>

                {/* Main Step Card Container */}
                <div className="bg-[#151824]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
                    
                    {/* STEP 1: Basic Information */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="border-b border-white/10 pb-4 mb-6">
                                <h2 className="text-xl font-bold text-white">1. Basic Information</h2>
                                <p className="text-xs text-slate-400">Introduce yourself to fellow hackers and teammates.</p>
                            </div>

                            {/* Avatar Section */}
                            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-[#0e111a]/80 border border-white/5">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] border-2 border-blue-400/40">
                                        {formData.profileImage ? (
                                            <img src={formData.profileImage} alt={formData.name} className="w-full h-full object-cover" />
                                        ) : (
                                            formData.name ? formData.name.charAt(0).toUpperCase() : <FaUser className="w-8 h-8 opacity-70" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 text-center sm:text-left space-y-2">
                                    <h4 className="text-sm font-bold text-white">Profile Avatar</h4>
                                    <p className="text-xs text-slate-400">Provide an image URL or use your default profile icon.</p>
                                    <input 
                                        type="url" 
                                        placeholder="https://example.com/avatar.jpg" 
                                        value={formData.profileImage}
                                        onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                                        className="w-full max-w-md px-3.5 py-2 text-xs bg-[#151824] border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none text-slate-200 placeholder-slate-600"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Name Input */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                        Full Name <span className="text-blue-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FaUser className="absolute left-3.5 top-3.5 text-slate-500 text-xs" />
                                        <input 
                                            type="text" 
                                            required
                                            placeholder="e.g. Alex Rivera" 
                                            value={formData.name} 
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-[#0e111a] border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm text-white placeholder-slate-600 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* University Input */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                        College / University <span className="text-blue-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FaGraduationCap className="absolute left-3.5 top-3.5 text-slate-500 text-xs" />
                                        <input 
                                            type="text" 
                                            required
                                            placeholder="e.g. Stanford University / IIT Delhi" 
                                            value={formData.university} 
                                            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-[#0e111a] border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm text-white placeholder-slate-600 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                        Location / City
                                    </label>
                                    <div className="relative">
                                        <FaLocationDot className="absolute left-3.5 top-3.5 text-slate-500 text-xs" />
                                        <input 
                                            type="text" 
                                            placeholder="e.g. San Francisco, CA / Bengaluru, India" 
                                            value={formData.location} 
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-[#0e111a] border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm text-white placeholder-slate-600 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Role & Skills */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="border-b border-white/10 pb-4 mb-6">
                                <h2 className="text-xl font-bold text-white">2. Primary Role & Technical Skills</h2>
                                <p className="text-xs text-slate-400">Choose your main hackathon role and technical competencies.</p>
                            </div>

                            {/* Role Cards Grid */}
                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                                    Select Your Main Role
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                                    {ROLE_OPTIONS.map((r) => {
                                        const Icon = r.icon;
                                        const isSelected = formData.role.toLowerCase() === r.label.toLowerCase();
                                        return (
                                            <div 
                                                key={r.id}
                                                onClick={() => handleRoleSelect(r.label)}
                                                className={`p-4 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between text-left ${
                                                    isSelected 
                                                        ? 'bg-gradient-to-b from-blue-600/25 to-indigo-600/25 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.25)] ring-1 ring-blue-400' 
                                                        : 'bg-[#0e111a]/70 hover:bg-[#121624] border-white/5 hover:border-white/15'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${
                                                        isSelected ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-800/80 text-slate-400'
                                                    }`}>
                                                        <Icon />
                                                    </div>
                                                    {isSelected && (
                                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]">
                                                            <FaCheck />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-white">{r.label}</h4>
                                                    <p className="text-[11px] text-slate-400 mt-0.5">{r.desc}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="pt-4 border-t border-white/5 space-y-4">
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                                    Popular Skills (Click to Add/Remove)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {SUGGESTED_SKILLS.map((skillName) => {
                                        const isAdded = formData.skills.some(
                                            s => s.name.toLowerCase() === skillName.toLowerCase()
                                        );
                                        return (
                                            <button
                                                key={skillName}
                                                type="button"
                                                onClick={() => handleToggleSkill(skillName)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                                                    isAdded 
                                                        ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.4)] border border-blue-400/40' 
                                                        : 'bg-[#0e111a] hover:bg-[#181d2c] border border-white/10 text-slate-300'
                                                }`}
                                            >
                                                {isAdded ? <FaCheck className="text-[10px]" /> : <FaPlus className="text-[10px] text-slate-500" />}
                                                {skillName}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Custom Skill Input */}
                                <div className="p-4 rounded-2xl bg-[#0e111a]/80 border border-white/10 mt-4 space-y-3">
                                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Add Custom Skill & Level</h4>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input 
                                            type="text" 
                                            placeholder="Skill name (e.g. Solidity, Rust, OpenCV)" 
                                            value={newSkillInput}
                                            onChange={(e) => setNewSkillInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddCustomSkill(e); }}
                                            className="flex-1 px-3.5 py-2.5 bg-[#151824] border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                        <div className="flex items-center gap-3 bg-[#151824] px-4 py-2 border border-white/10 rounded-xl">
                                            <span className="text-xs text-slate-400 whitespace-nowrap">Proficiency: <strong className="text-blue-400">{newSkillLevel}%</strong></span>
                                            <input 
                                                type="range" 
                                                min="20" 
                                                max="100" 
                                                value={newSkillLevel} 
                                                onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                                                className="w-24 accent-blue-500 cursor-pointer"
                                            />
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={handleAddCustomSkill}
                                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold tracking-wide transition shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center gap-1.5"
                                        >
                                            <FaPlus /> Add
                                        </button>
                                    </div>
                                </div>

                                {/* Selected Skills List */}
                                {formData.skills.length > 0 && (
                                    <div className="pt-2">
                                        <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Selected Skills ({formData.skills.length})
                                        </h5>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.skills.map((skill, index) => (
                                                <div 
                                                    key={index}
                                                    className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 bg-blue-950/40 border border-blue-500/30 rounded-xl text-xs text-blue-200"
                                                >
                                                    <span className="font-semibold">{skill.name}</span>
                                                    <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] rounded-md font-mono">{skill.level || 50}%</span>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemoveSkill(index)}
                                                        className="hover:text-red-400 transition ml-1 text-slate-400"
                                                    >
                                                        <FaXmark className="text-[10px]" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Bio & Preferences */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="border-b border-white/10 pb-4 mb-6">
                                <h2 className="text-xl font-bold text-white">3. Bio & Matchmaking Preferences</h2>
                                <p className="text-xs text-slate-400">Help hackathon teams and project leads learn what you love building.</p>
                            </div>

                            {/* Bio Textarea */}
                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                    About You (Bio)
                                </label>
                                <textarea 
                                    rows="4" 
                                    placeholder="Share a short summary of your background, exciting projects you've built, or what technologies you're looking forward to exploring..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full p-4 bg-[#0e111a] border border-white/10 rounded-2xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm text-white placeholder-slate-600 outline-none resize-none"
                                />
                            </div>

                            {/* Matchmaking Toggle Card */}
                            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-teal-900/20 border border-blue-500/30 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400 text-lg">
                                        <FaUsers />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Actively Looking for a Team</h4>
                                        <p className="text-xs text-slate-400">Enable this to feature your profile in teammate recommendations and receive invites.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.lookingForTeam} 
                                        onChange={(e) => setFormData({ ...formData, lookingForTeam: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons Footer */}
                    <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            {currentStep > 1 ? (
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-bold transition"
                                >
                                    Back
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleSaveProfile(true)}
                                    disabled={saving}
                                    className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition"
                                >
                                    Skip for now & go to Dashboard
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    Next Step <FaArrowRight className="text-[10px]" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => handleSaveProfile(false)}
                                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white rounded-xl text-xs font-extrabold tracking-wide transition-all shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    {saving ? 'SAVING PROFILE...' : 'COMPLETE & GO TO DASHBOARD 🚀'}
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
