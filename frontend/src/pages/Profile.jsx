import React, { useState } from 'react';

export default function Profile() {
    const [formData, setFormData] = useState({ skills: '', preferredRole: '', achievements: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Profile Saved:', formData);
    };

    return (
        <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Profile Overview</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Skills (comma-separated)</label>
                    <input
                        type="text"
                        name="skills"
                        placeholder="e.g. React, Node.js, Python"
                        value={formData.skills}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Preferred Role</label>
                    <input
                        type="text"
                        name="preferredRole"
                        placeholder="e.g. Frontend Developer"
                        value={formData.preferredRole}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Achievements</label>
                    <textarea
                        name="achievements"
                        rows="4"
                        placeholder="List your hackathon wins or relevant projects..."
                        value={formData.achievements}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px', backgroundColor: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Save Profile
                </button>
            </form>
        </div>
    );
}
