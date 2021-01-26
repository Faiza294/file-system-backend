const express = require('express');
const passport = require('passport')
const passportConf = require('../config/passport-config')
const paymentController = require('../controllers/payment');

const router = express.Router();

router.post('/', paymentController.payment);

module.exports = router;