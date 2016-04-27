var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost/todo';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);

    // do some work here with the database.

    //Close connection
    db.close();
  }
});

//Lets load the mongoose module in our program
var mongoose = require('mongoose');//Lets connect to our database using the DB server URL.
mongoose.connect(url);

var TodoModel = mongoose.model('Todo', {id: Number, description: String, state: Boolean, deleted: Boolean});

var Todo = function(id, description) {
    this.id = id;
    this.description = description;
    this.state = false; 
    this.deleted = false;
};

Todo.prototype.complete = function() {
    this.state = true;
};

Todo.prototype.undo = function() {
    this.state = false;
};

Todo.prototype.delete = function() {
    this.deleted = true;
};

var all = [];
var id = 1;

app.post('/todo/create', (req, res) => {
    if (!req.query.description) return res.sendStatus(400);
    
    var todo = new TodoModel({id: id, description: req.query.description, state: false, deleted: false});
    id++;
    all.push(todo);
    //Lets try to print and see it. You will see _id is assigned.
    console.log(todo);

    //Lets save it
    todo.save(function (err, userObj) {
      if (err) {
        console.log(err);
      } else {
        console.log('saved successfully:', userObj);
      }
    });
    res.sendStatus(200);
});

app.get('/todo/list', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    TodoModel.find({}, function(err, docs) {
        if (!err){ 
            res.send(JSON.stringify({result: docs}));
        } else {
            res.send('Error :(');
            throw err;
        }
    });
});

app.post('/todo/done', (req, res) => {
    if (!req.query.id) return res.sendStatus(400);

        all.filter(function(todo) {
            return todo.id == req.query.id;
        }).forEach(function(todo) {
            todo.complete();
        });

        res.sendStatus(200);
});

app.post('/todo/undo', (req, res) => {
    if (!req.query.id) return res.sendStatus(400);

    all.filter(function(todo) {
        return todo.id == req.query.id;
    }).forEach(function(todo) {
        todo.undo();
    });

    res.sendStatus(200);
});

app.post('/todo/delete', (req, res) => {
    if (!req.query.id) return res.sendStatus(400);

    all.filter(function(todo) {
        return todo.id == req.query.id;
    }).forEach(function(todo) {
        todo.delete();
    });

    res.sendStatus(200);
});

// INTEGRAÇ

//todo set complete to-do

app.listen(3000, () => {console.log('Server listening in port 3000');});

