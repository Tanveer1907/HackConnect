const Hackathon = require('../../models/Hackathon');
const Internship = require('../../models/Internship');

/**
 * Upserts a list of normalized hackathons into MongoDB.
 * Keyed off { source, sourceId } to prevent duplication.
 */
exports.upsertHackathons = async (hackathons) => {
    let inserted = 0;
    let updated = 0;
    
    for (const h of hackathons) {
        if (!h.sourceId || !h.source) continue;
        
        try {
            // Find if existing
            const existing = await Hackathon.findOne({ source: h.source, sourceId: h.sourceId });
            
            if (existing) {
                // If it already exists, update properties, but do NOT override status if it's already live or rejected
                const updatedData = { ...h };
                delete updatedData.status; // Keep existing moderation status
                
                await Hackathon.updateOne({ _id: existing._id }, { $set: updatedData });
                updated++;
            } else {
                // Insert new
                const newHackathon = new Hackathon(h);
                await newHackathon.save();
                inserted++;
            }
        } catch (error) {
            console.error(`[Dedupe] Failed to upsert hackathon ${h.title}: ${error.message}`);
        }
    }
    
    console.log(`[Dedupe Hackathons] Finished. Inserted: ${inserted}, Updated: ${updated}`);
    return { inserted, updated };
};

/**
 * Upserts a list of normalized internships into MongoDB.
 */
exports.upsertInternships = async (internships) => {
    let inserted = 0;
    let updated = 0;
    
    for (const i of internships) {
        if (!i.sourceId || !i.source) continue;
        
        try {
            const existing = await Internship.findOne({ source: i.source, sourceId: i.sourceId });
            
            if (existing) {
                const updatedData = { ...i };
                delete updatedData.status;
                
                await Internship.updateOne({ _id: existing._id }, { $set: updatedData });
                updated++;
            } else {
                const newInternship = new Internship(i);
                await newInternship.save();
                inserted++;
            }
        } catch (error) {
            console.error(`[Dedupe] Failed to upsert internship ${i.role} at ${i.company}: ${error.message}`);
        }
    }
    
    console.log(`[Dedupe Internships] Finished. Inserted: ${inserted}, Updated: ${updated}`);
    return { inserted, updated };
};
