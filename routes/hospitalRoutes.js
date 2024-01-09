const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const authenticateToken = require('../middlewares/authenticateToken');
// Define user-related routes
router.get('/', hospitalController.getHospitals);
router.post('/', hospitalController.createHospital);
router.delete('/:id', hospitalController.deleteHospital);

module.exports = router;