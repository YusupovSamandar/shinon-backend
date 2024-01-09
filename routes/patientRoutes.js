const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { remoteUpload } = require("./../multerConfig");
// Define user-related routes
router.get('/:hospitalName', patientController.getAllPatients);
router.get('/other/:hospitalName', patientController.getAllOtherPatients);
router.get('/complete/all', patientController.getCompletePatients);
router.get('/one/:id', patientController.getOnePatient);
router.put('/:id', patientController.updatePatient);
router.post('/', remoteUpload.fields([{ name: 'patientPicture', maxCount: 1 }, { name: 'patientPassport', maxCount: 1 }]), patientController.createPatient);
router.delete('/:id', patientController.deletePatient);
router.get('/passport/:id', patientController.downloadPatientPassport);
router.get('/summary/:id', patientController.downloadSummary);
router.post('/passport/:id', remoteUpload.single('patientPassport'), patientController.uploadPassport);
router.post('/summary/:id', remoteUpload.single('dischargeSummary'), patientController.uploadDischargeSummary);

module.exports = router;