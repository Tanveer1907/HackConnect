const axios = require('axios');

/**
 * Infer domain matching HackConnect frontend filters:
 * ['AI/ML', 'Blockchain', 'Sustainability', 'Finance/Crypto', 'Healthcare/MedTech', 'Education', 'Cybersecurity', 'Gaming/AR/VR', 'General']
 */
const inferDomain = (title = '') => {
    const t = title.toLowerCase();
    if (t.includes('ai') || t.includes('ml') || t.includes('gpt') || t.includes('neural') || t.includes('data') || t.includes('vision') || t.includes('intelligence')) {
        return 'AI/ML';
    }
    if (t.includes('web3') || t.includes('crypto') || t.includes('blockchain') || t.includes('eth') || t.includes('defi') || t.includes('solana') || t.includes('nft')) {
        return 'Blockchain';
    }
    if (t.includes('health') || t.includes('med') || t.includes('bio') || t.includes('clinical') || t.includes('care')) {
        return 'Healthcare/MedTech';
    }
    if (t.includes('cyber') || t.includes('security') || t.includes('ctf') || t.includes('hack')) {
        return 'Cybersecurity';
    }
    if (t.includes('game') || t.includes('gaming') || t.includes('ar') || t.includes('vr') || t.includes('metaverse')) {
        return 'Gaming/AR/VR';
    }
    if (t.includes('fintech') || t.includes('finance') || t.includes('bank') || t.includes('money')) {
        return 'Finance/Crypto';
    }
    if (t.includes('sustain') || t.includes('climate') || t.includes('green') || t.includes('eco') || t.includes('energy')) {
        return 'Sustainability';
    }
    if (t.includes('edu') || t.includes('learn') || t.includes('student') || t.includes('campus') || t.includes('college')) {
        return 'Education';
    }
    return 'General';
};

const DOMAIN_IMAGES = {
    'AI/ML': 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    'Blockchain': 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80',
    'Healthcare/MedTech': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    'Cybersecurity': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    'Gaming/AR/VR': 'https://images.unsplash.com/photo-1552824722-ddab1374e622?w=800&auto=format&fit=crop&q=80',
    'Finance/Crypto': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    'Sustainability': 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop&q=80',
    'Education': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    'General': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80'
};

/**
 * Fetches verified student hackathons from Brabble API (aggregating Unstop, Devfolio, Devpost, MLH, etc.)
 */
exports.fetchBrabbleHackathons = async (limit = 100) => {
    const apiKey = process.env.BRABBLE_API_KEY || 'brbl_6ec6a34218441eb5cfaff1c2b4e33aeda07dbb84cde6c3ba995e5b39e358102c';

    try {
        console.log(`[Brabble Adapter] Fetching up to ${limit} hackathons...`);

        const response = await axios.get(`https://brabble.ai/api/listings?hub=hackathons&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json'
            },
            timeout: 10000
        });

        if (response.data && Array.isArray(response.data.listings)) {
            const listings = response.data.listings;
            console.log(`[Brabble Adapter] Successfully fetched ${listings.length} listings from Brabble API.`);

            return listings.map(item => {
                const domain = inferDomain(item.title);
                
                // Parse team size
                let teamSize = 4;
                if (typeof item.team === 'string') {
                    const match = item.team.match(/\d+$/);
                    if (match) teamSize = parseInt(match[0], 10);
                } else if (typeof item.team === 'number') {
                    teamSize = item.team;
                }

                // Format prize pool
                let prizePool = 'See Listing';
                if (item.prize?.inr && item.prize.inr > 0) {
                    prizePool = `₹${item.prize.inr.toLocaleString('en-IN')}`;
                } else if (item.prize?.label && item.prize.label !== 'See listing') {
                    prizePool = item.prize.label;
                }

                // Compose description
                const descParts = [];
                if (item.organiser) descParts.push(`Organized by ${item.organiser}`);
                if (item.platform) descParts.push(`via ${item.platform}`);
                if (item.city && item.city !== 'Remote') descParts.push(`in ${item.city}`);
                if (item.eligibility && item.eligibility.length > 0) {
                    descParts.push(`| Eligibility: ${item.eligibility.join(', ')}`);
                }
                const description = descParts.length > 0 
                    ? descParts.join(' ') 
                    : `Live hackathon listed on ${item.platform || 'Brabble'}. Build and collaborate with student developers.`;

                return {
                    sourceId: String(item.id),
                    source: 'brabble',
                    title: item.title,
                    description,
                    domain,
                    deadline: item.deadline ? new Date(item.deadline) : null,
                    startDate: item.startDate ? new Date(item.startDate) : new Date(),
                    mode: item.mode === 'OFFLINE' ? 'OFFLINE' : 'ONLINE',
                    teamSize,
                    image: DOMAIN_IMAGES[domain] || DOMAIN_IMAGES['General'],
                    prizePool,
                    sourceUrl: item.url || item.shareUrl || 'https://brabble.ai',
                    participantCount: parseInt(item.registered) || 0,
                    status: 'live'
                };
            });
        }

        throw new Error('Unexpected JSON structure from Brabble API');
    } catch (error) {
        console.error(`[Brabble Adapter] Error fetching listings: ${error.message}`);
        return [];
    }
};
