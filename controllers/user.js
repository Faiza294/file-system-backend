const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretOrKey = process.env.secretOrKey

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

const sign_up = (req, res) => {
  const {education, experience, email, password} = req.body
  if (!education || education.length === 0) { return res.send({ success: false, message: 'Education missing' }) }
  if (!experience || experience.length === 0) { return res.send({ success: false, message: 'Experience missing' }) }

  User.find({email : email})
      .then(async result => {
        if (result.length > 0) {
          return res.send({
            success: false,
            message: 'User already exist with this email!'
          })
        } else {
          req.body.password = await bcrypt.hash(password, 10)
          let user = new User(req.body)
          user.save()
              .then(async resp => {
                let user = resp
                delete user._doc.password
                let id = user._id
                let accessToken = await jwt.sign({
                  iss: "falconWing",
                  sub: id,
                  iat: new Date().getTime(),
                  exp: new Date().setDate(new Date().getDate() + 1)
                }, secretOrKey)
                return res.send({
                  success: true,
                  data: user,
                  accessToken
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
      })
      .catch(err => {
        console.log(err);
        return res.send({
          success: false,
          data: err
        })
      });
}

const sign_in = (req, res) => {
  const {email, password} = req.body
  if (!email) { return res.send({ success: false, message: 'Email missing' }) }
  if (!password) { return res.send({ success: false, message: 'Password missing' }) }

  User.find({email : email})
      .then(async result => {
        if (result.length > 0) {
          result = result[0]
          if (!await bcrypt.compare(password, result.password)) {
            res.send({
              success: false,
              message: 'Password is Incorrect!'
            })
          } else {
            let id = result._id
            let accessToken = await jwt.sign({
              iss: "falconWing",
              sub: id,
              iat: new Date().getTime(),
              exp: new Date().setDate(new Date().getDate() + 1)
            }, secretOrKey)
            let user = result
            delete user._doc.password
            return res.send({
              success: true,
              data: user,
              accessToken
            })
          }
        } else {
          return res.send({
            success: false,
            message: 'This Email is not Valid!!'
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
  sign_up,
  sign_in,
  delete_user,
  update_user
}