const express = require('express');
const questionController = require('../controllers/question');

const router = express.Router();

router.post('/', questionController.create_question);
router.get('/:id', questionController.find_by_id);
router.get('/', questionController.find_all);
router.delete('/:id', questionController.delete_question);

module.exports = router;