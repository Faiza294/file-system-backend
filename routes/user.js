const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

router.post('/', userController.sign_up);
router.get('/:id', userController.find_by_id);
router.post('/update', userController.update_user);
router.get('/', userController.find_all);
router.delete('/:id', userController.delete_user);

module.exports = router;