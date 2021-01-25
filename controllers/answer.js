const Answer = require('../models/answer');

const find_all = (req, res) => {
  Answer.find().populate('user').populate('question').sort({ createdAt: -1 })
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
  Answer.findById(id).populate('user').populate('question')
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

const find_by_user_id = (req, res) => {
  const id = req.params.id;
  Answer.find({user:id}).populate('question')
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

const create_answer = (req, res) => {
  let answer = new Answer(req.body)
  answer.save()
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

const create_multiple_answers = (req, res) => {
  let { answers, user } = req.body
  const answersToInsert = answers.map(v => ({...v, user: user}))
  Answer.insertMany(answersToInsert)
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

const delete_answer = (req, res) => {
  const id = req.params.id;
  Answer.findByIdAndDelete(id)
    .then(result => {
      if (result) {
        return res.send({
          success: true,
          data: "Answer deleted Successfully"
        })
      } else {
        return res.send({
          success: false,
          data: "Answer with this id does not exist"
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
  find_by_user_id,
  create_answer,
  delete_answer,
  create_multiple_answers
}