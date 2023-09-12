const Patients = require("./../models/patients");
const fs = require('fs');
const path = require('path');


const getAllPatients = async (req, res) => {
    const allPatients = await Patients.find({}, 'currentStatus nameOfDonor fullName');
    res.send(allPatients);
}
const createPatient = async (req, res) => {
    const patientPicture = req.files['patientPicture'][0];
    const patientPassport = req.files['patientPassport'][0];
    try {
        const newPatient = new Patients({
            ...req.body,
            patientPicture: patientPicture ? `/uploads/patients/${patientPicture.filename}` : 'none',
            patientPassport: patientPassport ? `/uploads/passports/${patientPassport.filename}` : 'none'
        }
        );
        const savedPatient = await newPatient.save();
        res.send(savedPatient);
    }
    catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
}
const deletePatient = async (req, res) => {

    const deleteFile = (filePath) => {
        const deletingPath = path.join(__dirname, '../', filePath);
        fs.unlink(deletingPath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error deleting file' });
            } else {
                return 'deleted';
            }
        })
    }

    const deletingPatient = await Patients.findOne({ _id: req.params.id });
    if (deletingPatient) {
        if (deletingPatient.patientPassport !== "none") {
            deleteFile(deletingPatient.patientPassport);
        }
        if (deletingPatient.patientPicture !== "none") {
            deleteFile(deletingPatient.patientPicture);

        }
        const response = await Patients.deleteOne({ _id: req.params.id });
        res.send(response);


    } else {
        res.send("no such patient exists");
    }
}

const getOnePatient = async (req, res) => {
    const foundPatient = await Patients.findOne({ _id: req.params.id });
    res.send(foundPatient);
}
const updatePatient = async (req, res) => {
    const updatedPatient = await Patients.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true
    });
    res.send(updatedPatient);
}

module.exports = {
    getAllPatients,
    createPatient,
    deletePatient,
    getOnePatient,
    updatePatient
};