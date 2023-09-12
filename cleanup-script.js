const mongoose = require('mongoose');
const cron = require('node-cron');
const Updates = require('./models/updates'); // Import your Update model
const dotenv = require('dotenv');
dotenv.config();

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

cron.schedule('0 0 * * *', async () => {
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
});