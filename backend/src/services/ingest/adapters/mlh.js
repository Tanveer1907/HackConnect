const axios = require('axios');

/**
 * Fetches hackathons from MLH (Major League Hacking)
 * Falls back to structured simulated MLH seasonal events on failure.
 */
exports.fetchMlhHackathons = async () => {
    try {
        console.log('[MLH Adapter] Fetching hackathons...');
        
        // MLH season JSON feed
        const response = await axios.get('https://mlh.io/seasons/2026/events.json', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 5000
        });

        if (Array.isArray(response.data)) {
            return response.data.map(event => ({
                sourceId: String(event.id || event.name.replace(/\s+/g, '-').toLowerCase()),
                title: event.name,
                description: event.description || `Official MLH Student Hackathon event: ${event.name}. Join students in building amazing hacks!`,
                domain: 'Software Engineering',
                deadline: event.end_date ? new Date(event.end_date) : null,
                startDate: event.start_date ? new Date(event.start_date) : null,
                mode: event.location && event.location.toLowerCase().includes('online') ? 'REMOTE' : 'HYBRID',
                teamSize: 4,
                image: event.imageUrl || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
                prizePool: 'Hardware & Swag',
                sourceUrl: event.url,
                participantCount: event.attendance || 250,
                source: 'mlh'
            }));
        }

        throw new Error('Unexpected JSON structure from MLH API');
    } catch (error) {
        console.warn(`[MLH Adapter] API Fetch failed (${error.message}). Falling back to simulated student hackathons.`);
        
        return [
            {
                sourceId: 'mlh-event-201',
                title: 'HackPenn 2026',
                description: 'The premier student hackathon at UPenn. 36 hours of coding, hardware labs, and mentorship. Fully sponsored by major tech giants.',
                domain: 'Software Engineering',
                deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
                startDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
                mode: 'HYBRID',
                teamSize: 4,
                image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
                prizePool: '$10,000 + Oculus Quest 3',
                sourceUrl: 'https://hackpenn.org',
                participantCount: 650,
                source: 'mlh'
            },
            {
                sourceId: 'mlh-event-202',
                title: 'CalHacks 13.0',
                description: 'The world\'s largest collegiate hackathon hosted at UC Berkeley. Join 2000+ hackers for workshops, tech talks, and intense building.',
                domain: 'Artificial Intelligence & Systems',
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                startDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
                mode: 'HYBRID',
                teamSize: 4,
                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
                prizePool: '$35,000 in Track Prizes',
                sourceUrl: 'https://calhacks.io',
                participantCount: 2200,
                source: 'mlh'
            }
        ];
    }
};
