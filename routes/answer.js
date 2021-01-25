const express = require('express');
const answerController = require('../controllers/answer');

const router = express.Router();

router.post('/', answerController.create_answer);
router.post('/multiple', answerController.create_multiple_answers);
router.get('/:id', answerController.find_by_id);
router.get('/by_user_id/:id', answerController.find_by_user_id);
router.get('/', answerController.find_all);
router.delete('/:id', answerController.delete_answer);

module.exports = router;