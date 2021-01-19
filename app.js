const express = require('express');
require('dotenv').config()
const mongoose = require('mongoose');
const questionRoutes = require('./routes/question');
const userRoutes = require('./routes/user');
const answerRoutes = require('./routes/answer');

// express app
const app = express();
const bodyParser = require('body-parser');

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://profile-system123:profile-system123@profilesystem.orroo.mongodb.net/profile-system?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(result => app.listen(3000))
  .catch(err => console.log("Mongoose Connection Error ", err));

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// routes
app.use('/questions', questionRoutes);
app.use('/users', userRoutes);
app.use('/answers', answerRoutes);
