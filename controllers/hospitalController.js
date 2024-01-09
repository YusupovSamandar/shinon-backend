const Hospitals = require("./../models/hospitals");


const getHospitals = async (req, res) => {
    const allHospitals = await Hospitals.find({});
    res.send(allHospitals);
}
const createHospital = async (req, res) => {
    try {
        const newHospital = new Hospitals(req.body);
        const savedHospital = await newHospital.save();
        res.send(savedHospital);
    }
    catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
}
const deleteHospital = async (req, res) => {
    try {
        const result = await Hospitals.deleteOne({ hospitalName: req.params.id });
        res.send(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Error: ' + err.message);
    }
}

module.exports = {
    getHospitals,
    deleteHospital,
    createHospital
};