const express = require('express');
const answerController = require('../controllers/answer');

const router = express.Router();

router.post('/', answerController.create_answer);
router.get('/:id', answerController.find_by_id);
router.get('/', answerController.find_all);
router.delete('/:id', answerController.delete_answer);

module.exports = router;