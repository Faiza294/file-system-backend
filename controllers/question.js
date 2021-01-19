const Question = require('../models/question');

const find_all = (req, res) => {
  Question.find().sort({ createdAt: -1 })
    .then(result => {
      if (result.length > 0){
        return res.send({
          success: true,
          data: result
        })
      } else {
        return res.send({
          success: false,
          data: "No data found"
        })
      }
    })
    .catch(err => {
      console.log(err);
      return res.send({
        success: false,
        data: err
      })
    });
}

const find_by_id = (req, res) => {
  const id = req.params.id;
  Question.findById(id)
    .then(result => {
      if (result) {
        return res.send({
          success: true,
          data: result
        })
      } else {
        return res.send({
          success: false,
          data: "No data found"
        })
      }
    })
    .catch(err => {
      console.log(err);
      return res.send({
        success: false,
        data: err
      })
    });
}

const create_question = (req, res) => {
  let question = new Question(req.body)
  // const question = new Question(req.body);
  question.save()
    .then(result => {
      return res.send({
        success: true,
        data: result
      })
    })
    .catch(err => {
      console.log(err);
      return res.send({
        success: false,
        data: err
      })
    });
}

const delete_question = (req, res) => {
  const id = req.params.id;
  Question.findByIdAndDelete(id)
    .then(result => {
      if (result) {
        return res.send({
          success: true,
          data: "Question deleted Successfully"
        })
      } else {
        return res.send({
          success: false,
          data: "Question with this id does not exist"
        })
      }
    })
    .catch(err => {
      console.log(err);
      return res.send({
        success: false,
        data: err
      })
    });
}

module.exports = {
  find_all,
  find_by_id,
  create_question,
  delete_question
}