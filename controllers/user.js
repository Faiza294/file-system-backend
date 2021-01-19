const User = require('../models/user');

const find_all = (req, res) => {
  User.find().sort({ createdAt: -1 })
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
  User.findById(id)
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

const create_user = (req, res) => {
  let user = new User(req.body)
  user.save()
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

const delete_user = (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id)
    .then(result => {
      if (result) {
        return res.send({
          success: true,
          data: "User deleted Successfully"
        })
      } else {
        return res.send({
          success: false,
          data: "User with this id does not exist"
        })
      }
    })
    .catch(err => {
      return res.send({
        success: false,
        data: err
      })
    })
}

const update_user = async (req, res) => {
  await User.findByIdAndUpdate(req.body.id, {$set: req.body}, (err, user) => {
    if(err) {
      return res.send({
        success: false,
        data: err
      })
    }
    else {
      if(user) {
        return res.send({
          success: true,
          data: "User Updated Successfully"
        })
      }
      else {
        return res.send({
          success: false,
          data: "User Not Found"
        })
      }
    }
  })
}

module.exports = {
  find_all,
  find_by_id,
  create_user,
  delete_user,
  update_user
}