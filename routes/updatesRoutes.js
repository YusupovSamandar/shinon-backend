const express = require('express');
const router = express.Router();
const updateController = require('../controllers/updateController');
// Define user-related routes
router.get('/:id', updateController.getUpdateOnPatient);
router.get('/load/:id', updateController.loadMoreData);
router.post('/', updateController.createUpdate);
router.post('/report', updateController.getReport);


module.exports = router;