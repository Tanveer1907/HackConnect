const cron = require('node-cron');
const { fetchDevpostHackathons } = require('./adapters/devpost');
const { fetchMlhHackathons } = require('./adapters/mlh');
const { fetchInternships } = require('./adapters/internships');
const { normalizeHackathon, normalizeInternship } = require('./normalize');
const { upsertHackathons, upsertInternships } = require('./dedupe');

/**
 * Executes a full synchronization cycle across all aggregated platforms.
 */
const runSync = async () => {
    console.log('=== [Ingestion Engine] Starting Synchronization Cycle ===');
    
    // 1. Process Hackathons (Devpost)
    try {
        const rawDevpost = await fetchDevpostHackathons();
        const normalizedDevpost = rawDevpost.map(normalizeHackathon);
        await upsertHackathons(normalizedDevpost);
    } catch (err) {
        console.error(`[Ingestion Engine] Devpost Sync failed: ${err.message}`);
    }

    // 2. Process Hackathons (MLH)
    try {
        const rawMlh = await fetchMlhHackathons();
        const normalizedMlh = rawMlh.map(normalizeHackathon);
        await upsertHackathons(normalizedMlh);
    } catch (err) {
        console.error(`[Ingestion Engine] MLH Sync failed: ${err.message}`);
    }

    // 3. Process Internships (India Aggregated)
    try {
        const rawInternships = await fetchInternships();
        const normalizedInternships = rawInternships.map(normalizeInternship);
        await upsertInternships(normalizedInternships);
    } catch (err) {
        console.error(`[Ingestion Engine] Internships Sync failed: ${err.message}`);
    }

    console.log('=== [Ingestion Engine] Synchronization Cycle Completed ===');
};

/**
 * Initializes the cron scheduler for background aggregation.
 */
const initCron = () => {
    console.log('[Scheduler] Initializing background ingestion cron...');

    // Schedule: Runs every 12 hours
    cron.schedule('0 */12 * * *', () => {
        console.log('[Scheduler] Triggering scheduled ingestion...');
        runSync();
    });

    // Proactive trigger on server startup to guarantee we have live data populated in Mongo
    console.log('[Scheduler] Triggering initial startup synchronization...');
    runSync();
};

module.exports = {
    initCron,
    runSync
};
