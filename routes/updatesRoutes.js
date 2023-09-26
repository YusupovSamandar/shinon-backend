const express = require('express');
const router = express.Router();
const updateController = require('../controllers/updateController');
// Define user-related routes
router.get('/:id', updateController.getUpdateOnPatient);
router.post('/load/:id', updateController.loadMoreData);
router.post('/', updateController.createUpdate);
router.post('/report', updateController.getReport);
router.post('/report/load', updateController.getReportLoadMore);


module.exports = router;