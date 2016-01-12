/**
 * Created by rokne on 10.01.2016.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var callbacks = [];
var users = [];

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/send', function (req, res) {
    var message = {
        nickname: req.param('nickname', ''),
        text: req.param('text', '')
    }
    appendMessage(message);
    console.log(message.text);
    res.json({status: 'ok'});
})

app.post('/newUser', function (req, res) {
    var message = {
        nickname: req.param('nickname', '')
    }
    if (users.indexOf(message.nickname) == -1) {
        users.push(message.nickname);
        console.log(message.nickname);
        res.json({status: 'ok'});
    } else {
        res.json({status: 'fail'});
    }

})

app.get('/subscribe', function (req, res) {
    var userNick = req.query.nickname;
    callbacks.push(function (message) {
        res.json(message);
    })
})


app.get('/online', function (req, res) {
    res.json(users);
})

function appendMessage(message) {
    var resp = {messages: [message]};
    while (callbacks.length > 0) {
        callbacks.shift()(resp);
    }
}

app.listen(3000);