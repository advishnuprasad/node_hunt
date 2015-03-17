// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

mongoose.connect('mongodb://localhost:27017/default');

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================

// define model =================
var Question = mongoose.model('Question', {
    level   : Number,
    question: String,
    img_url : String,
    answer  : String,
    answered: { type: Boolean, default: false }
});


app.get('/api/questions', function(req, res) {
  Question.find({answered: null}).sort({level: 1}).execFind(function(err, questions) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      console.log(questions);
      if (err)
          res.send(err)

      res.json(questions[0]);
  });
});


app.post('/api/check_answer', function(req, res) {
  query = { level: parseInt(req.body.level) }
  Question.findOne(query, function(err, question) {
    if(err) res.send(err);

    if(question && question.answer == req.body.answer){
      question.answered = true;
      question.save();
      Question.find({answered: null}).sort({level: 1}).execFind(function(err, questions) {
        res.json({next_question: questions[0], result: "true"});
      });
    }
    else{
      res.json({result: "Wrong Answer. Please try again"})
    }
  });

});

app.post('/api/store_question', function(req, res) {
  console.log(req.body);
  Question.create({
    level: req.body.level,
    question: req.body.question,
    answer: req.body.answer,
    img_url: req.body.img_url
  }, function(err, question) {
    if(err)
      res.send(err)
    res.json({result: "Created Successfully"});
  });
});

app.get('*', function(req, res) {
  res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(8080);
console.log("App listening on port 8080");
