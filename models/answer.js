const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  statement: {
    type: String,
    required: true,
  },
  is_video: {
    type: Boolean,
    default: false
  },
    user: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,
  },
  question: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Question',
    required: true,
  }
}, { timestamps: true });

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;