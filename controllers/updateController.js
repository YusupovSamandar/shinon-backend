const Updates = require("./../models/updates");
const User = require("./../models/users");
const Patients = require("./../models/patients");
const createUpdate = async (req, res) => {
    try {
        const foundUser = await User.findOne({ _id: req.body.editorId });
        const foundPatient = await Patients.findOne({ _id: req.body.patientId });
        const newUpdate = new Updates({ ...req.body, editor: foundUser.login, patientFullName: foundPatient.fullName });
        const savedUpdate = await newUpdate.save();
        res.send(savedUpdate);
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
}
const getUpdateOnPatient = async (req, res) => {
    const { myStartDate, myEndDate } = req.body;

    const startOfDay = new Date(myStartDate);
    const endOfDay = new Date(myEndDate);

    const foundUpdates = await Updates.find({
        patientId: req.params.id,
        date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ date: -1 });

    res.send(foundUpdates);
}

const loadMoreData = async (req, res) => {
    const { myEndDate } = req.body;

    const { numberOfDataToLoad, page } = req.body;
    const skip = (page - 1) * numberOfDataToLoad;

    const endOfDay = new Date(myEndDate);

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
    let { startDate, endDate } = req.body;
    if (!startDate && !endDate) {
        return res.send("provide date ranges")
    }
    startDate = new Date(startDate).toISOString();
    endDate = new Date(endDate).toISOString();

    const foundUpdates = await Updates.find({
        date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    res.send(foundUpdates);
}

const getReportLoadMore = async (req, res) => {

    let { startDate } = req.body;

    if (!startDate) {
        return res.send("provide end date")
    }

    const { numberOfDataToLoad, page } = req.body;
    const skip = (page - 1) * numberOfDataToLoad;

    startDate = new Date(startDate).toISOString();

    const foundUpdates = await Updates.find({
        date: { $lt: startDate }
    })
        .sort({ date: -1 })
        .skip(skip)
        .limit(numberOfDataToLoad);

    res.send(foundUpdates);
}

module.exports = {
    createUpdate,
    getUpdateOnPatient,
    loadMoreData,
    getReport,
    getReportLoadMore
};