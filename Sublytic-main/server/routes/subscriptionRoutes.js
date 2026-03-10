// routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authenticateToken = require('../middleware/authMiddleware');

// Apply the middleware to all routes in this file
router.use(authenticateToken);

// Routes
router.get('/', subscriptionController.getAllSubscriptions);
router.post('/', subscriptionController.addSubscription);
router.put('/:id', subscriptionController.updateSubscription);
router.delete('/:id', subscriptionController.deleteSubscription);

module.exports = router;