const Answer = require('../models/answer');

const find_all = (req, res) => {
  Answer.find().sort({ createdAt: -1 })
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
  Answer.findById(id)
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
  // user = req.params;
  // id = user.id;
  // const { title, subtitle} = req.body;
  // const post = await Post.create({
  //   title,
  //   subtitle,
  //   user:id
  // });
  // await post.save();
  //
  // const userById = await User.findById(id);
  //
  // userById.posts.push(post);
  // await userById.save();
  //
  // return res.send(userById);
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
  create_answer,
  delete_answer
}