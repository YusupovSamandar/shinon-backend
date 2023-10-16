const Updates = require('./../../models/updates'); // Import your Update model
export const cron = async () => {
    try {
        // Calculate the date 3 months ago
        const retentionPeriod = new Date();

        retentionPeriod.setMonth(retentionPeriod.getMonth() - 3);

        // Define a query to find updates older than the retention period
        const query = { date: { $lt: retentionPeriod } };

        // Remove updates that match the query
        const result = await Updates.deleteMany(query);

        console.log(`${result.deletedCount} old updates removed.`);
    } catch (error) {
        console.error('Error removing old updates:', error);
    }
};