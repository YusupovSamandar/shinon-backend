const Updates = require("./../models/updates");

const createUpdate = async (req, res) => {
    try {
        const newUpdate = new Updates(req.body);
        const savedUpdate = await newUpdate.save();
        res.send(savedUpdate);
    } catch (err) {
        res.status(500).send('Error: ' + err.message);

    }
}
const getUpdateOnPatient = async (req, res) => {
    const date = new Date()
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const foundUpdates = await Updates.find({
        patientId: req.params.id,
        date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ date: -1 });

    res.send(foundUpdates);
}

const loadMoreData = async (req, res) => {
    const date = new Date();

    const { numberOfDataToLoad, page } = req.body;
    const skip = (page - 1) * numberOfDataToLoad;

    const endOfDay = new Date(date);
    endOfDay.setHours(0, 0, 0, 0);
    const foundUpdates = await Updates.find({
        patientId: req.params.id,
        date: { $lt: endOfDay },
    })
        .sort({ date: -1 })
        .skip(skip)
        .limit(numberOfDataToLoad);

    res.send(foundUpdates);
}

const getReport = async (req, res) => {
    const { startDate, endDate } = req.body;
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    const foundUpdates = await Updates.find({
        date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    res.send(foundUpdates);
}

module.exports = {
    createUpdate,
    getUpdateOnPatient,
    loadMoreData,
    getReport
};