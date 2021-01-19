const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  statement: {
    type: String,
    required: true,
  },
    user_id: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,
  },
  question_id: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Question',
    required: true,
  }
}, { timestamps: true });

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;