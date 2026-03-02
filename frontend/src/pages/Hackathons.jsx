import React from 'react';
import { Link } from 'react-router-dom';

export default function Hackathons() {
    const dummyHackathons = [
        { id: 1, title: 'Global AI Challenge 2024', mode: 'ONLINE', duration: '48H', desc: 'Build the future of generative AI. Solve real-world problems using the latest...', deadline: '2 Days 4h', joined: 120 },
        { id: 2, title: 'CyberDefend 2024', mode: 'NEW YORK', duration: '24H', desc: 'The ultimate CTF competition for university students. Secure the flag...', deadline: '12 Hours', joined: 45 },
        { id: 3, title: 'Design Systems Hack', mode: 'HYBRID', duration: '1 WEEK', desc: 'Focus on UI/UX and frontend architecture. Create scalable design...', deadline: '5 Days', joined: 300, isStartsIn: true },
        { id: 4, title: 'GreenTech Summit', mode: 'ONLINE', duration: '72H', desc: 'Innovating for a sustainable future. Develop solutions for climate change...', deadline: '1 Week', joined: 89 },
        { id: 5, title: 'GameJam UK 2024', mode: 'LONDON', duration: '36H', desc: 'Create the next indie hit. Theme will be announced at the start of the event.', deadline: '3 Weeks', joined: 210, isStartsIn: true },
        { id: 6, title: 'Open Source Summer', mode: 'ONLINE', duration: '4 WEEKS', desc: 'Contribute to major open source projects and earn rewards. A month-...', deadline: '1 Month', joined: 5000 }
    ];

    return (
        <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {/* Navbar */}
            <nav style={{ display: 'flex', alignItems: 'center', padding: '15px 40px', justifyContent: 'space-between', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '20px', color: '#111827' }}>
                    <div style={{ width: '24px', height: '24px', backgroundColor: '#2563eb', borderRadius: '4px' }}></div>
                    HackConnect
                </Link>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px', marginLeft: '40px' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#9ca3af' }}>🔍</span>
                    <input type="text" placeholder="Search hackathons..." style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '20px', border: '1px solid #e5e7eb', backgroundColor: '#f3f4f6', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: '25px', color: '#4b5563', fontSize: '14px', fontWeight: '500', marginLeft: 'auto', marginRight: '30px' }}>
                    <span style={{ color: '#111827', borderBottom: '2px solid #2563eb', paddingBottom: '20px', marginBottom: '-20px' }}>Explore</span>
                    <span style={{ cursor: 'pointer' }}>Find Teammates</span>
                    <span style={{ cursor: 'pointer' }}>Resources</span>
                    <span style={{ cursor: 'pointer' }}>My Projects</span>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <Link to="/login" className="btn-outline" style={{ fontSize: '14px', padding: '8px 16px' }}>Log In</Link>
                    <Link to="/signup" className="btn-primary" style={{ fontSize: '14px', padding: '8px 16px' }}>Sign Up</Link>
                </div>
            </nav>

            {/* Main Content */}
            <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
                {/* Sidebar Filters */}
                <aside style={{ width: '250px', flexShrink: 0, paddingRight: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>Filters</h3>
                        <span style={{ color: '#2563eb', fontSize: '12px', cursor: 'pointer' }}>Reset All</span>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h4 style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Mode</h4>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '14px' }}>
                            <input type="radio" name="mode" defaultChecked style={{ accentColor: '#2563eb' }} /> Online
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '14px' }}>
                            <input type="radio" name="mode" style={{ accentColor: '#2563eb' }} /> Offline (In-person)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '14px' }}>
                            <input type="radio" name="mode" style={{ accentColor: '#2563eb' }} /> Hybrid
                        </label>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h4 style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Domain</h4>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '14px' }}>
                            <input type="checkbox" defaultChecked style={{ accentColor: '#2563eb' }} /> Web Development
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '14px' }}>
                            <input type="checkbox" style={{ accentColor: '#2563eb' }} /> AI & Machine Learning
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '14px' }}>
                            <input type="checkbox" style={{ accentColor: '#2563eb' }} /> Blockchain
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '14px' }}>
                            <input type="checkbox" style={{ accentColor: '#2563eb' }} /> Cybersecurity
                        </label>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Duration</h4>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '14px' }}>
                            <input type="radio" name="dur" style={{ accentColor: '#2563eb' }} /> 1-2 Days
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '14px' }}>
                            <input type="radio" name="dur" style={{ accentColor: '#2563eb' }} /> 3-7 Days
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '14px' }}>
                            <input type="radio" name="dur" style={{ accentColor: '#2563eb' }} /> Month Long
                        </label>
                    </div>

                    <div style={{ backgroundColor: '#eef2ff', padding: '20px', borderRadius: '12px', marginTop: '40px' }}>
                        <div style={{ color: '#4338ca', fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>📢 Pro Tip</div>
                        <p style={{ color: '#4f46e5', fontSize: '12px', margin: 0 }}>Hackathons with "Beginner Friendly" tags often have mentors available 24/7.</p>
                    </div>
                </aside>

                {/* Hackathons Grid */}
                <main style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                        <div>
                            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 10px 0' }}>Upcoming Hackathons</h1>
                            <p style={{ color: '#6b7280', margin: 0 }}>Discover, compete, and win prizes in global challenges.</p>
                        </div>
                        <select style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#4b5563', fontSize: '14px', outline: 'none' }}>
                            <option>Recommended</option>
                            <option>Newest</option>
                            <option>Prize Pool</option>
                        </select>
                    </div>

                    {/* Stats Bar */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ backgroundColor: 'white', padding: '15px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #e5e7eb', flex: 1 }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#dcfce7', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>📅</div>
                            <div>
                                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Active Now</div>
                                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>14 Events</div>
                            </div>
                        </div>
                        <div style={{ backgroundColor: 'white', padding: '15px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #e5e7eb', flex: 1 }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#f3e8ff', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>🚀</div>
                            <div>
                                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Upcoming</div>
                                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>32 Events</div>
                            </div>
                        </div>
                        <div style={{ backgroundColor: 'white', padding: '15px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #e5e7eb', flex: 1 }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#ffedd5', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>👥</div>
                            <div>
                                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Hackers</div>
                                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>12k+ Active</div>
                            </div>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                        {dummyHackathons.map((hackathon, i) => (
                            <div key={hackathon.id} style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb', transition: 'transform 0.2s', cursor: 'pointer' }} className="hackathon-card">
                                <div style={{ height: '160px', backgroundColor: '#e5e7eb', position: 'relative' }}>
                                    <img src={`https://images.unsplash.com/photo-${1500000000000 + i + 10}?auto=format&fit=crop&w=600&q=80`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Cover" />
                                    <div style={{ position: 'absolute', top: '15px', right: '15px', width: '32px', height: '32px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>🤍</div>
                                    {i === 0 && (
                                        <div style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: 'white', color: '#111827', fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px' }}>Featured</div>
                                    )}
                                </div>
                                <div style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                        <span style={{ backgroundColor: hackathon.mode === 'ONLINE' ? '#ecfdf5' : '#eff6ff', color: hackathon.mode === 'ONLINE' ? '#059669' : '#2563eb', fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>
                                            {hackathon.mode === 'ONLINE' ? '🌐 ONLINE' : hackathon.mode === 'HYBRID' ? '🏙️ HYBRID' : '📍 ' + hackathon.mode}
                                        </span>
                                        <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>
                                            ⏱️ {hackathon.duration}
                                        </span>
                                    </div>

                                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#111827' }}>{hackathon.title}</h3>
                                    <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5', margin: '0 0 20px 0', height: '42px', overflow: 'hidden' }}>{hackathon.desc}</p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: '24px', height: '24px', backgroundColor: '#e5e7eb', borderRadius: '12px', border: '2px solid white' }}></div>
                                                <div style={{ width: '24px', height: '24px', backgroundColor: '#d1d5db', borderRadius: '12px', border: '2px solid white', marginLeft: '-8px' }}></div>
                                            </div>
                                            <span style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500' }}>+{hackathon.joined}</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold' }}>{hackathon.isStartsIn ? 'STARTS IN' : 'DEADLINE IN'}</div>
                                            <div style={{ fontSize: '14px', color: hackathon.isStartsIn ? '#111827' : '#dc2626', fontWeight: 'bold' }}>{hackathon.deadline}</div>
                                        </div>
                                    </div>

                                    <button className="btn-outline" style={{ width: '100%', padding: '10px', fontSize: '14px' }}>View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '10px' }}>
                        <button style={{ width: '36px', height: '36px', borderRadius: '18px', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#6b7280', cursor: 'pointer' }}>&lt;</button>
                        <button style={{ width: '36px', height: '36px', borderRadius: '18px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>1</button>
                        <button style={{ width: '36px', height: '36px', borderRadius: '18px', border: 'none', backgroundColor: 'transparent', color: '#4b5563', cursor: 'pointer' }}>2</button>
                        <button style={{ width: '36px', height: '36px', borderRadius: '18px', border: 'none', backgroundColor: 'transparent', color: '#4b5563', cursor: 'pointer' }}>3</button>
                        <span style={{ color: '#9ca3af', lineHeight: '36px' }}>...</span>
                        <button style={{ width: '36px', height: '36px', borderRadius: '18px', border: 'none', backgroundColor: 'transparent', color: '#4b5563', cursor: 'pointer' }}>12</button>
                        <button style={{ width: '36px', height: '36px', borderRadius: '18px', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#6b7280', cursor: 'pointer' }}>&gt;</button>
                    </div>
                </main>
            </div>

            <footer style={{ backgroundColor: 'white', padding: '40px 0', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', color: '#4b5563', fontSize: '14px', marginBottom: '20px' }}>
                    <span>About</span>
                    <span>Contact</span>
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                </div>
                <div style={{ color: '#9ca3af', fontSize: '12px' }}>
                    © 2023 HackConnect. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
