const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { remoteUpload } = require("./../multerConfig");
// Define user-related routes
router.get('/', patientController.getAllPatients);
router.get('/:id', patientController.getOnePatient);
router.put('/:id', patientController.updatePatient);
router.post('/', remoteUpload.fields([{ name: 'patientPicture', maxCount: 1 }, { name: 'patientPassport', maxCount: 1 }]), patientController.createPatient);
router.delete('/:id', patientController.deletePatient);
router.get('/passport/:id', patientController.downloadPatientPassport);

module.exports = router;