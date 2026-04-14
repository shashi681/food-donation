const express = require('express');
const router = express.Router();
const { addFood, getAllFood, getMyFood } = require('../controllers/foodController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRole('restaurant'), addFood);
router.get('/', protect, authorizeRole('ngo'), getAllFood);
router.get('/mine', protect, authorizeRole('restaurant'), getMyFood);

module.exports = router;
