var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'aotyandb',
    password: 'efktrctzlfyyst',
    database: 'aotyandb'
});
connection.connect(function (error) {
    if (!error) {
        console.log('database is connected ...');
    } else {
        console.log("Error connecting database ...");
    }
});
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

app.get('/tasks', function (req, res) {
    connection.query('SELECT * FROM todo_list', function (error, rows) {
        if (error) {
            console.log(error);
        } else {
            var data = [];
            for (var i = 0; i < rows.length; i++) {
                var task = {title: rows[i].title, completed: rows[i].completed};
                data.push(task);
            }
            res.send(JSON.stringify(data));
            res.end();
        }
    })
});

app.post('/tasks', function (req, res) {
    connection.query('TRUNCATE TABLE todo_list', function (error) {
        if (error) {
            console.log(error);
        }
    });
    for (var i = 0; i < req.body.length; i++) {
        var task = {title: req.body[i].title, completed: req.body[i].completed};
        connection.query('INSERT INTO todo_list SET ?', task, function (error) {
            if (error) {
                console.log(error);
            } else {
                console.log('Added new task to the db');
            }
        })
    }
    res.end();
});

http.listen(6632, function () {
    console.log('listening on: 6630');
});