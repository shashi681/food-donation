const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getIncomingRequests,
  updateRequestStatus
} = require('../controllers/requestController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.post('/',          protect, authorizeRole('ngo'), createRequest);
router.get('/mine',       protect, authorizeRole('ngo'), getMyRequests);
router.get('/incoming',   protect, authorizeRole('restaurant'), getIncomingRequests);
router.put('/:id/status', protect, authorizeRole('restaurant'), updateRequestStatus);

module.exports = router;
