var express = require('express');
var app = express();
var body_parser = require('body-parser');
var pgp = require('pg-promise')({});


var db = pgp({database: 'todo_app'});


app.set('view engine', 'hbs');
app.use('/static', express.static('public'));
app.use(body_parser.urlencoded({extended: false}));



app.get('/', function(request, response) {
  response.redirect('/todos');
})



app.get('/todos', function(request, response) {
  db.any('SELECT * from task WHERE done = False')
    .then(function(todos) {
      response.render('todos.hbs', {todos: todos})
    });
});


app.get('/todos/add', function(request, response) {
  context = {title: 'Add Task'}
  response.render('add.hbs', context);
});

app.get('/todos/done', function(request, response) {
  db.any('SELECT * from task WHERE done = True')
    .then(function(todos) {
      response.render('done.hbs', {todos: todos})
    });
});


app.post('/todos/add', function(request, response, next) {
  var desc = request.body.description;

  db.none('INSERT INTO task VALUES (default, $1, FALSE)', desc)
    .then(function() {
      response.redirect('/todos');
    })
    .catch(next);
});


app.get('/todos/done/:id', function(request, response) {
  var id = request.params.id;
  context = {title: 'Done'}

  db.none('UPDATE task SET done = TRUE WHERE id = $1', id)
    .then(function() {
      response.redirect('/todos/done');
    })
});

app.listen(8000, function () {
  console.log('Listening on port 8000');
});
