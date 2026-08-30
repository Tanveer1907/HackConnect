import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-hot-toast';
import { getPendingModeration, moderateItem, createHackathon, createInternship } from '../services/api';

export default function AdminModeration() {
    const [hackathons, setHackathons] = useState([]);
    const [internships, setInternships] = useState([]);
    const [activeTab, setActiveTab] = useState('hackathons');
    const [loading, setLoading] = useState(true);

    // Edit modal states
    const [editingItem, setEditingItem] = useState(null);
    const [editType, setEditType] = useState('');
    const [editForm, setEditForm] = useState({});

    // Admin direct posting states
    const [showCreateHackathonModal, setShowCreateHackathonModal] = useState(false);
    const [isCreatingHackathon, setIsCreatingHackathon] = useState(false);
    const [hackathonForm, setHackathonForm] = useState({
        title: '',
        description: '',
        domain: 'AI/ML',
        mode: 'ONLINE',
        prizePool: '$10,000',
        teamSize: 4,
        deadline: '',
        image: ''
    });

    const [showCreateInternshipModal, setShowCreateInternshipModal] = useState(false);
    const [isCreatingInternship, setIsCreatingInternship] = useState(false);
    const [internshipForm, setInternshipForm] = useState({
        company: '',
        role: '',
        location: 'Remote',
        mode: 'REMOTE',
        stipend: '$2,000/month',
        duration: '3 Months',
        skills: '',
        description: '',
        applyUrl: ''
    });

    const loadPendingData = async () => {
        try {
            const response = await getPendingModeration();
            setHackathons(response.data.hackathons || []);
            setInternships(response.data.internships || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load moderation data. Make sure you are logged in as admin.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPendingData();
    }, []);

    const handleCreateHackathonSubmit = async (e) => {
        e.preventDefault();
        if (!hackathonForm.title.trim() || !hackathonForm.description.trim()) {
            return toast.error("Please fill in title and description");
        }
        setIsCreatingHackathon(true);
        try {
            await createHackathon(hackathonForm);
            toast.success("Hackathon published directly by Admin!");
            setShowCreateHackathonModal(false);
            setHackathonForm({
                title: '',
                description: '',
                domain: 'AI/ML',
                mode: 'ONLINE',
                prizePool: '$10,000',
                teamSize: 4,
                deadline: '',
                image: ''
            });
            loadPendingData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create hackathon");
        } finally {
            setIsCreatingHackathon(false);
        }
    };

    const handleCreateInternshipSubmit = async (e) => {
        e.preventDefault();
        if (!internshipForm.company.trim() || !internshipForm.role.trim() || !internshipForm.description.trim()) {
            return toast.error("Please fill in company, role and description");
        }
        setIsCreatingInternship(true);
        try {
            await createInternship(internshipForm);
            toast.success("Internship published directly by Admin!");
            setShowCreateInternshipModal(false);
            setInternshipForm({
                company: '',
                role: '',
                location: 'Remote',
                mode: 'REMOTE',
                stipend: '$2,000/month',
                duration: '3 Months',
                skills: '',
                description: '',
                applyUrl: ''
            });
            loadPendingData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create internship");
        } finally {
            setIsCreatingInternship(false);
        }
    };

    const handleAction = async (type, id, action) => {
        try {
            const res = await moderateItem(type, id, action);
            toast.success(res.data.message || `Item ${action}ed successfully`);
            loadPendingData();
        } catch (err) {
            console.error(err);
            toast.error(`Failed to ${action} item.`);
        }
    };

    const handleOpenEdit = (type, item) => {
        setEditType(type);
        setEditingItem(item);
        setEditForm({ ...item });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await moderateItem(editType, editingItem._id, 'edit', editForm);
            toast.success("Item details updated successfully!");
            setEditingItem(null);
            loadPendingData();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update item details.");
        }
    };

    return (
        <div className="flex flex-col flex-1 text-slate-800 bg-slate-50 transition-colors duration-300 dark:text-slate-200 dark:bg-transparent min-h-0">
            <div className="flex flex-1 overflow-hidden max-w-[1600px] w-full mx-auto relative z-10 min-h-0">
                <Sidebar className="hidden lg:flex" />

                <main className="flex-1 p-6 md:p-10 overflow-y-auto min-h-0">
                    <div className="max-w-6xl mx-auto">
                        
                        {/* HEADER */}
                        <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight dark:text-white">
                                    Admin Moderation Queue 🛡️
                                </h1>
                                <p className="text-slate-600 font-medium dark:text-slate-400">
                                    Review, edit, and approve dynamically aggregated listing feeds before going live.
                                </p>
                            </div>
                            
                            {/* Counters */}
                            <div className="flex gap-4">
                                <div className="bg-white px-5 py-3 rounded-2xl border border-gray-200 dark:bg-white/5 dark:border-white/10 text-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pending Hackathons</span>
                                    <strong className="text-2xl text-blue-600 dark:text-blue-400">{hackathons.length}</strong>
                                </div>
                                <div className="bg-white px-5 py-3 rounded-2xl border border-gray-200 dark:bg-white/5 dark:border-white/10 text-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pending Internships</span>
                                    <strong className="text-2xl text-emerald-600 dark:text-emerald-400">{internships.length}</strong>
                                </div>
                            </div>
                        </div>

                        {/* TAB BAR & ADMIN ACTION BUTTONS */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-200 dark:border-white/10 pb-4">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setActiveTab('hackathons')}
                                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                                        activeTab === 'hackathons'
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'bg-white hover:bg-slate-100 border border-gray-200 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10'
                                    }`}
                                >
                                    Hackathons Queue ({hackathons.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('internships')}
                                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                                        activeTab === 'internships'
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'bg-white hover:bg-slate-100 border border-gray-200 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10'
                                    }`}
                                >
                                    Internships Queue ({internships.length})
                                </button>
                            </div>

                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => setShowCreateHackathonModal(true)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
                                >
                                    <span>+</span> Post Hackathon
                                </button>
                                <button
                                    onClick={() => setShowCreateInternshipModal(true)}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
                                >
                                    <span>+</span> Post Internship
                                </button>
                            </div>
                        </div>

                        {/* QUEUE LISTINGS */}
                        {loading ? (
                            <div className="text-center py-20 text-slate-500 font-semibold bg-white rounded-3xl border border-gray-200 dark:bg-white/5 dark:border-white/10">
                                Loading moderation queues...
                            </div>
                        ) : activeTab === 'hackathons' ? (
                            hackathons.length === 0 ? (
                                <div className="text-center py-20 text-slate-500 font-semibold bg-white rounded-3xl border border-gray-200 dark:bg-white/5 dark:border-white/10">
                                    No pending hackathons to review.
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {hackathons.map(item => (
                                        <div key={item._id} className="bg-white rounded-3xl p-7 border border-gray-200 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4 mb-3">
                                                    <img 
                                                        src={item.image} 
                                                        alt="Banner" 
                                                        className="w-16 h-12 object-cover rounded-lg border dark:border-white/10"
                                                    />
                                                    <div>
                                                        <h3 className="font-extrabold text-slate-900 text-lg leading-tight dark:text-white">{item.title}</h3>
                                                        <p className="text-xs text-blue-600 font-bold dark:text-blue-400">
                                                            Source: <span className="uppercase">{item.source}</span> • Scraped ID: {item.sourceId}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 text-sm leading-relaxed mb-4 dark:text-slate-300">{item.description}</p>
                                                <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                    <div>Prize Pool: <strong className="text-slate-950 dark:text-white">{item.prizePool || 'Swag/Prizes'}</strong></div>
                                                    <div>Domain: <strong className="text-slate-950 dark:text-white">{item.domain}</strong></div>
                                                    <div>Team Size: <strong className="text-slate-950 dark:text-white">{item.teamSize}</strong></div>
                                                    <div>Mode: <strong className="text-slate-950 dark:text-white">{item.mode}</strong></div>
                                                    {item.deadline && (
                                                        <div>Deadline: <strong className="text-slate-950 dark:text-white">{new Date(item.deadline).toLocaleDateString()}</strong></div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Action panel */}
                                            <div className="flex md:flex-col justify-end gap-3 min-w-[150px]">
                                                <button
                                                    onClick={() => handleAction('hackathon', item._id, 'approve')}
                                                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all"
                                                >
                                                    Approve & Publish
                                                </button>
                                                <button
                                                    onClick={() => handleOpenEdit('hackathon', item)}
                                                    className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                                                >
                                                    Edit Details
                                                </button>
                                                <button
                                                    onClick={() => handleAction('hackathon', item._id, 'reject')}
                                                    className="px-5 py-2.5 border border-rose-350 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl transition-all dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10"
                                                >
                                                    Reject / Hide
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            internships.length === 0 ? (
                                <div className="text-center py-20 text-slate-500 font-semibold bg-white rounded-3xl border border-gray-200 dark:bg-white/5 dark:border-white/10">
                                    No pending internships to review.
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {internships.map(item => (
                                        <div key={item._id} className="bg-white rounded-3xl p-7 border border-gray-200 dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-extrabold text-2xl text-slate-800 shadow-inner dark:bg-slate-800 dark:text-white">
                                                        {item.logo || '💼'}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-extrabold text-slate-900 text-lg leading-tight dark:text-white">{item.role}</h3>
                                                        <p className="text-xs text-blue-600 font-bold dark:text-blue-400">
                                                            {item.company} • Source: <span className="uppercase">{item.source}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 text-sm leading-relaxed mb-4 dark:text-slate-300">{item.description}</p>
                                                <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                    <div>Stipend: <strong className="text-slate-950 dark:text-white">{item.stipend || 'Competitive'}</strong></div>
                                                    <div>Duration: <strong className="text-slate-950 dark:text-white">{item.duration}</strong></div>
                                                    <div>Skills: <strong className="text-slate-950 dark:text-white">{item.skills.join(', ') || 'General'}</strong></div>
                                                    <div>Mode: <strong className="text-slate-950 dark:text-white">{item.mode}</strong></div>
                                                    {item.deadline && (
                                                        <div>Deadline: <strong className="text-slate-950 dark:text-white">{new Date(item.deadline).toLocaleDateString()}</strong></div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Action panel */}
                                            <div className="flex md:flex-col justify-end gap-3 min-w-[150px]">
                                                <button
                                                    onClick={() => handleAction('internship', item._id, 'approve')}
                                                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all"
                                                >
                                                    Approve & Publish
                                                </button>
                                                <button
                                                    onClick={() => handleOpenEdit('internship', item)}
                                                    className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                                                >
                                                    Edit Details
                                                </button>
                                                <button
                                                    onClick={() => handleAction('internship', item._id, 'reject')}
                                                    className="px-5 py-2.5 border border-rose-350 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl transition-all dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10"
                                                >
                                                    Reject / Hide
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                </main>
            </div>

            {/* EDIT DETAIL MODAL */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl border border-gray-150 dark:bg-slate-900 dark:border-white/10">
                        <div className="p-8 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <div>
                                <h2 className="font-extrabold text-slate-900 text-xl leading-none mb-1 dark:text-white">Edit Aggregated Details</h2>
                                <p className="text-xs text-slate-500 font-semibold dark:text-slate-400">Review and modify info for {editingItem.title || editingItem.role}</p>
                            </div>
                            <button 
                                onClick={() => setEditingItem(null)}
                                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-350 text-slate-500 font-bold flex items-center justify-center transition-colors dark:bg-white/10 dark:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
                            {editType === 'hackathon' ? (
                                <>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Title</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={editForm.title || ''}
                                            onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-250 rounded-xl text-sm font-medium outline-none dark:bg-slate-800/40 dark:border-white/5 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Domain</label>
                                        <input 
                                            type="text" 
                                            value={editForm.domain || ''}
                                            onChange={e => setEditForm({ ...editForm, domain: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-250 rounded-xl text-sm font-medium outline-none dark:bg-slate-800/40 dark:border-white/5 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Prize Pool</label>
                                        <input 
                                            type="text" 
                                            value={editForm.prizePool || ''}
                                            onChange={e => setEditForm({ ...editForm, prizePool: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-250 rounded-xl text-sm font-medium outline-none dark:bg-slate-800/40 dark:border-white/5 dark:text-white"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Role / Title</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={editForm.role || ''}
                                            onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-250 rounded-xl text-sm font-medium outline-none dark:bg-slate-800/40 dark:border-white/5 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Company</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={editForm.company || ''}
                                            onChange={e => setEditForm({ ...editForm, company: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-250 rounded-xl text-sm font-medium outline-none dark:bg-slate-800/40 dark:border-white/5 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Stipend</label>
                                        <input 
                                            type="text" 
                                            value={editForm.stipend || ''}
                                            onChange={e => setEditForm({ ...editForm, stipend: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-250 rounded-xl text-sm font-medium outline-none dark:bg-slate-800/40 dark:border-white/5 dark:text-white"
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Work Mode</label>
                                <select
                                    value={editForm.mode || ''}
                                    onChange={e => setEditForm({ ...editForm, mode: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-250 rounded-xl text-sm font-medium outline-none dark:bg-slate-800/40 dark:border-white/5 dark:text-slate-350"
                                >
                                    <option value="REMOTE">Remote</option>
                                    <option value="HYBRID">Hybrid</option>
                                    <option value="IN_OFFICE">In-Office</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                                <textarea 
                                    rows="4" 
                                    required
                                    value={editForm.description || ''}
                                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-250 rounded-xl text-sm font-medium outline-none resize-none dark:bg-slate-800/40 dark:border-white/5 dark:text-white"
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-lg hover:shadow-xl"
                            >
                                SAVE UPDATES
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ADMIN CREATE HACKATHON MODAL */}
            {showCreateHackathonModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-200 dark:border-white/10 p-6 md:p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">🏆 Post New Hackathon (Admin)</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Publish an official hackathon challenge directly to the live platform</p>
                            </div>
                            <button
                                onClick={() => setShowCreateHackathonModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateHackathonSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Hackathon Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Google AI Hackathon 2026"
                                    value={hackathonForm.title}
                                    onChange={(e) => setHackathonForm({ ...hackathonForm, title: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Description *
                                </label>
                                <textarea
                                    rows="3"
                                    placeholder="Describe the challenge, problem statements, and tracks..."
                                    value={hackathonForm.description}
                                    onChange={(e) => setHackathonForm({ ...hackathonForm, description: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Domain / Category
                                    </label>
                                    <select
                                        value={hackathonForm.domain}
                                        onChange={(e) => setHackathonForm({ ...hackathonForm, domain: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    >
                                        {['AI/ML', 'Blockchain', 'Sustainability', 'Finance/Crypto', 'Healthcare/MedTech', 'Education', 'Cybersecurity', 'Gaming/AR/VR', 'General'].map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Mode
                                    </label>
                                    <select
                                        value={hackathonForm.mode}
                                        onChange={(e) => setHackathonForm({ ...hackathonForm, mode: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="ONLINE">ONLINE</option>
                                        <option value="OFFLINE">OFFLINE</option>
                                        <option value="HYBRID">HYBRID</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Prize Pool
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. $25,000"
                                        value={hackathonForm.prizePool}
                                        onChange={(e) => setHackathonForm({ ...hackathonForm, prizePool: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Max Team Size
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={hackathonForm.teamSize}
                                        onChange={(e) => setHackathonForm({ ...hackathonForm, teamSize: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Deadline
                                    </label>
                                    <input
                                        type="date"
                                        value={hackathonForm.deadline}
                                        onChange={(e) => setHackathonForm({ ...hackathonForm, deadline: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Cover Banner Image URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://images.unsplash.com/..."
                                    value={hackathonForm.image}
                                    onChange={(e) => setHackathonForm({ ...hackathonForm, image: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateHackathonModal(false)}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreatingHackathon}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-md transition disabled:opacity-50"
                                >
                                    {isCreatingHackathon ? 'Publishing...' : 'Publish Hackathon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ADMIN CREATE INTERNSHIP MODAL */}
            {showCreateInternshipModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-200 dark:border-white/10 p-6 md:p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">💼 Post New Internship (Admin)</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Publish a verified internship position directly to the live platform</p>
                            </div>
                            <button
                                onClick={() => setShowCreateInternshipModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateInternshipSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Google, Stripe"
                                        value={internshipForm.company}
                                        onChange={(e) => setInternshipForm({ ...internshipForm, company: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Role / Position *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Frontend Engineering Intern"
                                        value={internshipForm.role}
                                        onChange={(e) => setInternshipForm({ ...internshipForm, role: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Work Mode
                                    </label>
                                    <select
                                        value={internshipForm.mode}
                                        onChange={(e) => setInternshipForm({ ...internshipForm, mode: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="REMOTE">REMOTE</option>
                                        <option value="HYBRID">HYBRID</option>
                                        <option value="IN_OFFICE">IN_OFFICE</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. San Francisco / Remote"
                                        value={internshipForm.location}
                                        onChange={(e) => setInternshipForm({ ...internshipForm, location: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Stipend
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. $5,000 / mo"
                                        value={internshipForm.stipend}
                                        onChange={(e) => setInternshipForm({ ...internshipForm, stipend: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Required Skills (comma separated)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. React, TypeScript, TailwindCSS"
                                    value={internshipForm.skills}
                                    onChange={(e) => setInternshipForm({ ...internshipForm, skills: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Role Description & Responsibilities *
                                </label>
                                <textarea
                                    rows="4"
                                    placeholder="Describe responsibilities, expectations, and requirements..."
                                    value={internshipForm.description}
                                    onChange={(e) => setInternshipForm({ ...internshipForm, description: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateInternshipModal(false)}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreatingInternship}
                                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-md transition disabled:opacity-50"
                                >
                                    {isCreatingInternship ? 'Posting...' : 'Post Internship'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
