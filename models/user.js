const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile_image_url: {
    type: String,
    required: false,
    default: null
  },
  education : [{
    school : {type : String, required: true},
    degree : {type : String, required: true},
    start_date : {type : Date, required: true},
    end_date : {type : Date, required: true},
    q1_answer : {type : String, required: true}
  }],
  experience : [{
    title : {type : String, required: true},
    employment_type : {type : String, required: true},
    company_name : {type : String, required: true},
    start_date : {type : Date, required: true},
    end_date : {type : Date, required: true},
    q1_answer : {type : String, required: true},
    q2_answer : {type : String, required: true}
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;