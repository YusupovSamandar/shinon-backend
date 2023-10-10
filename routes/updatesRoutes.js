const express = require('express');
const router = express.Router();
const updateController = require('../controllers/updateController');
// Define user-related routes
router.post('/initial/:id', updateController.getUpdateOnPatient);
router.post('/load/:id', updateController.loadMoreData);
router.post('/', updateController.createUpdate);
router.post('/report', updateController.getReport);
router.post('/report/load', updateController.getReportLoadMore);


module.exports = router;