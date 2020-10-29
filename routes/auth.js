const express = require('express');
const authController = require('../controllers/auth')
const router = express.Router();

router.post('/registration',authController.register)

router.post('/home',authController.home)

router.post('/index'||'/',authController.index)

module.exports = router;