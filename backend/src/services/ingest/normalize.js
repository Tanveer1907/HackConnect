/**
 * Normalizes Hackathon properties to ensure consistency and prevent empty fields.
 */
exports.normalizeHackathon = (raw) => {
    return {
        sourceId: raw.sourceId ? String(raw.sourceId).trim() : null,
        source: raw.source ? String(raw.source).toLowerCase().trim() : 'manual',
        title: raw.title ? String(raw.title).trim() : 'Untitled Hackathon',
        description: raw.description ? String(raw.description).trim() : 'No description provided.',
        domain: raw.domain ? String(raw.domain).trim() : 'General',
        deadline: raw.deadline ? new Date(raw.deadline) : null,
        startDate: raw.startDate ? new Date(raw.startDate) : null,
        mode: (() => {
            const m = String(raw.mode || '').toUpperCase();
            if (m === 'OFFLINE' || m === 'IN_OFFICE') return 'OFFLINE';
            if (m === 'HYBRID') return 'HYBRID';
            return 'ONLINE';
        })(),
        teamSize: parseInt(raw.teamSize) || 4,
        image: raw.image ? String(raw.image).trim() : 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        prizePool: raw.prizePool ? String(raw.prizePool).trim() : 'Sponsored Prizes',
        sourceUrl: raw.sourceUrl ? String(raw.sourceUrl).trim() : null,
        participantCount: parseInt(raw.participantCount) || 0,
        status: raw.status || 'live' // Default verified ingested events to live
    };
};

/**
 * Normalizes Internship properties to ensure consistency and prevent empty fields.
 */
exports.normalizeInternship = (raw) => {
    return {
        sourceId: raw.sourceId ? String(raw.sourceId).trim() : null,
        source: raw.source ? String(raw.source).toLowerCase().trim() : 'manual',
        company: raw.company ? String(raw.company).trim() : 'Unknown Company',
        logo: raw.logo ? String(raw.logo).trim() : '💼',
        role: raw.role ? String(raw.role).trim() : 'Software Engineering Intern',
        location: raw.location ? String(raw.location).trim() : 'Remote',
        mode: ['REMOTE', 'HYBRID', 'IN_OFFICE'].includes(String(raw.mode).toUpperCase()) 
            ? String(raw.mode).toUpperCase() 
            : 'REMOTE',
        stipend: raw.stipend ? String(raw.stipend).trim() : 'Unpaid',
        duration: raw.duration ? String(raw.duration).trim() : '3 Months',
        skills: Array.isArray(raw.skills) 
            ? raw.skills.map(s => String(s).trim()) 
            : raw.skills ? String(raw.skills).split(',').map(s => s.trim()) : [],
        description: raw.description ? String(raw.description).trim() : 'No description provided.',
        applyUrl: raw.applyUrl ? String(raw.applyUrl).trim() : null,
        deadline: raw.deadline ? new Date(raw.deadline) : null,
        status: raw.status || 'pending'
    };
};
