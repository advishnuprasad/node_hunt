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
    level: Number,
    question: String,
    img_url : String,
    answer  : String
});

var Todo = mongoose.model('Todo', {
    text  : String
});

app.get('/api/questions', function(req, res) {
  Question.findOne(function(err, question) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
          res.send(err)

      res.json(question); // return all todos in JSON format
  });
});


app.post('/api/check_answer', function(req, res) {
  console.log(req.body);
  res.json({result: "Wrong answer"});
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

// routes ======================================================================

// api ---------------------------------------------------------------------
// get all todos
app.get('/api/todos', function(req, res) {
    console.log("am getting called");
    // use mongoose to get all todos in the database
    Todo.find(function(err, todos) {
        console.log("am getting called - 1");
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(todos); // return all todos in JSON format
    });
});

// create todo and send back all todos after creation
app.post('/api/todos', function(req, res) {

    // create a todo, information comes from AJAX request from Angular
    Todo.create({
        text : req.body.text,
        done : false
    }, function(err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });

});

// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
        _id : req.params.todo_id
    }, function(err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

app.get('*', function(req, res) {
  res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(8080);
console.log("App listening on port 8080");