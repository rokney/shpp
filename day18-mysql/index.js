var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

var listSockets = {};

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'qwerty',
    database: 'stuff'
})
connection.connect();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.on('new user', function (data, callback) {
        if (data in listSockets || data === '') {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            listSockets[socket.nickname] = socket;
            socket.broadcast.emit('new user', {nick: data});
            listSockets[data].emit('new user', {nick: null});
            updateNicknames();
        }
    });

    socket.on('chat message', function (msg, callback) {
        var inputMsg = msg.trim();
        if (inputMsg.substr(0, 3) === '/s ') {
            inputMsg = inputMsg.substr(3);
            var index = inputMsg.indexOf(' ');
            if (index !== -1) {
                var userName = inputMsg.substr(0, index);
                var inputMsg = inputMsg.substr(index + 1);
                if (userName in listSockets) {
                    listSockets[userName].emit('secret', {msg: inputMsg, nick: socket.nickname});
                } else {
                    callback('Enter a valid user name');
                }
            } else {
                callback('usage: "/s UserName your message" for send secret message');
            }
        } else {
            addMsgToDB({message: msg, nickname: socket.nickname});
            socket.broadcast.emit('chat message', {msg: msg, nick: socket.nickname});
            listSockets[socket.nickname].emit('chat message', {msg: msg, nick: null})
        }
    });

    socket.on('disconnect', function () {
        if (!socket.nickname) {
            return;
        }
        io.emit('disconnect', socket.nickname);
        delete listSockets[socket.nickname];
        updateNicknames();
    });

    socket.on('is typing', function () {
        io.emit('is typing', {nick: socket.nickname});
    })

    socket.on('message history', function(data){
        displayMessageHistory(socket, data.index);
    })

});
function updateNicknames() {
    io.emit('usernames', Object.keys(listSockets));
}

function displayMessageHistory(socket, startIndx) {
    var condition = (startIndx) ? "WHERE id < " + startIndx : "";
    var query = 'SELECT * FROM Messages ' + condition + ' ORDER BY `id` DESC LIMIT 10';
    connection.query(query, function (err, rows, fields) {
        socket.emit('message history', {list: rows});
    });
}

function addMsgToDB(msg) {
    var query = 'INSERT INTO Messages (nickname, message) VALUES ("' + msg.nickname + '", "' + msg.message + '")';
    connection.query(query, function (err, rows, fields) {
        if (err) {
            throw err;
        }
    });
}

http.listen(6630, function () {
    console.log('listening on *:6630');
});
