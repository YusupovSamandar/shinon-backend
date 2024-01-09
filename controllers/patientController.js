const Patients = require("./../models/patients");
const fs = require('fs');
const path = require('path');
const { nonTransplantValue } = require('./../models/patients/patientProgress');
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("./../s3remoteConfig");
const sharp = require("sharp");
const bucketName = process.env.BUCKET_NAME;


const getAllPatients = async (req, res) => {
    const { hospitalName } = req.params;
    const allPatients = await Patients.find({ currentStatus: { "$ne": 'complete' }, hospital: hospitalName }, 'currentStatus nameOfDonor fullName dateOfVisaExpiry patientUHID extendingVisa');
    res.send(allPatients);
}
const getAllOtherPatients = async (req, res) => {
    const { hospitalName } = req.params;
    const allPatients = await Patients.find({ currentStatus: { "$ne": 'complete' }, hospital: { "$ne": hospitalName } }, 'currentStatus nameOfDonor fullName patientUHID');
    res.send(allPatients);
}
const getCompletePatients = async (req, res) => {
    const allPatients = await Patients.find({ currentStatus: "complete" }, 'currentStatus nameOfDonor fullName patientUHID returnTicket');
    res.send(allPatients);
}
const createPatient = async (req, res) => {
    const { typeOfPatient, fullName } = req.body;
    const patientPicture = req.files['patientPicture'] ? req.files['patientPicture'][0] : undefined;
    const patientPassport = req.files['patientPassport'] ? req.files['patientPassport'][0] : undefined;

    const nonTransplantWorkup = typeOfPatient === "non-transplant" ? nonTransplantValue : undefined;

    const ptFileExtension = req.files['patientPicture'] && path.extname(patientPicture.originalname);
    const newPatientPicName = req.files['patientPicture'] && `${fullName}${ptFileExtension}`;
    const passportFileExtension = req.files['patientPassport'] && path.extname(patientPassport.originalname);
    const newPatientPassportName = req.files['patientPassport'] && `${fullName}${passportFileExtension}`;

    const newPatientOBJ = {
        ...req.body,
        patientPicture: patientPicture ? "patients/" + newPatientPicName : 'none',
        patientPassport: patientPassport ? "passports/" + newPatientPassportName : 'none',
        patientProgress: nonTransplantWorkup
    }


    try {
        const newPatient = new Patients(newPatientOBJ);
        const savedPatient = await newPatient.save();
        // upload s3
        if (patientPicture) {
            const resizedPtPicBuffer = await sharp(patientPicture.buffer).resize({ height: 500, width: 500, fit: "contain" }).toBuffer()
            const params = {
                Bucket: bucketName,
                Key: "patients/" + newPatientPicName,
                Body: resizedPtPicBuffer,
                ContentType: patientPicture.mimetype
            }
            const command = new PutObjectCommand(params);
            await s3.send(command);
        }
        if (patientPassport) {
            const params = {
                Bucket: bucketName,
                Key: "passports/" + newPatientPassportName,
                Body: patientPassport.buffer,
                ContentType: patientPassport.mimetype
            }
            const command = new PutObjectCommand(params);
            await s3.send(command);
        }

        res.send(savedPatient);
    }
    catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
}
const deletePatient = async (req, res) => {
    const deleteFile = async (filePath) => {
        // local
        // const deletingPath = path.join(__dirname, '../', filePath);
        // fs.unlink(deletingPath, (err) => {
        //     if (err) {
        //         console.log(err);
        //         return 'Error deleting file';
        //     } else {
        //         return 'deleted';
        //     }
        // });

        // remote s3
        const deleteObjectParams = {
            Bucket: bucketName,
            Key: filePath
        }
        const command = new DeleteObjectCommand(deleteObjectParams);
        await s3.send(command);
    }

    const deletingPatient = await Patients.findOne({ _id: req.params.id });
    if (deletingPatient) {
        if (deletingPatient.patientPassport !== "none") {
            await deleteFile(deletingPatient.patientPassport);
        }
        if (deletingPatient.patientPicture !== "none") {
            await deleteFile(deletingPatient.patientPicture);
        }
        if (deletingPatient.dischargeSummary) {
            await deleteFile(deletingPatient.dischargeSummary);
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
        if (foundPatient.patientPicture !== "none") {
            const getObjectParams = {
                Bucket: bucketName,
                Key: foundPatient.patientPicture
            }

            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            res.send({ ...foundPatient._doc, patientPictureURL: url });
        } else {
            res.send(foundPatient);
        }
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

const downloadPatientPassport = async (req, res) => {
    const foundPatient = await Patients.findOne({ _id: req.params.id });
    if (foundPatient.patientPassport !== "none") {
        const getObjectParams = {
            Bucket: bucketName,
            Key: foundPatient.patientPassport
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        res.send({ url });

    } else {
        res.status(404).json({ error: 'file not found' });
    }
}
const downloadSummary = async (req, res) => {
    const foundPatient = await Patients.findOne({ _id: req.params.id });
    if (foundPatient.dischargeSummary) {
        const getObjectParams = {
            Bucket: bucketName,
            Key: foundPatient.dischargeSummary
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        res.send({ url });

    } else {
        res.status(404).json({ error: 'file not found' });
    }
}

const uploadPassport = async (req, res) => {
    const foundPatient = await Patients.findOne({ _id: req.params.id });
    if (req.file && foundPatient) {
        const fileNameExt = path.extname(req.file.originalname);
        const newFileName = `${foundPatient.fullName}${fileNameExt}`
        const params = {
            Bucket: bucketName,
            Key: "passports/" + newFileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        }

        const command = new PutObjectCommand(params);
        await s3.send(command);
        foundPatient.patientPassport = "passports/" + newFileName;
        foundPatient.save();
        res.status(200).send({ uploadedFileName: "passports/" + newFileName })
    } else {
        res.status(500).send('Error: no file provided');
    }
}
const uploadDischargeSummary = async (req, res) => {
    const foundPatient = await Patients.findOne({ _id: req.params.id });
    if (req.file && foundPatient) {
        const fileNameExt = path.extname(req.file.originalname);
        const newFileName = `${foundPatient.fullName}${fileNameExt}`
        const params = {
            Bucket: bucketName,
            Key: "summary/" + newFileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        }

        const command = new PutObjectCommand(params);
        await s3.send(command);
        foundPatient.dischargeSummary = "summary/" + newFileName;
        foundPatient.save();
        res.status(200).send({ uploadedFileName: "summary/" + newFileName })
    } else {
        res.status(500).send('Error: no file provided');
    }
}

module.exports = {
    getAllPatients,
    createPatient,
    deletePatient,
    getOnePatient,
    updatePatient,
    downloadPatientPassport,
    uploadPassport,
    uploadDischargeSummary,
    downloadSummary,
    getCompletePatients,
    getAllOtherPatients
};