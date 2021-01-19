const express = require('express');
const passport = require('passport')
const passportConf = require('../config/passport-config')
const userController = require('../controllers/user');

const router = express.Router();

router.post('/sign_up', userController.sign_up);
router.post('/sign_in', userController.sign_in);
router.get('/:id', userController.find_by_id);
router.post('/update', userController.update_user);
router.get('/', userController.find_all);
router.delete('/:id', userController.delete_user);

// router.get('/:id', passport.authenticate('jwt', { session: false }), userController.find_by_id);

module.exports = router;