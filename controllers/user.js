const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretOrKey = process.env.secretOrKey

const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );

const s3 = new aws.S3({
  accessKeyId: process.env.accessKeyAWS,
  secretAccessKey: process.env.secretAccessKey,
  Bucket: process.env.bucketName
})
const profileImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.bucketName,
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
    }
  }),
  limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter: function( req, file, cb ){
    checkFileType( file, cb );
  }
}).single('profile_image')

function checkFileType( file, cb ){
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = fileTypes.test( path.extname( file.originalname ).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test( file.mimetype );if( mimeType && extname ){
    return cb( null, true );
  } else {
    cb( 'Error: Images Only!' );
  }
}

const update_user = async (req, res) => {
  profileImgUpload( req, res, ( error ) => {
    if( error ){
      return res.json( { success: false, error: error } );
    } else {
      // If File not found
      if( req.file === undefined ){
        updateUser(req.body)
      } else {
        req.body.profile_image_url = req.file.location
        updateUser(req.body)
      } } })
  async function updateUser(user) {
    await User.findByIdAndUpdate(user.id, {$set: user}, (err, resp) => {
      if(err) {
        return res.send({
          success: false,
          data: err
        })
      }
      else {
        if(resp) {
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
}

const sign_up = (req, res) => {
  const {email, password} = req.body
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

module.exports = {
  find_all,
  find_by_id,
  sign_up,
  sign_in,
  delete_user,
  update_user
}