const Patients = require("./../models/patients");
const fs = require('fs');
const path = require('path');
const { nonTransplantValue } = require('./../models/patients/patientProgress')


const getAllPatients = async (req, res) => {
    const allPatients = await Patients.find({}, 'currentStatus nameOfDonor fullName dateOfVisaExpiry patientUHID extendingVisa');
    res.send(allPatients);
}
const createPatient = async (req, res) => {
    const { typeOfPatient } = req.body
    const patientPicture = req.files['patientPicture'] ? req.files['patientPicture'][0] : undefined;
    const patientPassport = req.files['patientPassport'] ? req.files['patientPassport'][0] : undefined;

    const nonTransplantWorkup = typeOfPatient === "non-transplant" ? nonTransplantValue : undefined;

    const newPatientOBJ = {
        ...req.body,
        patientPicture: patientPicture ? `/uploads/patients/${patientPicture.filename}` : 'none',
        patientPassport: patientPassport ? `/uploads/passports/${patientPassport.filename}` : 'none',
        patientProgress: nonTransplantWorkup
    }

    try {
        const newPatient = new Patients(newPatientOBJ);
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
                console.log(err);
                return 'Error deleting file';
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
    try {
        const foundPatient = await Patients.findOne({ _id: req.params.id });
        res.send(foundPatient);
    } catch (error) {
        res.status(404).json({ error: 'patient not found' });
    }
}
const updatePatient = async (req, res) => {
    try {
        const updatedPatient = await Patients.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true
        });
        res.send(updatedPatient);
    } catch (error) {
        res.status(404).json({ error: 'patient not found' });
    }


}

module.exports = {
    getAllPatients,
    createPatient,
    deletePatient,
    getOnePatient,
    updatePatient
};