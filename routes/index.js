const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const adminRoutes = require('./admin');

router.use('/', require('./swagger'));
router.use('/users', userRoutes);
router.use('/admins', adminRoutes);

module.exports = router;