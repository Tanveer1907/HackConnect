import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            {/* Navbar directly in Home page for exact layout */}
            <nav style={{ display: 'flex', alignItems: 'center', padding: '20px 40px', justifyContent: 'space-between', backgroundColor: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '20px', color: '#111827' }}>
                    <div style={{ width: '24px', height: '24px', backgroundColor: '#2563eb', borderRadius: '4px' }}></div>
                    HackConnect
                </div>
                <div style={{ display: 'flex', gap: '30px', color: '#4b5563', fontSize: '14px', fontWeight: '500' }}>
                    <Link to="/hackathons">Hackathons</Link>
                    <span style={{ cursor: 'pointer' }}>Teams</span>
                    <span style={{ cursor: 'pointer' }}>Internships</span>
                    <span style={{ cursor: 'pointer' }}>Community</span>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <Link to="/login" style={{ color: '#4b5563', fontWeight: '600', fontSize: '14px' }}>Log In</Link>
                    <Link to="/signup" className="btn-primary" style={{ fontSize: '14px', padding: '8px 16px' }}>Sign Up</Link>
                </div>
            </nav>

            <main style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Hero Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '100px' }}>
                    <div style={{ flex: 1, paddingRight: '40px' }}>
                        <div style={{ display: 'inline-block', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '600', marginBottom: '20px' }}>
                            🚀 v2.0 is now live!
                        </div>
                        <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.1', color: '#111827', margin: '0 0 20px 0' }}>
                            Discover Hackathons.<br />
                            <span style={{ color: '#2563eb' }}>Build Strong Teams.</span><br />
                            Grow Together.
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: '18px', maxWidth: '500px', lineHeight: '1.6', marginBottom: '40px' }}>
                            HackConnect is the ultimate platform for students to find teammates, join global hackathons, and launch their careers in tech.
                        </p>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <Link to="/signup" className="btn-primary" style={{ padding: '12px 24px', fontSize: '16px' }}>Get Started</Link>
                            <Link to="/hackathons" className="btn-outline" style={{ padding: '12px 24px', fontSize: '16px' }}>Explore Hackathons</Link>
                        </div>
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                            alt="Team collaborating"
                            style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                        />
                        <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', backgroundColor: 'white', padding: '15px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', backgroundColor: '#e0e7ff', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>🏆</div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>HackMIT 2024</div>
                                    <div style={{ color: '#6b7280', fontSize: '12px' }}>Registration closing in 2 days</div>
                                </div>
                            </div>
                            <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '20px' }}>Join</button>
                        </div>
                    </div>
                </div>

                {/* How it Works */}
                <div style={{ textAlign: 'center', marginBottom: '100px' }}>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '15px' }}>How it Works</h2>
                    <p style={{ color: '#6b7280', marginBottom: '50px' }}>Join the community in three simple steps and start building your dream projects.</p>

                    <div style={{ display: 'flex', gap: '30px', justifyContent: 'space-between' }}>
                        {[
                            { icon: '👤', title: '1. Create Profile', desc: 'Showcase your skills, GitHub repos, and past projects to attract the best teammates.' },
                            { icon: '👥', title: '2. Find a Team', desc: 'Browse listings or post your own to find the perfect squad for your next event.' },
                            { icon: '🏆', title: '3. Build & Win', desc: 'Collaborate efficiently, submit your project, and win prizes and recognition.' }
                        ].map((step, i) => (
                            <div key={i} style={{ flex: 1, backgroundColor: 'white', padding: '40px 30px', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <div style={{ width: '60px', height: '60px', backgroundColor: '#f3f4f6', borderRadius: '30px', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' }}>{step.icon}</div>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>{step.title}</h3>
                                <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '30px' }}>
                        <span style={{ color: '#2563eb', fontWeight: '600', cursor: 'pointer' }}>Learn more about the process →</span>
                    </div>
                </div>

                {/* Platform Features */}
                <div style={{ marginBottom: '100px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                        <div>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '10px' }}>Platform Features</h2>
                            <p style={{ color: '#6b7280' }}>Everything you need to succeed in the hackathon ecosystem.</p>
                        </div>
                        <button className="btn-outline" style={{ borderRadius: '20px', padding: '8px 16px', fontSize: '14px' }}>View all features</button>
                    </div>

                    <div style={{ display: 'flex', gap: '30px' }}>
                        {[
                            { tag: 'DISCOVERY', title: 'Global Hackathon List', desc: 'A curated, real-time list of global and local hackathons updated daily. Filter by location, prizes, or tech stack.' },
                            { tag: 'NETWORKING', title: 'Smart Team Formation', desc: 'Our AI matching algorithm helps you find teammates with complementary skills to build the perfect balanced squad.' },
                            { tag: 'CAREER', title: 'Internship Opportunities', desc: 'Connect directly with event sponsors and top tech companies looking to hire talent from hackathons.' }
                        ].map((feature, i) => (
                            <div key={i} style={{ flex: 1, backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                                <div style={{ height: '200px', backgroundColor: '#e5e7eb' }}>
                                    <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&w=400&q=80`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="feature" />
                                </div>
                                <div style={{ padding: '24px' }}>
                                    <div style={{ color: '#2563eb', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>{feature.tag}</div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>{feature.title}</h3>
                                    <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6' }}>{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div style={{ backgroundColor: '#3b49df', borderRadius: '24px', padding: '60px', textAlign: 'center', color: 'white' }}>
                    <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' }}>Ready to build something amazing?</h2>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <Link to="/signup" className="btn-outline" style={{ padding: '12px 24px', borderRadius: '30px' }}>Sign Up Now</Link>
                        <Link to="/hackathons" style={{ padding: '12px 24px', borderRadius: '30px', border: '1px solid white', color: 'white', fontWeight: '600' }}>View Hackathons</Link>
                    </div>
                </div>
            </main>

            <footer style={{ backgroundColor: 'white', padding: '60px 40px', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '20px', color: '#111827', marginBottom: '15px' }}>
                            <div style={{ width: '24px', height: '24px', backgroundColor: '#2563eb', borderRadius: '4px' }}></div>
                            HackConnect
                        </div>
                        <p style={{ color: '#6b7280', fontSize: '14px', maxWidth: '300px' }}>Empowering the next generation of builders. Connect, create, and launch your career with HackConnect.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '60px', fontSize: '14px' }}>
                        <div>
                            <h4 style={{ fontWeight: 'bold', marginBottom: '15px' }}>PLATFORM</h4>
                            <div style={{ color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <span>Find Hackathons</span>
                                <span>Find Teammates</span>
                                <span>Internships</span>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 'bold', marginBottom: '15px' }}>COMPANY</h4>
                            <div style={{ color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <span>About Us</span>
                                <span>Careers</span>
                                <span>Contact</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', marginTop: '60px' }}>
                    © 2024 HackConnect Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
