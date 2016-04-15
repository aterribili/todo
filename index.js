var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

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
    
    var todo = new Todo(id, req.query.description);
    id++;
    all.push(todo);
    res.sendStatus(200);
});

app.get('/todo/list', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var todos = all.filter(function(todo){
        return !todo.deleted;
    }).map(function(todo) {
        return JSON.stringify({id: todo.id, description: todo.description, state: todo.state});
    });
    
    res.send(JSON.stringify({result: todos}));
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

