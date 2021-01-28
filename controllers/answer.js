const Answer = require('../models/answer');
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );

const s3 = new aws.S3({
  accessKeyId: process.env.accessKeyAWS,
  secretAccessKey: process.env.secretAccessKey,
  Bucket: process.env.bucketName
})
const answerVideoUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.bucketName,
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
    }
  }),
  // limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter: function( req, file, cb ){
    checkFileType( file, cb );
  }
}).single('answer_video')

function checkFileType( file, cb ){
  // Allowed ext
  const fileTypes = /mp4|mpeg4|mov|avi/;
  // Check ext
  const extname = fileTypes.test( path.extname( file.originalname ).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test( file.mimetype );if( mimeType && extname ){
    return cb( null, true );
  } else {
    cb( 'Error: Videos Only!' );
  }
}

const create_video_answer = (req, res) => {
  answerVideoUpload( req, res, ( error ) => {
    if( error ){
      return res.json( { success: false, error: error } );
    } else {
      // If File not found
      if( req.file === undefined ){
        return res.send({
          success: false,
          data: "File not sent"
        })
      } else {
        req.body.statement = req.file.location
        req.body.is_video = true
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
            })
      } } })
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
  create_multiple_answers,
  create_video_answer
}